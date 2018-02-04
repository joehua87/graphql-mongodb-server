// @flow


import parseFilter from '../parseFilter'
import getEntities from './getEntities'
import getPagingInfo from './getPagingInfo'
import getProjection from './getProjection'
import { appCode } from '../config'
import refineProjection from './refineProjection'

const debug = require('debug')(`${appCode}:create-query`)

/*
 * Create Query Resolvers
 */
export default function createQuery({
  Model,
  overrideFilter,
  filterFields = {},
  populate: defaultPopulate = [],
  availableProjection,
  checkAuthorization,
}: {
    Model: any,
    overrideFilter?: { [key: string]: any } | Function,
    filterFields?: FilterFields,
    populate?: Array<string>,
    availableProjection?: string | string[],
    checkAuthorization?: Function,
  } = {}): QueryExtractorFn {
  return async (
    obj: any,
    args: { sort: string, page: number, limit: number, skip: number },
    context,
    info: any,
  ): Promise<QueryExtractorResult> => {
    const {
      sort, page = 1, limit = 20, skip = 0, ...filter
    } = args
    if (checkAuthorization) {
      const error = await checkAuthorization({
        parent: obj,
        args,
        context,
        info,
      })
      debug('checkAuthorization', { context, error })
      if (error) return { error }
    }

    let _overrideFilter = overrideFilter || {}

    if (typeof _overrideFilter === 'function') {
      _overrideFilter = await _overrideFilter(context)
    }

    const _mongoFilter = await parseFilter(
      filter,
      filterFields,
    )

    // Merge MongoFilter parsed from query & override Filter
    const mongoFilter = {
      ..._mongoFilter,
      ..._overrideFilter,
    }

    const { projection, populate } = refineProjection({
      projection: getProjection({ field: 'entities', info }),
      availableProjection,
      populate: defaultPopulate,
    })

    const entities = await getEntities({
      Model,
      mongoFilter,
      sort,
      page,
      limit,
      skip,
      projection,
      populate,
    })

    const _pagingInfo = await getPagingInfo({
      Model,
      mongoFilter,
      sort,
      page,
      limit,
      skip,
    })

    return {
      entities,
      pagingInfo: _pagingInfo,
    }
  }
}

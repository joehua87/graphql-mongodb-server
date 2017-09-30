// @flow

import R from 'ramda'
import parseFilter from '../parseFilter'
import getEntities from './getEntities'
import getPagingInfo from './getPagingInfo'
import getProjection from './getProjection'
import { appCode } from '../config'

const debug = require('debug')(`${appCode}:create-query`)

const mixedProjection = ({
  source1, source2 }: {
  source1: string[],
  source2: any
}) => {
  const result = {}
  if (source1 === null || source1 === undefined || source1 === ' ') return source2
  const keys = Object.keys(source2)
  const fields1 = source1
  keys.map((item) => {
    if (fields1.indexOf(item) > -1 && source2[item] > 0) {
      result[item] = 1
      return item
    }
    return null
  })
  return result
}
/*
 * Create Query Resolvers
 */
export default function createQuery({
  Model,
  overrideFilter,
  filterFields = {},
  populate = [],
  checkAuthorization,
  checkPermission,
}: {
  Model: any,
  overrideFilter?: { [key: string]: any } | Function,
  filterFields?: FilterFields,
  populate?: Array<string>,
  checkAuthorization?: Function,
  checkPermission?: Function,
} = {}): QueryExtractorFn {
  return async (
    obj: any,
    args: { sort: string, page: number, limit: number, actionCode: string },
    context,
    info: any,
  ): Promise<QueryExtractorResult> => {
    const {
      sort, page = 1, limit = 20, ...filter
    } = args
    if (checkAuthorization) {
      const error = await checkAuthorization({
        parent: obj, args, context, info,
      })
      debug('checkAuthorization', { context, error })
      if (error) return { error }
    }
    let _filterResult = { }
    let _projectionResult = { }
    let _errorResult = {}
    if (checkPermission) {
      const _resultCheckPermission = await checkPermission({
        parent: obj, args, context, info,
      })
      _filterResult = _resultCheckPermission.filter || {}
      _projectionResult = _resultCheckPermission.projection || {}
      _errorResult = _resultCheckPermission.error || {}
    }

    let _overrideFilter = overrideFilter || {}

    if (typeof _overrideFilter === 'function') {
      _overrideFilter = await _overrideFilter(context)
    }

    const _mongoFilter = await parseFilter({
      ...filter,
    }, filterFields)

    // Merge MongoFilter parsed from query & override Filter
    const mongoFilter = {
      ..._mongoFilter,
      ..._overrideFilter,
      ..._filterResult,
    }

    const projection = getProjection({ field: 'entities', info })
    const mixProjection = mixedProjection({ source1: projection, source2: _projectionResult })
    debug('projection', projection)
    debug('populate', R.intersection(populate, projection))

    const entities = await getEntities({
      Model,
      mongoFilter,
      sort,
      page,
      limit,
      projection: mixProjection,
      populate,
    })

    const _pagingInfo = await getPagingInfo({
      Model,
      mongoFilter,
      sort,
      page,
      limit,
    })
    return {
      entities,
      permission: {
        error: _errorResult,
        filter: _filterResult,
        projection: _projectionResult,
      },
      pagingInfo: _pagingInfo,
    }
  }
}

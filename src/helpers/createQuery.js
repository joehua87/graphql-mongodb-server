// @flow

import parseFilter from '../parseFilter'
import getEntities from './getEntities'
import getPagingInfo from './getPagingInfo'
import { appCode } from '../config'

const debug = require('debug')(`${appCode}:create-query`)

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
    const { sort, page = 1, limit = 20, ...filter } = args
    if (checkAuthorization) {
      const error = await checkAuthorization({ parent: obj, args, context, info })
      debug('checkAuthorization', { context, error })
      if (error) return { error }
    }
    let _filterResult = { }
    let _projectionResult = { }
    let _errorResult = {}
    if (checkPermission) {
      const _resultCheckPermission = await checkPermission({ parent: obj, args, context, info })
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

    const entities = await getEntities({
      Model,
      mongoFilter,
      sort,
      page,
      limit,
      projection: _projectionResult,
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

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
  overrideFilter = {},
  filterFields = {},
  populate = [],
  checkAuthorization,
}: {
  Model: any,
  overrideFilter?: { [key: string]: any },
  filterFields?: FilterFields,
  populate?: Array<string>,
  checkAuthorization?: Function,
} = {}): QueryExtractorFn {
  return async (
    obj: any,
    { sort, page = 1, limit = 20, ...filter }: { sort: string, page: number, limit: number },
    context,
  ): Promise<QueryExtractorResult> => {
    if (checkAuthorization) {
      const error = await checkAuthorization(context)
      debug('checkAuthorization', { context, error })
      if (error) return { error }
    }
    const mongoFilter = await parseFilter({ ...filter, ...overrideFilter }, filterFields)

    const entities = await getEntities({
      Model,
      mongoFilter,
      sort,
      page,
      limit,
      // projection, TODO Extract projection from info
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
      pagingInfo: _pagingInfo,
    }
  }
}

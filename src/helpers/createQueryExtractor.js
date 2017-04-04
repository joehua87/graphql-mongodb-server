// @flow

import parseFilter from '../parseFilter'
import { appCode } from '../config'

const debug = require('debug')(`${appCode}:extract-query`)

/*
 * QueryExtractorFn: Receive params (parentObj, params) & return:
 *   - filter to query entities
 *   - pagingInfo to query { total, hasMore }
 */
export default function createQueryExtractor({ overrideFilter = {}, filterFields = {} }: {
  overrideFilter?: { [key: string]: any },
  filterFields?: FilterFields,
} = {}): QueryExtractorFn {
  return (
    obj: any,
    { sort, page, limit, ...filter }: { sort: string, page: number, limit: number },
  ): QueryExtractorResult => {
    const mongoFilter = parseFilter({ ...filter, ...overrideFilter }, filterFields)

    const query = {
      mongoFilter,
      pagingInfo: { sort, page, limit },
    }
    debug(query)
    return query
  }
}

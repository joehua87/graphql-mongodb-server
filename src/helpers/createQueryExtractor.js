// @flow

import parseFilter from '../parseFilter'
import { appCode } from '../config'

const debug = require('debug')(`${appCode}:extract-query`)

/*
 * QueryExtractorFn: Receive params (parentObj, params) & return:
 *   - filter to query entities
 *   - pagingInfo to query { total, hasMore }
 */
export default function createQueryExtractor({
  overrideFilter = {},
  filterFields = {},
  populate = [],
}: {
  overrideFilter?: { [key: string]: any },
  filterFields?: FilterFields,
  populate: Array<string>,
} = {}): QueryExtractorFn {
  return async (
    obj: any,
    { sort, page, limit, ...filter }: { sort: string, page: number, limit: number },
  ): Promise<QueryExtractorResult> => {
    const mongoFilter = await parseFilter({ ...filter, ...overrideFilter }, filterFields)

    const query = {
      mongoFilter,
      populate,
      pagingInfo: { sort, page, limit },
    }
    debug(query)
    return query
  }
}

// @flow

import getFields from './getFields'
import getEntities from './getEntities'
import getPagingInfo from './getPagingInfo'

/*
 * Convert list of array params to map for easier management
 */
function argsToObj(parentObj: any, args: any, context: any, info: any) {
  return {
    parentObj,
    args,
    context,
    info,
  }
}

export default function createQueryResolver(Model: any) {
  return {
    entities(...args: Array<any>) {
      const { parentObj: { mongoFilter, populate, pagingInfo }, info } = argsToObj(...args)
      const { sort, page = 1, limit = 20 } = pagingInfo
      const { projection } = getFields(info)
      return getEntities({
        Model,
        mongoFilter,
        sort,
        page,
        limit,
        projection,
        populate,
      })
    },
    pagingInfo(...args: Array<any>) {
      const { parentObj: { mongoFilter, pagingInfo } } = argsToObj(...args)
      const { sort, page = 1, limit = 20 } = pagingInfo
      return getPagingInfo({
        Model,
        mongoFilter,
        sort,
        page,
        limit,
      })
    },
  }
}

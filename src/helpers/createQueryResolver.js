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

export default function createQueryResolver({ Model, checkAuthorization }: {
  Model: any,
  checkAuthorization?: (context: any) => Promise<any>,
}) {
  return async (...args: Array<any>) => {
    const { parentObj: { mongoFilter, populate, pagingInfo }, context, info } = argsToObj(...args)
    if (checkAuthorization) {
      const error = await checkAuthorization(context)
      if (error) return { error }
    }

    const { sort, page = 1, limit = 20 } = pagingInfo
    const { projection } = getFields(info)

    const entities = await getEntities({
      Model,
      mongoFilter,
      sort,
      page,
      limit,
      projection,
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

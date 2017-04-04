// @flow

import DataLoader from 'dataloader'
import { appCode } from '../config'

const debug = require('debug')(`${appCode}:resolver`)

export default function createLoadEntitiesDataLoader(Model: any) {
  return new DataLoader(
    async (ids: Array<string>) => {
      debug(`Start load ${ids.length} ids`)
      const entities = await Model.find({
        _id: { $in: ids },
      }).lean()
      debug(`Load ${entities.length} entities in model ${Model.modelName}`)
      // Because ids is a duplicated list, we must make result return same length as ids
      const result = ids.map((_id) => {
        const entity = entities.find(x => x._id.toString() === _id.toString())
        return {
          ...entity,
          id: _id.toString(),
        }
      })
      return result
    },
    {
      cache: false, // Let cache = false, enable cache when we're able to clear cache when mutate
      cacheKeyFn: id => id.toString(),
    },
  )
}

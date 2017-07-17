// @flow

import getFields from './getFields'
import { appCode } from '../config'

const debug = require('debug')(`${appCode}:create-get-one`)

export default function createGetOne({ Model, populate, checkAuthorization }: {
  Model: any,
  populate: Array<string>,
  checkAuthorization?: Function,
}) {
  return async function getOne(
    obj: any,
    args: any,  // Example: { slug }: { slug: string },
    context: any,
    info: any,
  ): Promise<any> {
    if (checkAuthorization) {
      const error = await checkAuthorization({ parent: obj, args, context, info })
      debug('checkAuthorization', { context, error })
      if (error) return { error }
    }
    const { projection } = getFields(info)
    let q = Model.findOne(args).select(projection)
    populate.forEach((field) => { q = q.populate(field) })
    return q.lean()
  }
}

// @flow

import getFields from './getFields'

export default function createGetOne({ Model, populate }: {
  Model: any,
  populate: Array<string>,
}) {
  return function getOne(
    obj: any,
    args: any,  // Example: { slug }: { slug: string },
    ctx: any,
    info: any,
  ): Promise<any> {
    const { projection } = getFields(info)
    let q = Model.findOne(args).select(projection)
    populate.forEach((field) => { q = q.populate(field) })
    return q.lean()
  }
}

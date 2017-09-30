// @flow

export function createRemoveMutation({
  Model,
  populate = [],
  checkAuthorization,
}: {
  Model: any,
  populate: Array<string>,
  checkAuthorization?: (context: any) => Promise<any>,
}) {
  return async (parentObj: any, entity: any, context: any, info: any) => {
    if (checkAuthorization) {
      const error = await checkAuthorization({
        parent: parentObj, context, args: entity, info,
      })
      if (error) return { error }
    }
    const { _id } = entity
    const q = Model.findOneAndRemove({ _id })
    populate.forEach(field => q.populate(field))
    const result = await q.lean()
    return {
      result,
    }
  }
}

export function createCreateMutation({
  Model,
  populate = [],
  checkAuthorization,
}: {
  Model: any,
  populate: Array<string>,
  checkAuthorization?: (context: any) => Promise<any>,
}) {
  return async (parentObj: any, entity: any, context: any, info: any) => {
    if (checkAuthorization) {
      const error = await checkAuthorization({
        parent: parentObj, context, args: entity, info,
      })
      if (error) return { error }
    }
    const { _id } = await Model.create(entity)
    const q = Model.findOne({ _id })
    populate.forEach(field => q.populate(field))
    const result = await q.lean()
    return {
      result,
    }
  }
}

export function createEditMutation({
  Model,
  populate = [],
  checkAuthorization,
}: {
  Model: any,
  populate: Array<string>,
  checkAuthorization?: (context: any) => Promise<any>,
}) {
  return async (parentObj: any, entity: any, context: any, info: any) => {
    if (checkAuthorization) {
      const error = await checkAuthorization({
        parent: parentObj, context, args: entity, info,
      })
      if (error) return { error }
    }

    const { _id, ...rest } = entity
    const q = Model.findOneAndUpdate(
      { _id },
      { $set: rest },
      { new: true },
    )
    populate.forEach(field => q.populate(field))
    const result = await q.lean()
    return {
      result,
    }
  }
}

export default function createMutation({
  name,
  Model,
  populate = [],
  checkAuthorization,
}: {
  Model: any,
  name: string,
  populate: Array<string>,
  checkAuthorization?: (context: any) => Promise<any>,
}) {
  return {
    [`create${name}`]: createCreateMutation({ Model, populate, checkAuthorization }),
    [`edit${name}`]: createEditMutation({ Model, populate, checkAuthorization }),
    [`remove${name}`]: createRemoveMutation({ Model, populate, checkAuthorization }),
  }
}

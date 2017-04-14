// @flow

export function createRemoveMutation({ Model, populate = [] }: {
  Model: any,
  populate: Array<string>,
}) {
  return (parentObj: any, product: TProduct) => {
    const { _id } = product
    const q = Model.findOneAndRemove({ _id })
    populate.forEach(field => q.populate(field))
    return q.lean()
  }
}

export function createCreateMutation({ Model, populate = [] }: {
  Model: any,
  populate: Array<string>,
}) {
  return async (parentObj: any, product: TProduct) => {
    const { _id } = await Model.create(product)
    const q = Model.findOne({ _id })
    populate.forEach(field => q.populate(field))
    return q.lean()
  }
}

export function createEditMutation({ Model, populate = [] }: {
  Model: any,
  populate: Array<string>,
}) {
  return (parentObj: any, entity: any) => {
    const { _id, ...rest } = entity
    const q = Model.findOneAndUpdate(
      { _id },
      { $set: rest },
      { new: true },
    )
    populate.forEach(field => q.populate(field))
    return q
  }
}

export default function createMutation({
  name,
  Model,
  populate = [],
}: {
  Model: any,
  name: string,
  populate: Array<string>,
}) {
  return {
    [`create${name}`]: createCreateMutation({ Model, populate }),
    [`edit${name}`]: createEditMutation({ Model, populate }),
    [`remove${name}`]: createRemoveMutation({ Model, populate }),
  }
}

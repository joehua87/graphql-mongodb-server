// @flow

import { appCode } from '../config'

const debug = require('debug')(`${appCode}:createMutation`)

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
    debug('before insert', entity)
    const { _id } = await Model.create(entity)
    // const data = Model(entity)
    // debug('data', data)
    // const { _id } = await data.save()
    const q = Model.findOne({ _id })
    populate.forEach(field => q.populate(field))
    const result = await q.lean()
    debug('after insert', result)
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
    debug('before update', rest.section)
    // const data = Model(entity)
    // debug('data', data.section)
    await Model.update(
      { _id },
      { $set: rest },
      { new: true },
    )
    const q = Model.findOne({ _id })
    populate.forEach(field => q.populate(field))
    const result = await q.lean()
    debug('after update', result.section)
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

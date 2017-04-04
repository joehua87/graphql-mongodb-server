// @flow

import { appCode } from '../config'

const debug = require('debug')(`${appCode}:getEntities`)

export default async function getEntities({
  Model,
  mongoFilter,
  sort,
  page,
  limit,
  projection,
}: {
  Model: any,
  mongoFilter: MongoFilter,
  sort: string,
  page: number,
  limit: number,
  projection: string,
}) {
  debug(`Start getEntities for model ${Model.modelName}`)
  debug({ sort, page, limit, projection })
  const entities = await Model.find(mongoFilter)
    .select(projection)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .lean()

  debug(`Got ${entities.length} entities for model ${Model.modelName}`)
  return entities
}

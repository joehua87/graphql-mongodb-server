// @flow

import { appCode } from '../config'

const debug = require('debug')(`${appCode}:getPagingInfo`)

export default async function getPagingInfo({
  Model,
  mongoFilter,
  sort,
  page,
  limit,
  skip,
}: {
  Model: any,
  mongoFilter: MongoFilter,
  sort: string,
  page: number,
  limit: number,
  skip: number,

}) {
  debug(`Start getPagingInfo for model ${Model.modelName}`)
  const total = await Model.count(mongoFilter)
  const hasMore = total > page * limit
  const result = {
    sort,
    page,
    limit,
    total,
    hasMore,
    skip,
  }
  debug(result)
  return result
}

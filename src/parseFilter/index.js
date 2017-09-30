// @flow

import numeral from 'numeral'
import merge from 'lodash.merge'
import * as constants from './constants'

// const debug = require('debug')('parse-filter')

const getValue = (value: string, type: any): any => {
  switch (type) {
    case Number:
      return numeral(value).value()
    case Date:
      return new Date(value)
    case String:
    default:
      return value
  }
}

async function preprocessValue({
  fn, value }: {
  fn: Function,
  value: string,
}): Promise<any> {
  if (!fn) return value
  return fn(value)
}

const toMongoFilterItem = async ({ key, filterFields, filter }) => {
  const item: FilterItem = filterFields[key]
  if (!item) return null

  const value = getValue(filter[key], item.dbType)

  if (item.preprocess) {
    return preprocessValue({
      fn: item.preprocess,
      value,
    })
  }

  if (item.compareType === constants.FULL_TEXT) {
    return { $text: { $search: value } }
  }

  const { dbField } = item
  if (!dbField) {
    throw new Error('Require dbField, preprocess or compareType = FULL_TEXT')
  }

  switch (item.compareType) {
    case constants.EQUAL:
      return { [dbField]: value }
    case constants.GT:
      return { [dbField]: { $gt: value } }
    case constants.GTE:
      return { [dbField]: { $gte: value } }
    case constants.LT:
      return { [dbField]: { $lt: value } }
    case constants.LTE:
      return { [dbField]: { $lte: value } }
    case constants.REG_EX:
      return { [dbField]: new RegExp(value) }
    case constants.REG_EX_I:
      return { [dbField]: new RegExp(value, 'i') }
    // case constants.EXISTS:
    //   return { [dbField]: { $exists: value } }
    case constants.IN:
      return { [dbField]: { $in: value } }
    default:
      throw new Error('Compare Type must be 1 of EQUAL, GT, GTE, LT, LTE, REG_EX, REG_EX_I, FULL_TEXT, IN')
  }
}

export default async function parseFilter(filter: { [key: string]: any }, filterFields: FilterFields) {
  const keys = Object.keys(filter)
  const mongoFilters = await Promise.all(keys
    .filter(key => filterFields[key])
    .map(key => toMongoFilterItem({ key, filter, filterFields })))
  return merge(...mongoFilters)
}

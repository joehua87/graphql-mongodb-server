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

export default function parseFilter(filter: { [key: string]: any }, filterFields: FilterFields) {
  const keys = Object.keys(filter)
  const mongoFilters = keys
    .filter(key => filterFields[key]) // Make sure that FilterItem exists
    .map((key) => {
      const item: FilterItem = filterFields[key]
      if (!item) return null
      const value = getValue(filter[key], item.dbType)
      const dbField = item.dbField
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
        case constants.FULL_TEXT:
          return { [dbField]: { $search: value } }
        case constants.IN:
          return { [dbField]: { $in: value } }
        default:
          throw new Error('Compare Type must be 1 of EQUAL, GT, GTE, LT, LTE, REG_EX, REG_EX_I, FULL_TEXT, IN')
      }
    })
  return merge(...mongoFilters)
}

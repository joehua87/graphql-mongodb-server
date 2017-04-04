// @flow

import { expect } from 'chai'
import parseFilter from '../'
import * as constants from '../constants'

const filterFields = {
  name: {
    dbField: 'name',
    compareType: constants.REG_EX_I,
    dbType: String,
  },
  minAge: {
    dbField: 'age',
    compareType: constants.GTE,
    dbType: Number,
  },
  maxAge: {
    dbField: 'age',
    compareType: constants.LTE,
    dbType: Number,
  },
  maxDate: {
    dbField: 'date',
    compareType: constants.LTE,
    dbType: Date,
  },
}

const filter = {
  name: 'Hello',
  minAge: 10,
  maxAge: 100,
  maxDate: '2017-03-20T00:00:00.000Z',
}

describe('parse filter', () => {
  it('parse', () => {
    const mongoFilter = parseFilter(filter, filterFields)
    const expectedMongoFilter = {
      name: /Hello/i,
      age: { $gte: 10, $lte: 100 },
      date: { $lte: new Date('2017-03-20T00:00:00.000Z') },
    }
    expect(mongoFilter).to.deep.equal(expectedMongoFilter)
  })
})

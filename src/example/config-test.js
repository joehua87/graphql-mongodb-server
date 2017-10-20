/* eslint-disable global-require, import/prefer-default-export */

import { mongoose } from './models'
import { appCode, mongoUri } from '../config'

const debug = require('debug')(`${appCode}:config-test`)

export function setUpAndTearDown(initialData) {
  before(async () => {
    await mongoose.openUri(mongoUri)
    if (initialData) {
      await Promise.all(initialData.map(async (item) => {
        debug(`Start to insert ${item.schemaName}`)
        const Model = mongoose.model(item.schemaName)
        await Model.ensureIndexes()
        const entities = await Model.create(item.entities)
        debug(`${(entities || []).length} ${item.schemaName} inserted`)
      }))
    }
  })

  after(async () => {
    await mongoose.db.dropDatabase()
    await mongoose.close()
  })
}

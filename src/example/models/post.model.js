// @flow

import { Schema } from 'mongoose'
import timePlugin from 'mongoose-time-plugin'
import mongoose from './mongoose'

export const schemaName = 'Post'

export const schemaDefinition = {
  name: { type: String, required: true },
  data: {},
  description: String,
  website: String,
}

export const schema = new Schema(schemaDefinition, {
  collection: schemaName,
  retainKeyOrder: true,
})

schema.plugin(timePlugin)

export const Model = mongoose.model(schemaName, schema)

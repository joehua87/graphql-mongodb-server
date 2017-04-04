// @flow

import { Schema } from 'mongoose'
import timePlugin from 'mongoose-time-plugin'
import mongoose from './mongoose'

export const schemaName = 'ProductAttribute'

export const schemaDefinition = {
  key: { type: String, required: true },
  name: { type: String, required: true },
  group: { type: Schema.ObjectId, required: true, rel: 'ProductAttributeGroup' },
  description: String,
}

export const schema = new Schema(schemaDefinition, { collection: schemaName })
schema.index({ key: 1 })
schema.index({ group: 1 })

schema.plugin(timePlugin)

export const Model = mongoose.model(schemaName, schema)

export const config = {
  key: 'key',
  queryProjection: '',
  detailProjection: '',
  defaultLimit: 20,
  defaultSort: 'name',
  fields: [],
}

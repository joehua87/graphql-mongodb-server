// @flow

import { Schema } from 'mongoose'
import timePlugin from 'mongoose-time-plugin'
import mongoose from './mongoose'

export const schemaName = 'ProductBrand'

export const schemaDefinition = {
  id: { type: String, required: true }, // Track Old Id system
  slug: { type: String, required: true },
  name: { type: String, required: true },
  description: String,
  website: String,
}

export const schema = new Schema(schemaDefinition, { collection: schemaName })
schema.index({ slug: 1 }, { unique: true })
schema.index({ parentId: 1 })

schema.plugin(timePlugin)

export const Model = mongoose.model(schemaName, schema)

export const config = {
  key: 'slug',
  queryProjection: '',
  detailProjection: '',
  defaultLimit: 20,
  defaultSort: 'name',
  fields: [],
}

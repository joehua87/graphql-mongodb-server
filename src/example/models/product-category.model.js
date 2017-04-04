// @flow

import { Schema } from 'mongoose'
import timePlugin from 'mongoose-time-plugin'
import mongoose from './mongoose'

export const schemaName = 'ProductCategory'

export const schemaDefinition = {
  id: { type: String, required: true }, // Track Old Id system
  slug: { type: String, required: true },
  name: { type: String, required: true },
  weight: { type: Number, required: true, default: 0 },
  isRoot: { type: Boolean, required: true },
  parent: Schema.ObjectId,
  brands: [{ type: Schema.ObjectId, required: true, ref: 'ProductBrand' }],
  description: String,
}

export const schema = new Schema(schemaDefinition, { collection: schemaName })
schema.index({ slug: 1 }, { unique: true })
schema.index({ isRoot: 1 })
schema.index({ parent: 1 })
schema.index({ brands: 1 })

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

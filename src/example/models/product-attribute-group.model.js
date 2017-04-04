// @flow

import { Schema } from 'mongoose'
import timePlugin from 'mongoose-time-plugin'
import mongoose from './mongoose'

export const schemaName = 'ProductAttributeGroup'

export const schemaDefinition = {
  slug: { type: String, required: true },
  name: { type: String, required: true },
  description: String,
}

export const schema = new Schema(schemaDefinition, { collection: schemaName })
schema.index({ slug: 1 })
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

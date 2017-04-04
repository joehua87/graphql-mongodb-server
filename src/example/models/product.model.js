// @flow

import { Schema } from 'mongoose'
import timePlugin from 'mongoose-time-plugin'
import mongoose from './mongoose'

export const schemaName = 'Product'

export const schemaDefinition = {
  id: { type: String, required: true }, // Track Old Id system
  sku: String,
  model: { type: String, required: true },
  slug: { type: String, required: true },
  name: { type: String, required: true },
  description: String,
  body: String,
  listPrice: { type: Number, required: true },
  salePrice: { type: Number, required: true },
  imageSrc: String, // src
  category: Schema.ObjectId, // slug
  categories: [{ type: Schema.ObjectId, required: true, ref: 'ProductCategory' }],
  tags: [{ type: Schema.ObjectId, required: true, ref: 'ProductTag' }],
  brands: [{ type: Schema.ObjectId, required: true, ref: 'ProductBrand' }],
  attributes: [{
    key: { type: String, required: true },
    value: {},
  }],
  images: [{
    src: { type: String, required: true },
    title: { type: String, required: true },
  }],
}

export const schema = new Schema(schemaDefinition, { collection: schemaName })
schema.index({ sku: 1 })
schema.index({ slug: 1 }, { unique: true })
schema.index({ categories: 1 })
schema.index({ tags: 1 })
schema.index({ brands: 1 })
schema.index({ 'attributes.key': 1 })
schema.index(
  { name: 'text', description: 'text', body: 'text' },
  {
    weights: {
      name: 3,
      description: 2,
      body: 1,
    },
  },
)

schema.plugin(timePlugin)
export const Model = mongoose.model(schemaName, schema)

export const config = {
  key: 'sku',
  queryProjection: '',
  detailProjection: '',
  defaultLimit: 20,
  defaultSort: 'name',
  fields: [],
}

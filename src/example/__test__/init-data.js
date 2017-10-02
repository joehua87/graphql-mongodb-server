/* eslint-disable no-console */

// @flow

import path from 'path'
import fs from 'fs'
import yaml from 'yamljs'
import { mongoUri } from '../../config'
import {
  mongoose,
  ProductModel,
  ProductTagModel,
  ProductCategoryModel,
  ProductBrandModel,
} from '../models'

async function importData({
  filePath, Model }: {
        filePath: string,
        Model: any,
    }) {
  const fileContent = fs.readFileSync(filePath, 'utf8')
  const entities = yaml.parse(fileContent)
  const result = await Model.create(entities)
  console.log(`${result.length} items ${Model.modelName} inserted`)
  return result
}

async function run() {
  await mongoose.openUri(mongoUri)
  await mongoose.db.dropDatabase()

  const dataToImport = [
    {
      filePath: path.resolve(__dirname, './sample-data/products.yml'),
      Model: ProductModel.Model,
    },
    {
      filePath: path.resolve(__dirname, './sample-data/product-tags.yml'),
      Model: ProductTagModel.Model,
    },
    {
      filePath: path.resolve(__dirname, './sample-data/product-categories.yml'),
      Model: ProductCategoryModel.Model,
    },
    {
      filePath: path.resolve(__dirname, './sample-data/product-brands.yml'),
      Model: ProductBrandModel.Model,
    },
    // {
    //     filePath: path.resolve(__dirname, './sample-data/product-attributes.yml'),
    //     Model: ProductAttributeModel.Model,
    // },
    // {
    //     filePath: path.resolve(__dirname, './sample-data/product-attribute-groups.yml'),
    //     Model: ProductAttributeGroupModel.Model,
    // }
  ]

  await Promise.all(dataToImport.map(importData))
}
export default function InitData() {
  run()
    .then(() => {
      console.log('Success')
    })
}
run()
  .then(() => {
    console.log('Success')
  })
  .catch(console.error)
  .then(() => mongoose.close())

// @flow

import {
  ProductModel,
  ProductCategoryModel,
  ProductTagModel,
} from './models'
import createQuery from '../helpers/createQuery'
import createGetOne from '../helpers/createGetOne'
import * as productConfig from './config/product'
import { appCode } from '../config'

const debug = require('debug')(`${appCode}:resolvers`)

const checkAuthorizationFail = async (...params) => {
  debug(params)
  return {
    message: 'Required user',
  }
}

const checkAuthorizationSuccess = async (...params) => {
  debug(params)
  return null
}

const resolveFunctions = {
  Query: {
    products: createQuery({
      Model: ProductModel.Model,
      filterFields: productConfig.filters,
      populate: productConfig.populate,
      checkAuthorizationSuccess,
    }),
    restrictedProducts: createQuery({
      Model: ProductModel.Model,
      filterFields: productConfig.filters,
      populate: productConfig.populate,
      overrideFilter: async () => {
        const filter = await Promise.resolve({ categories: '58c4bf341a6d674733a2b2dd' })
        return filter
      },
    }),
    categories: createQuery({
      Model: ProductCategoryModel.Model,
      checkAuthorization: checkAuthorizationFail,
    }),
    tags: createQuery({
      Model: ProductTagModel.Model,
      checkAuthorization: checkAuthorizationSuccess,
    }),
    product: createGetOne({
      Model: ProductModel.Model,
      populate: productConfig.populate,
      checkAuthorizationSuccess,
    }),
  },
}

export default resolveFunctions

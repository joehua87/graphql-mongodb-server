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

const checkPermission = async (...params) => {
  debug(params)
  if (params[0].args.actionCode === 'view_product_full') {
    return {
      filter: {
        $or: [
          { category: '58c4bf341a6d674733a2b2dd', name: 'name' },
          { category: '58c4bf341a6d674733a2b2dd', listPrice: 2000 },
        ],
      },
      projection: { _id: 1, slug: 1, name: 1, description: 1, listPrice: 1 },
      // projection: 'slug name description category listPrice -sku -salePrice -model',
    }
  } else if (params[0].args.actionCode === 'view_product_basic') {
    return {
      filter: {
        $or: [
          { category: '58c4bf341a6d674733a2b2dd', name: 'name' },
          { category: '58c4bf341a6d674733a2b2dd', listPrice: { $gt: 1600 } },
        ],
      },
      projection: { _id: 1, slug: 1, name: 1 },
      // projection: 'slug name description category listPrice -sku -salePrice -model',
    }
  } 
  return {
    error: {
      code: 1,
      message: 'actionCodeNotSame',
      action: `action: ${params[0].args.actionCode}`,
      params,
    },
  }
}

const resolveFunctions = {
  Query: {
    products: createQuery({
      Model: ProductModel.Model,
      filterFields: productConfig.filters,
      populate: productConfig.populate,
      checkAuthorizationSuccess,
      checkPermission,
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
      filterFields: productConfig.filters,
      populate: productConfig.populate,
      checkAuthorizationSuccess,
    }),
  },
}

export default resolveFunctions

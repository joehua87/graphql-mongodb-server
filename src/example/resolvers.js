// @flow

import {
  ProductModel,
  ProductCategoryModel,
  ProductTagModel,
} from './models'
import createQuery from '../helpers/createQuery'
import createGetOne from '../helpers/createGetOne'
import * as productConfig from './config/product'

const checkAuthorizationFail = async () => ({
  message: 'Required user',
})

const checkAuthorizationSuccess = () => null

const resolveFunctions = {
  Query: {
    products: createQuery({
      Model: ProductModel.Model,
      filterFields: productConfig.filters,
      populate: productConfig.populate,
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
    }),
  },
}

export default resolveFunctions

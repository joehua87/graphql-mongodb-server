// @flow

import {
  ProductModel,
} from './models'
import createQueryExtractor from '../helpers/createQueryExtractor'
import createQueryResolver from '../helpers/createQueryResolver'
import createGetOne from '../helpers/createGetOne'

import * as productConfig from './config/product'

const resolveFunctions = {
  ProductResponse: createQueryResolver(ProductModel.Model),
  Query: {
    products: (parentObj: any, args: any, context: any, info: any) => (
      // NOTE Authorization goes here by receive data from context
      createQueryExtractor({
        filterFields: productConfig.filters,
        populate: productConfig.populate,
      })(
        parentObj, args, context, info,
      )
    ),
    product: createGetOne({
      Model: ProductModel.Model,
      populate: productConfig.populate,
    }),
  },
}

export default resolveFunctions

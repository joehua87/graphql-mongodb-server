// @flow

import {
  ProductModel,
} from './models'
import createQueryExtractor from '../helpers/createQueryExtractor'
import createQueryResolver from '../helpers/createQueryResolver'

import productFilter from './filters/productFilter'

const resolveFunctions = {
  ProductResponse: createQueryResolver(ProductModel.Model),
  Query: {
    products: (parentObj: any, args: any, context: any, info: any) => (
      // NOTE Authorization goes here by receive data from context
      createQueryExtractor({
        filterFields: productFilter,
        populate: ['category', 'categories', 'tags', 'brands'],
      })(
        parentObj, args, context, info,
      )
    ),
  },
}

export default resolveFunctions

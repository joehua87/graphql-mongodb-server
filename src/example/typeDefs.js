export default `
# Product Tag
type ProductTag {
  _id: ID!
  id: String
  slug: String!
  name: String!
  description: String
}

# Product Brand
type ProductBrand {
  _id: ID!
  id: String
  slug: String!
  name: String!
  description: String
  website: String
}

# Product Category
type ProductCategory {
  _id: ID!
  id: String
  slug: String!
  name: String!
  description: String
  isRoot: Boolean
  parent: ProductCategory
  children: [ProductCategory]
  brands: [ProductBrand]
}

type Image {
  src: String!
  title: String
}

type ProductAttribute {
  key: String!
  value: String
}

type Product {
  _id: ID!
  id: String
  model: String
  sku: String
  slug: String!
  name: String!
  description: String
  body: String
  listPrice: Int
  salePrice: Int
  tags: [ProductTag]
  imageSrc: String
  category: ProductCategory
  categories: [ProductCategory]
  images: [Image]
  brands: [ProductBrand]
  attributes: [ProductAttribute]
}

type PagingInfo {
  sort: String,
  page: Int,
  limit: Int,
  total: Int,
  hasMore: Boolean,
}

type ProductResponse {
  entities: [Product],
  pagingInfo: PagingInfo,
}

type ProductCategoryResponse {
  entities: [ProductCategory],
  pagingInfo: PagingInfo,
}

type ProductTagResponse {
  entities: [ProductTag],
  pagingInfo: PagingInfo,
}

type ProductBrandResponse {
  entities: [ProductBrand],
  pagingInfo: PagingInfo,
}

# the schema allows the following query:
type Query {
  # List
  products(
    category: String, tag: String, brand: String
    sort: String, page: Int, limit: Int
  ): ProductResponse
  brands(sort: String, page: Int, limit: Int): ProductBrandResponse
  categories(sort: String, page: Int, limit: Int): ProductCategoryResponse
  tags(sort: String, page: Int, limit: Int): ProductTagResponse

  # Detail
  product(slug: String): Product
}

# we need to tell the server which types represent the root query
# and root mutation types. We call them RootQuery and RootMutation by convention.
schema {
  query: Query
}
`

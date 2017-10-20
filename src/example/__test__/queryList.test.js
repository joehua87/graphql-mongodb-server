// @flow

import { expect } from 'chai'
import 'isomorphic-fetch'
import ApolloClient, { createNetworkInterface } from 'apollo-client'
import gql from 'graphql-tag'
import app from '../app'
import { setUpAndTearDown } from '../config-test'

const port = 3200

const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: `http://localhost:${port}/graphql`,
  }),
})

function assertResponse({ data }: { data: any }) {
  expect(data.posts).to.have.property('entities')
  expect(data.posts).to.have.property('pagingInfo')

  expect(data.posts.pagingInfo.page).to.equal(1)
  expect(data.posts.pagingInfo.hasMore).to.be.a('boolean')

  data.posts.entities.forEach((product) => {
    expect(product).to.have.property('_id')
    expect(product).to.have.property('name')
    expect(product).to.have.property('data')
  })
}

describe('Query list: get products', () => {
  setUpAndTearDown([
    {
      schemaName: 'Post',
      entities: [
        {
          _id: '59e990eca5b60b7e475e001f',
          name: 'Hello World',
          data: {
            data: {
              title: 'Hello World',
            },
            theme: {
              title: '',
            },
            sectionData: {
              title: '',
              subtitle: '',
              description: '',
            },
            sectionTheme: {
              root: '',
              title: '',
              subtitle: '',
              description: '',
            },
          },
        },
      ],
    },
  ])

  let server
  before(() => {
    server = app.listen(port)
  })

  after(() => {
    server.close()
  })

  it('without params', async () => {
    const query = gql`
    query {
      posts {
        pagingInfo {
          sort
          page
          limit
          total
          hasMore
        }
        entities {
          _id
          name
          data
        }
      }
    }
    `

    const response = await client.query({
      query,
    })

    assertResponse(response)
    expect(response.data.posts.pagingInfo.limit).to.equal(20)
    expect(response.data.posts.pagingInfo.total).to.equal(1)
  })

  /*
  it('without category _id filter', async () => {
    const query = gql`
    query TodoApp {
      products(category: "58c4bf341a6d674733a2b2dd") {
        pagingInfo {
          sort
          page
          limit
          total
          hasMore
        }
        entities {
          _id
          slug
          name
          images {
            src
            title
          }
          imageSrc
        }
      }
    }
    `

    const response = await client.query({
      query,
    })

    assertResponse(response)
    expect(response.data.products.pagingInfo.total).to.equal(23)
  })

  it('with overrideFilter', async () => {
    const query = gql`
    query TodoApp {
      restrictedProducts {
        pagingInfo {
          sort
          page
          limit
          total
          hasMore
        }
        entities {
          _id
          slug
          name
          images {
            src
            title
          }
          imageSrc
        }
      }
    }
    `

    const response = await client.query({
      query,
    })

    expect(response.data.restrictedProducts.pagingInfo.total).to.equal(23)
  })

  it('without tag slug filter', async () => {
    const query = gql`
    query TodoApp {
      products(tag: "thung-da-nhua") {
        pagingInfo {
          sort
          page
          limit
          total
          hasMore
        }
        entities {
          _id
          slug
          name
          images {
            src
            title
          }
          imageSrc
        }
      }
    }
    `

    const response = await client.query({
      query,
    })

    assertResponse(response)
    expect(response.data.products.pagingInfo.total).to.equal(15)
  })

  it('with paging limit', async () => {
    const query = gql`
    query TodoApp {
      products(limit: 50) {
        pagingInfo {
          sort
          page
          limit
          total
          hasMore
        }
        entities {
          _id
          slug
          name
          images {
            src
            title
          }
          imageSrc
        }
      }
    }
    `

    const response = await client.query({
      query,
    })

    assertResponse(response)
    expect(response.data.products.pagingInfo.limit).to.equal(50)
    expect(response.data.products.entities.length).to.equal(50)
  })

  it('should populate', async () => {
    const query = gql`
    query TodoApp {
      products {
        pagingInfo {
          sort
          page
          limit
          total
          hasMore
        }
        entities {
          _id
          slug
          name
          categories {
            _id
            slug
            name
          }
        }
      }
    }
    `

    const response = await client.query({
      query,
    })

    assertResponse(response)
    expect(response.data.products.pagingInfo.limit).to.equal(20)
    expect(response.data.products.pagingInfo.total).to.equal(579)

    // Make sure that at least 1 product have categories.length > 1
    const productsHavingCategoriesCount = response.data.products.entities.filter(x => x.categories.length > 0).length
    expect(productsHavingCategoriesCount).to.gt(0)

    response.data.products.entities.forEach((product) => {
      product.categories.forEach((cat) => {
        expect(cat).to.have.property('_id')
        expect(cat).to.have.property('slug')
        expect(cat).to.have.property('name')
      })
    })
  })
  */
})

// @flow

import { expect } from 'chai'
import 'isomorphic-fetch'
import ApolloClient, { createNetworkInterface } from 'apollo-client'
import gql from 'graphql-tag'
import app from '../app'
import { setUpAndTearDown } from '../config-test'
import { appCode } from '../../config'

const debug = require('debug')(`${appCode}:resolvers`)

const port = 3200

const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: `http://localhost:${port}/graphql`,
  }),
})

function assertResponse({ data }: { data: any }) {
  expect(data.products).to.have.property('entities')
  expect(data.products).to.have.property('pagingInfo')

  expect(data.products.pagingInfo.page).to.equal(1)
  expect(data.products.pagingInfo.hasMore).to.be.a('boolean')

  data.products.entities.forEach((product) => {
    expect(product).to.have.property('_id')
    expect(product).to.have.property('slug')
    expect(product).to.have.property('name')
  })
}

describe('Query list: get products with check permission', () => {
  setUpAndTearDown()

  let server
  before(() => {
    server = app.listen(port)
  })

  after(() => {
    server.close()
  })

  it('has fields { slug, name, desciption, listPrice }', async () => {
    const query = gql`
    query TodoApp {
      products(actionCode: "view_product_full") {
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
            name
          }
          description
          listPrice
          sku
          model
          salePrice
          images {
            src
            title
          }
          imageSrc
        },
        permission {
          error,
          filter,
          projection,
        }
      }
    }
    `

    const response = await client.query({
      query,
    })

    debug(response.data.products.permission)
    debug(response.data.products.permission.error.params)
    debug(response.data.products.entities)

    assertResponse(response)
    expect(response.data.products.pagingInfo.limit).to.equal(20)
    expect(response.data.products.pagingInfo.total).to.equal(2)
    expect(response.data.products.entities[0]).has.property('slug')
    expect(response.data.products.entities[0]).has.property('name')
    expect(response.data.products.entities[0]).has.property('description')
    expect(response.data.products.entities[0]).has.property('listPrice')
    // no allow others properties
    expect(response.data.products.entities[0]).has.property('sku')
    expect(response.data.products.entities[0].sku).equal(null)
    expect(response.data.products.entities[0]).has.property('model')
    expect(response.data.products.entities[0].model).equal(null)
    expect(response.data.products.entities[0]).has.property('salePrice')
    expect(response.data.products.entities[0].salePrice).equal(null)
  })

  it('has fields { slug, name }', async () => {
    const query = gql`
    query TodoApp {
      products(actionCode: "view_product_basic", category: "58c4bf341a6d674733a2b2dd") {
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
            name
          }
          description
          listPrice
          sku
          model
          salePrice
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
    debug(response.data.products.entities)
    assertResponse(response)
    expect(response.data.products.pagingInfo.total).to.equal(3)

    expect(response.data.products.entities[0]).has.property('slug')
    expect(response.data.products.entities[0]).has.property('name')
    expect(response.data.products.entities[0]).has.property('description')
    expect(response.data.products.entities[0].description).equal(null)
    expect(response.data.products.entities[0]).has.property('listPrice')
    expect(response.data.products.entities[0].listPrice).equal(null)
    expect(response.data.products.entities[0]).has.property('sku')
    expect(response.data.products.entities[0].sku).equal(null)
    expect(response.data.products.entities[0]).has.property('model')
    expect(response.data.products.entities[0].model).equal(null)
    expect(response.data.products.entities[0]).has.property('salePrice')
    expect(response.data.products.entities[0].salePrice).equal(null)
  })
})

// @flow

import { expect } from 'chai'
import 'isomorphic-fetch'
import ApolloClient, { createNetworkInterface } from 'apollo-client'
import gql from 'graphql-tag'
import app from '../../app'
import { setUpAndTearDown } from '../../config-test'

const port = 3200

const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: `http://localhost:${port}/graphql`,
  }),
})

describe('Get one', () => {
  setUpAndTearDown()

  let server
  before(() => {
    server = app.listen(port)
  })

  after(() => {
    server.close()
  })

  it('get', async () => {
    const slug = 'tu-nhua-duy-tan-sake-4-tang-4-ngan'
    const query = gql`
    query ProductDetail {
      productWithPermission(
        params: {
            slug: "${slug}"
        },
        actionCode: "view_product_full"
    ) {
        _id
        slug
        name
        listPrice
        sku
        model
        salePrice
      }
    }
    `

    const response = await client.query({
      query,
    })
    expect(response.data.productWithPermission.slug).to.equal(slug)
    // no allow others properties
    expect(response.data.productWithPermission.sku).equal(null)
    expect(response.data.productWithPermission.model).equal(null)
    expect(response.data.productWithPermission.salePrice).equal(null)
  })

  it('get with customer filter', async () => {
    const slug = 'tu-nhua-duy-tan-sake-5-tang-5-ngan'
    const query = gql`
    query ProductDetail {
      productWithPermission(
        params: {
            customFilterSlug: "${slug}"
        },
        actionCode: "view_product_gt1600"
    ) {
        _id
        slug
        name
        listPrice
        sku
        model
        salePrice
      }
    }
    `

    const response = await client.query({
      query,
    })
    console.log(response.data.productWithPermission)
    expect(response.data.productWithPermission.slug).to.equal(slug)
    // no allow others properties
    expect(response.data.productWithPermission.listPrice).equal(null)
    expect(response.data.productWithPermission.sku).equal(null)
    expect(response.data.productWithPermission.model).equal(null)
    expect(response.data.productWithPermission.salePrice).equal(null)
  })

  it('get with populate', async () => {
    const slug = 'tu-nhua-duy-tan-sake-4-tang-4-ngan'
    const query = gql`
    query ProductDetail {
      productWithPermission(
        params: {
            slug: "${slug}"
        },
        actionCode: "view_product_gt1600"
    ) {
        _id
        slug
        name
        listPrice
        sku
        model
        salePrice
        categories {
          _id
          slug
          name
        }
      }
    }
    `

    const response = await client.query({
      query,
    })
    console.log(response.data.productWithPermission)
    expect(response.data.productWithPermission).equal(null)
    // console.log(response.data.productWithPermission.categories.length)
    // expect(response.data.productWithPermission.categories.length).to.gt(0)
    // response.data.productWithPermission.categories.forEach((cat) => {
    //   expect(cat).to.have.property('_id')
    //   expect(cat).to.have.property('slug')
    //   expect(cat).to.have.property('name')
    // })
  })
})

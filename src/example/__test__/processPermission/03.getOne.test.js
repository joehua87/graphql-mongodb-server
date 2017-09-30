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

  it('get has fields { slug, name, desciption, listPrice }', async () => {
    const slug = 'tu-nhua-duy-tan-sake-4-tang-4-ngan'
    const query = gql`
    query ProductDetail {
      productWithPermission(
        params: {
            slug: "${slug}"
        },
        actionCode: "view_product_full"
    ) {
        entity {
          _id
          slug
          name
          listPrice
          sku
          model
          salePrice
        }
        error
      }
    }
    `

    const response = await client.query({
      query,
    })
    expect(response.data.productWithPermission.entity.slug).to.equal(slug)
    expect(response.data.productWithPermission.entity).has.property('slug')
    expect(response.data.productWithPermission.entity).has.property('name')
    expect(response.data.productWithPermission.entity).has.property('listPrice')
    // no allow others properties
    expect(response.data.productWithPermission.entity.sku).equal(null)
    expect(response.data.productWithPermission.entity.model).equal(null)
    expect(response.data.productWithPermission.entity.salePrice).equal(null)
  })

  it('get with customer filter, has fields { slug, name }', async () => {
    const slug = 'tu-nhua-duy-tan-sake-5-tang-5-ngan'
    const query = gql`
    query ProductDetail {
      productWithPermission(
        params: {
            customFilterSlug: "${slug}"
        },
        actionCode: "view_product_gt1600"
    ) {
        entity {
          _id
          slug
          name
          listPrice
          sku
          model
          salePrice
        }
        error
      }
    }
    `

    const response = await client.query({
      query,
    })
    // console.log(response.data.productWithPermission)
    expect(response.data.productWithPermission.entity.slug).to.equal(slug)
    expect(response.data.productWithPermission.entity).has.property('slug')
    expect(response.data.productWithPermission.entity).has.property('name')
    // no allow others properties
    expect(response.data.productWithPermission.entity.listPrice).equal(null)
    expect(response.data.productWithPermission.entity.sku).equal(null)
    expect(response.data.productWithPermission.entity.model).equal(null)
    expect(response.data.productWithPermission.entity.salePrice).equal(null)
  })

  it('get error Canot find entity', async () => {
    const slug = 'tu-nhua-duy-tan-sake-4-tang-4-ngan'
    const query = gql`
    query ProductDetail {
      productWithPermission(
        params: {
            slug: "${slug}"
        },
        actionCode: "view_product_gt1600"
    ) {
        entity {
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
        error
      }
    }
    `

    const response = await client.query({
      query,
    })
    // console.log(response.data.productWithPermission)
    expect(response.data.productWithPermission.error.message).equal('Canot find entity')
    // console.log(response.data.productWithPermission.entity.categories.length)
    // expect(response.data.productWithPermission.entity.categories.length).to.gt(0)
    // response.data.productWithPermission.entity.categories.forEach((cat) => {
    //   expect(cat).to.have.property('_id')
    //   expect(cat).to.have.property('slug')
    //   expect(cat).to.have.property('name')
    // })
  })
})

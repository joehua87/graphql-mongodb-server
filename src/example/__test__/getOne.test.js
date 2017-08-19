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
      product(slug: "${slug}") {
        _id
        slug
        name
      }
    }
    `

    const response = await client.query({
      query,
    })
    expect(response.data.product.slug).to.equal(slug)
  })

  it('get with customer filter', async () => {
    const slug = 'tu-nhua-duy-tan-sake-4-tang-4-ngan'
    const query = gql`
    query ProductDetail {
      product(customFilterSlug: "${slug}") {
        _id
        slug
        name
      }
    }
    `

    const response = await client.query({
      query,
    })
    expect(response.data.product.slug).to.equal(slug)
  })

  it('get with populate', async () => {
    const slug = 'tu-nhua-duy-tan-sake-4-tang-4-ngan'
    const query = gql`
    query ProductDetail {
      product(slug: "${slug}") {
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
    `

    const response = await client.query({
      query,
    })
    expect(response.data.product.slug).to.equal(slug)
    expect(response.data.product.categories.length).to.gt(0)
    response.data.product.categories.forEach((cat) => {
      expect(cat).to.have.property('_id')
      expect(cat).to.have.property('slug')
      expect(cat).to.have.property('name')
    })
  })
})

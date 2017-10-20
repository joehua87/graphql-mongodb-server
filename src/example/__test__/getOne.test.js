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

  it('get', async () => {
    const _id = '59e990eca5b60b7e475e001f'
    const query = gql`
    query {
      post(_id: "59e990eca5b60b7e475e001f") {
        entity {
          _id
          name
          data
        }
        error
      }
    }
    `

    const response = await client.query({
      query,
    })
    expect(response.data.post.entity).to.have.property('name')
    expect(response.data.post.entity).to.have.property('data')
    expect(response.data.post.entity._id).to.equal(_id)
  })

  /*
  it('get with customer filter', async () => {
    const slug = 'tu-nhua-duy-tan-sake-4-tang-4-ngan'
    const query = gql`
    query ProductDetail {
      product(customFilterSlug: "${slug}") {
        entity {
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
    expect(response.data.product.entity.slug).to.equal(slug)
  })

  it('get with populate', async () => {
    const slug = 'tu-nhua-duy-tan-sake-4-tang-4-ngan'
    const query = gql`
    query ProductDetail {
      product(slug: "${slug}") {
        entity {
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
    expect(response.data.product.entity.slug).to.equal(slug)
    expect(response.data.product.entity.categories.length).to.gt(0)
    response.data.product.entity.categories.forEach((cat) => {
      expect(cat).to.have.property('_id')
      expect(cat).to.have.property('slug')
      expect(cat).to.have.property('name')
    })
  })
  */
})

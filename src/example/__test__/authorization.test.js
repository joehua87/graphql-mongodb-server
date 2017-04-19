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

describe('Query list: get categories', () => {
  setUpAndTearDown()

  let server
  before(() => {
    server = app.listen(port)
  })

  after(() => {
    server.close()
  })

  it('return error if checkAuthorization fail', async () => {
    const query = gql`
    query TodoApp {
      categories {
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
        }
        error
      }
    }
    `

    const response = await client.query({
      query,
    })

    expect(response.data.categories.error).to.have.property('message')
    expect(response.data.categories.error.message).to.equal('Required user')
  })

  it('success', async () => {
    const query = gql`
    query TodoApp {
      tags {
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
        }
        error
      }
    }
    `

    const response = await client.query({
      query,
    })

    expect(response.data.tags.error).to.equal(null)
    expect(response.data.tags.pagingInfo.total).to.gt(0)
  })
})

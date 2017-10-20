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

describe('Query list: get posts', () => {
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

  it('return error if checkAuthorization fail', async () => {
    const query = gql`
    query {
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
        }
        error
      }
    }
    `

    const response = await client.query({
      query,
    })

    expect(response.data.posts.error).to.equal(null)
    expect(response.data.posts.pagingInfo.total).to.gt(0)
  })
})

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

describe('Mutation', () => {
  setUpAndTearDown()

  let server
  before(() => {
    server = app.listen(port)
  })

  after(() => {
    server.close()
  })
  let post
  it('create new', async () => {
    const mutation = gql`
      mutation($name: String!, $data: JSON) {
        createPost(name: $name, data: $data) {
          result {
            _id
            name
            data
          }
          error
        }
      }
    `

    const postToCreate = {
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
    }

    const response = await client.mutate({
      mutation,
      variables: postToCreate,
    })
    post = response.data.createPost.result
    // expect(response.data.product.entity.slug).to.equal(slug)
  })

  it('created success', () => {
    expect(post).to.have.property('name', 'Hello World')
  })

  it('keep object order', () => {
    const keys = Object.keys(post.data)
    expect(keys).to.deep.equal(['data', 'theme', 'sectionData', 'sectionTheme'])
  })

  it('keep nested object order', () => {
    const keys = Object.keys(post.data.sectionTheme)
    expect(keys).to.deep.equal(['root', 'title', 'subtitle', 'description'])
  })

  let updatedPost
  it('update', async () => {
    const mutation = gql`
      mutation($_id: ID!, $name: String!, $data: JSON) {
        editPost(_id: $_id, name: $name, data: $data) {
          result {
            _id
            name
            data
          }
          error
        }
      }
    `

    const postToEdit = {
      _id: post._id,
      name: 'Updated name',
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
    }

    const response = await client.mutate({
      mutation,
      variables: postToEdit,
    })
    updatedPost = response.data.editPost.result
    // expect(response.data.product.entity.slug).to.equal(slug)
  })

  it('update success', () => {
    expect(updatedPost).to.have.property('name', 'Updated name')
  })

  it('keep object order after update', () => {
    const keys = Object.keys(updatedPost.data)
    expect(keys).to.deep.equal(['data', 'theme', 'sectionData', 'sectionTheme'])
  })

  it('keep nested object order after update', () => {
    const keys = Object.keys(updatedPost.data.sectionTheme)
    expect(keys).to.deep.equal(['root', 'title', 'subtitle', 'description'])
  })
})

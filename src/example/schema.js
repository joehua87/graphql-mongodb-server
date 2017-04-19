// @flow

import JSON from 'graphql-type-json'
import { makeExecutableSchema } from 'graphql-tools'
import typeDefs from './typeDefs'
import resolvers from './resolvers'

const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers: {
    JSON,
    ...resolvers,
  },
})

export default executableSchema

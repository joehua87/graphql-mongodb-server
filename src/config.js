// @flow

require('dotenv').config()

export const appCode = 'graphql-mongodb-server'
export const env = process.env.NODE_ENV || 'development'
export const mongoUri = env !== 'test' ? process.env.MONGO_URI : 'mongodb://localhost/graphql-mongodb-server-test'

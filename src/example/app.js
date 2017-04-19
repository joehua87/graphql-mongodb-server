// @flow

import Koa from 'koa'
import KoaRouter from 'koa-router'
import koaBody from 'koa-bodyparser'
import koaCors from 'koa-cors'
import convert from 'koa-convert'
import { graphqlKoa, graphiqlKoa } from 'graphql-server-koa'
import myGraphQLSchema from './schema'

const app = new Koa()
const router = new KoaRouter()

app.use(convert(koaCors()))
app.use(koaBody())

router.post('/graphql', (ctx) => {
  const context = { user: 'test' }
  return graphqlKoa({ schema: myGraphQLSchema, context })(ctx)
})
router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }))
app.use(router.routes())
app.use(router.allowedMethods())

export default app

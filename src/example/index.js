// @flow

import { mongoose } from './models'
import { mongoUri } from '../config'
import app from './app'

const port = parseInt(process.env.PORT || 3100, 10)

mongoose.open(mongoUri, () => {
  app.listen(port)
  console.log(`App listen to port ${port}`)
})

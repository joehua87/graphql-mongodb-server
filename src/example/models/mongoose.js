// @flow

import m from 'mongoose'

m.Promise = Promise
export default m.createConnection()

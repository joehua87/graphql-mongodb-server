// @flow

import R from 'ramda'
import getFields from './getFields'
import parseFilter from '../parseFilter'
import { appCode } from '../config'

const debug = require('debug')(`${appCode}:create-get-one`)

const mixedProjection = ({ source1, source2 }) => {
  const result = {}
  if (source1 === null || source1 === undefined || source1 === ' ') return source2
  const keys = Object.keys(source2)
  const fields1 = source1.split(' ')
  keys.map((item) => {
    if (fields1.indexOf(item) > -1 && source2[item] > 0) {
      result[item] = 1
      return item
    }
    return null
  })
  return result
}

export default function createGetOne({
  Model,
  overrideFilter,
  filterFields = {},
  populate,
  checkAuthorization,
  checkPermission,
}: {
    Model: any,
    overrideFilter?: { [key: string]: any } | Function,
    filterFields?: FilterFields,
    populate: Array<string>,
    checkAuthorization?: Function,
    checkPermission?: Function,
  }) {
  return async function getOne(
    obj: any,
    args: { params: any, actionCode: string }, // Example: { slug }: { slug: string },
    context: any,
    info: any,
  ): Promise<any> {
    if (checkAuthorization) {
      const error = await checkAuthorization({ parent: obj, args, context, info })
      debug('checkAuthorization', { context, error })
      if (error) return { error }
    }
    let _filterResult = {}
    let _projectionResult = {}
    if (checkPermission) {
      const _resultCheckPermission = await checkPermission({ parent: obj, args, context, info })
      _filterResult = _resultCheckPermission.filter || {}
      _projectionResult = _resultCheckPermission.projection || {}
      if (_resultCheckPermission.error) return { error: _resultCheckPermission.error }
    }

    let _overrideFilter = overrideFilter || {}

    if (typeof _overrideFilter === 'function') {
      _overrideFilter = await _overrideFilter(context)
    }

    const _mongoFilter = await parseFilter(args.params, filterFields)

    // Merge MongoFilter parsed from query & override Filter
    const mongoFilter = {
      // keep default filter args but ignore customer filter keys
      ...R.omit(Object.keys(filterFields), args.params),
      ..._mongoFilter,
      ..._overrideFilter,
      ..._filterResult,
    }
    const { projectionInfo } = getFields(info)
    const projection = mixedProjection({ source1: projectionInfo, source2: _projectionResult })
    let q = Model.findOne(mongoFilter)
      .select(projection)
    populate.forEach((field) => { q = q.populate(field) })
    return q.lean()
  }
}

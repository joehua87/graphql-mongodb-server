// @flow

import R from 'ramda'
import { appCode } from '../config'

const debug = require('debug')(`${appCode}:refine-projection`)

export default function refineProjection({
  projection,
  availableProjection,
  populate,
}: {
  projection: string[],
  availableProjection?: string | string[],
  populate: string[],
}): {
  projection: string[],
  populate: string[],
} {
  debug('before refine', { projection, availableProjection, populate })
  let _projection = projection
  if (availableProjection) {
    const tmp =
      typeof availableProjection === 'string'
        ? availableProjection
          .split(/ /g)
          .map(p => p.trim())
          .filter(x => x)
        : availableProjection

    _projection = R.intersection(tmp, _projection)

    if (_projection.length === 0) _projection = ['_id']
  }

  const result = {
    projection: _projection,
    populate: R.intersection(projection, populate),
  }
  debug('after refine', result)
  return result
}

// @flow

import R from 'ramda'

export default function getProjection({
  field,
  info,
}: {
  field: string,
  info: any,
}): string[] {
  const fieldSelections = info.fieldNodes[0].selectionSet.selections
  const { selectionSet: { selections } } = fieldSelections.find(x => x.name.value === field)
  return R.pipe(R.map(x => x.name.value), R.filter(x => x !== '__typename'))(selections)
}

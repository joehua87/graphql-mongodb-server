// @flow

import R from 'ramda'

export default function getProjection({
  field,
  info,
}: {
  field: string,
  info: any,
}): string[] {
  // console.log(JSON.stringify(info, null, 2))
  const {
    selectionSet: { selections },
  } = info.fieldNodes[0].selectionSet.selections.find(x => x.name.value === field)
  const fieldSelection = R.pipe(
    R.filter(x => x.kind === 'Field'),
    R.map(x => x.name.value),
    R.filter(x => x !== '__typename'),
  )(selections)
  const fragmentSelection = R.pipe(
    R.filter(x => x.kind === 'FragmentSpread'),
    R.map(x => x.name.value),
    R.filter(x => x !== '__typename'),
  )(selections)

  const fragmentFields = R.pipe(
    R.map(name => info.fragments[name]),
    R.map(x =>
      x.selectionSet.selections.map(selection => selection.name.value)),
    R.flatten,
  )(fragmentSelection)
  return [...fieldSelection, ...fragmentFields]
}

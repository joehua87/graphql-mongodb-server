// @flow

export default function getFields(
  info: { fieldNodes: Array<any> },
): { name: string, fields: Array<string>, projection: string } {
  return info.fieldNodes.map((item) => {
    const fields = item.selectionSet.selections.map(x => x.name.value)
    return {
      name: item.name.value,
      fields,
      projection: fields.join(' '),
    }
  })[0]
}


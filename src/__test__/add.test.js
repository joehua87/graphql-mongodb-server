// @flow

import { expect } from 'chai'
import {
  add,
  addAsync,
} from '../add'

describe('add', () => {
  it('add', () => {
    expect(add(1, 1)).to.equal(2)
  })

  it('add async', async () => {
    const result = await addAsync(1, 1)
    expect(result).to.equal(2)
  })
})

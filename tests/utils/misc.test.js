import { describe, expect, it } from 'vitest'
import { assert } from '../../lib/utils/misc'

describe('assert', () => {
  it('throws an error when a condition equals `false`; otherwise, do nothing', () => {
    expect(() => assert('true', 'error')).not.toThrow()
    expect(() => assert(false, 'error')).toThrowErrorMatchingInlineSnapshot(`[Error: error]`)
  })
})

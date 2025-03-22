import { describe, expect, it, vitest } from 'vitest'
import { assert } from '../../utils/assert'

describe('assert', () => {
  it('throws an exception when a predicate does not equal to `true`; otherwise, it does nothing', () => {
    expect(() => assert(true, 'Exception A')).not.toThrow()
    expect(() => assert(false, 'Exception B'))
      .toThrowErrorMatchingInlineSnapshot(`[Error: Exception B]`)
    expect(() => assert(false, 'Exception C', ReferenceError))
      .toThrowErrorMatchingInlineSnapshot(`[ReferenceError: Exception C]`)
  })
})

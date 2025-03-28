import { describe, expect, it } from 'vitest'
import { ChainifyPredicate } from '../../lib/utils/predicate.js'

describe('isNonNull', () => {
  it('returns `true` when an input does not equal `null`; otherwise, it returns `false`', () => {
    expect(ChainifyPredicate.isNonNull()).toBe(true)
    expect(ChainifyPredicate.isNonNull(5)).toBe(true)
    expect(ChainifyPredicate.isNonNull({})).toBe(true)
    expect(ChainifyPredicate.isNonNull(null)).toBe(false)
  })
})

describe('isNull', () => {
  it('returns `true` when an input is `null`; otherwise, it returns `false``', () => {
    expect(ChainifyPredicate.isNull()).toBe(false)
    expect(ChainifyPredicate.isNull(5)).toBe(false)
    expect(ChainifyPredicate.isNull({})).toBe(false)
    expect(ChainifyPredicate.isNull(null)).toBe(true)
  })
})

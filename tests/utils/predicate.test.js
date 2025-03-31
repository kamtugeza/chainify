import { describe, expect, it } from 'vitest'
import { RechainifyPredicate } from '../../lib/utils/predicate.js'

describe('isNonNull', () => {
  it('returns `true` when an input does not equal `null`; otherwise, it returns `false`', () => {
    expect(RechainifyPredicate.isNonNull()).toBe(true)
    expect(RechainifyPredicate.isNonNull(5)).toBe(true)
    expect(RechainifyPredicate.isNonNull({})).toBe(true)
    expect(RechainifyPredicate.isNonNull(null)).toBe(false)
  })
})

describe('isNull', () => {
  it('returns `true` when an input is `null`; otherwise, it returns `false``', () => {
    expect(RechainifyPredicate.isNull()).toBe(false)
    expect(RechainifyPredicate.isNull(5)).toBe(false)
    expect(RechainifyPredicate.isNull({})).toBe(false)
    expect(RechainifyPredicate.isNull(null)).toBe(true)
  })
})

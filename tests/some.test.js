import { describe, expect, it } from 'vitest'
import some from '../lib/some.js'

describe('some', () => {
  function buildTest () {
    const chain = some({
      currency: (symbol) => (input) => {
        const isCurrency = typeof symbol === 'string' && typeof input === 'string' && input.startsWith(symbol) 
        return isCurrency ? Number.parseFloat(input.slice(symbol.length)) : null 
      },
      gte: (gte) => (input) => {
        const isGreaterOrEqual = typeof gte === 'number' && typeof input === 'number' && input >= gte
        return isGreaterOrEqual ? input : null
      },
      number: (input) => typeof input === 'number' ? input * 2 : null,
      string: (input) => typeof input === 'string' ? `${input}!` : null,
    }) 

    return { chain }
  }

  it('throws an exception when the `step` argument is not an array or an object', () => {
    expect(() => some()).not.toThrow()
    expect(() => some([])).not.toThrow()
    expect(() => some({})).not.toThrow()
    expect(() => some(null))
      .toThrowErrorMatchingInlineSnapshot(
        `[TypeError: \`steps\` argument should be either an array or an object]`
      )
    expect(() => some(5))
      .toThrowErrorMatchingInlineSnapshot(
        `[TypeError: \`steps\` argument should be either an array or an object]`
      )
    expect(() => some('steps'))
      .toThrowErrorMatchingInlineSnapshot(
        `[TypeError: \`steps\` argument should be either an array or an object]`
      )
  })

  it('throws an exception when `predicate` is not a function', () => {
    expect(() => some([], () => true)).not.toThrow()
    expect(() => some([])).not.toThrow()
    expect(() => some([], null))
      .toThrowErrorMatchingInlineSnapshot(`[TypeError: \`predicate\` should be a function.]`)
    expect(() => some([], 'abc'))
      .toThrowErrorMatchingInlineSnapshot(`[TypeError: \`predicate\` should be a function.]`)
  })

  it('clears the sequence after the input decoration', () => {
    const addOne = (input) => ++input
    const double = (input) => input * 2
    const chain = some({ addOne, double })

    chain.addOne.double
    expect(chain.__SEQUENCE__).toEqual([addOne, double])

    chain(35)
    expect(chain.__SEQUENCE__).toEqual([])
  })

  it('returns `null` when there is no steps', () => {
    const chain = some([])

    expect(chain(5)).toBe(null)
    expect(chain('abc')).toBe(null)
    expect(chain({})).toBe(null)
  })

  it('returns the result of the plain step if it is not `null`', () => {
    const { chain } = buildTest()

    expect(chain.number(5)).toBe(10)
    expect(chain.number('abc')).toBe(null)
    expect(chain.string(5)).toBe(null)
    expect(chain.string('abc')).toBe('abc!')
  })

  it('returns the result of the factory step, which is not `null`', () => {
    const { chain } = buildTest()

    expect(chain.currency(5, 5)).toBe(null)
    expect(chain.currency('$', 5)).toBe(null)
    expect(chain.currency('$', 'ahoy!')).toBe(null)
    expect(chain.currency('$', '€10')).toBe(null)
    expect(chain.currency('$', '$10')).toBe(10)
    expect(chain.currency('€', '€10')).toBe(10)

    expect(chain.gte('abc', 10)).toBe(null)
    expect(chain.gte(10, '10')).toBe(null)
    expect(chain.gte(10, 5)).toBe(null)
    expect(chain.gte(10, 10)).toBe(10)
    expect(chain.gte(10, 15)).toBe(15)
  })

  it('returns the result of the first step, which is not `null`', () => {
    const { chain } = buildTest()

    expect(chain.number.string(15)).toBe(30)
    expect(chain.number.string('ahoy')).toBe('ahoy!')
    expect(chain.number.string([])).toBe(null)

    expect(chain.string.number(15)).toBe(30)
    expect(chain.string.number('hello')).toBe('hello!')
    expect(chain.string.number({})).toBe(null)

    expect(chain.currency('$').gte(30, 45)).toBe(45)
    expect(chain.currency('$').gte(30, '$64')).toBe(64)
    expect(chain.currency('$').gte(30, 15)).toBe(null)
    expect(chain.currency('$').gte(30, '15')).toBe(null)
    expect(chain.currency('$').gte(30, undefined)).toBe(null)

    expect(chain.gte(22).currency('€', 40)).toBe(40)
    expect(chain.gte(22).currency('€', '€40')).toBe(40)
    expect(chain.gte(22).currency('€', 20)).toBe(null)
    expect(chain.gte(22).currency('€', '25')).toBe(null)
    expect(chain.gte(22).currency('€', {})).toBe(null)

    expect(chain.number.gte(10, 15)).toBe(30)
    expect(chain.number.gte(10, 5)).toBe(10)
    expect(chain.number.gte(10, '15')).toBe(null)
    expect(chain.number.gte(10, [])).toBe(null)
    
    expect(chain.gte(10).number(15)).toBe(15)
    expect(chain.gte(10).number(5)).toBe(10)
    expect(chain.gte(10).number('15')).toBe(null)
    expect(chain.gte(10).number([])).toBe(null)

    expect(chain.number.string.gte(15).currency('$', 44)).toBe(88)
    expect(chain.number.string.gte(15).currency('$', '$44')).toBe('$44!')

    expect(chain.currency('€').gte(6).number.string(100)).toBe(100)
    expect(chain.currency('€').gte(6).number.string('€99.99')).toBe(99.99)
  })
})

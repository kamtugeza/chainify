import { describe, expect, it } from 'vitest'
import every from '../lib/every.js'

describe('every', () => {
  function buildTest () {
    const chain = every({
      currency: (symbol) => (input) => {
        const isCurrency = typeof symbol === 'string' && typeof input === 'string' && input.startsWith(symbol) 
        return isCurrency ? Number.parseFloat(input.slice(symbol.length)) : null 
      },
      gte: (gte) => (input) => {
        const isGreaterOrEqual = typeof gte === 'number' && typeof input === 'number' && input >= gte
        return isGreaterOrEqual ? input : null
      }, 
      number: (input) => typeof input === 'number' ? input * 2 : null,
      positive: (input) => typeof input === 'number' && input >=0  ? input : null,
    })

    return { chain }
  }

  it('throws an exception when the `step` argument is not an array or an object', () => {
    expect(() => every()).not.toThrow()
    expect(() => every([])).not.toThrow()
    expect(() => every({})).not.toThrow()
    expect(() => every(null))
      .toThrowErrorMatchingInlineSnapshot(
        `[TypeError: \`steps\` argument should be either an array or an object]`
      )
    expect(() => every(5))
      .toThrowErrorMatchingInlineSnapshot(
        `[TypeError: \`steps\` argument should be either an array or an object]`
      )
    expect(() => every('steps'))
      .toThrowErrorMatchingInlineSnapshot(
        `[TypeError: \`steps\` argument should be either an array or an object]`
      )
  })

  it('throws an exception when `predicate` is not a function', () => {
    expect(() => every([], () => true)).not.toThrow()
    expect(() => every([])).not.toThrow()
    expect(() => every([], null))
      .toThrowErrorMatchingInlineSnapshot(`[TypeError: \`predicate\` should be a function.]`)
    expect(() => every([], 'abc'))
      .toThrowErrorMatchingInlineSnapshot(`[TypeError: \`predicate\` should be a function.]`)
  })

  it('clears the sequence after the input decoration', () => {
    const addOne = (input) => ++input
    const double = (input) => input * 2
    const chain = every({ addOne, double }) 

    chain.addOne.double
    expect(chain.__SEQUENCE__).toEqual([addOne, double])

    chain(35)
    expect(chain.__SEQUENCE__).toEqual([])
  })

  it('returns `null` when there is no steps', () => {
    const chain = every([])

    expect(chain()).toBe(undefined)
    expect(chain(null)).toBe(null)
    expect(chain(5)).toBe(5) 
    expect(chain(7n)).toBe(7n)
    expect(chain('abc')).toBe('abc')

    const inputObject = {}
    expect(chain(inputObject)).toBe(inputObject)

    const inputArray = []
    expect(chain(inputArray)).toBe(inputArray)
  })

  it('returns the result of the plain step if it is not `null`', () => {
    const { chain } = buildTest()

    expect(chain.number(5)).toBe(10)
    expect(chain.number('abc')).toBe(null)

    expect(chain.positive(5)).toBe(5)
    expect(chain.positive(-5)).toBe(null)
    expect(chain.positive('abc')).toBe(null)
  })

  it('returns the result of the factory step if it is not `null`', () => {
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

  it('returns the result of the last step if all steps returns non-null values', () => {
    const { chain } = buildTest()
    
    expect(chain.number.positive(5)).toBe(10)
    expect(chain.number.positive(-5)).toBe(null)
    expect(chain.number.positive('abc')).toBe(null)
    
    expect(chain.positive.number(5)).toBe(10)
    expect(chain.positive.number(-5)).toBe(null)
    expect(chain.positive.number('abc')).toBe(null)

    expect(chain.currency('$').gte(30, 45)).toBe(null)
    expect(chain.currency('$').gte(30, '$64')).toBe(64)
    expect(chain.currency('$').gte(30, 15)).toBe(null)
    expect(chain.currency('$').gte(30, '15')).toBe(null)
    expect(chain.currency('$').gte(30, undefined)).toBe(null)

    expect(chain.gte(22).currency('€', 40)).toBe(null)
    expect(chain.gte(22).currency('€', '€40')).toBe(null)
    expect(chain.gte(22).currency('€', 20)).toBe(null)
    expect(chain.gte(22).currency('€', '25')).toBe(null)
    expect(chain.gte(22).currency('€', {})).toBe(null)

    expect(chain.number.gte(10, 15)).toBe(30)
    expect(chain.number.gte(10, 5)).toBe(10)
    expect(chain.number.gte(10, '15')).toBe(null)
    expect(chain.number.gte(10, [])).toBe(null)
    
    expect(chain.gte(10).number(15)).toBe(30)
    expect(chain.gte(10).number(5)).toBe(null)
    expect(chain.gte(10).number('15')).toBe(null)
    expect(chain.gte(10).number([])).toBe(null)

    expect(chain.number.positive.gte(15).currency('$', 44)).toBe(null)
    expect(chain.number.positive.gte(15).currency('$', '$44')).toBe(null)

    expect(chain.currency('$').number.positive.gte(10, 5)).toBe(null)
    expect(chain.currency('$').number.positive.gte(10, '$2')).toBe(null)
    expect(chain.currency('$').number.positive.gte(10, '$5')).toBe(10)
  })
})

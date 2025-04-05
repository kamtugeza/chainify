import { describe, expect, it } from 'vitest'
import map from '../lib/map.js'

describe('map', () => {
  it('throws an exception when the `step` argument is not an array or an object', () => {
    expect(() => map()).not.toThrow()
    expect(() => map([])).not.toThrow()
    expect(() => map({})).not.toThrow()
    expect(() => map(null))
      .toThrowErrorMatchingInlineSnapshot(
        `[TypeError: \`steps\` argument should be either an array or an object]`
      )
    expect(() => map(5))
      .toThrowErrorMatchingInlineSnapshot(
        `[TypeError: \`steps\` argument should be either an array or an object]`
      )
    expect(() => map('steps'))
      .toThrowErrorMatchingInlineSnapshot(
        `[TypeError: \`steps\` argument should be either an array or an object]`
      )
  })

  it('returns a handler that does nothing to input if there are no step functions', () => {
    const chain = map([])
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
  
  it('applies plain decorators to the input', () => {
    const addOne = (input) => ++input
    const double = (input) => input * 2
    const chain = map({ addOne, double }) 
    expect(chain.addOne(5)).toBe(6)
    expect(chain.addOne.double(5)).toBe(12)
    expect(chain.double.addOne(5)).toBe(11)
  })

  it('clears the sequence after the input decoration', () => {
    const addOne = (input) => ++input
    const double = (input) => input * 2
    const chain = map({ addOne, double }) 
    chain.addOne.double
    expect(chain.__SEQUENCE__).toEqual([addOne, double])

    chain(35)
    expect(chain.__SEQUENCE__).toEqual([])
  })

  it('applies factory decorators to the input', () => {
    const decorator = map({
      add: (val) => (input) => input + val,
      multiply: (val) => (input) => input * val,
    }) 
    expect(decorator.add(2, 8)).toBe(10)
    expect(decorator.add(2).multiply(3, 4)).toBe(18)
  })

  it('applies a mixed set of decorators to the input', () => {
    const decorator = map({
      add: (val) => (input) => input + val,
      addOne: (input) => ++input,
      double: (input) => input * 2,
      multiply: (val) => (input) => input * val
    })
    expect(decorator.addOne(5)).toBe(6)
    expect(decorator.add(2, 8)).toBe(10)
    expect(decorator.addOne.multiply(3).double.add(10, 8)).toBe(64)
  })
})

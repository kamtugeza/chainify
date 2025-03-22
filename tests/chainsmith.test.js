import { describe, expect, it } from 'vitest'
import { Chainsmith } from './chainsmith.js'
import { Decorator, DecoratorType } from '../utils/decorator.js'

describe('from', () => {
  it('returns a handler that do nothing with the input', () => {
    const decorate = Chainsmith.from()
    expect(decorate()).toBe(undefined)
    expect(decorate(null)).toBe(null)
    expect(decorate(5)).toBe(5) 
    expect(decorate(7n)).toBe(7n)
    expect(decorate('abc')).toBe('abc')

    const targetObject = {}
    expect(decorate(targetObject)).toBe(targetObject)

    const targetArray = []
    expect(decorate(targetArray)).toBe(targetArray)
  })

  it('clears the sequence after the input decoration', () => {
    const addOne = (input) => ++input
    const double = (input) => input * 2
    const decorator = Chainsmith.from([
      Decorator.of('addOne', addOne),
      Decorator.of('double', double),
    ]) 
    decorator.addOne.double
    expect(decorator.__SEQUENCE__).toEqual([addOne, double])

    decorator(35)
    expect(decorator.__SEQUENCE__).toEqual([])
  })

  it('applies plain decorators to the input', () => {
    const decorator = Chainsmith.from([
      Decorator.of('addOne', (input) => ++input),
      Decorator.of('double', (input) => input * 2),
    ]) 
    expect(decorator.addOne(5)).toBe(6)
    expect(decorator.addOne.double(5)).toBe(12)
    expect(decorator.double.addOne(5)).toBe(11)
  })

  it('applies factory decorators to the input', () => {
    const decorator = Chainsmith.from([
      Decorator.of('add', (val) => (input) => input + val, DecoratorType.factory),
      Decorator.of('multiply', (val) => (input) => input * val, DecoratorType.factory),
    ]) 
    expect(decorator.add(2, 8)).toBe(10)
    expect(decorator.add(2).multiply(3, 4)).toBe(18)
  })

  it('applies a mixed set of decorators to the input', () => {
    const decorator = Chainsmith.from([
      Decorator.of('add', (val) => (input) => input + val, DecoratorType.factory),
      Decorator.of('addOne', (input) => ++input),
      Decorator.of('double', (input) => input * 2),
      Decorator.of('multiply', (val) => (input) => input * val, DecoratorType.factory)
    ])
    expect(decorator.addOne(5)).toBe(6)
    expect(decorator.add(2, 8)).toBe(10)
    expect(decorator.addOne.multiply(3).double.add(10, 8)).toBe(64)
  })
})


import { describe, expect, it, vitest as vi } from 'vitest'
import { defineGetters } from '../../lib/utils/getter.js'

describe('defineGetters', () => {
  function buildTest () {
    const handler = vi.fn() 
    handler.__SEQUENCE__ = []

    const factory = vi.fn(() => plain)
    const plain = vi.fn()

    defineGetters(handler, { factory, plain })

    factory.mockReset()
    plain.mockReset()

    function resetTest () {
      handler.__SEQUENCE__ = []
      vi.resetAllMocks()
    }

    return { factory, handler, plain, resetTest }
  }

  it('throws an exception when the `handler` argument is not a function', () => {
    expect(() => defineGetters(() => {})).not.toThrow()
    expect(() => defineGetters(null))
      .toThrowErrorMatchingInlineSnapshot(
        `[TypeError: \`handler\` argument should be an function]`
      )
    expect(() => defineGetters('handler'))
      .toThrowErrorMatchingInlineSnapshot(
        `[TypeError: \`handler\` argument should be an function]`
      )
    expect(() => defineGetters({}))
      .toThrowErrorMatchingInlineSnapshot(
        `[TypeError: \`handler\` argument should be an function]`
      )
  })

  it('throws an exception when the `step` argument is not an array or an object', () => {
    expect(() => defineGetters(() => {})).not.toThrow()
    expect(() => defineGetters(() => {}, [])).not.toThrow()
    expect(() => defineGetters(() => {}, {})).not.toThrow()
    expect(() => defineGetters(() => {}, null))
      .toThrowErrorMatchingInlineSnapshot(
        `[TypeError: \`steps\` argument should be either an array or an object]`
      )
    expect(() => defineGetters(() => {}, 5))
      .toThrowErrorMatchingInlineSnapshot(
        `[TypeError: \`steps\` argument should be either an array or an object]`
      )
    expect(() => defineGetters(() => {}, 'steps'))
      .toThrowErrorMatchingInlineSnapshot(
        `[TypeError: \`steps\` argument should be either an array or an object]`
      )
  })

  it('throws an exception when the step is an invalid record in an array or an object', () => {
    expect(() => defineGetters(() => {}, [5]))
      .toThrowErrorMatchingInlineSnapshot(`[TypeError: \`step\` should be an array.]`)
    expect(() => defineGetters(() => {}, [{}]))
      .toThrowErrorMatchingInlineSnapshot(`[TypeError: \`step\` should be an array.]`)
    expect(() => defineGetters(() => {}, ['step']))
      .toThrowErrorMatchingInlineSnapshot(`[TypeError: \`step\` should be an array.]`)
    expect(() => defineGetters(() => {}, [[]]))
      .toThrowErrorMatchingInlineSnapshot(`[TypeError: \`name\` should be a string.]`)
    expect(() => defineGetters(() => {}, [[5]]))
      .toThrowErrorMatchingInlineSnapshot(`[TypeError: \`name\` should be a string.]`)
    expect(() => defineGetters(() => {}, [['required']]))
      .toThrowErrorMatchingInlineSnapshot(`[TypeError: \`fn\` should be a function.]`)
    expect(() => defineGetters(() => {}, [['required', 5]]))
      .toThrowErrorMatchingInlineSnapshot(`[TypeError: \`fn\` should be a function.]`)
    expect(() => defineGetters(() => {}, [['required', {} ]]))
      .toThrowErrorMatchingInlineSnapshot(`[TypeError: \`fn\` should be a function.]`)
  })

  it('does nothing when there is no steps', () => {
    const handler = vi.fn()
    const expected = Object.keys(handler).length
  
    defineGetters(handler)
    expect(Object.keys(handler).length).toBe(expected)

    handler.mockReset()
    defineGetters(handler, [])
    expect(Object.keys(handler).length).toBe(expected)

    handler.mockReset()
    defineGetters(handler, {})
    expect(Object.keys(handler).length).toBe(expected)
  })

  it('attaches a step to the handler as a static method', () => {
    const handler = vi.fn() 
    handler.__SEQUENCE__ = []

    const factory = vi.fn(() => plain)
    const plain = vi.fn()

    defineGetters(handler, { factory, plain })

    expect(handler.factory).toBeInstanceOf(Function)
    expect(factory).toBeCalledTimes(1)

    expect(handler.plain).toBeInstanceOf(Function)
    expect(plain).toBeCalledTimes(1)
  })

  it('adds a plain step to the sequence', () => {
    const { handler, plain, resetTest } = buildTest()

    expect(handler.plain).toBe(handler)
    expect(plain).toBeCalledTimes(0)
    expect(handler).toBeCalledTimes(0)
    expect(handler.__SEQUENCE__).toHaveLength(1)
    expect(handler.__SEQUENCE__).toHaveProperty(0, plain)

    resetTest()
    handler.plain()
    expect(plain).toBeCalledTimes(0)
    expect(handler.__SEQUENCE__).toHaveLength(1)
    expect(handler.__SEQUENCE__).toHaveProperty(0, plain)
  })

  it('adds a factory step to the sequence', () => {
    const { factory, handler, plain, resetTest } = buildTest()

    expect(handler.factory).not.toBe(handler)

    expect(handler.factory(10)).toBe(handler)
    expect(factory).toBeCalledTimes(1)
    expect(factory).toBeCalledWith(10)
    expect(handler.__SEQUENCE__).toHaveLength(1)
    expect(handler.__SEQUENCE__).toHaveProperty(0, plain)

    resetTest()
    handler.factory('abc', 100)
    expect(handler).toBeCalledTimes(1)
    expect(handler).toBeCalledWith(100)
    expect(factory).toBeCalledTimes(1)
    expect(factory).toBeCalledWith('abc')
    expect(plain).toBeCalledTimes(0)
    expect(handler.__SEQUENCE__).toHaveLength(1)
    expect(handler.__SEQUENCE__).toHaveProperty(0, plain)
  })
})

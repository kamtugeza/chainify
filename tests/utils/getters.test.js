import { describe, expect, it, vitest as vi } from 'vitest'
import { RechainifyStep, RechainifyStepType } from '../../lib/utils/step.js'
import { defineGetters } from '../../lib/utils/getter.js'

describe('defineGetters', () => {
  function buildTest () {
    const handler = vi.fn() 
    handler.__SEQUENCE__ = []

    const plain = vi.fn()
    const factory = vi.fn(() => plain)

    defineGetters(handler, [
      RechainifyStep.of('plain', plain),
      RechainifyStep.of('factory', factory, RechainifyStepType.factory),
    ])

    function resetTest () {
      handler.__SEQUENCE__ = []
      vi.resetAllMocks()
    }

    return { factory, handler, plain, resetTest }
  }

  it('throws an exception when `steps` contains a non-step configuration', () => {
    expect(() => defineGetters(() => 5, [{ }]))
      .toThrowErrorMatchingInlineSnapshot(`[Error: \`name\` should be a string.]`)
    expect(() => defineGetters(() => 5, [{ name: 'name' }]))
      .toThrowErrorMatchingInlineSnapshot(`[Error: \`fn\` should be a function.]`)
    expect(() => defineGetters(() => 5, [{ name: 'name', fn: () => null }]))
      .toThrowErrorMatchingInlineSnapshot(`[Error: \`type\` should be one of: factory, plain.]`)
  })

  it('defines steps as handler static methods', () => {
    const { handler } = buildTest()

    expect(handler.plain).toBeInstanceOf(Function)
    expect(handler.factory).toBeInstanceOf(Function)
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

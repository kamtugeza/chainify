import { expect, it, vi } from 'vitest'
import createHandler from '../src/handler'

it('does nothing when there is no steps', () => {
  const behavior = vi.fn()
  const expected = Object.keys(behavior).length

  createHandler(behavior, [] as const)
  expect(Object.keys(behavior).length).toBe(expected)

  behavior.mockReset()
  createHandler(behavior, {})
  expect(Object.keys(behavior).length).toBe(expected)
})

it('attaches a step to the handler as a static method', () => {
  const behavior = vi.fn() 
  const plain = vi.fn()
  const factory = vi.fn(() => plain)
  const handler = createHandler(behavior, { factory, plain })

  expect(factory).toBeCalledTimes(1)
  expect(plain).toBeCalledTimes(1)

  factory.mockReset()
  expect(handler.factory).toBeInstanceOf(Function)
  expect(factory).toBeCalledTimes(0)

  plain.mockReset()
  expect(handler.plain).toBeInstanceOf(Function)
  expect(plain).toBeCalledTimes(0)
})

it('attaches a tuple step to handler as a static method', () => {
  const behavior = vi.fn() 
  const plain = vi.fn()
  const factory = vi.fn(() => plain)
  const handler = createHandler(behavior, [['factory', factory], ['plain', plain]] as const)

  expect(factory).toBeCalledTimes(1)
  expect(plain).toBeCalledTimes(1)

  factory.mockReset()
  expect(handler.factory).toBeInstanceOf(Function)
  expect(factory).toBeCalledTimes(0)

  plain.mockReset()
  expect(handler.plain).toBeInstanceOf(Function)
  expect(plain).toBeCalledTimes(0)
})

it('passes the plain steps and the input value to the behavior function', () => {
  const behavior = vi.fn()
  const plainA = vi.fn()
  const plainB = vi.fn()
  const handler = createHandler(behavior, { plainA, plainB })

  handler.plainA(5)
  expect(behavior).toBeCalledTimes(1)
  expect(behavior).toBeCalledWith([plainA], 5)

  behavior.mockReset()
  handler.plainB.plainA('abc')
  expect(behavior).toBeCalledTimes(1)
  expect(behavior).toBeCalledWith([plainB, plainA], 'abc')
})

it('passes the factory steps and the input value to the behavior function', () => {
  const behavior = vi.fn()
  const plainA = vi.fn()
  const factoryA = vi.fn(() => plainA)
  const plainB = vi.fn()
  const factoryB = vi.fn(() => plainB)
  const handler = createHandler(behavior, { factoryA, factoryB })

  factoryA.mockReset()
  handler.factoryA(10, 5)
  expect(factoryA).toBeCalledTimes(1)
  expect(factoryA).toBeCalledWith(10)
  expect(behavior).toBeCalledTimes(1)
  expect(behavior).toBeCalledWith([plainA], 5)

  factoryA.mockReset()
  factoryB.mockReset()
  behavior.mockReset()
  handler.factoryB('world').factoryA('!', 'ahoy')
  expect(factoryA).toBeCalledTimes(1)
  expect(factoryA).toBeCalledWith('!')
  expect(factoryB).toBeCalledTimes(1)
  expect(factoryB).toBeCalledWith('world')
  expect(behavior).toBeCalledTimes(1)
  expect(behavior).toBeCalledWith([plainB, plainA], 'ahoy')
})

it('adds a plain step if the function throws an exception', () => {
  const plain = vi.fn((input) => input.length)
  const behavior = vi.fn()
  const handler = createHandler(behavior, { plain })
  
  expect(plain).toBeCalledTimes(1)
 
  plain.mockReset()
  handler.plain('help')
  expect(behavior).toBeCalledTimes(1)
  expect(behavior).toBeCalledWith([plain], 'help')
})

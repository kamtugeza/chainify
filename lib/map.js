import { assert } from './utils/misc'
import { ChainifyStep, ChainifyStepType } from './utils/step'

const getters = {
  [ChainifyStepType.factory]: (handler, fn) => () => (...args) => {
    handler.__SEQUENCE__.push(fn(args[0]))
    const isTail = args.length === 2
    return isTail ? handler(args[1]) : handler
  },
  [ChainifyStepType.plain]: (handler, fn) => () => {
    handler.__SEQUENCE__.push(fn)
    return handler
  }
}

export default function map (steps) {
  assert(Array.isArray(steps), '`steps` should be an array.')

  function handler (input) {
    if (handler.__SEQUENCE__.length === 0) return input
    const sequence = handler.__SEQUENCE__
    handler.__SEQUENCE__ = []
    return sequence.reduce((value, fn) => fn(value), input)
  }

  handler.__SEQUENCE__ = []

  steps.forEach(({ fn, name, type }) => {
    ChainifyStep.validate(name, fn, type)
    const get = getters[type](handler, fn)
    Object.defineProperty(handler, name, {
      configurable: true,
      enumerable: true,
      get
    })
  })

  return handler
}

import { Decorator, DecoratorType } from './utils/decorator'

const getters = {
  [DecoratorType.factory]: (handler, fn) => () => (...args) => {
    handler.__SEQUENCE__.push(fn(args[0]))
    const isTail = args.length === 2
    return isTail ? handler(args[1]) : handler
  },
  [DecoratorType.plain]: (handler, fn) => () => {
    handler.__SEQUENCE__.push(fn)
    return handler
  }
}

function from(decorators = []) {
  function handler(input) {
    if (handler.__SEQUENCE__.length === 0) return input
    const sequence = handler.__SEQUENCE__
    handler.__SEQUENCE__ = []
    return sequence.reduce((value, decorator) => decorator(value), input)
  }

  handler.__SEQUENCE__ = []

  decorators.forEach(({ fn, name, type }) => {
    Decorator.validate(name, fn, type)
    const get = getters[type](handler, fn)
    Object.defineProperty(handler, name, {
      configurable: true,
      enumerable: true,
      get
    })
  })

  return handler
}

export const Chainsmith = { from }

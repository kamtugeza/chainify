import { ChainifyStep, ChainifyStepType} from './step.js'

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

export function registerSteps (handler, steps) {
  steps.forEach(({ fn, name, type }) => {
    ChainifyStep.validate(name, fn, type)
    const get = getters[type](handler, fn)
    Object.defineProperty(handler, name, {
      configurable: true,
      enumerable: true,
      get
    })
  })
}
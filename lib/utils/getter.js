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

/**
 * Defines property getters on the Chainify handler for each step.
 * 
 * When the property is accessed (for plain steps) or invoked (for factory steps), it adds the step
 * function to the handler's internal sequence (i.e., `__SEQUENCE__`).
 *  
 * @param {*} handler - The Chainify handler.
 * @param {*} steps - An array of step definitions with method name, function, and type.
 * @return {void}
 */
export function defineGetters (handler, steps) {
  steps.forEach(({ fn, name, type }) => {
    ChainifyStep.assert(name, fn, type)
    const get = getters[type](handler, fn)
    Object.defineProperty(handler, name, {
      configurable: true,
      enumerable: true,
      get
    })
  })
}
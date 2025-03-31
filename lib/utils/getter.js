import { RechainifyStep, RechainifyStepType} from './step.js'

const getters = {
  [RechainifyStepType.factory]: (handler, fn) => () => (...args) => {
    handler.__SEQUENCE__.push(fn(args[0]))
    const isTail = args.length === 2
    return isTail ? handler(args[1]) : handler
  },
  [RechainifyStepType.plain]: (handler, fn) => () => {
    handler.__SEQUENCE__.push(fn)
    return handler
  }
}

/**
 * Defines property getters on the Rechainify handler for each step.
 * 
 * When the property is accessed (for plain steps) or invoked (for factory steps), it adds the step
 * function to the handler's internal sequence (i.e., `__SEQUENCE__`).
 *  
 * @param {*} handler - The Rechainify handler.
 * @param {*} steps - An array of step definitions with method name, function, and type.
 * @return {void}
 */
export function defineGetters (handler, steps) {
  steps.forEach(({ fn, name, type }) => {
    RechainifyStep.assert(name, fn, type)
    const get = getters[type](handler, fn)
    Object.defineProperty(handler, name, {
      configurable: true,
      enumerable: true,
      get
    })
  })
}
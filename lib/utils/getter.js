/**
 * @typedef {(input: any) => any} RechainifyStepFn
 * A plain method for processing an input value.
 * 
 * @typedef {(options: any) => RechainifyStepFn} RechainifyStepFactory
 * Returns a configured `RechainifyStepFn` function tailored for a specific execution.
 * 
 * @typedef {Array<[string, RechainifyStepFn | RechainifyStepFactory]> | Record<string, RechainifyStepFn | RechainifyStepFactory>} RechainifySteps
 * A collection of steps
 */

function toArray (steps) {
  if (Array.isArray(steps)) return steps
  if (typeof steps === 'object' && steps !== null) return Object.entries(steps)
  throw new TypeError('`steps` argument should be either an array or an object')
}

function parse (step) {
  if (!Array.isArray(step)) throw new TypeError('`step` should be an array.')
  if (typeof step[0] !== 'string') throw new TypeError('`name` should be a string.')
  if (typeof step[1] !== 'function') throw new TypeError('`fn` should be a function.')
  return step
}

function defineFactoryGetter (handler, fn) {
  return () => (...args) => {
    handler.__SEQUENCE__.push(fn(args[0]))
    const isTail = args.length === 2
    return isTail ? handler(args[1]) : handler
  }
}

function definePlainGetter (handler, fn) {
  return () => {
    handler.__SEQUENCE__.push(fn)
    return handler
  }
}

const define = [definePlainGetter, defineFactoryGetter]

function getType (fn) {
  try {
    return Number(typeof fn() === 'function') 
  } catch {
    return 0
  }
}

function defineGetter (handler, step) {
  const [name, fn] = parse(step)
  const type = getType(fn) 
  Object.defineProperty(handler, name, {
    configurable: true,
    enumerable: true,
    get: define[type](handler, fn)
  })
}

/**
 * Defines property getters on the Rechainify handler for each step.
 * 
 * When the property is accessed (for plain steps) or invoked (for factory steps), it adds the step
 * function to the handler's internal sequence (i.e., `__SEQUENCE__`).
 * 
 * Note: each step is executed with not arguments during attachment to the `handler` to determine
 * whether it is a plain or factory step.
 *  
 * @param {Function} handler - The Rechainify handler.
 * @param {RechainifySteps} steps - An array of step definitions with method name, function, and type.
 * @return {void}
 */
export function defineGetters (handler, steps = []) {
  if (typeof handler !== 'function') throw new TypeError('`handler` argument should be an function')
  for (const step of toArray(steps)) defineGetter(handler, step)
}

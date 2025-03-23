import { registerSteps } from './utils/getters.js'
import { assert } from './utils/misc.js'
import { ChainifyPredicate } from './utils/predicate.js'

export default function some (steps, predicate = ChainifyPredicate.isNonNull) {
  assert(Array.isArray(steps), '`steps` should be an array.')
  assert(typeof predicate === 'function', '`predicate` should be a function.')

  function handler (input) {
    const sequence = handler.__SEQUENCE__
    handler.__SEQUENCE__ = []
    for (const fn of sequence) {
      const value = fn(input)
      if (predicate(value)) return value
    }
    return null
  }

  handler.__SEQUENCE__ = []

  registerSteps(handler, steps)

  return handler
}

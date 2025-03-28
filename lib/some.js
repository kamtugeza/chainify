/**
 * A handler function that executes a sequence of steps on the given input.
 * Returns the first result that satisfies the predicate; otherwise, returns `null`.
 *
 * @callback ChainifySomeHandler
 * @param {any} input - The value to be passed through the sequence of steps.
 * @returns {any} The first result that satisfies the predicate; otherwise, `null`.
 */

import { defineGetters } from './utils/getter.js'
import { assert } from './utils/misc.js'
import { ChainifyPredicate } from './utils/predicate.js'

/**
 * Creates a handler function that processes a sequence of steps, returning the first result that
 * satisfies the predicate. If no step satisfies the predicate, it returns `null`.
 *
 * @param {Array<import('./utils/step.js').ChainifyStepConfig>} steps - The sequence of step configurations.
 * @param {(input: any) => boolean} [predicate=ChainifyPredicate.isNonNull] - Function applied to
 *   each step result. Returns `true` to return the value; `false` to continue.
 * @returns {ChainifySomeHandler} A chainable handler function that processes input and returns
 *   the first satisfying result, or `null`.
 */
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

  defineGetters(handler, steps)

  return handler
}

/**
 * A handler function that executes a sequence of steps on the given input.
 * Returns the first result that satisfies the predicate; otherwise, returns `null`.
 *
 * @callback RechainifySomeHandler
 * @param {any} input - The value to be passed through the sequence of steps.
 * @returns {any} The first result that satisfies the predicate; otherwise, `null`.
 */

import { defineGetters } from './utils/getter.js'
import { RechainifyPredicate } from './utils/predicate.js'

/**
 * Creates a handler function that processes a sequence of steps, returning the first result that
 * satisfies the predicate. If no step satisfies the predicate, it returns `null`.
 *
 * @param {Array<import('./utils/getter.js').RechainifySteps>} steps - The sequence of step
 *   configurations.
 * @param {(input: any) => boolean} [predicate=RechainifyPredicate.isNonNull] - Function applied to
 *   each step result. Returns `true` to return the value; `false` to continue.
 * @returns {RechainifySomeHandler} A chainable handler function that processes input and returns
 *   the first satisfying result, or `null`.
 */
export default function some (steps, predicate = RechainifyPredicate.isNonNull) {
  if (typeof predicate !== 'function') throw new TypeError('`predicate` should be a function.')

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

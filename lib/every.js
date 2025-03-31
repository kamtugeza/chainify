/**
 * A handler function that executes a sequence of steps on the given input.
 * If all intermediate results satisfy the predicate, it returns the final result; otherwise,
 * returns `null`.
 *
 * @callback RechainifyEveryHandler
 * @param {any} input - The initial value to be passed through the sequence of steps.
 * @returns {any} The final result if all steps pass the predicate; otherwise, `null`.
 */

import { defineGetters } from './utils/getter.js'
import { assert } from './utils/misc.js'
import { RechainifyPredicate } from './utils/predicate.js'

/**
 * Creates a handler function that processes a sequence of steps, returning the final result only
 * if all intermediate results satisfy a predicate.
 *
 * @param {Array<import('./utils/step.js').RechainifyStepConfig>} steps - The sequence of step configurations.
 * @param {(input: any) => boolean} [predicate=RechainifyPredicate.isNonNull] - Function applied to each
 *   intermediate result. Returns true to continue; false to abort and return null.
 * @returns {RechainifyEveryHandler} A chainable handler function that accumulates steps and processes
 *   input when invoked.
 */
export default function every (steps, predicate = RechainifyPredicate.isNonNull) {
  assert(Array.isArray(steps), '`steps` should be an array.')
  assert(typeof predicate === 'function', '`predicate` should be a function.')

  function handler (input) {
    if (handler.__SEQUENCE__.length === 0) return input
    const sequence = handler.__SEQUENCE__
    handler.__SEQUENCE__ = []
    let value = input
    for (const fn of sequence) {
      value = fn(value)
      if (!predicate(value)) return null
    }
    return value
  }

  handler.__SEQUENCE__ = []

  defineGetters(handler, steps)

  return handler
}

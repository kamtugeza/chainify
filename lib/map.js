/**
 * A handler function that applies a sequence of transformation steps to the input.
 * Returns the transformed result after applying all steps in order.
 *
 * @callback RechainifyMapHandler
 * @param {any} input - The input value to transform.
 * @returns {any} The transformed result.
 */

import { defineGetters } from './utils/getter.js'

/**
 * Creates a handler function that applies a sequence of transformation steps to an input.
 * Each step acts like a decorator that transforms the input. The sequence is reset after each call.
 *
 * @param {Array<import('./utils/getter.js').RechainifySteps>} steps - The sequence of step
 *   configurations to apply.
 * @returns {RechainifyMapHandler} A chainable handler function that processes input and returns
 *   the transformed result.
 */

export default function map (steps) {

  function handler (input) {
    if (handler.__SEQUENCE__.length === 0) return input
    const sequence = handler.__SEQUENCE__
    handler.__SEQUENCE__ = []
    return sequence.reduce((value, fn) => fn(value), input)
  }

  handler.__SEQUENCE__ = []

  defineGetters(handler, steps)

  return handler
}

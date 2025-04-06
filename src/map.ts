import createHandler, { RechainifyHandler, RechainifySteps } from './handler.ts'

/**
 * Creates a handler function that applies a sequence of transformation steps to an input.
 * Each step acts like a decorator that transforms the input. The sequence is reset after each call.
 *
 * @param steps The sequence of step configurations to apply.
 * @returns A chainable handler function that processes input and returns the transformed result
 *   after applying all steps in order.
 */
export default function map <T extends RechainifySteps>(steps: T): RechainifyHandler<T> {
  return createHandler((sequence, input) => {
    let value = input
    for (const fn of sequence) value = fn(value)
    return value
  }, steps)
}

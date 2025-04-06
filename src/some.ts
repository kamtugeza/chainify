import createHandler, { RechainifyHandler, RechainifySteps } from './handler.ts'

/**
 * Creates a handler function that processes a sequence of steps, returning the first result that
 * satisfies the predicate. If no step satisfies the predicate, it returns `null`.
 *
 * @param steps The sequence of step configurations.
 * @param predicate Function applied to each step result. Returns `true` to return the value;
 *   `false` to continue.
 * @returns A chainable handler function that processes input and Returns the first result that
 *   satisfies the predicate; otherwise, returns `null`.
 */
export default function some <T extends RechainifySteps>(
  steps: T,
  predicate: (input: unknown) => boolean = (input) => input !== null
): RechainifyHandler<T> {
  return createHandler((sequence, input) => {
    for (const fn of sequence) {
      const value = fn(input)
      if (predicate(value)) return value
    }
    return null
  }, steps)
}
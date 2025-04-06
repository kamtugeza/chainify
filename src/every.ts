import createHandler, { RechainifyHandler, RechainifySteps } from './handler.ts'

/**
 * Creates a handler function that processes a sequence of steps, returning the final result only
 * if all intermediate results satisfy a predicate.
 *
 * @param steps - The sequence of step configurations.
 * @param predicate - Function applied to each intermediate result. Returns true to continue;
 *   `false` to abort and return `null`.
 * @returns A chainable handler function that accumulates steps and
 *   processes input when invoked. If all intermediate results satisfy the predicate, it returns
 *   the final result; otherwise, returns `null`.
 */
export default function every <T extends RechainifySteps>(
  steps: T,
  predicate: (input: unknown) => boolean = (input) => input !== null
): RechainifyHandler<T> {
  return createHandler((sequence, input: any) => {
    let value = input
    for (const fn of sequence) {
      value = fn(value)
      if (!predicate(value)) return null
    }
    return value
  }, steps)
}

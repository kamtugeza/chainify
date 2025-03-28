/**
 * Throws an error if the provided condition is `false`.
 *
 * @param {boolean} condition - The condition to assert. If `false`, an error is thrown.
 * @param {string} message - The error message to include if the assertion fails.
 * @throws {Error} Throws an error with the provided message if the condition is `false`.
 * @returns {void}
 */
export function assert (condition, message) {
  if (!condition) throw new Error(message)
}

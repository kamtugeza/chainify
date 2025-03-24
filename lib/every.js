import { defineGetters } from './utils/getters.js'
import { assert } from './utils/misc.js'
import { ChainifyPredicate } from './utils/predicate.js'

export default function every (steps, predicate = ChainifyPredicate.isNonNull) {
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

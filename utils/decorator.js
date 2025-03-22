import { assert } from './utils/assert'

export const DecoratorType = Object.freeze({
  factory: 'factory',
  plain: 'plain',
})

function of(name, fn, type = DecoratorType.plain) {
  validate(name, fn, type)
  return { fn, name, type }
}

function validate(name, fn, type) {
  assert(name, 'The `name` property is required.', ReferenceError)
  assert(typeof name === 'string', 'The `name` property should be a non-empty string.', TypeError)
  assert(fn, 'The `fn` property is required.', ReferenceError)
  assert(typeof fn === 'function', 'The `fn` property should be a function.', TypeError)
  const types = Object.values(DecoratorType)
  assert(types.includes(type), `The \`type\` must be one of: ${types.join(', ')}.`, TypeError)
}

export const Decorator = { of, validate }

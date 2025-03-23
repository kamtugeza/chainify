import { assert } from './misc.js'

export const ChainifyStepType = Object.freeze({
  factory: 'factory',
  plain: 'plain',
})

function createStep (name, fn, type = ChainifyStepType.plain) {
  validate(name, fn, type)
  return { name, fn, type }
}

function validate (name, fn, type) {
  assert(typeof name === 'string', '`name` should be a string.')
  assert(typeof fn === 'function', '`fn` should be a function.')
  const types = Object.values(ChainifyStepType) 
  assert(types.includes(type), `\`type\` should be one of: ${types.join(', ')}.`)
}

export const ChainifyStep = { of: createStep, validate }

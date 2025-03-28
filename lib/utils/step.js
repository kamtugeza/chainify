/** 
 * @typedef {(input: any) => any} ChainifyStepFn A plain method for processing an input value.
 *
 * @typedef {(options: any) => ChainifyStepFn} ChainifyStepFactory Returns a configured
 *   `ChainifyStepFn` function tailored for a specific execution.
 * 
 * @typedef {'factory' | 'plain'} ChainifyStepType
 * 
 * @typedef {Object} ChainifyStepConfig - A configuration of the Chainify step.
 * @property {string} name - The name of the static method in the Chainify instance.
 * @property {ChainifyStepFactory | ChainifyStepFn} fn - The function that defines the step behavior.
 * @property {ChainifyStepType} type - The type of the step (e.g., plain or factory).
 */

import { assert } from './misc.js'

export const ChainifyStepType = Object.freeze({
  factory: 'factory',
  plain: 'plain'
})

/**
 * A factory for creating a Chainify step configuration object.
 *  
 * @param {string} name - The name of the static method in the Chainify instance.
 * @param {ChainifyStepFactory | ChainifyStepFn} fn - The function that defines the step behavior.
 * @param {ChainifyStepType} type - The type of the step (e.g., plain or factory).
 * @returns {ChainifyStepConfig} The Chainify step configuration object.
 */
function createStep (name, fn, type = ChainifyStepType.plain) {
  assertProps(name, fn, type)
  return { name, fn, type }
}

/**
 * Validates the properties of a Chainify step.
 * 
 * @param {string} name  - The name of the static method in the Chainify instance. 
 * @param {ChainifyStepFactory | ChainifyStepFn} fn - The function that defines the step behavior. 
 * @param {ChainifyStepType} type - The type of the step (e.g., plain or factory).
 * @throws {Error} Throws if any of the properties are invalid.
 * @return {void}
 */
function assertProps (name, fn, type) {
  assert(typeof name === 'string', '`name` should be a string.')
  assert(typeof fn === 'function', '`fn` should be a function.')
  const types = Object.values(ChainifyStepType) 
  assert(types.includes(type), `\`type\` should be one of: ${types.join(', ')}.`)
}

export const ChainifyStep = { assert: assertProps, of: createStep }

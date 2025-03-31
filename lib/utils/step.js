/** 
 * @typedef {(input: any) => any} RechainifyStepFn A plain method for processing an input value.
 *
 * @typedef {(options: any) => RechainifyStepFn} RechainifyStepFactory Returns a configured
 *   `RechainifyStepFn` function tailored for a specific execution.
 * 
 * @typedef {'factory' | 'plain'} RechainifyStepType
 * 
 * @typedef {Object} RechainifyStepConfig - A configuration of the Rechainify step.
 * @property {string} name - The name of the static method in the Rechainify instance.
 * @property {RechainifyStepFactory | RechainifyStepFn} fn - The function that defines the step behavior.
 * @property {RechainifyStepType} type - The type of the step (e.g., plain or factory).
 */

import { assert } from './misc.js'

export const RechainifyStepType = Object.freeze({
  factory: 'factory',
  plain: 'plain'
})

/**
 * A factory for creating a Rechainify step configuration object.
 *  
 * @param {string} name - The name of the static method in the Rechainify instance.
 * @param {RechainifyStepFactory | RechainifyStepFn} fn - The function that defines the step behavior.
 * @param {RechainifyStepType} type - The type of the step (e.g., plain or factory).
 * @returns {RechainifyStepConfig} The Rechainify step configuration object.
 */
function createStep (name, fn, type = RechainifyStepType.plain) {
  assertProps(name, fn, type)
  return { name, fn, type }
}

/**
 * Validates the properties of a Rechainify step.
 * 
 * @param {string} name  - The name of the static method in the Rechainify instance. 
 * @param {RechainifyStepFactory | RechainifyStepFn} fn - The function that defines the step behavior. 
 * @param {RechainifyStepType} type - The type of the step (e.g., plain or factory).
 * @throws {Error} Throws if any of the properties are invalid.
 * @return {void}
 */
function assertProps (name, fn, type) {
  assert(typeof name === 'string', '`name` should be a string.')
  assert(typeof fn === 'function', '`fn` should be a function.')
  const types = Object.values(RechainifyStepType) 
  assert(types.includes(type), `\`type\` should be one of: ${types.join(', ')}.`)
}

export const RechainifyStep = { assert: assertProps, of: createStep }

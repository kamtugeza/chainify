import { describe, expect, it } from 'vitest'
import { ChainifyStep, ChainifyStepType } from '../../lib/utils/step'
import { vitest } from 'vitest'

describe('of', () => {
  it('throws an exception if `name` is not a string', () => {
    expect(() => ChainifyStep.of())
      .toThrowErrorMatchingInlineSnapshot(`[Error: \`name\` should be a string.]`)
    expect(() => ChainifyStep.of(null))
      .toThrowErrorMatchingInlineSnapshot(`[Error: \`name\` should be a string.]`)
    expect(() => ChainifyStep.of(5))
      .toThrowErrorMatchingInlineSnapshot(`[Error: \`name\` should be a string.]`)
  })

  it('throws an exception if `fn` is not a function', () => {
    expect(() => ChainifyStep.of('name'))
      .toThrowErrorMatchingInlineSnapshot(`[Error: \`fn\` should be a function.]`)
    expect(() => ChainifyStep.of('name', null))
      .toThrowErrorMatchingInlineSnapshot(`[Error: \`fn\` should be a function.]`)
    expect(() => ChainifyStep.of('name', {}))
      .toThrowErrorMatchingInlineSnapshot(`[Error: \`fn\` should be a function.]`)
  })

  it('throws an exception if `type` does not equal the step type', () => {
    expect(() => ChainifyStep.of('name', () => 5, 5))
      .toThrowErrorMatchingInlineSnapshot(`[Error: \`type\` should be one of: factory, plain.]`)
    expect(() => ChainifyStep.of('name', () => 5, 'abc'))
      .toThrowErrorMatchingInlineSnapshot(`[Error: \`type\` should be one of: factory, plain.]`)
  })

  it('returns a step configuration', () => {
    const fn = (input) => input
    expect(ChainifyStep.of('name', fn)).toMatchInlineSnapshot(`
      {
        "fn": [Function],
        "name": "name",
        "type": "plain",
      }
    `)
    expect(ChainifyStep.of('name', fn, ChainifyStepType.plain)).toMatchInlineSnapshot(`
      {
        "fn": [Function],
        "name": "name",
        "type": "plain",
      }
    `)
    expect(ChainifyStep.of('name', fn, ChainifyStepType.factory)).toMatchInlineSnapshot(`
      {
        "fn": [Function],
        "name": "name",
        "type": "factory",
      }
    `)
  })
})

describe('validate', () => {
  it('throws an exception if `name` is not a string', () => {
    expect(() => ChainifyStep.validate())
      .toThrowErrorMatchingInlineSnapshot(`[Error: \`name\` should be a string.]`)
    expect(() => ChainifyStep.validate(null))
      .toThrowErrorMatchingInlineSnapshot(`[Error: \`name\` should be a string.]`)
    expect(() => ChainifyStep.validate(5))
      .toThrowErrorMatchingInlineSnapshot(`[Error: \`name\` should be a string.]`)
  })

  it('throws an exception if `fn` is not a function', () => {
    expect(() => ChainifyStep.validate('name'))
      .toThrowErrorMatchingInlineSnapshot(`[Error: \`fn\` should be a function.]`)
    expect(() => ChainifyStep.validate('name', null))
      .toThrowErrorMatchingInlineSnapshot(`[Error: \`fn\` should be a function.]`)
    expect(() => ChainifyStep.validate('name', {}))
      .toThrowErrorMatchingInlineSnapshot(`[Error: \`fn\` should be a function.]`)
  })

  it('throws an exception if `type` does not equal the step type', () => {
    expect(() => ChainifyStep.validate('name', () => 5))
      .toThrowErrorMatchingInlineSnapshot(`[Error: \`type\` should be one of: factory, plain.]`)
    expect(() => ChainifyStep.validate('name', () => 5, 5))
      .toThrowErrorMatchingInlineSnapshot(`[Error: \`type\` should be one of: factory, plain.]`)
    expect(() => ChainifyStep.validate('name', () => 5, 'abc'))
      .toThrowErrorMatchingInlineSnapshot(`[Error: \`type\` should be one of: factory, plain.]`)
  })

  it('does nothing if arguments are valid step configuration properties', () => {
    expect(() => ChainifyStep.validate('name', () => 5, ChainifyStepType.plain)).not.toThrow()
    expect(() => ChainifyStep.validate('another', () => undefined, ChainifyStepType.factory)).not.toThrow()
  })
})

import { describe, expect, it } from 'vitest'
import { RechainifyStep, RechainifyStepType } from '../../lib/utils/step.js'

describe('of', () => {
  it('throws an exception if `name` is not a string', () => {
    expect(() => RechainifyStep.of())
      .toThrowErrorMatchingInlineSnapshot(`[Error: \`name\` should be a string.]`)
    expect(() => RechainifyStep.of(null))
      .toThrowErrorMatchingInlineSnapshot(`[Error: \`name\` should be a string.]`)
    expect(() => RechainifyStep.of(5))
      .toThrowErrorMatchingInlineSnapshot(`[Error: \`name\` should be a string.]`)
  })

  it('throws an exception if `fn` is not a function', () => {
    expect(() => RechainifyStep.of('name'))
      .toThrowErrorMatchingInlineSnapshot(`[Error: \`fn\` should be a function.]`)
    expect(() => RechainifyStep.of('name', null))
      .toThrowErrorMatchingInlineSnapshot(`[Error: \`fn\` should be a function.]`)
    expect(() => RechainifyStep.of('name', {}))
      .toThrowErrorMatchingInlineSnapshot(`[Error: \`fn\` should be a function.]`)
  })

  it('throws an exception if `type` does not equal the step type', () => {
    expect(() => RechainifyStep.of('name', () => 5, 5))
      .toThrowErrorMatchingInlineSnapshot(`[Error: \`type\` should be one of: factory, plain.]`)
    expect(() => RechainifyStep.of('name', () => 5, 'abc'))
      .toThrowErrorMatchingInlineSnapshot(`[Error: \`type\` should be one of: factory, plain.]`)
  })

  it('returns a step configuration', () => {
    const fn = (input) => input
    expect(RechainifyStep.of('name', fn)).toMatchInlineSnapshot(`
      {
        "fn": [Function],
        "name": "name",
        "type": "plain",
      }
    `)
    expect(RechainifyStep.of('name', fn, RechainifyStepType.plain)).toMatchInlineSnapshot(`
      {
        "fn": [Function],
        "name": "name",
        "type": "plain",
      }
    `)
    expect(RechainifyStep.of('name', fn, RechainifyStepType.factory)).toMatchInlineSnapshot(`
      {
        "fn": [Function],
        "name": "name",
        "type": "factory",
      }
    `)
  })
})

describe('assert', () => {
  it('throws an exception if `name` is not a string', () => {
    expect(() => RechainifyStep.assert())
      .toThrowErrorMatchingInlineSnapshot(`[Error: \`name\` should be a string.]`)
    expect(() => RechainifyStep.assert(null))
      .toThrowErrorMatchingInlineSnapshot(`[Error: \`name\` should be a string.]`)
    expect(() => RechainifyStep.assert(5))
      .toThrowErrorMatchingInlineSnapshot(`[Error: \`name\` should be a string.]`)
  })

  it('throws an exception if `fn` is not a function', () => {
    expect(() => RechainifyStep.assert('name'))
      .toThrowErrorMatchingInlineSnapshot(`[Error: \`fn\` should be a function.]`)
    expect(() => RechainifyStep.assert('name', null))
      .toThrowErrorMatchingInlineSnapshot(`[Error: \`fn\` should be a function.]`)
    expect(() => RechainifyStep.assert('name', {}))
      .toThrowErrorMatchingInlineSnapshot(`[Error: \`fn\` should be a function.]`)
  })

  it('throws an exception if `type` does not equal the step type', () => {
    expect(() => RechainifyStep.assert('name', () => 5))
      .toThrowErrorMatchingInlineSnapshot(`[Error: \`type\` should be one of: factory, plain.]`)
    expect(() => RechainifyStep.assert('name', () => 5, 5))
      .toThrowErrorMatchingInlineSnapshot(`[Error: \`type\` should be one of: factory, plain.]`)
    expect(() => RechainifyStep.assert('name', () => 5, 'abc'))
      .toThrowErrorMatchingInlineSnapshot(`[Error: \`type\` should be one of: factory, plain.]`)
  })

  it('does nothing if arguments are valid step configuration properties', () => {
    expect(() => RechainifyStep.assert('name', () => 5, RechainifyStepType.plain)).not.toThrow()
    expect(() => RechainifyStep.assert('another', () => undefined, RechainifyStepType.factory)).not.toThrow()
  })
})

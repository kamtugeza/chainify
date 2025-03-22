import { describe, expect, it, vitest } from 'vitest'
import { Decorator, DecoratorType } from '../../utils/decorator'

describe('of', () => {
  it('throws an exception when params are invalid', () => {
    expect(() => Decorator.of())
      .toThrowErrorMatchingInlineSnapshot(`[ReferenceError: The \`name\` property is required.]`)
    expect(() => Decorator.of(5))
      .toThrowErrorMatchingInlineSnapshot(`[TypeError: The \`name\` property should be a non-empty string.]`)
    expect(() => Decorator.of('name'))
      .toThrowErrorMatchingInlineSnapshot(`[ReferenceError: The \`fn\` property is required.]`)
    expect(() => Decorator.of('name', 5))
      .toThrowErrorMatchingInlineSnapshot(`[TypeError: The \`fn\` property should be a function.]`)
    expect(() => Decorator.of('name', () => 5, 'abc'))
      .toThrowErrorMatchingInlineSnapshot(`[TypeError: The \`type\` must be one of: factory, plain.]`)
  })

  it('returns a decorator configuration', () => {
    const fn = vitest.fn()
    expect(Decorator.of('required', fn)).toEqual({
      fn,
      name: 'required',
      type: 'plain'
    })
    expect(Decorator.of('category', fn, DecoratorType.factory)).toEqual({
      fn,
      name: 'category',
      type: 'factory'
    })
    expect(Decorator.of('visible', fn, DecoratorType.plain)).toEqual({
      fn,
      name: 'visible',
      type: 'plain'
    })
  })
})

describe('validate', () => {
  it('throws an exception when params are invalid', () => {
    expect(() => Decorator.validate())
      .toThrowErrorMatchingInlineSnapshot(`[ReferenceError: The \`name\` property is required.]`)
    expect(() => Decorator.validate(5))
      .toThrowErrorMatchingInlineSnapshot(`[TypeError: The \`name\` property should be a non-empty string.]`)
    expect(() => Decorator.validate('name'))
      .toThrowErrorMatchingInlineSnapshot(`[ReferenceError: The \`fn\` property is required.]`)
    expect(() => Decorator.validate('name', 5))
      .toThrowErrorMatchingInlineSnapshot(`[TypeError: The \`fn\` property should be a function.]`)
    expect(() => Decorator.validate('name', () => 5, 'abc'))
      .toThrowErrorMatchingInlineSnapshot(`[TypeError: The \`type\` must be one of: factory, plain.]`)
  })
})
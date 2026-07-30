import { describe, expect, it } from 'vitest'
import type { FilterSerializer } from '../../types/table'
import { commaSeparated, createDelimited, dotSeparated, multiKey, pipeSeparated } from './filter-serializers'

describe('createDelimited', () => {
  it('parses a delimited string into its parts', () => {
    const serializer = createDelimited(':')
    expect(serializer.parse('a:b:c', [])).toEqual(['a', 'b', 'c'])
  })

  it('returns an empty array for null or empty input', () => {
    const serializer = createDelimited(':')
    expect(serializer.parse(null, [])).toEqual([])
    expect(serializer.parse('', [])).toEqual([])
  })

  it('filters out empty segments produced by the split', () => {
    const serializer = createDelimited(':')
    expect(serializer.parse('a::b', [])).toEqual(['a', 'b'])
  })

  it('serializes values into a single delimited string', () => {
    const serializer = createDelimited(':')
    expect(serializer.serialize(['a', 'b', 'c'])).toEqual({ type: 'single', value: 'a:b:c' })
  })
})

describe.each<[string, string, FilterSerializer]>([
  ['dotSeparated', '.', dotSeparated],
  ['commaSeparated', ',', commaSeparated],
  ['pipeSeparated', '|', pipeSeparated]
])('%s', (_name, separator, serializer) => {
  it(`uses "${separator}" as the delimiter`, () => {
    expect(serializer.parse(['a', 'b', 'c'].join(separator), [])).toEqual(['a', 'b', 'c'])
    expect(serializer.serialize(['a', 'b'])).toEqual({ type: 'single', value: `a${separator}b` })
  })
})

describe('multiKey', () => {
  it('parses by ignoring the raw single value and using allValues instead', () => {
    expect(multiKey.parse('ignored', ['a', 'b'])).toEqual(['a', 'b'])
  })

  it('filters out falsy entries from allValues', () => {
    expect(multiKey.parse(null, ['a', '', 'b'])).toEqual(['a', 'b'])
  })

  it('serializes values as a multi-value result', () => {
    expect(multiKey.serialize(['a', 'b'])).toEqual({ type: 'multi', values: ['a', 'b'] })
  })
})

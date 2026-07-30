import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useTableTranslations } from './use-table-translations'
import { withTableProviderConfig } from '../config/test-helpers'

describe('useTableTranslations', () => {
  it('returns the built-in English strings for known keys outside any provider', () => {
    const { result } = renderHook(() => useTableTranslations())
    expect(result.current('search')).toBe('Search')
    expect(result.current('pagination')).toBe('Pagination')
  })

  it('falls back to the key itself for unknown keys', () => {
    const { result } = renderHook(() => useTableTranslations())
    expect(result.current('some-unregistered-key')).toBe('some-unregistered-key')
  })

  it('uses a custom translationFn from the provider config when supplied', () => {
    const wrapper = withTableProviderConfig({ i18n: { translationFn: (key: string) => `custom:${key}` } })

    const { result } = renderHook(() => useTableTranslations(), { wrapper })

    expect(result.current('search')).toBe('custom:search')
  })
})

import { renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useResolvedTableConfig } from './use-resolved-config'
import { withTableProviderConfig } from '../config/test-helpers'
import { DEFAULT_TABLE_CONFIG } from '../config/defaults'
import type { TablePlugin } from '../types/table-config'

describe('useResolvedTableConfig', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  it('returns the core defaults when there is no provider and no instance config', () => {
    const { result } = renderHook(() => useResolvedTableConfig())
    expect(result.current).toEqual(DEFAULT_TABLE_CONFIG)
  })

  it('merges instance config (layer 3) over the core defaults', () => {
    const { result } = renderHook(() => useResolvedTableConfig({ pagination: { defaultPageSize: 25 } }))

    expect(result.current.pagination.defaultPageSize).toBe(25)
    expect(result.current.pagination.pageSizeOptions).toEqual(DEFAULT_TABLE_CONFIG.pagination.pageSizeOptions)
  })

  it('merges the provider config (layer 2) beneath instance config (layer 3), instance winning on conflicts', () => {
    const wrapper = withTableProviderConfig({ search: { debounceMs: 999 }, i18n: { locale: 'de' } })

    const { result } = renderHook(() => useResolvedTableConfig({ i18n: { locale: 'fr' } }), { wrapper })

    // i18n.locale is set by both layers — instance (layer 3) must win over provider (layer 2).
    expect(result.current.i18n.locale).toBe('fr')
    // search.debounceMs is only set by the provider — it must still come through.
    expect(result.current.search.debounceMs).toBe(999)
  })

  it('applies plugins (layer 4) in priority order, a later (higher-priority-number) plugin winning on conflicts', () => {
    const calls: string[] = []
    const plugins: TablePlugin[] = [
      {
        name: 'second-plugin',
        priority: 2,
        config: { features: { sorting: false } },
        onResolve: () => calls.push('second')
      },
      {
        name: 'first-plugin',
        priority: 1,
        config: { features: { sorting: true } },
        onResolve: () => calls.push('first')
      }
    ]

    const { result } = renderHook(() => useResolvedTableConfig({ plugins }))

    // Both plugins set features.sorting — the higher-priority-number one is applied last and wins.
    expect(result.current.features.sorting).toBe(false)
    expect(calls).toEqual(['first', 'second'])
  })

  it('is referentially stable across re-renders when neither the global nor instance config changed', () => {
    const instanceConfig = { pagination: { defaultPageSize: 25 } }
    const { result, rerender } = renderHook(() => useResolvedTableConfig(instanceConfig))

    const first = result.current
    rerender()

    expect(result.current).toBe(first)
  })

  it('logs a dev warning through the shared logger when a sanity check fails in development', () => {
    vi.stubEnv('NODE_ENV', 'development')
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    renderHook(() => useResolvedTableConfig({ search: { debounceMs: -1 } }))

    expect(warnSpy).toHaveBeenCalledWith(
      '[another-table-craft]',
      expect.stringContaining('search.debounceMs is negative')
    )
  })

  it('does not run dev validation outside development', () => {
    vi.stubEnv('NODE_ENV', 'test')
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    renderHook(() => useResolvedTableConfig({ search: { debounceMs: -1 } }))

    expect(warnSpy).not.toHaveBeenCalled()
  })
})

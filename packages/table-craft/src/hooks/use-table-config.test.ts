import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useTableConfig } from './use-table-config'
import { withProviderAndResolvedConfig, withTableProviderConfig } from '../config/test-helpers'
import { DEFAULT_TABLE_CONFIG } from '../config/defaults'

describe('useTableConfig', () => {
  it('falls back to the global default config outside any provider or resolved context', () => {
    const { result } = renderHook(() => useTableConfig())
    expect(result.current).toEqual(DEFAULT_TABLE_CONFIG)
  })

  it('returns the provider config (layer 1+2) when wrapped in TableProvider only', () => {
    const wrapper = withTableProviderConfig({ search: { debounceMs: 999 } })

    const { result } = renderHook(() => useTableConfig(), { wrapper })

    expect(result.current.search.debounceMs).toBe(999)
  })

  it('prefers the resolved-context config over the provider config when inside a useTableCraft tree', () => {
    // Both layers set search.debounceMs to different values — resolved-context must win.
    const resolvedConfig = { ...DEFAULT_TABLE_CONFIG, search: { ...DEFAULT_TABLE_CONFIG.search, debounceMs: 42 } }
    const wrapper = withProviderAndResolvedConfig({ search: { debounceMs: 999 } }, resolvedConfig)

    const { result } = renderHook(() => useTableConfig(), { wrapper })

    expect(result.current.search.debounceMs).toBe(42)
  })

  it('supports the selector overload, returning a derived slice', () => {
    const { result } = renderHook(() => useTableConfig((config) => config.pagination.defaultPageSize))
    expect(result.current).toBe(DEFAULT_TABLE_CONFIG.pagination.defaultPageSize)
  })

  it('memoizes the selected slice when neither config nor selector changed', () => {
    // The selector returns a fresh object each call, so this only passes if useMemo
    // actually skips re-invoking it — a selector that just returns an existing stable
    // reference (like `config.pagination`) would pass even without memoization.
    const selector = (config: typeof DEFAULT_TABLE_CONFIG) => ({ pageSize: config.pagination.defaultPageSize })
    const { result, rerender } = renderHook(() => useTableConfig(selector))

    const first = result.current
    rerender()

    expect(result.current).toBe(first)
  })
})

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import type { ColumnDef } from '@tanstack/react-table'
import { useTableCraft } from './use-table-craft'
import { createMemoryStateStore } from '../core/stores/memory-store'
import { commaSeparated } from '../core/serializers/filter-serializers'
import type { TableStateSnapshot } from '../types/table-state'

interface Row {
  id: string
  name: string
}

const data: Row[] = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' }
]

const columns: ColumnDef<Row>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Name' }
]

describe('useTableCraft (uncontrolled, memory store)', () => {
  it('reflects an external store change in table.getState()', () => {
    const store = createMemoryStateStore()
    const { result } = renderHook(() => useTableCraft({ data, columns, store }))

    act(() => {
      store.setState({ globalFilter: 'alice' })
    })

    expect(result.current.state.globalFilter).toBe('alice')
    expect(result.current.table.getState().globalFilter).toBe('alice')
  })

  it('setPage/setPageSize update pagination and resetPage on pageSize change', () => {
    const store = createMemoryStateStore()
    const { result } = renderHook(() => useTableCraft({ data, columns, store }))

    act(() => {
      result.current.setPage(3)
    })
    expect(result.current.state.pagination.pageIndex).toBe(3)

    act(() => {
      result.current.setPageSize(25)
    })
    expect(result.current.state.pagination).toEqual({ pageIndex: 0, pageSize: 25 })
  })

  it('setSorting/setGlobalFilter/setColumnFilter/clearFilters round-trip through the store', () => {
    const store = createMemoryStateStore()
    const { result } = renderHook(() => useTableCraft({ data, columns, store }))

    act(() => {
      result.current.setSorting([{ id: 'name', desc: true }])
    })
    expect(result.current.state.sorting).toEqual([{ id: 'name', desc: true }])

    act(() => {
      result.current.setColumnFilter('name', 'Alice')
    })
    expect(result.current.state.columnFilters).toEqual([{ id: 'name', value: 'Alice' }])

    act(() => {
      result.current.setGlobalFilter('hello')
    })
    expect(result.current.state.globalFilter).toBe('hello')

    act(() => {
      result.current.clearFilters()
    })
    expect(result.current.state.columnFilters).toEqual([])
    expect(result.current.state.globalFilter).toBe('')
  })

  it('removes a column filter when set to an empty value', () => {
    const store = createMemoryStateStore()
    const { result } = renderHook(() => useTableCraft({ data, columns, store }))

    act(() => {
      result.current.setColumnFilter('name', 'Alice')
    })
    expect(result.current.state.columnFilters).toHaveLength(1)

    act(() => {
      result.current.setColumnFilter('name', undefined)
    })
    expect(result.current.state.columnFilters).toHaveLength(0)
  })
})

describe('useTableCraft (default store, config wiring)', () => {
  // jsdom always defines `window`, so the default-store branch under test here is always
  // createUrlStateStore(...) -- this also gives the wiring's most realistic coverage,
  // since a real browser hits this exact branch too.
  function resetLocation() {
    window.history.replaceState({}, '', '/')
  }

  beforeEach(() => {
    resetLocation()
  })

  afterEach(() => {
    vi.useRealTimers()
    resetLocation()
  })

  it('seeds the default page size from config.pagination.defaultPageSize when no store is passed', () => {
    const { result } = renderHook(() =>
      useTableCraft({ data, columns, config: { pagination: { defaultPageSize: 25 } } })
    )

    expect(result.current.state.pagination.pageSize).toBe(25)
  })

  it('passes config.filter.defaultSerializer through to the default URL store', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() =>
      useTableCraft({ data, columns, config: { filter: { defaultSerializer: commaSeparated } } })
    )

    act(() => {
      result.current.setColumnFilter('name', ['alice', 'bob'])
    })
    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(window.location.search).toContain('name=alice%2Cbob')
  })
})

describe('useTableCraft (controlled)', () => {
  it('calls onStateChange with the next snapshot instead of touching a store', () => {
    const onStateChange = vi.fn()
    let state: Partial<TableStateSnapshot> = { globalFilter: '' }

    const { result, rerender } = renderHook(() => useTableCraft({ data, columns, state, onStateChange }))

    act(() => {
      result.current.setGlobalFilter('bob')
    })

    expect(onStateChange).toHaveBeenCalledTimes(1)
    const next = onStateChange.mock.calls[0][0] as TableStateSnapshot
    expect(next.globalFilter).toBe('bob')

    // Simulate the parent feeding the new state back in (controlled component idiom).
    state = next
    rerender()
    expect(result.current.state.globalFilter).toBe('bob')
  })
})

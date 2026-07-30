'use client'

import { useMemo, useSyncExternalStore } from 'react'
import {
  type ColumnFiltersState,
  type SortingState,
  type Updater,
  type VisibilityState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'

import { createMemoryStateStore } from '../core/stores/memory-store'
import { createUrlStateStore } from '../core/stores/url-store'
import type { TableStateStore } from '../types/table-state-store'
import type { TableStatePatch, TableStateSnapshot } from '../types/table-state'
import { DEFAULT_TABLE_STATE, mergeTableState } from '../types/table-state'
import { useResolvedTableConfig } from './use-resolved-config'
import type { UseTableCraftOptions, UseTableCraftResult } from '../types/use-table-craft'

function resolveUpdater<T>(updater: Updater<T>, current: T): T {
  return typeof updater === 'function' ? (updater as (old: T) => T)(current) : updater
}

/**
 * The headless core of another-table-craft: owns the single `useReactTable()` call and
 * exposes state + handlers, fully decoupled from any specific state-storage mechanism
 * (URL, memory, or a fully controlled parent) and from any presentation layer.
 *
 * This is the direct fix for the original library's biggest architectural flaw, where
 * `useReactTable()` and inline URL-sync `useEffect`s were fused into one 780-line
 * `DataTable` component.
 */
export function useTableCraft<TData, TValue = unknown>(
  options: UseTableCraftOptions<TData, TValue>
): UseTableCraftResult<TData> {
  const config = useResolvedTableConfig(options.config)
  const isControlled = options.state !== undefined || options.onStateChange !== undefined

  // Always constructed and always subscribed to (even in controlled mode) so hook call
  // order never depends on a prop that's expected to stay constant across a call site's
  // lifetime — see the Rules of Hooks note in the class doc above.
  const defaultStore = useMemo<TableStateStore>(() => {
    if (options.store) return options.store
    if (config.store) return config.store
    return typeof window !== 'undefined' ? createUrlStateStore() : createMemoryStateStore()
  }, [options.store, config.store])

  const storeSnapshot = useSyncExternalStore(
    defaultStore.subscribe,
    defaultStore.getSnapshot,
    defaultStore.getServerSnapshot ?? defaultStore.getSnapshot
  )

  const state: TableStateSnapshot = isControlled
    ? mergeTableState(DEFAULT_TABLE_STATE, options.state ?? {})
    : storeSnapshot

  function applyPatch(patch: TableStatePatch, patchOptions?: { resetPage?: boolean }): void {
    if (isControlled) {
      const next = mergeTableState(state, patch)
      options.onStateChange?.(
        patchOptions?.resetPage ? { ...next, pagination: { ...next.pagination, pageIndex: 0 } } : next
      )
    } else {
      defaultStore.setState(patch, patchOptions)
    }
  }

  const table = useReactTable({
    data: options.data,
    columns: options.columns,
    state: {
      pagination: state.pagination,
      sorting: state.sorting as SortingState,
      columnFilters: state.columnFilters as ColumnFiltersState,
      globalFilter: state.globalFilter,
      columnVisibility: state.columnVisibility as VisibilityState
    },
    manualPagination: options.manualPagination,
    manualSorting: options.manualSorting,
    manualFiltering: options.manualFiltering,
    pageCount:
      options.manualPagination && options.rowCount !== undefined
        ? Math.max(1, Math.ceil(options.rowCount / Math.max(1, state.pagination.pageSize)))
        : undefined,
    getRowId: options.getRowId,
    onPaginationChange: (updater) => {
      const next = resolveUpdater(updater, state.pagination)
      applyPatch({ pagination: next }, { resetPage: next.pageSize !== state.pagination.pageSize })
    },
    onSortingChange: (updater) => {
      const next = resolveUpdater(updater, state.sorting as SortingState)
      applyPatch({ sorting: next as TableStateSnapshot['sorting'] }, { resetPage: true })
    },
    onColumnFiltersChange: (updater) => {
      const next = resolveUpdater(updater, state.columnFilters as ColumnFiltersState)
      applyPatch({ columnFilters: next as TableStateSnapshot['columnFilters'] }, { resetPage: true })
    },
    onGlobalFilterChange: (updater) => {
      const next = resolveUpdater(updater as Updater<string>, state.globalFilter)
      applyPatch({ globalFilter: next }, { resetPage: true })
    },
    onColumnVisibilityChange: (updater) => {
      const next = resolveUpdater(updater, state.columnVisibility as VisibilityState)
      applyPatch({ columnVisibility: next })
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: options.manualPagination ? undefined : getPaginationRowModel(),
    getSortedRowModel: options.manualSorting ? undefined : getSortedRowModel(),
    getFilteredRowModel: options.manualFiltering ? undefined : getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues()
  })

  return {
    table,
    state,
    config,
    setPage(pageIndex) {
      applyPatch({ pagination: { ...state.pagination, pageIndex } })
    },
    setPageSize(size) {
      applyPatch({ pagination: { ...state.pagination, pageSize: size } }, { resetPage: true })
    },
    setSorting(updater) {
      const next = resolveUpdater(updater, state.sorting as SortingState)
      applyPatch({ sorting: next as TableStateSnapshot['sorting'] }, { resetPage: true })
    },
    setColumnFilter(id, value) {
      const others = state.columnFilters.filter((filter) => filter.id !== id)
      const isEmpty = value === undefined || value === '' || (Array.isArray(value) && value.length === 0)
      const next = isEmpty ? others : [...others, { id, value }]
      applyPatch({ columnFilters: next }, { resetPage: true })
    },
    setGlobalFilter(value) {
      applyPatch({ globalFilter: value }, { resetPage: true })
    },
    clearFilters() {
      applyPatch({ columnFilters: [], globalFilter: '' }, { resetPage: true })
    }
  }
}

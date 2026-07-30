/**
 * The full persistable state of a table instance. This is the shape every
 * `TableStateStore` (see `src/types/table-state-store.ts`) reads and writes.
 *
 * Row selection is deliberately excluded: it's ephemeral, session-only UI state,
 * not something that should round-trip through a URL or any other persisted store.
 */
export interface TableStateSnapshot {
  pagination: { pageIndex: number; pageSize: number }
  sorting: { id: string; desc: boolean }[]
  columnFilters: { id: string; value: unknown }[]
  globalFilter: string
  columnVisibility: Record<string, boolean>
  /** Generalizes the original's `view` query param — 'table' | 'cards' | any custom view key. */
  viewMode: string | null
}

/** The subset of `TableStateSnapshot` a caller may want to change at once. */
export type TableStatePatch = Partial<TableStateSnapshot>

const EMPTY_SORTING: TableStateSnapshot['sorting'] = []
const EMPTY_COLUMN_FILTERS: TableStateSnapshot['columnFilters'] = []
const EMPTY_COLUMN_VISIBILITY: TableStateSnapshot['columnVisibility'] = {}

export const DEFAULT_TABLE_STATE: TableStateSnapshot = Object.freeze({
  pagination: Object.freeze({ pageIndex: 0, pageSize: 10 }),
  sorting: EMPTY_SORTING,
  columnFilters: EMPTY_COLUMN_FILTERS,
  globalFilter: '',
  columnVisibility: EMPTY_COLUMN_VISIBILITY,
  viewMode: null
})

/** Shallow-merges a patch into a snapshot, one level deep for `pagination`/`columnVisibility`. */
export function mergeTableState(base: TableStateSnapshot, patch: TableStatePatch): TableStateSnapshot {
  return {
    pagination: patch.pagination ? { ...base.pagination, ...patch.pagination } : base.pagination,
    sorting: patch.sorting ?? base.sorting,
    columnFilters: patch.columnFilters ?? base.columnFilters,
    globalFilter: patch.globalFilter ?? base.globalFilter,
    columnVisibility: patch.columnVisibility
      ? { ...base.columnVisibility, ...patch.columnVisibility }
      : base.columnVisibility,
    viewMode: patch.viewMode !== undefined ? patch.viewMode : base.viewMode
  }
}

/** Forces `pagination.pageIndex` back to 0 — used whenever filters/sorting/search change. */
export function resetPageIndex(snapshot: TableStateSnapshot): TableStateSnapshot {
  return { ...snapshot, pagination: { ...snapshot.pagination, pageIndex: 0 } }
}

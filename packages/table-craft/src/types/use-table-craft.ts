import type { ColumnDef, SortingState, Table, Updater } from '@tanstack/react-table'
import type { TableStateStore } from './table-state-store'
import type { TableStateSnapshot } from './table-state'
import type { TableConfig, TableConfigInput } from './table-config'

export interface UseTableCraftOptions<TData, TValue = unknown> {
  data: TData[]
  columns: ColumnDef<TData, TValue>[]
  /** State-storage backend. Defaults to `config.store`, or a lazily-created URL/memory store. */
  store?: TableStateStore
  /** Fully controlled state, like TanStack's own `state` option. Mutually exclusive with `store`. */
  state?: Partial<TableStateSnapshot>
  /** Required alongside `state` for controlled mode — receives the next full snapshot. */
  onStateChange?: (next: TableStateSnapshot) => void
  /** Data-processing axis: is pagination computed server-side? Independent of where state lives. */
  manualPagination?: boolean
  manualSorting?: boolean
  manualFiltering?: boolean
  /** Total row count for manual pagination (used to compute `pageCount`). */
  rowCount?: number
  /** Instance layer of the 4-layer config cascade (defaults -> provider -> instance -> plugins). */
  config?: TableConfigInput
  getRowId?: (row: TData) => string
}

export interface UseTableCraftResult<TData> {
  table: Table<TData>
  state: TableStateSnapshot
  config: TableConfig
  setPage(pageIndex: number): void
  setPageSize(size: number): void
  setSorting(updater: Updater<SortingState>): void
  setColumnFilter(id: string, value: unknown): void
  setGlobalFilter(value: string): void
  clearFilters(): void
}

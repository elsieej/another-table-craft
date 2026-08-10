import type { Table } from '@tanstack/react-table'
import { DataTable, DataTablePagination } from 'another-table-craft'

interface SortableDataTableProps<TData> {
  table: Table<TData>
  /** false renders plain header text with no sort affordance -- e.g. when gating on
   * `config.features.sorting`, which the library itself doesn't enforce. */
  sortable?: boolean
  /** Native `dir` for the table's wrapper -- the RTL showcase sets this. Column headers use
   * the CSS logical `text-start` property, so alignment flips automatically with `dir`. */
  dir?: 'ltr' | 'rtl'
}

/** Shared table markup every showcase embeds, built on the library's own `DataTable`. */
export function SortableDataTable<TData>({ table, sortable = true, dir }: SortableDataTableProps<TData>) {
  return (
    <div dir={dir}>
      <DataTable table={table} sortable={sortable} />
    </div>
  )
}

/** Shared Previous/Next + page-size controls every showcase embeds, built on the library's own `DataTablePagination`. */
export function PaginationControls<TData>({ table }: { table: Table<TData> }) {
  return <DataTablePagination table={table} className='mt-4' />
}

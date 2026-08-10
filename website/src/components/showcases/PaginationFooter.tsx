import type { Table } from '@tanstack/react-table'
import { DataTablePagination } from 'another-table-craft'

/** `DataTablePagination`, pre-wired with `w-full` -- required once it's nested inside a `TableCard`
 * `footer` (a flex `CardFooter`), where a bare block-level child would otherwise stretch to fill
 * the footer automatically but a flex child won't unless told to. */
export function PaginationFooter<TData>({ table }: { table: Table<TData> }) {
  return <DataTablePagination table={table} className='w-full' />
}

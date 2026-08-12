import type { Table } from '@tanstack/react-table'
import { DataTablePagination } from 'another-table-craft'

interface PaginationFooterProps<TData> {
  table: Table<TData>
  /** Forwarded to `DataTablePagination` to show a "Columns per page" select -- e.g. for a Card view.
   * Omit all three to keep the footer showing only "Rows per page", same as Table view. */
  cardColumns?: number
  onCardColumnsChange?: (count: number) => void
  cardColumnOptions?: number[]
}

/** `DataTablePagination`, pre-wired with `w-full` -- required once it's nested inside a `TableCard`
 * `footer` (a flex `CardFooter`), where a bare block-level child would otherwise stretch to fill
 * the footer automatically but a flex child won't unless told to. */
export function PaginationFooter<TData>({
  table,
  cardColumns,
  onCardColumnsChange,
  cardColumnOptions
}: PaginationFooterProps<TData>) {
  return (
    <DataTablePagination
      table={table}
      className='w-full'
      cardColumns={cardColumns}
      onCardColumnsChange={onCardColumnsChange}
      cardColumnOptions={cardColumnOptions}
    />
  )
}

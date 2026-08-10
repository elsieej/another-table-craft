import type { ReactNode } from 'react'
import { flexRender, type Table as TanStackTable } from '@tanstack/react-table'
import { ChevronDown, ChevronsUpDown, ChevronUp } from 'lucide-react'
import { Button } from './ui/button'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'

export interface DataTableProps<TData> {
  table: TanStackTable<TData>
  /** Force-disables the sort-toggle affordance for every column, regardless of column-level `enableSorting`. */
  sortable?: boolean
  /** Rendered as a `<caption>` below the table. */
  caption?: ReactNode
  /** Shown in place of rows when `table.getRowModel().rows` is empty. */
  emptyMessage?: ReactNode
  className?: string
}

/** Renders a TanStack `Table` instance (e.g. from `useTableCraft`) as a styled table with sortable headers. */
export function DataTable<TData>({
  table,
  sortable = true,
  caption,
  emptyMessage = 'No results.',
  className
}: DataTableProps<TData>) {
  const rows = table.getRowModel().rows
  const columnCount = table.getAllLeafColumns().length

  return (
    <Table className={className}>
      {caption ? <TableCaption>{caption}</TableCaption> : null}
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              if (header.isPlaceholder) return <TableHead key={header.id} />

              const canSort = sortable && header.column.getCanSort()
              const sortDirection = header.column.getIsSorted()
              const headerContent = flexRender(header.column.columnDef.header, header.getContext())

              return (
                <TableHead key={header.id} aria-sort={ariaSort(sortDirection)}>
                  {canSort ? (
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      className='-ml-3 h-8 gap-1.5 px-2 font-medium'
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {headerContent}
                      <SortIcon direction={sortDirection} />
                    </Button>
                  ) : (
                    headerContent
                  )}
                </TableHead>
              )
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {rows.length ? (
          rows.map((row) => (
            <TableRow key={row.id} data-state={row.getIsSelected() ? 'selected' : undefined}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columnCount} className='h-24 text-center text-muted-foreground'>
              {emptyMessage}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

function ariaSort(direction: false | 'asc' | 'desc'): 'ascending' | 'descending' | 'none' {
  if (direction === 'asc') return 'ascending'
  if (direction === 'desc') return 'descending'
  return 'none'
}

function SortIcon({ direction }: { direction: false | 'asc' | 'desc' }) {
  if (direction === 'asc') return <ChevronUp className='size-4' />
  if (direction === 'desc') return <ChevronDown className='size-4' />
  return <ChevronsUpDown className='size-4 text-muted-foreground' />
}

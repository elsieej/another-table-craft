import type { Table as TanStackTable } from '@tanstack/react-table'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

export interface DataTablePaginationProps<TData> {
  table: TanStackTable<TData>
  pageSizeOptions?: number[]
  className?: string
}

/** Previous/Next + page-size controls for a TanStack `Table` instance (e.g. from `useTableCraft`). */
export function DataTablePagination<TData>({
  table,
  pageSizeOptions = [10, 20, 30, 40, 50],
  className
}: DataTablePaginationProps<TData>) {
  const { pageIndex, pageSize } = table.getState().pagination
  const pageCount = Math.max(table.getPageCount(), 1)

  return (
    <div className={cn('flex flex-wrap items-center justify-between gap-4', className)}>
      <div className='flex items-center gap-2 text-sm text-muted-foreground'>
        <span>Rows per page</span>
        <Select value={`${pageSize}`} onValueChange={(value) => table.setPageSize(Number(value))}>
          <SelectTrigger className='h-8 w-[70px]' aria-label='Rows per page'>
            <SelectValue placeholder={`${pageSize}`} />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={`${size}`}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className='flex items-center gap-4'>
        <span className='text-sm text-muted-foreground'>
          Page {pageIndex + 1} of {pageCount}
        </span>
        <div className='flex items-center gap-2'>
          <Button
            type='button'
            variant='outline'
            size='icon'
            className='size-8'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label='Previous page'
          >
            <ChevronLeft className='size-4' />
          </Button>
          <Button
            type='button'
            variant='outline'
            size='icon'
            className='size-8'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label='Next page'
          >
            <ChevronRight className='size-4' />
          </Button>
        </div>
      </div>
    </div>
  )
}

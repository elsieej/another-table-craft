import type { Table as TanStackTable } from '@tanstack/react-table'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

export interface DataTablePaginationProps<TData> {
  table: TanStackTable<TData>
  pageSizeOptions?: number[]
  /** How many numbered page buttons to show at once (a sliding window centered on the current page). */
  maxVisiblePages?: number
  className?: string
}

/** 0-based page indices for a sliding window of `maxVisible` pages, centered on `current`, clamped to
 * `[0, total)`. E.g. getPageWindow(0, 10, 5) -> [0,1,2,3,4]; getPageWindow(7, 10, 5) -> [5,6,7,8,9]. */
function getPageWindow(current: number, total: number, maxVisible: number): number[] {
  if (total <= maxVisible) return Array.from({ length: total }, (_, i) => i)
  const half = Math.floor(maxVisible / 2)
  const start = Math.min(Math.max(current - half, 0), total - maxVisible)
  return Array.from({ length: maxVisible }, (_, i) => start + i)
}

/** Page-size + numbered-pagination controls for a TanStack `Table` instance (e.g. from `useTableCraft`). */
export function DataTablePagination<TData>({
  table,
  pageSizeOptions = [10, 20, 30, 40, 50],
  maxVisiblePages = 5,
  className
}: DataTablePaginationProps<TData>) {
  const { pageIndex, pageSize } = table.getState().pagination
  const pageCount = Math.max(table.getPageCount(), 1)
  const pageWindow = getPageWindow(pageIndex, pageCount, maxVisiblePages)

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
      <div className='flex items-center gap-1'>
        <Button
          type='button'
          variant='outline'
          size='icon'
          className='size-8'
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          aria-label='First page'
        >
          <ChevronsLeft className='size-4' />
        </Button>
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
        {pageWindow.map((page) => (
          <Button
            key={page}
            type='button'
            variant={page === pageIndex ? 'default' : 'outline'}
            size='icon'
            className='size-8'
            onClick={() => table.setPageIndex(page)}
            aria-label={`Page ${page + 1}`}
            aria-current={page === pageIndex ? 'page' : undefined}
          >
            {page + 1}
          </Button>
        ))}
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
        <Button
          type='button'
          variant='outline'
          size='icon'
          className='size-8'
          onClick={() => table.setPageIndex(pageCount - 1)}
          disabled={!table.getCanNextPage()}
          aria-label='Last page'
        >
          <ChevronsRight className='size-4' />
        </Button>
      </div>
    </div>
  )
}

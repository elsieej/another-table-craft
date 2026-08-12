import type { Table as TanStackTable } from '@tanstack/react-table'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Separator } from './ui/separator'

const DEFAULT_CARD_COLUMN_OPTIONS = [1, 2, 3, 4]

export interface DataTablePaginationProps<TData> {
  table: TanStackTable<TData>
  pageSizeOptions?: number[]
  /** How many numbered page buttons to show at once (a sliding window centered on the current page). */
  maxVisiblePages?: number
  className?: string
  /** Current card-grid column count. Provide together with `onCardColumnsChange` to show a "Columns
   * per page" select next to "Rows per page" -- e.g. for a Card view. Omit both to leave the
   * pagination bar showing only "Rows per page", as today. */
  cardColumns?: number
  onCardColumnsChange?: (count: number) => void
  /** Options for the "Columns per page" select. Defaults to `[1, 2, 3, 4]`. */
  cardColumnOptions?: number[]
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
  className,
  cardColumns,
  onCardColumnsChange,
  cardColumnOptions = DEFAULT_CARD_COLUMN_OPTIONS
}: DataTablePaginationProps<TData>) {
  const { pageIndex, pageSize } = table.getState().pagination
  const pageCount = Math.max(table.getPageCount(), 1)
  const pageWindow = getPageWindow(pageIndex, pageCount, maxVisiblePages)
  const showCardColumns = cardColumns !== undefined && onCardColumnsChange !== undefined

  return (
    // `@container` + `@sm:` variants below, not `sm:` -- this bar is routinely embedded in panes
    // narrower than the viewport (a sidebar, a card, the "Frame" divs in the Responsive layout
    // showcase), so a viewport media query would see the full window width and never switch, even
    // though the bar itself has no room. Reacting to the bar's own width is what actually matches
    // "does this fit", regardless of where it's mounted.
    <div
      className={cn(
        '@container flex flex-col items-stretch gap-4 @sm:flex-row @sm:items-center @sm:justify-between',
        className
      )}
    >
      <div className='flex flex-col gap-2 text-sm text-muted-foreground @sm:flex-row @sm:items-center'>
        <div className='flex items-center gap-2'>
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
        {showCardColumns ? (
          <div className='flex items-center gap-2'>
            <Separator orientation='vertical' className='hidden h-4 @sm:block' />
            <span>Columns per page</span>
            <Select value={`${cardColumns}`} onValueChange={(value) => onCardColumnsChange(Number(value))}>
              <SelectTrigger className='h-8 w-[70px]' aria-label='Columns per page'>
                <SelectValue placeholder={`${cardColumns}`} />
              </SelectTrigger>
              <SelectContent>
                {cardColumnOptions.map((count) => (
                  <SelectItem key={count} value={`${count}`}>
                    {count}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}
      </div>
      <div className='flex flex-wrap items-center gap-1'>
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

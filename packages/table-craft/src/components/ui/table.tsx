import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

function Table({ className, ...props }: ComponentProps<'table'>) {
  return (
    <div data-slot='table-container' className='relative w-full overflow-x-auto'>
      <table
        data-slot='table'
        // `table` (display: table) counters a host page's markdown-table CSS forcing `display: block`
        // on every <table> for its own responsive scrolling -- harmless to override since our own
        // wrapper div above already handles horizontal overflow. Without it, `w-full` stretches an
        // invisible block box while the actual visible grid (thead/tr/td, still table-row/-cell
        // display) sizes to content in an anonymous inner table, silently ignoring the 100% width.
        // `text-[13px]`, not the stock `text-sm` (14px): the design system's cell/header workhorse size.
        className={cn('w-full table border-collapse caption-bottom text-[13px]', className)}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: ComponentProps<'thead'>) {
  return <thead data-slot='table-header' className={cn('[&_tr]:border-b', className)} {...props} />
}

function TableBody({ className, ...props }: ComponentProps<'tbody'>) {
  return <tbody data-slot='table-body' className={cn('[&_tr:last-child]:border-0', className)} {...props} />
}

function TableFooter({ className, ...props }: ComponentProps<'tfoot'>) {
  return (
    <tfoot
      data-slot='table-footer'
      className={cn('border-t bg-muted/50 font-medium [&>tr]:last:border-b-0', className)}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: ComponentProps<'tr'>) {
  return (
    <tr
      data-slot='table-row'
      className={cn('border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted', className)}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: ComponentProps<'th'>) {
  return (
    <th
      data-slot='table-head'
      // px-[18px]/py-[10px]: the design system's header cell padding is `--atc-cell-padding-x`/`--atc-space-5`
      // (18px/10px) -- narrower vertically than a body row's 12px, since the header row leans on the raised
      // `--atc-surface-header` background rather than extra padding to read as its own band.
      // font-semibold (600), not font-medium: column headers are the same size as the cells, "distinguished
      // by weight and the header surface" per the design system.
      className={cn(
        'px-[18px] py-[10px] text-start align-middle font-semibold whitespace-nowrap text-foreground bg-muted/40 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: ComponentProps<'td'>) {
  return (
    <td
      data-slot='table-cell'
      // px-[18px]/py-3: same `--atc-cell-padding-x`/`--atc-row-padding-y` as TableHead above, giving a
      // ~43px row height (design system's `--atc-row-height`) once the 13px cell font is factored in.
      className={cn(
        'px-[18px] py-3 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        className
      )}
      {...props}
    />
  )
}

function TableCaption({ className, ...props }: ComponentProps<'caption'>) {
  return (
    <caption data-slot='table-caption' className={cn('mt-4 text-sm text-muted-foreground', className)} {...props} />
  )
}

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption }

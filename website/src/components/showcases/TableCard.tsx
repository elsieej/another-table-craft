import type { ReactNode } from 'react'
import type { Table } from '@tanstack/react-table'
import { DataTable } from 'another-table-craft'
import { Card, CardFooter } from '../ui/card'

interface TableCardProps<TData> {
  table: Table<TData>
  /** Rendered above the table in a bordered, padded band -- a search field, filter controls, or
   * both, matching the design system's toolbar. Omit for showcases with nothing to put there. */
  toolbar?: ReactNode
  /** false renders plain header text with no sort affordance -- e.g. when gating on
   * `config.features.sorting`, which the library itself doesn't enforce. */
  sortable?: boolean
  /** Native `dir` for the table's wrapper -- the RTL showcase sets this. Column headers use
   * the CSS logical `text-start` property, so alignment flips automatically with `dir`. */
  dir?: 'ltr' | 'rtl'
  /** Rendered in the card's bordered footer band -- typically `<DataTablePagination>` plus
   * whatever per-showcase readout (a row count, a query-string echo, a "go back" button, ...)
   * follows it. Stacked, not inlined, so pagination controls don't fight a second line for room. */
  footer?: ReactNode
  /** Fades just the table body (not the toolbar or footer) while an in-flight fetch is pending --
   * for showcases standing in for `manualPagination`/`manualFiltering` server-mode data. */
  loading?: boolean
}

/** The shared shell every showcase on this site embeds a table in: a `Card`, an optional toolbar
 * band above the table, and an optional bordered footer band below it -- the same structure (and
 * the same `DataTable` primitive) the styled-components showcase uses, so every table on the site
 * reads as one system regardless of which feature its own page is demonstrating. */
export function TableCard<TData>({ table, toolbar, sortable = true, dir, footer, loading }: TableCardProps<TData>) {
  return (
    <Card>
      {toolbar ? <div className='flex flex-col gap-3 border-b border-border px-5 py-4'>{toolbar}</div> : null}
      <div dir={dir} className={loading ? 'opacity-50 transition-opacity' : 'transition-opacity'}>
        <DataTable table={table} sortable={sortable} />
      </div>
      {footer ? <CardFooter className='flex flex-col items-stretch gap-3'>{footer}</CardFooter> : null}
    </Card>
  )
}

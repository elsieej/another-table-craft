import { flexRender, type Table } from '@tanstack/react-table'

interface SortableDataTableProps<TData> {
  table: Table<TData>
  /** false renders plain header text with no sort affordance -- e.g. when gating on
   * `config.features.sorting`, which the library itself doesn't enforce. */
  sortable?: boolean
  /** Native `dir` for the `<table>` element -- the RTL showcase sets this. */
  dir?: 'ltr' | 'rtl'
  /** false omits the hardcoded `textAlign: 'left'` so a `dir="rtl"` ancestor/table can show
   * its own direction-aware default alignment instead -- the RTL showcase's whole point. */
  textAlign?: boolean
}

/** Shared table markup every showcase embeds: sortable headers (button + aria-sort) and rows. */
export function SortableDataTable<TData>({
  table,
  sortable = true,
  dir,
  textAlign = true
}: SortableDataTableProps<TData>) {
  return (
    <table dir={dir} style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              const sortDirection = header.column.getIsSorted()
              const headerLabel = flexRender(header.column.columnDef.header, header.getContext())
              return (
                <th
                  key={header.id}
                  aria-sort={
                    sortable
                      ? sortDirection === 'asc'
                        ? 'ascending'
                        : sortDirection === 'desc'
                          ? 'descending'
                          : 'none'
                      : undefined
                  }
                  style={{
                    ...(textAlign ? { textAlign: 'left' as const } : {}),
                    borderBottom: '2px solid var(--ifm-color-emphasis-400)',
                    padding: '0.5rem'
                  }}
                >
                  {sortable ? (
                    <button
                      onClick={header.column.getToggleSortingHandler()}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        font: 'inherit',
                        color: 'inherit',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      {headerLabel}
                      {sortDirection === 'asc' ? ' ▲' : sortDirection === 'desc' ? ' ▼' : ''}
                    </button>
                  ) : (
                    <span style={{ fontWeight: 'bold' }}>{headerLabel}</span>
                  )}
                </th>
              )
            })}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} style={{ borderBottom: '1px solid var(--ifm-color-emphasis-200)', padding: '0.5rem' }}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

/** Shared Previous/Next + "Page X of Y" controls every showcase embeds. */
export function PaginationControls<TData>({ table }: { table: Table<TData> }) {
  return (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginTop: '1rem' }}>
      <button
        className='button button--sm button--outline button--primary'
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        Previous
      </button>
      <span>
        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
      </span>
      <button
        className='button button--sm button--outline button--primary'
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        Next
      </button>
    </div>
  )
}

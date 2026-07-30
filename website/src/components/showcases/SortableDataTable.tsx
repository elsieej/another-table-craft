import { flexRender, type Table } from '@tanstack/react-table'

/** Shared table markup every showcase embeds: sortable headers (button + aria-sort) and rows. */
export function SortableDataTable<TData>({ table }: { table: Table<TData> }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              const sortDirection = header.column.getIsSorted()
              return (
                <th
                  key={header.id}
                  aria-sort={sortDirection === 'asc' ? 'ascending' : sortDirection === 'desc' ? 'descending' : 'none'}
                  style={{
                    textAlign: 'left',
                    borderBottom: '2px solid var(--ifm-color-emphasis-400)',
                    padding: '0.5rem'
                  }}
                >
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
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {sortDirection === 'asc' ? ' ▲' : sortDirection === 'desc' ? ' ▼' : ''}
                  </button>
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

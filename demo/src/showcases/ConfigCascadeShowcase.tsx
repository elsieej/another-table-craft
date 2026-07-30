import { useMemo } from 'react'
import { flexRender, type ColumnDef } from '@tanstack/react-table'
import { createMemoryStateStore, TableProvider, useTableConfig, useTableCraft } from 'another-table-craft'
import { people, type Person } from '../data'

const columns: ColumnDef<Person>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' }
]

function ConfigTable({ label }: { label: string }) {
  // config.pagination.defaultPageSize isn't applied automatically -- it's only
  // consulted by the URL store to decide whether to omit `per_page` from the URL.
  // A consumer that wants it as the real initial page size seeds the store with it.
  const config = useTableConfig()
  const store = useMemo(
    () => createMemoryStateStore({ pagination: { pageIndex: 0, pageSize: config.pagination.defaultPageSize } }),
    [config.pagination.defaultPageSize]
  )
  const { table } = useTableCraft({ data: people, columns, store })

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <h3>{label}</h3>
      <p style={{ fontSize: '0.85rem', color: '#555' }}>
        Page sizes: {config.pagination.pageSizeOptions.join(', ')} (default {config.pagination.defaultPageSize}) ·
        Sorting: {config.features.sorting ? 'enabled' : 'disabled'}
      </p>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const sortDirection = config.features.sorting ? header.column.getIsSorted() : false
                return (
                  <th
                    key={header.id}
                    aria-sort={
                      !config.features.sorting
                        ? undefined
                        : sortDirection === 'asc'
                          ? 'ascending'
                          : sortDirection === 'desc'
                            ? 'descending'
                            : 'none'
                    }
                    style={{ textAlign: 'left', borderBottom: '2px solid #333', padding: '0.5rem' }}
                  >
                    {config.features.sorting ? (
                      <button
                        onClick={header.column.getToggleSortingHandler()}
                        style={{ all: 'unset', cursor: 'pointer', userSelect: 'none', display: 'inline-block' }}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {sortDirection === 'asc' ? ' ▲' : sortDirection === 'desc' ? ' ▼' : ''}
                      </button>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
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
                <td key={cell.id} style={{ borderBottom: '1px solid #ddd', padding: '0.5rem' }}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.75rem', flexWrap: 'wrap' }}>
        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
        </span>
        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </button>
        <label>
          Page size:{' '}
          <select
            value={table.getState().pagination.pageSize}
            onChange={(event) => table.setPageSize(Number(event.target.value))}
          >
            {config.pagination.pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  )
}

function ConfigCascadeShowcase() {
  return (
    <section>
      <h2>Config cascade</h2>
      <p>
        Same data, same columns, two different resolved configs. The left table uses the library's core defaults with no
        provider; the right table sits inside a <code>TableProvider</code> overriding page-size options and disabling
        sorting.
      </p>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <ConfigTable label='Default config (no provider)' />
        <TableProvider
          config={{
            pagination: { pageSizeOptions: [3, 6, 9], defaultPageSize: 3 },
            features: { sorting: false }
          }}
        >
          <ConfigTable label='Provider-overridden config' />
        </TableProvider>
      </div>
    </section>
  )
}

export default ConfigCascadeShowcase

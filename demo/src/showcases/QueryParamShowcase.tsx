import { useEffect, useState } from 'react'
import { flexRender, type ColumnDef } from '@tanstack/react-table'
import { createUrlStateStore, useTableCraft } from 'another-table-craft'
import { people, type Person } from '../data'

const columns: ColumnDef<Person>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' }
]

// Snappier than the library's 300ms default debounce so the URL visibly updates
// right away in a demo -- still the real URL-backed store, just tuned for this page.
// Module-level singleton: only this showcase touches the URL, so no other tab's
// table state can collide with it.
const store = createUrlStateStore({ debounceMs: 0 })

function useLiveLocation() {
  const [href, setHref] = useState(() => window.location.href)

  useEffect(() => {
    const id = setInterval(() => setHref(window.location.href), 150)
    return () => clearInterval(id)
  }, [])

  return href
}

function QueryParamShowcase() {
  const { table } = useTableCraft({ data: people, columns, store })
  const href = useLiveLocation()

  return (
    <section>
      <h2>Query-param state</h2>
      <p>
        Pagination, sorting, and the filter below all sync to the URL as you use them. Change something, then reload
        this page (or copy the URL into a new tab) -- the same table state comes back.
      </p>

      <input
        type='text'
        placeholder='Filter...'
        value={table.getState().globalFilter ?? ''}
        onChange={(event) => table.setGlobalFilter(event.target.value)}
        style={{ padding: '0.4rem', width: '100%', boxSizing: 'border-box' }}
      />

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.75rem' }}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const sortDirection = header.column.getIsSorted()
                return (
                  <th
                    key={header.id}
                    aria-sort={sortDirection === 'asc' ? 'ascending' : sortDirection === 'desc' ? 'descending' : 'none'}
                    style={{ textAlign: 'left', borderBottom: '2px solid #333', padding: '0.5rem' }}
                  >
                    <button
                      onClick={header.column.getToggleSortingHandler()}
                      style={{
                        all: 'unset',
                        cursor: 'pointer',
                        userSelect: 'none',
                        display: 'inline-block'
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
                <td key={cell.id} style={{ borderBottom: '1px solid #ddd', padding: '0.5rem' }}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginTop: '1rem' }}>
        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
        </span>
        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </button>
      </div>

      <p style={{ marginTop: '1rem' }}>
        Current URL: <code style={{ wordBreak: 'break-all' }}>{href}</code>
      </p>
    </section>
  )
}

export default QueryParamShowcase

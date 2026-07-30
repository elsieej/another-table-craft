import { useMemo } from 'react'
import { flexRender, type ColumnDef } from '@tanstack/react-table'
import { createMemoryStateStore, useTableCraft } from 'another-table-craft'
import { people, type Person } from '../data'

const columns: ColumnDef<Person>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' }
]

function BasicTable() {
  // In-memory store: this showcase is about the basic table/pagination wiring, not
  // URL persistence (that's the Query-param showcase) -- keeps the two decoupled so
  // switching tabs never causes one showcase's pagination to affect the other's.
  const store = useMemo(() => createMemoryStateStore(), [])
  const { table } = useTableCraft({ data: people, columns, store })

  return (
    <section>
      <h2>Basic table</h2>
      <p>A minimal table over 12 sample rows, driven entirely by the headless useTableCraft hook.</p>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} style={{ textAlign: 'left', borderBottom: '2px solid #333', padding: '0.5rem' }}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
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
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </button>
      </div>
    </section>
  )
}

export default BasicTable

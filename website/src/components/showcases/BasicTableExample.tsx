import { useMemo, type ReactNode } from 'react'
import { flexRender, type ColumnDef } from '@tanstack/react-table'
import { createMemoryStateStore, useTableCraft } from 'another-table-craft'
import { people, type Person } from '../../data/people'

const columns: ColumnDef<Person>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' }
]

export default function BasicTableExample(): ReactNode {
  // In-memory store keeps this embed self-contained: it never touches this page's own URL.
  const store = useMemo(() => createMemoryStateStore({ pagination: { pageIndex: 0, pageSize: 5 } }), [])
  const { table } = useTableCraft({ data: people, columns, store })

  return (
    <div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: 8, padding: '1rem' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  style={{
                    textAlign: 'left',
                    borderBottom: '2px solid var(--ifm-color-emphasis-400)',
                    padding: '0.5rem'
                  }}
                >
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
                <td
                  key={cell.id}
                  style={{ borderBottom: '1px solid var(--ifm-color-emphasis-200)', padding: '0.5rem' }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

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
    </div>
  )
}

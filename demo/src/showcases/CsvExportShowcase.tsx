import { useMemo } from 'react'
import { flexRender, type ColumnDef } from '@tanstack/react-table'
import { createMemoryStateStore, exportSelectedRowsCsv, useTableCraft } from 'another-table-craft'
import { people, type Person } from '../data'

const columns: ColumnDef<Person>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <input
        type='checkbox'
        checked={table.getIsAllPageRowsSelected()}
        onChange={table.getToggleAllPageRowsSelectedHandler()}
        aria-label='Select all rows on this page'
      />
    ),
    cell: ({ row }) => (
      <input
        type='checkbox'
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
        aria-label={`Select row ${row.index + 1}`}
      />
    )
  },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' }
]

function CsvExportShowcase() {
  const store = useMemo(() => createMemoryStateStore(), [])
  const { table } = useTableCraft({ data: people, columns, store })

  const selectedCount = table.getSelectedRowModel().rows.length

  return (
    <section>
      <h2>CSV export</h2>
      <p>Select rows below, then export -- this calls the library's real `exportSelectedRowsCsv`.</p>

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
        <span>{selectedCount} selected</span>
        <button onClick={() => exportSelectedRowsCsv(table, { fileName: 'people' })} disabled={selectedCount === 0}>
          Export CSV
        </button>
      </div>
    </section>
  )
}

export default CsvExportShowcase

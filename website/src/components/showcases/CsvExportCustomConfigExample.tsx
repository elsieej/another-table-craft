import { useMemo, type ReactNode } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { createMemoryStateStore, exportSelectedRowsCsv, useTableCraft } from 'another-table-craft'
import { people, type Person } from '../../data/people'
import { PaginationControls, SortableDataTable } from './SortableDataTable'

const EXPORT_OPTIONS = { fileName: 'selected-people', ignoredCols: ['role'], fieldSeparator: ';' }

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

export default function CsvExportCustomConfigExample(): ReactNode {
  const store = useMemo(() => createMemoryStateStore(), [])
  const { table } = useTableCraft({ data: people, columns, store })
  const selectedCount = table.getSelectedRowModel().rows.length

  return (
    <div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: 8, padding: '1rem' }}>
      <p style={{ marginTop: 0 }}>
        Role is visible in the table below, but excluded from the export -- watch for it missing from the downloaded
        CSV's columns. The download is also semicolon-separated, not comma-separated -- open it in a text editor to see
        fields joined with <code>;</code> instead of <code>,</code>.
      </p>
      <SortableDataTable table={table} sortable={false} />
      <PaginationControls table={table} />

      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginTop: '1rem' }}>
        <span>{selectedCount} selected</span>
        <button
          className='button button--sm button--primary'
          onClick={() => exportSelectedRowsCsv(table, EXPORT_OPTIONS)}
          disabled={selectedCount === 0}
        >
          Export as selected-people.csv
        </button>
      </div>
    </div>
  )
}

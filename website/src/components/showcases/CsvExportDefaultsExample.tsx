import { useMemo, type ReactNode } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { Button, Checkbox, createMemoryStateStore, exportSelectedRowsCsv, useTableCraft } from 'another-table-craft'
import { people, type Person } from '../../data/people'
import { TableCard } from './TableCard'
import { PaginationFooter } from './PaginationFooter'

const columns: ColumnDef<Person>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(checked) => table.toggleAllPageRowsSelected(checked === true)}
        aria-label='Select all rows on this page'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(checked) => row.toggleSelected(checked === true)}
        aria-label={`Select row ${row.index + 1}`}
      />
    )
  },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' }
]

export default function CsvExportDefaultsExample(): ReactNode {
  const store = useMemo(() => createMemoryStateStore(), [])
  const { table } = useTableCraft({ data: people, columns, store })
  const selectedCount = table.getSelectedRowModel().rows.length

  return (
    <TableCard
      table={table}
      sortable={false}
      footer={
        <>
          <PaginationFooter table={table} />
          <div className='flex items-center gap-3'>
            <span className='text-[13px] text-muted-foreground'>{selectedCount} selected</span>
            <Button size='sm' onClick={() => exportSelectedRowsCsv(table)} disabled={selectedCount === 0}>
              Export CSV
            </Button>
          </div>
        </>
      }
    />
  )
}

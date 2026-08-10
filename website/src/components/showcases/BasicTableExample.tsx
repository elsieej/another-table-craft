import { useMemo, type ReactNode } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { createMemoryStateStore, useTableCraft } from 'another-table-craft'
import { people, type Person } from '../../data/people'
import { TableCard } from './TableCard'
import { PaginationFooter } from './PaginationFooter'

const columns: ColumnDef<Person>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' }
]

export default function BasicTableExample(): ReactNode {
  // In-memory store keeps this embed self-contained: it never touches this page's own URL.
  const store = useMemo(() => createMemoryStateStore({ pagination: { pageIndex: 0, pageSize: 5 } }), [])
  const { table } = useTableCraft({ data: people, columns, store })

  return <TableCard table={table} footer={<PaginationFooter table={table} />} />
}

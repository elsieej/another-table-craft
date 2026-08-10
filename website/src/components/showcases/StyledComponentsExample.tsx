import { useMemo, type ReactNode } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import {
  createMemoryStateStore,
  useTableCraft,
  Card,
  CardFooter,
  DataTable,
  DataTablePagination
} from 'another-table-craft'
import { people, type Person } from '../../data/people'

const columns: ColumnDef<Person>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' },
  { accessorKey: 'team', header: 'Team' }
]

export default function StyledComponentsExample(): ReactNode {
  const store = useMemo(() => createMemoryStateStore({ pagination: { pageIndex: 0, pageSize: 5 } }), [])
  const { table } = useTableCraft({ data: people, columns, store })

  return (
    <Card>
      <DataTable table={table} />
      <CardFooter>
        <DataTablePagination table={table} className='w-full' />
      </CardFooter>
    </Card>
  )
}

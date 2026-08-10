import { useState, type ReactNode } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { DEFAULT_TABLE_STATE, useTableCraft, type TableStateSnapshot } from 'another-table-craft'
import { people, type Person } from '../../data/people'
import { TableCard } from './TableCard'
import { PaginationFooter } from './PaginationFooter'

const columns: ColumnDef<Person>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' }
]

export default function ControlledStateTableExample(): ReactNode {
  // This state lives here, in this component -- not in any store. useTableCraft only
  // ever reads it back and calls onStateChange; it never persists it anywhere itself.
  const [state, setState] = useState<TableStateSnapshot>(DEFAULT_TABLE_STATE)
  const { table } = useTableCraft({ data: people, columns, state, onStateChange: setState })

  return (
    <TableCard
      table={table}
      footer={
        <>
          <PaginationFooter table={table} />
          <div>
            <p className='mt-0 mb-1.5 text-[13px] text-muted-foreground'>
              The state below is this component's own <code>useState</code>, echoed back by <code>onStateChange</code>:
            </p>
            <pre className='m-0 max-h-[200px] overflow-auto text-[13px]'>{JSON.stringify(state, null, 2)}</pre>
          </div>
        </>
      }
    />
  )
}

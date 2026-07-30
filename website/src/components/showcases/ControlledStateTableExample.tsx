import { useState, type ReactNode } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { DEFAULT_TABLE_STATE, useTableCraft, type TableStateSnapshot } from 'another-table-craft'
import { people, type Person } from '../../data/people'
import { PaginationControls, SortableDataTable } from './SortableDataTable'

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
    <div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: 8, padding: '1rem' }}>
      <SortableDataTable table={table} />
      <PaginationControls table={table} />

      <p style={{ marginTop: '1rem', marginBottom: '0.25rem' }}>
        The state below is this component's own <code>useState</code>, echoed back by <code>onStateChange</code>:
      </p>
      <pre style={{ margin: 0, maxHeight: 200, overflow: 'auto' }}>{JSON.stringify(state, null, 2)}</pre>
    </div>
  )
}

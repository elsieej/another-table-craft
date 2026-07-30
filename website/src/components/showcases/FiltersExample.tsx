import { useMemo, type ReactNode } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { createMemoryStateStore, useTableCraft } from 'another-table-craft'
import { people, type Person } from '../../data/people'
import { PaginationControls, SortableDataTable } from './SortableDataTable'

const ROLES = ['Engineer', 'Researcher', 'Analyst']

const columns: ColumnDef<Person>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' }
]

export default function FiltersExample(): ReactNode {
  const store = useMemo(() => createMemoryStateStore(), [])
  const { table, state, setGlobalFilter, setColumnFilter } = useTableCraft({ data: people, columns, store })

  return (
    <div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: 8, padding: '1rem' }}>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <input
          type='text'
          placeholder='Search all columns…'
          value={state.globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          style={{ padding: '0.4rem', flex: 1, minWidth: '12rem' }}
          aria-label='Global filter'
        />

        <select
          value={(state.columnFilters.find((filter) => filter.id === 'role')?.value as string) ?? ''}
          onChange={(event) => setColumnFilter('role', event.target.value || undefined)}
          aria-label='Filter by role'
        >
          <option value=''>All roles</option>
          {ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      <SortableDataTable table={table} />
      <PaginationControls table={table} />

      <p style={{ marginTop: '1rem', marginBottom: 0 }}>
        {table.getFilteredRowModel().rows.length} of {people.length} rows match.
      </p>
    </div>
  )
}

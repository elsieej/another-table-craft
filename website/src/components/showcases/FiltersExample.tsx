import { useMemo, type ReactNode } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import {
  createMemoryStateStore,
  useTableCraft,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from 'another-table-craft'
import { SearchInput } from '../ui/search-input'
import { people, type Person } from '../../data/people'
import { TableCard } from './TableCard'
import { PaginationFooter } from './PaginationFooter'

const ROLES = ['Engineer', 'Researcher', 'Analyst']

const columns: ColumnDef<Person>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' }
]

export default function FiltersExample(): ReactNode {
  const store = useMemo(() => createMemoryStateStore(), [])
  const { table, state, setGlobalFilter, setColumnFilter } = useTableCraft({ data: people, columns, store })
  const roleFilter = (state.columnFilters.find((filter) => filter.id === 'role')?.value as string) ?? 'all'

  return (
    <>
      <TableCard
        table={table}
        toolbar={
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <SearchInput
              placeholder='Search all columns…'
              aria-label='Global filter'
              value={state.globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              onClear={() => setGlobalFilter('')}
            />
            <Select
              value={roleFilter}
              onValueChange={(value) => setColumnFilter('role', value === 'all' ? undefined : value)}
            >
              <SelectTrigger className='w-[160px]' aria-label='Filter by role'>
                {/* Explicit children, not a bare `placeholder`: Base UI's own value->label resolution only
                    works when an item's value and its rendered label are the same string (true for every
                    role here, but not for the 'all' sentinel), so it silently falls back to showing the
                    raw value instead of "All roles". */}
                <SelectValue>{roleFilter === 'all' ? 'All roles' : roleFilter}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All roles</SelectItem>
                {ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
        footer={<PaginationFooter table={table} />}
      />
      <p style={{ marginTop: '0.75rem' }}>
        {table.getFilteredRowModel().rows.length} of {people.length} rows match.
      </p>
    </>
  )
}

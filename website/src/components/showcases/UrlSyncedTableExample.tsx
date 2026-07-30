import { type ReactNode } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { useTableCraft } from 'another-table-craft'
import { people, type Person } from '../../data/people'
import { PaginationControls, SortableDataTable } from './SortableDataTable'
import { useLiveLocationSearch } from '../../hooks/useLiveLocationSearch'

const columns: ColumnDef<Person>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' }
]

export default function UrlSyncedTableExample(): ReactNode {
  // No `store` passed -- this is useTableCraft's own default: a URL-backed store in the
  // browser (falling back to an in-memory store during this page's static-site prerender).
  const { table, state, setGlobalFilter } = useTableCraft({ data: people, columns })
  const currentSearch = useLiveLocationSearch()

  return (
    <div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: 8, padding: '1rem' }}>
      <input
        type='text'
        placeholder='Search all columns…'
        value={state.globalFilter}
        onChange={(event) => setGlobalFilter(event.target.value)}
        style={{ marginBottom: '1rem', padding: '0.4rem', width: '100%', boxSizing: 'border-box' }}
        aria-label='Global filter'
      />

      <SortableDataTable table={table} />
      <PaginationControls table={table} />

      <p style={{ marginTop: '1rem', marginBottom: 0 }}>
        This page's URL right now: <code>{currentSearch || '(no query params -- try sorting or paging)'}</code>
      </p>
    </div>
  )
}

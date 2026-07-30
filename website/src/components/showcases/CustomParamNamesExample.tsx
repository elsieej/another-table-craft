import { useMemo, type ReactNode } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { createUrlStateStore, useTableCraft } from 'another-table-craft'
import { people, type Person } from '../../data/people'
import { PaginationControls, SortableDataTable } from './SortableDataTable'
import { useLiveLocationSearch } from '../../hooks/useLiveLocationSearch'

const columns: ColumnDef<Person>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' }
]

export default function CustomParamNamesExample(): ReactNode {
  const store = useMemo(() => createUrlStateStore({ paramNames: { page: 'p', pageSize: 'size', sort: 'order' } }), [])
  const { table } = useTableCraft({ data: people, columns, store })
  const currentSearch = useLiveLocationSearch()

  return (
    <div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: 8, padding: '1rem' }}>
      <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
        <span>rows per page:</span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(event) => table.setPageSize(Number(event.target.value))}
        >
          <option value={3}>3</option>
          <option value={5}>5</option>
          <option value={10}>10 (default)</option>
        </select>
      </label>

      <SortableDataTable table={table} />
      <PaginationControls table={table} />
      <p style={{ marginTop: '1rem', marginBottom: 0 }}>
        Query string: <code>{currentSearch || '(none yet -- sort or page to see p / order / size appear)'}</code>
      </p>
    </div>
  )
}

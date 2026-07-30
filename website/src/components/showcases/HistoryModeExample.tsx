import { useMemo, useState, type ReactNode } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { createUrlStateStore, useTableCraft } from 'another-table-craft'
import { people, type Person } from '../../data/people'
import { PaginationControls, SortableDataTable } from './SortableDataTable'
import { useLiveLocationSearch } from '../../hooks/useLiveLocationSearch'

const columns: ColumnDef<Person>[] = [{ accessorKey: 'name', header: 'Name' }]

export default function HistoryModeExample(): ReactNode {
  const [mode, setMode] = useState<'push' | 'replace'>('replace')
  // Recreated whenever `mode` changes. Param names are namespaced to this demo so its
  // writes round-trip through the other url-store demos on this page as inert, preserved
  // column-filter-shaped values rather than being confused with their own fields.
  const store = useMemo(
    () =>
      createUrlStateStore({
        history: mode,
        paramNames: { page: 'history-demo-p', sort: 'history-demo-sort' }
      }),
    [mode]
  )
  const { table } = useTableCraft({ data: people, columns, store })
  const currentSearch = useLiveLocationSearch()

  return (
    <div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: 8, padding: '1rem' }}>
      <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
        <span>history mode:</span>
        <select value={mode} onChange={(event) => setMode(event.target.value as 'push' | 'replace')}>
          <option value='replace'>replace (default)</option>
          <option value='push'>push</option>
        </select>
      </label>

      <SortableDataTable table={table} />
      <PaginationControls table={table} />
      <button
        className='button button--sm button--outline'
        onClick={() => window.history.back()}
        style={{ marginTop: '0.75rem' }}
      >
        ◀ Go back
      </button>

      <p style={{ marginTop: '1rem', marginBottom: 0 }}>
        Query string: <code>{currentSearch || '(none yet)'}</code>
      </p>
    </div>
  )
}

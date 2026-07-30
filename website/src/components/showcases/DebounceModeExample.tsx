import { useMemo, useState, type ReactNode } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { createUrlStateStore, useTableCraft } from 'another-table-craft'
import { people, type Person } from '../../data/people'
import { SortableDataTable } from './SortableDataTable'
import { useLiveLocationSearch } from '../../hooks/useLiveLocationSearch'

const columns: ColumnDef<Person>[] = [{ accessorKey: 'name', header: 'Name' }]

export default function DebounceModeExample(): ReactNode {
  const [debounceMs, setDebounceMs] = useState(2000)
  // Recreated whenever the selected delay changes -- exaggerated values (0ms vs 2000ms,
  // rather than the real 300ms default) so the lag is obvious to watch, not just measurable.
  const store = useMemo(
    () =>
      createUrlStateStore({
        debounceMs,
        paramNames: { globalFilter: 'debounce-demo-q', sort: 'debounce-demo-sort' }
      }),
    [debounceMs]
  )
  const { table, state, setGlobalFilter } = useTableCraft({ data: people, columns, store })
  const currentSearch = useLiveLocationSearch()

  return (
    <div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: 8, padding: '1rem' }}>
      <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
        <span>debounceMs:</span>
        <select value={debounceMs} onChange={(event) => setDebounceMs(Number(event.target.value))}>
          <option value={0}>0 (instant)</option>
          <option value={2000}>2000 (slow, for comparison -- real default is 300)</option>
        </select>
      </label>

      <input
        type='text'
        placeholder='Type here…'
        value={state.globalFilter}
        onChange={(event) => setGlobalFilter(event.target.value)}
        style={{ padding: '0.4rem', width: '100%', boxSizing: 'border-box' }}
        aria-label='Debounce demo filter'
      />

      <div style={{ marginTop: '1rem' }}>
        <SortableDataTable table={table} />
      </div>

      <p style={{ marginTop: '1rem', marginBottom: 0 }}>
        Query string: <code>{currentSearch || '(none yet)'}</code>
      </p>
    </div>
  )
}

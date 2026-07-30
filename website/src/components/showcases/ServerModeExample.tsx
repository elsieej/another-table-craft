import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { createMemoryStateStore, useTableCraft } from 'another-table-craft'
import { people, type Person } from '../../data/people'
import { PaginationControls, SortableDataTable } from './SortableDataTable'

const columns: ColumnDef<Person>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' }
]

interface FetchParams {
  pageIndex: number
  pageSize: number
  sorting: { id: string; desc: boolean }[]
  globalFilter: string
}

interface FetchResult {
  rows: Person[]
  rowCount: number
}

/** Stands in for a real API call: filters/sorts/paginates server-side, behind an artificial delay. */
function fakeServerFetch({ pageIndex, pageSize, sorting, globalFilter }: FetchParams): Promise<FetchResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let rows = people
      if (globalFilter) {
        const query = globalFilter.toLowerCase()
        rows = rows.filter(
          (person) =>
            person.name.toLowerCase().includes(query) ||
            person.email.toLowerCase().includes(query) ||
            person.role.toLowerCase().includes(query)
        )
      }
      if (sorting.length > 0) {
        const { id, desc } = sorting[0]
        const key = id as keyof Person
        rows = [...rows].sort((a, b) => {
          const cmp = String(a[key]).localeCompare(String(b[key]))
          return desc ? -cmp : cmp
        })
      }
      const rowCount = rows.length
      const start = pageIndex * pageSize
      resolve({ rows: rows.slice(start, start + pageSize), rowCount })
    }, 600)
  })
}

export default function ServerModeExample(): ReactNode {
  const [rows, setRows] = useState<Person[]>([])
  const [rowCount, setRowCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const store = useMemo(() => createMemoryStateStore({ pagination: { pageIndex: 0, pageSize: 4 } }), [])
  const { table, state } = useTableCraft({
    data: rows,
    columns,
    store,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    rowCount,
    // The "current page" is a different slice of Person on every fetch -- without this,
    // TanStack would fall back to row *index* as identity, which points at a different
    // person after every re-fetch. This keeps each row's identity tied to its real id.
    getRowId: (person) => `person-${person.id}`
  })

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fakeServerFetch({
      pageIndex: state.pagination.pageIndex,
      pageSize: state.pagination.pageSize,
      sorting: state.sorting,
      globalFilter: state.globalFilter
    }).then((result) => {
      if (cancelled) return
      setRows(result.rows)
      setRowCount(result.rowCount)
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [state.pagination.pageIndex, state.pagination.pageSize, state.sorting, state.globalFilter])

  return (
    <div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: 8, padding: '1rem' }}>
      <input
        type='text'
        placeholder='Search (hits the fake server)…'
        value={state.globalFilter}
        onChange={(event) => table.setGlobalFilter(event.target.value)}
        style={{ marginBottom: '1rem', padding: '0.4rem', width: '100%', boxSizing: 'border-box' }}
        aria-label='Server-mode search'
      />

      <div style={{ opacity: loading ? 0.5 : 1, transition: 'opacity 150ms' }}>
        <SortableDataTable table={table} />
      </div>
      <PaginationControls table={table} />

      <p style={{ marginTop: '1rem', marginBottom: 0 }}>
        {loading ? 'Fetching from the fake server…' : `${rowCount} total row(s) on the "server".`}
      </p>
    </div>
  )
}

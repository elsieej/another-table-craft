import { useMemo, useState, type ReactNode } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { Button, createMemoryStateStore, useTableCraft } from 'another-table-craft'
import { SearchInput } from '../ui/search-input'
import { people, type Person } from '../../data/people'
import { TableCard } from './TableCard'
import { PaginationFooter } from './PaginationFooter'

const columns: ColumnDef<Person>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' },
  { accessorKey: 'team', header: 'Team' }
]

// Frame widths, not real devices -- narrow enough that these four columns can't all fit, which is
// the point: the table doesn't reflow into cards or drop columns at small sizes, it scrolls.
const FRAMES = [
  { label: 'Mobile', width: 360 },
  { label: 'Tablet', width: 640 },
  { label: 'Desktop', width: undefined }
] as const

export default function ResponsiveExample(): ReactNode {
  const [frame, setFrame] = useState<(typeof FRAMES)[number]>(FRAMES[0])
  const store = useMemo(() => createMemoryStateStore({ pagination: { pageIndex: 0, pageSize: 5 } }), [])
  const { table, state, setGlobalFilter } = useTableCraft({ data: people, columns, store })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {FRAMES.map((candidate) => (
          <Button
            key={candidate.label}
            type='button'
            size='sm'
            variant={candidate.label === frame.label ? 'default' : 'outline'}
            onClick={() => setFrame(candidate)}
          >
            {candidate.label}
            {candidate.width ? ` (${candidate.width}px)` : ''}
          </Button>
        ))}
      </div>

      {/* This border is only here to make the chosen frame width visible on the page -- the
          scrolling behavior itself comes from Table's own wrapper (overflow-x-auto), which is
          exactly what a real narrow viewport gets too, framed or not. */}
      <div
        style={{
          width: frame.width,
          maxWidth: '100%',
          border: '1px dashed var(--ifm-color-emphasis-400)',
          borderRadius: 8,
          padding: 12
        }}
      >
        <TableCard
          table={table}
          toolbar={
            <SearchInput
              placeholder='Search all columns…'
              aria-label='Global filter'
              value={state.globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              onClear={() => setGlobalFilter('')}
              className='w-full'
            />
          }
          footer={<PaginationFooter table={table} />}
        />
      </div>
    </div>
  )
}

import { type ReactNode } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { SearchInput, useTableCraft } from 'another-table-craft'
import { people, type Person } from '../../data/people'
import { TableCard } from './TableCard'
import { PaginationFooter } from './PaginationFooter'
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
      footer={
        <>
          <PaginationFooter table={table} />
          <p className='m-0 text-[13px] text-muted-foreground'>
            This page's URL right now: <code>{currentSearch || '(no query params -- try sorting or paging)'}</code>
          </p>
        </>
      }
    />
  )
}

import { useMemo, type ReactNode } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import {
  createUrlStateStore,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useTableCraft
} from 'another-table-craft'
import { Label } from '../ui/label'
import { people, type Person } from '../../data/people'
import { TableCard } from './TableCard'
import { PaginationFooter } from './PaginationFooter'
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
    <TableCard
      table={table}
      toolbar={
        <div className='flex items-center gap-2'>
          <Label htmlFor='custom-param-page-size' className='text-[13px]'>
            rows per page:
          </Label>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger id='custom-param-page-size' className='w-fit'>
              {/* Explicit children: Base UI's value->label resolution only works when an item's value and
                  its rendered label are the same string, which isn't true for '10'. */}
              <SelectValue>
                {table.getState().pagination.pageSize === 10
                  ? '10 (default)'
                  : `${table.getState().pagination.pageSize}`}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='3'>3</SelectItem>
              <SelectItem value='5'>5</SelectItem>
              <SelectItem value='10'>10 (default)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      }
      footer={
        <>
          <PaginationFooter table={table} />
          <p className='m-0 text-[13px] text-muted-foreground'>
            Query string: <code>{currentSearch || '(none yet -- sort or page to see p / order / size appear)'}</code>
          </p>
        </>
      }
    />
  )
}

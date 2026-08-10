import { useMemo, useState, type ReactNode } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import {
  Button,
  createUrlStateStore,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useTableCraft
} from 'another-table-craft'
import { people, type Person } from '../../data/people'
import { TableCard } from './TableCard'
import { PaginationFooter } from './PaginationFooter'
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
    <TableCard
      table={table}
      toolbar={
        <div className='flex items-center gap-2'>
          <Label htmlFor='history-mode' className='text-[13px]'>
            history mode:
          </Label>
          <Select value={mode} onValueChange={(value) => setMode(value as 'push' | 'replace')}>
            <SelectTrigger id='history-mode' className='w-fit'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='replace'>replace (default)</SelectItem>
              <SelectItem value='push'>push</SelectItem>
            </SelectContent>
          </Select>
        </div>
      }
      footer={
        <>
          <PaginationFooter table={table} />
          <div className='flex items-center gap-3'>
            <Button size='sm' variant='outline' onClick={() => window.history.back()}>
              ◀ Go back
            </Button>
          </div>
          <p className='m-0 text-[13px] text-muted-foreground'>
            Query string: <code>{currentSearch || '(none yet)'}</code>
          </p>
        </>
      }
    />
  )
}

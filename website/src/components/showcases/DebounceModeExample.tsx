import { useMemo, useState, type ReactNode } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import {
  createUrlStateStore,
  Label,
  SearchInput,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useTableCraft
} from 'another-table-craft'
import { people, type Person } from '../../data/people'
import { TableCard } from './TableCard'
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
    <TableCard
      table={table}
      toolbar={
        <>
          <div className='flex items-center gap-2'>
            <Label htmlFor='debounce-ms' className='text-[13px]'>
              debounceMs:
            </Label>
            <Select value={`${debounceMs}`} onValueChange={(value) => setDebounceMs(Number(value))}>
              <SelectTrigger id='debounce-ms' className='w-fit'>
                {/* Explicit children: Base UI's value->label resolution only works when an item's value
                    and its rendered label are the same string, which isn't true here. */}
                <SelectValue>
                  {debounceMs === 0 ? '0 (instant)' : '2000 (slow, for comparison -- real default is 300)'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='0'>0 (instant)</SelectItem>
                <SelectItem value='2000'>2000 (slow, for comparison -- real default is 300)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <SearchInput
            placeholder='Type here…'
            aria-label='Debounce demo filter'
            value={state.globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            onClear={() => setGlobalFilter('')}
            className='w-full'
          />
        </>
      }
      footer={
        <p className='m-0 text-[13px] text-muted-foreground'>
          Query string: <code>{currentSearch || '(none yet)'}</code>
        </p>
      }
    />
  )
}

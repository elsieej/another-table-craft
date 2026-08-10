import { useMemo, useRef, type ReactNode } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { createMemoryStateStore, useTableCraft, type TableConfigInput, type TablePlugin } from 'another-table-craft'
import { people, type Person } from '../../data/people'
import { TableCard } from './TableCard'
import { PaginationFooter } from './PaginationFooter'

const columns: ColumnDef<Person>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'role', header: 'Role' }
]

// Lower priority applies first -- sizingPlugin's defaultPageSize (4) is merged in before
// overrideSizePlugin's (8), so overrideSizePlugin wins for the field they both touch.
const sizingPlugin: TablePlugin = {
  name: 'sizing',
  priority: 10,
  config: { pagination: { pageSizeOptions: [4, 8, 12], defaultPageSize: 4 } }
}

export default function PluginSystemExample(): ReactNode {
  // A ref, not state: onResolve runs synchronously inside useTableCraft below, before this
  // component's JSX is built, so reading the ref afterwards in the same render is enough --
  // no re-render needed, and no risk of the setState-during-render footguns that would come
  // with tracking this in state instead.
  const lastResolvedRef = useRef<number | null>(null)

  const instanceConfig = useMemo<TableConfigInput>(() => {
    const overrideSizePlugin: TablePlugin = {
      name: 'override-size',
      priority: 20,
      config: { pagination: { defaultPageSize: 8 } },
      onResolve: (resolvedConfig) => {
        lastResolvedRef.current = resolvedConfig.pagination.defaultPageSize
        console.log(
          '[override-size plugin] onResolve fired -- resolved defaultPageSize:',
          resolvedConfig.pagination.defaultPageSize
        )
      }
    }
    return { plugins: [sizingPlugin, overrideSizePlugin] }
  }, [])

  const store = useMemo(() => createMemoryStateStore({ pagination: { pageIndex: 0, pageSize: 8 } }), [])
  const { table, config } = useTableCraft({ data: people, columns, store, config: instanceConfig })

  return (
    <TableCard
      table={table}
      footer={
        <>
          <PaginationFooter table={table} />
          <p className='m-0 text-[13px] text-muted-foreground'>
            Resolved: pageSizeOptions=<code>{JSON.stringify(config.pagination.pageSizeOptions)}</code>, defaultPageSize=
            <code>{config.pagination.defaultPageSize}</code>
          </p>
          <p className='m-0 text-[13px] text-muted-foreground'>
            <code>override-size</code>'s <code>onResolve</code> last saw defaultPageSize=
            <code>{String(lastResolvedRef.current)}</code> (also logged to your browser console).
          </p>
        </>
      }
    />
  )
}

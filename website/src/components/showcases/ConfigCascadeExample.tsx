import { useMemo, type ReactNode } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { createMemoryStateStore, TableProvider, useTableCraft, type TableConfig } from 'another-table-craft'
import { people, type Person } from '../../data/people'
import { TableCard } from './TableCard'
import { PaginationFooter } from './PaginationFooter'

const columns: ColumnDef<Person>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'role', header: 'Role' }
]

function ConfigReadout({ config }: { config: TableConfig }) {
  return (
    <p style={{ margin: 0, fontSize: '0.85em' }}>
      Resolved: pageSizeOptions=<code>{JSON.stringify(config.pagination.pageSizeOptions)}</code>, defaultPageSize=
      <code>{config.pagination.defaultPageSize}</code>, features.sorting=<code>{String(config.features.sorting)}</code>
    </p>
  )
}

function DefaultsTable(): ReactNode {
  // No TableProvider ancestor, no instance config -- resolves to pure Layer 1 (defaults).
  const store = useMemo(() => createMemoryStateStore(), [])
  const { table, config } = useTableCraft({ data: people, columns, store })

  return (
    <div>
      <h4>1. Defaults (no provider, no instance config)</h4>
      <TableCard
        table={table}
        sortable={config.features.sorting}
        footer={
          <>
            <PaginationFooter table={table} />
            <ConfigReadout config={config} />
          </>
        }
      />
    </div>
  )
}

function ProviderOnlyTable(): ReactNode {
  // useTableCraft does seed a default store's page size from config.pagination.defaultPageSize
  // -- but only when no explicit `store` is passed. This table needs its own explicit store
  // anyway (so it and InstanceOverrideTable can show two different current page sizes at
  // once), so we still match the provider's defaultPageSize (3) here by hand.
  const store = useMemo(() => createMemoryStateStore({ pagination: { pageIndex: 0, pageSize: 3 } }), [])
  const { table, config } = useTableCraft({ data: people, columns, store })

  return (
    <div>
      <h4>2. Provider override (Layer 2)</h4>
      <TableCard
        table={table}
        sortable={config.features.sorting}
        footer={
          <>
            <PaginationFooter table={table} />
            <ConfigReadout config={config} />
          </>
        }
      />
    </div>
  )
}

function InstanceOverrideTable(): ReactNode {
  const store = useMemo(() => createMemoryStateStore({ pagination: { pageIndex: 0, pageSize: 6 } }), [])
  const { table, config } = useTableCraft({
    data: people,
    columns,
    store,
    config: { pagination: { defaultPageSize: 6 } }
  })

  return (
    <div>
      <h4>3. Instance override on top of the same provider (Layer 3)</h4>
      <TableCard
        table={table}
        sortable={config.features.sorting}
        footer={
          <>
            <PaginationFooter table={table} />
            <ConfigReadout config={config} />
          </>
        }
      />
    </div>
  )
}

export default function ConfigCascadeExample(): ReactNode {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <DefaultsTable />

      <TableProvider
        config={{ pagination: { pageSizeOptions: [3, 6, 9], defaultPageSize: 3 }, features: { sorting: false } }}
      >
        <ProviderOnlyTable />
        <InstanceOverrideTable />
      </TableProvider>
    </div>
  )
}

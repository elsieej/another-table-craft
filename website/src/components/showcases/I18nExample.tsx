import { useMemo, type ReactNode } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import {
  createMemoryStateStore,
  TableProvider,
  useTableConfig,
  useTableCraft,
  useTableTranslations,
  type TableConfigInput
} from 'another-table-craft'
import { people, type Person } from '../../data/people'
import { SortableDataTable } from './SortableDataTable'

const columns: ColumnDef<Person>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'role', header: 'Role' }
]

const ES_TRANSLATIONS: Record<string, string> = {
  search: 'Buscar',
  previous: 'Anterior',
  next: 'Siguiente'
}

function translateEs(key: string): string {
  return ES_TRANSLATIONS[key] ?? key
}

const ES_PROVIDER_CONFIG: TableConfigInput = { i18n: { locale: 'es', translationFn: translateEs } }
const RTL_PROVIDER_CONFIG: TableConfigInput = { i18n: { direction: 'rtl' } }

function TranslatedTable(): ReactNode {
  // useTableTranslations reads config via TableProvider's own context, so this only sees
  // ES_PROVIDER_CONFIG's translationFn because it's set at the provider layer, not passed
  // as instance config directly to useTableCraft below (see this page's own known-limitation
  // note on why instance-level config isn't visible to sibling hooks like this one).
  const t = useTableTranslations()
  const store = useMemo(() => createMemoryStateStore(), [])
  const { table, state, setGlobalFilter } = useTableCraft({ data: people, columns, store })

  return (
    <div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: 8, padding: '1rem' }}>
      <input
        type='text'
        placeholder={t('search')}
        aria-label={t('search')}
        value={state.globalFilter}
        onChange={(event) => setGlobalFilter(event.target.value)}
        style={{ marginBottom: '1rem', padding: '0.4rem', width: '100%', boxSizing: 'border-box' }}
      />
      <SortableDataTable table={table} />
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginTop: '1rem' }}>
        <button
          className='button button--sm button--outline button--primary'
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {t('previous')}
        </button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <button
          className='button button--sm button--outline button--primary'
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {t('next')}
        </button>
      </div>
    </div>
  )
}

function RtlTable(): ReactNode {
  const config = useTableConfig()
  const dir = config.i18n.direction === 'auto' ? undefined : config.i18n.direction
  const store = useMemo(() => createMemoryStateStore(), [])
  const { table } = useTableCraft({ data: people, columns, store })

  return (
    <div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: 8, padding: '1rem' }}>
      {/* Column headers use the CSS logical `text-start` property (not `text-left`), so this
          `dir` is what actually flips the alignment -- that's the whole point of this demo. */}
      <SortableDataTable table={table} sortable={false} dir={dir} />
    </div>
  )
}

export default function I18nExample(): ReactNode {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h4>Custom translationFn (locale: es)</h4>
        <TableProvider config={ES_PROVIDER_CONFIG}>
          <TranslatedTable />
        </TableProvider>
      </div>

      <div>
        <h4>direction: 'rtl'</h4>
        <TableProvider config={RTL_PROVIDER_CONFIG}>
          <RtlTable />
        </TableProvider>
      </div>
    </div>
  )
}

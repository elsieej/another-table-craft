// Headless core
export { useTableCraft } from './hooks/use-table-craft'
export { createUrlStateStore } from './core/stores/url-store'
export { createMemoryStateStore } from './core/stores/memory-store'
export { useDebounce } from './hooks/use-debounce'
export {
  createDelimited,
  dotSeparated,
  commaSeparated,
  pipeSeparated,
  multiKey
} from './core/serializers/filter-serializers'

// Config cascade
export {
  DEFAULT_TABLE_CONFIG,
  deepMergeConfig,
  createTableConfig,
  TableProvider,
  useGlobalTableConfig,
  useResolvedTableConfig,
  useTableConfig
} from './config'

// Hooks
export { useTableTranslations } from './hooks/use-table-translations'

// Lib
export { cn } from './lib/utils'
export { createCsvConfig, exportSelectedRowsCsv } from './lib/csv-export'

// Composed presentation layer, built on the UI primitives below.
export { DataTable } from './components/data-table'
export type { DataTableProps } from './components/data-table'
export { DataTablePagination } from './components/data-table-pagination'
export type { DataTablePaginationProps } from './components/data-table-pagination'

// UI primitives (Base UI + Tailwind) used internally by DataTable / DataTablePagination.
// Pair with the `./styles.css` export.
export { Button, buttonVariants } from './components/ui/button'
export { Separator } from './components/ui/separator'
export { ViewToggle } from './components/ui/view-toggle'
export type { ViewToggleOption, ViewToggleProps } from './components/ui/view-toggle'
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem
} from './components/ui/select'
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption
} from './components/ui/table'

// Types
export type {
  Option,
  DataTableSearchableColumn,
  DataTableQuerySearchable,
  DataTableFilterableColumn,
  DataTableFilterOption,
  FilterSerializer,
  SerializedResult,
  DeepPartial,
  TableFeatureFlags,
  TablePaginationConfig,
  TableSearchConfig,
  TableFilterConfig,
  TableI18nConfig,
  TablePerformanceConfig,
  TableEnterpriseConfig,
  TableDevConfig,
  TablePlugin,
  TableConfig,
  TableConfigInput,
  PaginationMeta,
  PaginationLinks,
  Pagination,
  BackendPagination,
  CursorPaginationInfo,
  CursorPaginationData,
  FilterOptions,
  TableStateSnapshot,
  TableStatePatch,
  TableStateStore,
  TableStateStoreSetOptions,
  UrlStateStoreParamNames,
  UrlStateStoreOptions,
  UseTableCraftOptions,
  UseTableCraftResult
} from './types'
export { DEFAULT_TABLE_STATE, mergeTableState, resetPageIndex } from './types/table-state'

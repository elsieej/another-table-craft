import type { FilterSerializer } from './table'
import type { TableStateStore } from '../core/table-state-store'

/** Deep-partial helper: makes every property (and nested property) optional. */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[] ? U[] : T[P] extends object ? DeepPartial<T[P]> : T[P]
}

/** Feature flags controlling which UI elements are rendered. */
export interface TableFeatureFlags {
  /** Show search inputs. */
  search: boolean
  /** Show filter dropdowns. */
  filter: boolean
  /** Show pagination controls. */
  pagination: boolean
  /** Show column visibility toggle. */
  columnVisibility: boolean
  /** Show CSV export button. */
  csvExport: boolean
  /** Enable row selection checkboxes. */
  rowSelection: boolean
  /** Show table/card view toggle. */
  viewToggle: boolean
  /** Initial view mode when viewToggle is enabled. Defaults to 'table'. */
  defaultViewMode: 'table' | 'cards'
  /** Show floating action bar for selected rows. */
  floatingBar: boolean
  /** Enable advanced filter builder UI. */
  advancedFilter: boolean
  /** Enable column sorting. */
  sorting: boolean
}

/** Pagination configuration. */
export interface TablePaginationConfig {
  /** Available page size options in the dropdown. */
  pageSizeOptions: number[]
  /** Default number of rows per page. */
  defaultPageSize: number
}

/** Search configuration. */
export interface TableSearchConfig {
  /** Debounce delay in milliseconds for search input. */
  debounceMs: number
  /** Minimum number of characters before search triggers. */
  minSearchLength: number
}

/** Filter configuration (URL serialization for filterable columns). */
export interface TableFilterConfig {
  /** Default serializer for filter array values. Used when column has no serializer override. */
  defaultSerializer: FilterSerializer
}

/** Internationalization configuration. */
export interface TableI18nConfig {
  /** Current locale string (e.g. 'en', 'ar'). */
  locale: string
  /** Text direction: 'ltr', 'rtl', or 'auto' (derived from locale). */
  direction: 'ltr' | 'rtl' | 'auto'
  /** Custom translation function. When provided, used for all UI strings. */
  translationFn?: (key: string) => string
  /** Translation namespace (for organizational purposes). */
  namespace: string
}

/** Performance tuning configuration. */
export interface TablePerformanceConfig {
  /** Memoization strategy: 'smart' (default), 'aggressive', or 'manual'. */
  memoStrategy: 'smart' | 'aggressive' | 'manual'
  /** Number of extra rows rendered above/below the visible area for virtualization. */
  virtualizationOverscan: number
  /** Whether to batch state updates. */
  batchUpdates: boolean
}

/** Enterprise-grade configuration. */
export interface TableEnterpriseConfig {
  /** Enforce strict ARIA compliance. */
  strictAccessibility: boolean
  /** Wrap table in error boundary for graceful recovery. */
  errorRecovery: boolean
  /** Enable debug mode with extra logging. */
  debugMode: boolean
}

/** Developer experience configuration (dev-only). */
export interface TableDevConfig {
  /** Show console warnings for misconfigurations. */
  warnings: boolean
  /** Show performance optimization hints. */
  performanceHints: boolean
  /** Threshold in ms for flagging slow renders. */
  renderCostThresholdMs: number
}

/** Plugin interface for extending table config. */
export interface TablePlugin {
  /** Unique plugin name. */
  name: string
  /** Merge priority (lower = applied first). */
  priority: number
  /** Partial config to deep-merge. */
  config: DeepPartial<TableConfig>
  /** Callback invoked after config resolution. */
  onResolve?: (resolvedConfig: TableConfig) => void
}

/** Root config interface — the fully resolved config shape. */
export interface TableConfig {
  features: TableFeatureFlags
  pagination: TablePaginationConfig
  search: TableSearchConfig
  filter: TableFilterConfig
  i18n: TableI18nConfig
  performance: TablePerformanceConfig
  enterprise: TableEnterpriseConfig
  dev: TableDevConfig
  plugins: TablePlugin[]
  /**
   * Optional state-storage backend for table state (pagination/sorting/filters/etc).
   * Left `undefined` here deliberately — `useTableCraft` resolves a per-instance default
   * (a URL-backed store in the browser, an in-memory store during SSR) lazily, rather than
   * baking a single shared, `window`-touching store instance into this frozen static config.
   * Set explicitly to opt into a specific store, or to `createMemoryStateStore()` to opt out
   * of URL sync entirely.
   */
  store?: TableStateStore
}

/** What consumers pass — everything optional via DeepPartial. */
export type TableConfigInput = DeepPartial<TableConfig>

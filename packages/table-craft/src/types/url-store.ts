import type { FilterSerializer } from './table'

export interface UrlStateStoreParamNames {
  page?: string
  pageSize?: string
  sort?: string
  globalFilter?: string
  viewMode?: string
  hiddenColumns?: string
}

export interface UrlStateStoreOptions {
  /** Override the default query-param names. */
  paramNames?: UrlStateStoreParamNames
  /** Per-column-id serializer override for `columnFilters` values. */
  filterSerializers?: Record<string, FilterSerializer>
  /** Serializer used for columns with no per-column override. Defaults to `dotSeparated`. */
  defaultSerializer?: FilterSerializer
  /** Used to omit `pageSize` from the URL when it equals the default, and to parse when absent. */
  defaultPageSize?: number
  /** `'replace'` (default, matches most table UX) or `'push'` to add a history entry per change. */
  history?: 'push' | 'replace'
  /** Debounces only the URL *write*; `getSnapshot` reflects changes immediately. Default 300ms. */
  debounceMs?: number
}

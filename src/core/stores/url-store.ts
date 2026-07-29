import type { TableStateStore } from '../table-state-store'
import type { TableStateSnapshot } from '../../types/table-state'
import { DEFAULT_TABLE_STATE, mergeTableState, resetPageIndex } from '../../types/table-state'
import type { FilterSerializer } from '../../types/table'
import { dotSeparated } from '../serializers/filter-serializers'

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

const DEFAULT_PARAM_NAMES: Required<UrlStateStoreParamNames> = {
  page: 'page',
  pageSize: 'per_page',
  sort: 'sort',
  globalFilter: 'q',
  viewMode: 'view',
  hiddenColumns: 'hidden'
}

function resolveSerializer(columnId: string, options: UrlStateStoreOptions): FilterSerializer {
  return options.filterSerializers?.[columnId] ?? options.defaultSerializer ?? dotSeparated
}

function snapshotToParams(snapshot: TableStateSnapshot, options: UrlStateStoreOptions): URLSearchParams {
  const names = { ...DEFAULT_PARAM_NAMES, ...options.paramNames }
  const defaultPageSize = options.defaultPageSize ?? DEFAULT_TABLE_STATE.pagination.pageSize
  const params = new URLSearchParams()

  if (snapshot.pagination.pageIndex > 0) {
    params.set(names.page, String(snapshot.pagination.pageIndex + 1))
  }
  if (snapshot.pagination.pageSize !== defaultPageSize) {
    params.set(names.pageSize, String(snapshot.pagination.pageSize))
  }
  if (snapshot.sorting.length > 0) {
    params.set(names.sort, snapshot.sorting.map((s) => `${s.desc ? '-' : ''}${s.id}`).join(','))
  }
  if (snapshot.globalFilter) {
    params.set(names.globalFilter, snapshot.globalFilter)
  }
  if (snapshot.viewMode) {
    params.set(names.viewMode, snapshot.viewMode)
  }
  const hidden = Object.entries(snapshot.columnVisibility)
    .filter(([, visible]) => visible === false)
    .map(([id]) => id)
  if (hidden.length > 0) {
    params.set(names.hiddenColumns, hidden.join(','))
  }

  for (const filter of snapshot.columnFilters) {
    const serializer = resolveSerializer(filter.id, options)
    const values = Array.isArray(filter.value) ? filter.value.map(String) : [String(filter.value)]
    const result = serializer.serialize(values)
    if (result.type === 'single') {
      if (result.value) params.set(filter.id, result.value)
    } else {
      for (const value of result.values) params.append(filter.id, value)
    }
  }

  return params
}

function paramsToSnapshot(params: URLSearchParams, options: UrlStateStoreOptions): TableStateSnapshot {
  const names = { ...DEFAULT_PARAM_NAMES, ...options.paramNames }
  const reserved = new Set(Object.values(names))
  const defaultPageSize = options.defaultPageSize ?? DEFAULT_TABLE_STATE.pagination.pageSize

  const pageRaw = params.get(names.page)
  const pageIndex = pageRaw ? Math.max(0, parseInt(pageRaw, 10) - 1) : 0

  const pageSizeRaw = params.get(names.pageSize)
  const parsedPageSize = pageSizeRaw ? parseInt(pageSizeRaw, 10) : NaN
  const pageSize = Number.isFinite(parsedPageSize) && parsedPageSize > 0 ? parsedPageSize : defaultPageSize

  const sortRaw = params.get(names.sort)
  const sorting = sortRaw
    ? sortRaw
        .split(',')
        .filter(Boolean)
        .map((token) => (token.startsWith('-') ? { id: token.slice(1), desc: true } : { id: token, desc: false }))
    : []

  const globalFilter = params.get(names.globalFilter) ?? ''
  const viewMode = params.get(names.viewMode)

  const columnVisibility: Record<string, boolean> = {}
  const hiddenRaw = params.get(names.hiddenColumns)
  if (hiddenRaw) {
    for (const id of hiddenRaw.split(',').filter(Boolean)) columnVisibility[id] = false
  }

  const columnFilters: TableStateSnapshot['columnFilters'] = []
  const seen = new Set<string>()
  for (const key of params.keys()) {
    if (reserved.has(key) || seen.has(key)) continue
    seen.add(key)
    const serializer = resolveSerializer(key, options)
    const values = serializer.parse(params.get(key), params.getAll(key))
    if (values.length > 0) {
      columnFilters.push({ id: key, value: values.length === 1 ? values[0] : values })
    }
  }

  return { pagination: { pageIndex, pageSize }, sorting, columnFilters, globalFilter, columnVisibility, viewMode }
}

/**
 * Zero-dependency URL-backed `TableStateStore`, built on the native History API and
 * `URLSearchParams`. This is the default store `useTableCraft` reaches for in the
 * browser — the mechanism that makes query-param state a zero-config default rather
 * than an adapter a consumer has to write themselves.
 *
 * Two correctness properties this implementation depends on (each covered by a unit test):
 *
 * 1. `getSnapshot` referential stability — `useSyncExternalStore` requires `getSnapshot`
 *    to return the SAME object when nothing changed, or React warns / loops. We cache the
 *    last raw `location.search` alongside the last parsed snapshot and only re-parse when
 *    the raw string actually differs.
 * 2. `pushState`/`replaceState` do not fire `popstate` — so after a write this store
 *    performs itself, it notifies its own subscribers directly; the real `popstate`
 *    listener stays registered only to catch external navigation (back/forward).
 */
export function createUrlStateStore(options: UrlStateStoreOptions = {}): TableStateStore {
  const historyMethod = options.history === 'push' ? 'pushState' : 'replaceState'
  const debounceMs = options.debounceMs ?? 300

  const listeners = new Set<() => void>()
  let cachedSearch: string | null = null
  let cachedSnapshot: TableStateSnapshot | null = null
  let writeTimer: ReturnType<typeof setTimeout> | undefined

  function isBrowser(): boolean {
    return typeof window !== 'undefined'
  }

  function readFromLocation(): TableStateSnapshot {
    const search = window.location.search
    if (cachedSnapshot !== null && search === cachedSearch) return cachedSnapshot
    cachedSearch = search
    cachedSnapshot = paramsToSnapshot(new URLSearchParams(search), options)
    return cachedSnapshot
  }

  function notify(): void {
    listeners.forEach((listener) => listener())
  }

  function commitToUrl(snapshot: TableStateSnapshot): void {
    const query = snapshotToParams(snapshot, options).toString()
    const url = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`
    window.history[historyMethod](window.history.state, '', url)
    cachedSearch = query ? `?${query}` : ''
  }

  function handlePopState(): void {
    notify()
  }

  return {
    getSnapshot() {
      if (!isBrowser()) return DEFAULT_TABLE_STATE
      return readFromLocation()
    },
    getServerSnapshot() {
      return DEFAULT_TABLE_STATE
    },
    subscribe(onStoreChange) {
      listeners.add(onStoreChange)
      if (isBrowser() && listeners.size === 1) {
        window.addEventListener('popstate', handlePopState)
      }
      return () => {
        listeners.delete(onStoreChange)
        if (isBrowser() && listeners.size === 0) {
          window.removeEventListener('popstate', handlePopState)
        }
      }
    },
    setState(partial, setOptions) {
      if (!isBrowser()) return
      const base = readFromLocation()
      let next = mergeTableState(base, partial)
      if (setOptions?.resetPage) next = resetPageIndex(next)
      cachedSnapshot = next
      notify()
      if (writeTimer) clearTimeout(writeTimer)
      writeTimer = setTimeout(() => commitToUrl(next), debounceMs)
    },
    reset(keys) {
      if (!isBrowser()) return
      const base = readFromLocation()
      const next =
        keys && keys.length > 0
          ? { ...base, ...Object.fromEntries(keys.map((key) => [key, DEFAULT_TABLE_STATE[key]])) }
          : DEFAULT_TABLE_STATE
      cachedSnapshot = next
      notify()
      if (writeTimer) clearTimeout(writeTimer)
      commitToUrl(next)
    }
  }
}

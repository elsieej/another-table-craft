import type { TableStateSnapshot, TableStatePatch } from '../types/table-state'

export interface TableStateStoreSetOptions {
  /** Forces `pagination.pageIndex` back to 0 — pass whenever filters/sorting/search change. */
  resetPage?: boolean
}

/**
 * Pluggable state-storage interface for `useTableCraft`, modeled on
 * `useSyncExternalStore`'s own contract so any implementation (URL, memory,
 * Zustand, Jotai, ...) plugs straight into React without an adapter shim.
 *
 * `getSnapshot` MUST return a referentially-identical value when nothing changed —
 * see `createUrlStateStore`'s doc comment for why this matters.
 */
export interface TableStateStore {
  getSnapshot(): TableStateSnapshot
  /** For SSR: a snapshot usable during server render / hydration. */
  getServerSnapshot?(): TableStateSnapshot
  subscribe(onStoreChange: () => void): () => void
  setState(partial: TableStatePatch, options?: TableStateStoreSetOptions): void
  reset?(keys?: (keyof TableStateSnapshot)[]): void
}

export type { TableStateSnapshot, TableStatePatch }

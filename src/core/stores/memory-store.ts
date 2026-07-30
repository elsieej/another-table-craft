import type { TableStateStore } from '../../types/table-state-store'
import type { TableStateSnapshot } from '../../types/table-state'
import { DEFAULT_TABLE_STATE, mergeTableState, resetPageIndex } from '../../types/table-state'

/**
 * Plain in-memory store — no `window` access at all. Doubles as:
 * - the explicit "no URL sync" opt-out for consumers who want a table with no
 *   query-param behavior at all, and
 * - the SSR-safe fallback `useTableCraft` reaches for when `window` is unavailable.
 */
export function createMemoryStateStore(initial?: Partial<TableStateSnapshot>): TableStateStore {
  let snapshot: TableStateSnapshot = initial ? mergeTableState(DEFAULT_TABLE_STATE, initial) : DEFAULT_TABLE_STATE
  const listeners = new Set<() => void>()

  function notify(): void {
    listeners.forEach((listener) => listener())
  }

  return {
    getSnapshot() {
      return snapshot
    },
    getServerSnapshot() {
      return snapshot
    },
    subscribe(onStoreChange) {
      listeners.add(onStoreChange)
      return () => listeners.delete(onStoreChange)
    },
    setState(partial, options) {
      let next = mergeTableState(snapshot, partial)
      if (options?.resetPage) next = resetPageIndex(next)
      snapshot = next
      notify()
    },
    reset(keys) {
      if (keys && keys.length > 0) {
        const patch = Object.fromEntries(keys.map((key) => [key, DEFAULT_TABLE_STATE[key]]))
        snapshot = { ...snapshot, ...patch }
      } else {
        snapshot = DEFAULT_TABLE_STATE
      }
      notify()
    }
  }
}

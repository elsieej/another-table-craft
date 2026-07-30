import { useSyncExternalStore } from 'react'

const POLL_MS = 150

/**
 * The URL store commits its write asynchronously (debounced, via pushState/replaceState,
 * which fire no event of their own) -- polling location.search is the simplest way to
 * reactively reflect the *actually-committed* URL, matching what a real reload would see.
 */
export function useLiveLocationSearch(): string {
  return useSyncExternalStore(
    (onStoreChange) => {
      const id = setInterval(onStoreChange, POLL_MS)
      return () => clearInterval(id)
    },
    () => (typeof window !== 'undefined' ? window.location.search : ''),
    () => ''
  )
}

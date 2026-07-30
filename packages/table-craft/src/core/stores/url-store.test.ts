import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createUrlStateStore } from './url-store'
import { DEFAULT_TABLE_STATE } from '../../types/table-state'

function resetLocation() {
  window.history.replaceState({}, '', '/')
}

describe('createUrlStateStore', () => {
  beforeEach(() => {
    resetLocation()
  })

  afterEach(() => {
    vi.useRealTimers()
    resetLocation()
  })

  it('returns the default snapshot for a URL with no query params', () => {
    const store = createUrlStateStore()
    expect(store.getSnapshot()).toEqual(DEFAULT_TABLE_STATE)
  })

  it('getSnapshot is referentially stable across calls with no intervening navigation', () => {
    const store = createUrlStateStore()
    const first = store.getSnapshot()
    const second = store.getSnapshot()
    expect(first).toBe(second)
  })

  it('parses an existing URL into a snapshot on read', () => {
    window.history.replaceState({}, '', '/?page=3&per_page=25&sort=-name&q=hello&view=cards')
    const store = createUrlStateStore()
    const snapshot = store.getSnapshot()

    expect(snapshot.pagination).toEqual({ pageIndex: 2, pageSize: 25 })
    expect(snapshot.sorting).toEqual([{ id: 'name', desc: true }])
    expect(snapshot.globalFilter).toBe('hello')
    expect(snapshot.viewMode).toBe('cards')
  })

  it('treats unrecognized params as column filters', () => {
    window.history.replaceState({}, '', '/?status=active.pending')
    const store = createUrlStateStore()
    expect(store.getSnapshot().columnFilters).toEqual([{ id: 'status', value: ['active', 'pending'] }])
  })

  it('notifies subscribers synchronously on setState, without a real popstate event', () => {
    vi.useFakeTimers()
    const store = createUrlStateStore()
    const listener = vi.fn()
    store.subscribe(listener)
    const popstateListener = vi.fn()
    window.addEventListener('popstate', popstateListener)

    store.setState({ globalFilter: 'abc' })

    expect(listener).toHaveBeenCalledTimes(1)
    expect(popstateListener).not.toHaveBeenCalled()
    expect(store.getSnapshot().globalFilter).toBe('abc')
    window.removeEventListener('popstate', popstateListener)
  })

  it('debounces the actual URL write but reflects the change in getSnapshot immediately', () => {
    vi.useFakeTimers()
    const store = createUrlStateStore({ debounceMs: 300 })

    store.setState({ globalFilter: 'abc' })
    expect(store.getSnapshot().globalFilter).toBe('abc')
    // URL not committed yet
    expect(window.location.search).toBe('')

    vi.advanceTimersByTime(300)
    expect(window.location.search).toContain('q=abc')
  })

  it('resets pageIndex to 0 when resetPage is passed', () => {
    vi.useFakeTimers()
    const store = createUrlStateStore()
    store.setState({ pagination: { pageIndex: 4, pageSize: 10 } })
    expect(store.getSnapshot().pagination.pageIndex).toBe(4)

    store.setState({ globalFilter: 'x' }, { resetPage: true })
    expect(store.getSnapshot().pagination.pageIndex).toBe(0)
  })

  it('round-trips pagination/sorting/filters through the URL', () => {
    vi.useFakeTimers()
    const store = createUrlStateStore()

    store.setState({
      pagination: { pageIndex: 2, pageSize: 25 },
      sorting: [{ id: 'createdAt', desc: true }],
      columnFilters: [{ id: 'status', value: ['active', 'pending'] }],
      globalFilter: 'hello',
      viewMode: 'cards'
    })
    vi.advanceTimersByTime(300)

    const reparsed = createUrlStateStore().getSnapshot()
    expect(reparsed.pagination).toEqual({ pageIndex: 2, pageSize: 25 })
    expect(reparsed.sorting).toEqual([{ id: 'createdAt', desc: true }])
    expect(reparsed.columnFilters).toEqual([{ id: 'status', value: ['active', 'pending'] }])
    expect(reparsed.globalFilter).toBe('hello')
    expect(reparsed.viewMode).toBe('cards')
  })

  it('re-parses and notifies on a real popstate (external navigation)', () => {
    const store = createUrlStateStore()
    const listener = vi.fn()
    store.subscribe(listener)

    window.history.pushState({}, '', '/?q=external')
    window.dispatchEvent(new PopStateEvent('popstate'))

    expect(listener).toHaveBeenCalledTimes(1)
    expect(store.getSnapshot().globalFilter).toBe('external')
  })
})

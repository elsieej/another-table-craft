import { describe, expect, it, vi } from 'vitest'
import { createMemoryStateStore } from './memory-store'
import { DEFAULT_TABLE_STATE } from '../../types/table-state'

describe('createMemoryStateStore', () => {
  it('returns the default snapshot when created with no initial state', () => {
    const store = createMemoryStateStore()
    expect(store.getSnapshot()).toEqual(DEFAULT_TABLE_STATE)
  })

  it('merges initial state over the defaults', () => {
    const store = createMemoryStateStore({ globalFilter: 'hello' })
    expect(store.getSnapshot().globalFilter).toBe('hello')
    expect(store.getSnapshot().pagination).toEqual(DEFAULT_TABLE_STATE.pagination)
  })

  it('notifies subscribers synchronously on setState', () => {
    const store = createMemoryStateStore()
    const listener = vi.fn()
    store.subscribe(listener)

    store.setState({ globalFilter: 'abc' })

    expect(listener).toHaveBeenCalledTimes(1)
    expect(store.getSnapshot().globalFilter).toBe('abc')
  })

  it('resets pageIndex to 0 when resetPage is passed', () => {
    const store = createMemoryStateStore()
    store.setState({ pagination: { pageIndex: 3, pageSize: 10 } })
    expect(store.getSnapshot().pagination.pageIndex).toBe(3)

    store.setState({ globalFilter: 'x' }, { resetPage: true })
    expect(store.getSnapshot().pagination.pageIndex).toBe(0)
  })

  it('stops notifying after unsubscribe', () => {
    const store = createMemoryStateStore()
    const listener = vi.fn()
    const unsubscribe = store.subscribe(listener)
    unsubscribe()

    store.setState({ globalFilter: 'x' })

    expect(listener).not.toHaveBeenCalled()
  })

  it('reset() restores full defaults, or only the given keys', () => {
    const store = createMemoryStateStore()
    store.setState({ globalFilter: 'x', viewMode: 'cards' })

    store.reset?.(['globalFilter'])
    expect(store.getSnapshot().globalFilter).toBe('')
    expect(store.getSnapshot().viewMode).toBe('cards')

    store.reset?.()
    expect(store.getSnapshot()).toEqual(DEFAULT_TABLE_STATE)
  })
})

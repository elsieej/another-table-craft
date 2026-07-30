import { afterEach, describe, expect, it, vi } from 'vitest'
import { logger } from './logger'

describe('logger', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it.each(['log', 'info', 'warn', 'error', 'debug'] as const)(
    '%s prefixes output with [another-table-craft] and forwards to console.%s',
    (method) => {
      const spy = vi.spyOn(console, method).mockImplementation(() => {})

      logger[method]('something happened', { detail: 1 })

      expect(spy).toHaveBeenCalledWith('[another-table-craft]', 'something happened', { detail: 1 })
    }
  )
})

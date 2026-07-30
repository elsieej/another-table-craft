'use client'

import { useMemo } from 'react'
import type { TableConfig } from '../types/table-config'
import { useGlobalTableConfig } from '../config/context'

/**
 * Consumer hook for reading the resolved table config.
 *
 * Overloaded:
 * - `useTableConfig()` — returns the full config object
 * - `useTableConfig(selector)` — returns a derived slice (prevents unnecessary re-renders)
 *
 * Returns the global/provider config (Layers 1+2) — a `useTableCraft` call's own
 * instance/plugin overrides (Layers 3+4) aren't visible here; read `config` from that call's
 * own return value instead if you need the fully-resolved result inside its render tree.
 */
export function useTableConfig(): TableConfig
export function useTableConfig<T>(selector: (config: TableConfig) => T): T
export function useTableConfig<T>(selector?: (config: TableConfig) => T): TableConfig | T {
  const config = useGlobalTableConfig()

  return useMemo(() => {
    if (selector) return selector(config)
    return config
  }, [config, selector])
}

import type { ReactNode } from 'react'
import type { TableConfig, TableConfigInput } from '../types/table-config'
import { ResolvedTableConfigContext, TableProvider } from './context'

export function withTableProviderConfig(config: TableConfigInput) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <TableProvider config={config}>{children}</TableProvider>
  }
}

export function withResolvedConfig(resolvedConfig: TableConfig) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <ResolvedTableConfigContext.Provider value={resolvedConfig}>{children}</ResolvedTableConfigContext.Provider>
  }
}

/**
 * Nests a real TableProvider (layer 2) beneath a ResolvedTableConfigContext value (the
 * fully-resolved config a useTableCraft tree would provide) — for proving the
 * resolved-context value wins over an *actual* provider value on a conflicting field,
 * not just over the untouched core defaults.
 */
export function withProviderAndResolvedConfig(providerConfig: TableConfigInput, resolvedConfig: TableConfig) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <TableProvider config={providerConfig}>
        <ResolvedTableConfigContext.Provider value={resolvedConfig}>{children}</ResolvedTableConfigContext.Provider>
      </TableProvider>
    )
  }
}

import type { ReactNode } from 'react'
import type { TableConfigInput } from '../types/table-config'
import { TableProvider } from './context'

export function withTableProviderConfig(config: TableConfigInput) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <TableProvider config={config}>{children}</TableProvider>
  }
}

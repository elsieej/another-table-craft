export { DEFAULT_TABLE_CONFIG } from './defaults'
export { deepMergeConfig } from './merge'
export { createTableConfig } from './create-config'
export { TableProvider, useGlobalTableConfig } from './context'
export { useResolvedTableConfig } from '../hooks/use-resolved-config'
export { useTableConfig } from '../hooks/use-table-config'

export type {
  TableConfig,
  TableConfigInput,
  TableFeatureFlags,
  TableFilterConfig,
  TablePaginationConfig,
  TableSearchConfig,
  TableI18nConfig,
  TablePerformanceConfig,
  TableEnterpriseConfig,
  TableDevConfig,
  TablePlugin,
  DeepPartial
} from '../types/table-config'

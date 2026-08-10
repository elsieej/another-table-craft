// Headless core
export { useTableCraft } from './hooks/use-table-craft'
export { createUrlStateStore } from './core/stores/url-store'
export { createMemoryStateStore } from './core/stores/memory-store'
export { useDebounce } from './hooks/use-debounce'
export {
  createDelimited,
  dotSeparated,
  commaSeparated,
  pipeSeparated,
  multiKey
} from './core/serializers/filter-serializers'

// Config cascade
export {
  DEFAULT_TABLE_CONFIG,
  deepMergeConfig,
  createTableConfig,
  TableProvider,
  useGlobalTableConfig,
  useResolvedTableConfig,
  useTableConfig
} from './config'

// Hooks
export { useTableTranslations } from './hooks/use-table-translations'

// Lib
export { cn } from './lib/utils'
export { createCsvConfig, exportSelectedRowsCsv } from './lib/csv-export'

// Composed presentation layer, built on the UI primitives below.
export { DataTable } from './components/data-table'
export type { DataTableProps } from './components/data-table'
export { DataTablePagination } from './components/data-table-pagination'
export type { DataTablePaginationProps } from './components/data-table-pagination'

// UI primitives (Base UI + Tailwind). Pair with the `./styles.css` export.
export { Badge, badgeVariants } from './components/ui/badge'
export { Button, buttonVariants } from './components/ui/button'
export { Calendar } from './components/ui/calendar'
export { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from './components/ui/card'
export { Checkbox } from './components/ui/checkbox'
export {
  Command,
  CommandInput,
  CommandList,
  CommandCollection,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandItem,
  CommandSeparator,
  CommandShortcut
} from './components/ui/command'
export {
  Drawer,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription
} from './components/ui/drawer'
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent
} from './components/ui/dropdown-menu'
export { Input } from './components/ui/input'
export { Label } from './components/ui/label'
export { Popover, PopoverTrigger, PopoverContent } from './components/ui/popover'
export { SearchInput } from './components/ui/search-input'
export type { SearchInputProps } from './components/ui/search-input'
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem
} from './components/ui/select'
export { Separator } from './components/ui/separator'
export { Skeleton } from './components/ui/skeleton'
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption
} from './components/ui/table'
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './components/ui/tooltip'

// Types
export type {
  Option,
  DataTableSearchableColumn,
  DataTableQuerySearchable,
  DataTableFilterableColumn,
  DataTableFilterOption,
  FilterSerializer,
  SerializedResult,
  DeepPartial,
  TableFeatureFlags,
  TablePaginationConfig,
  TableSearchConfig,
  TableFilterConfig,
  TableI18nConfig,
  TablePerformanceConfig,
  TableEnterpriseConfig,
  TableDevConfig,
  TablePlugin,
  TableConfig,
  TableConfigInput,
  PaginationMeta,
  PaginationLinks,
  Pagination,
  BackendPagination,
  CursorPaginationInfo,
  CursorPaginationData,
  FilterOptions,
  TableStateSnapshot,
  TableStatePatch,
  TableStateStore,
  TableStateStoreSetOptions,
  UrlStateStoreParamNames,
  UrlStateStoreOptions,
  UseTableCraftOptions,
  UseTableCraftResult
} from './types'
export { DEFAULT_TABLE_STATE, mergeTableState, resetPageIndex } from './types/table-state'

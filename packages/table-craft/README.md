# another-table-craft

A production-ready, SPA-first React data table system built on [TanStack Table](https://tanstack.com/table), with query-param state as a first-class default and [Base UI](https://base-ui.com/) presentation primitives.

## Features

- **Headless core** — `useTableCraft` owns the single `useReactTable()` call and exposes state + handlers, fully decoupled from any specific state-storage mechanism or presentation layer.
- **Query-param state by default** — a zero-dependency URL-backed store (`createUrlStateStore`) syncs pagination, sorting, filters, and view mode to the URL via the native History API, so table state survives a refresh or a shared link without any setup.
- **Config cascade** — a 4-layer config system (defaults → provider → instance → plugins) lets you set sane global defaults once and override them per table instance.
- **Presentation layer, opt-in** — `src/components/ui/` holds a full set of table-adjacent primitives (button, card, table, dialog-like drawer, dropdown menu, select, calendar, and more) built on Base UI + Tailwind, plus a small composed `DataTable`/`DataTablePagination` wired to `useTableCraft`'s own `table` instance. All of it is exported from the package root — see [Styled components](#styled-components) below. The headless core works with none of this; reach for it only if you also want this library's look and feel.

## Install

```bash
npm install another-table-craft @tanstack/react-table
```

`react` and `react-dom` (>=19) are peer dependencies.

## Quick start

```tsx
import { useTableCraft } from 'another-table-craft'
import { flexRender, type ColumnDef } from '@tanstack/react-table'

interface Person {
  id: string
  name: string
}

const columns: ColumnDef<Person>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Name' }
]

function PeopleTable({ data }: { data: Person[] }) {
  const { table } = useTableCraft({ data, columns })

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

By default, `useTableCraft` reads and writes pagination/sorting/filter state to the URL's query string in the browser (falling back to an in-memory store during SSR). Pass a `store` (e.g. `createMemoryStateStore()`) or fully controlled `state`/`onStateChange` to opt out.

## Styled components

The plain `<table>` above works, but the package also ships the Base UI + Tailwind components it's built with, wired to `useTableCraft`'s `table` instance:

```tsx
import { useTableCraft, DataTable, DataTablePagination } from 'another-table-craft'
// once, anywhere in your app
import 'another-table-craft/styles.css'
// Card isn't exported by the package — bring your own, or copy `src/components/ui/card.tsx`
// into your app (see "What's exported" below).
import { Card, CardFooter } from './components/ui/card'

function PeopleTable({ data }: { data: Person[] }) {
  const { table } = useTableCraft({ data, columns })

  return (
    <Card>
      <DataTable table={table} />
      <CardFooter>
        <DataTablePagination table={table} className='w-full' />
      </CardFooter>
    </Card>
  )
}
```

- `DataTable` renders sortable headers (pass `sortable={false}` to force plain, non-interactive headers) and rows from the `table` instance, with an empty-state row.
- `DataTablePagination` renders Previous/Next and a page-size `Select`, wired to the table's own `setPageSize`/`previousPage`/`nextPage`.
- Both are built from `Button`, `Table`, and `Select`, the only lower-level primitives the package exports from its root. Everything else under `src/components/ui/` (`Badge`, `Card`, `Checkbox`, `DropdownMenu`, `Popover`, `Tooltip`, `Skeleton`, `Separator`, `Label`, `Command`, `Calendar`, `Drawer`, ...) is a Base UI + Tailwind recipe you're meant to copy into your own app and adjust, not an exported dependency — the same idea as the shadcn CLI.
- Dark mode follows either a `.dark` class or a `data-theme="dark"` attribute on an ancestor element (e.g. `<html>`) — pick whichever your app already toggles.
- `another-table-craft/styles.css` is precompiled at publish time; it doesn't require Tailwind or PostCSS in the consuming app.

## Project structure

```
src/
├── index.ts          # Public package entry point
├── hooks/            # use-*.ts React hooks (useTableCraft, useTableConfig, useDebounce, ...)
├── core/             # Headless state-storage implementations and serializers
│   ├── stores/       # createUrlStateStore, createMemoryStateStore
│   └── serializers/  # Column-filter <-> query-string serializers
├── config/           # The 4-layer config cascade (defaults, provider, merge, dev warnings)
├── types/            # Shared TypeScript types, re-exported from types/index.ts
├── components/ui/    # Base UI-based presentation primitives
├── lib/              # Small standalone utilities (cn, CSV export, logger)
└── styles/           # Tailwind v4 theme tokens
```

## Contributing

Issues and feature requests are tracked as [GitHub issues](https://github.com/elsieej/another-table-craft/issues) on this repository. Pull requests are welcome — please make sure `npm run typecheck`, `npm test`, and `npm run lint` pass before opening one.

## License

[MIT](https://opensource.org/licenses/MIT)

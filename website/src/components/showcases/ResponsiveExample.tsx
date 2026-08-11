import { useMemo, useState, type ReactNode } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { Button, createMemoryStateStore, useTableCraft, ViewToggle } from 'another-table-craft'
import { FilterIcon, LayoutGridIcon, TableIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '../ui/drawer'
import { SearchInput } from '../ui/search-input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { people, type Person } from '../../data/people'
import { TableCard } from './TableCard'
import { PaginationFooter } from './PaginationFooter'

const columns: ColumnDef<Person>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' },
  { accessorKey: 'team', header: 'Team' }
]

// Frame widths, not real devices -- narrow enough that these four columns can't all fit, which is
// the point: the table doesn't reflow into cards or drop columns at small sizes, it scrolls.
const FRAMES = [
  { label: 'Mobile', width: 360 },
  { label: 'Tablet', width: 640 },
  { label: 'Desktop', width: undefined }
] as const

type View = 'Table' | 'Card'

export default function ResponsiveExample(): ReactNode {
  const [frame, setFrame] = useState<(typeof FRAMES)[number]>(FRAMES[0])
  const [view, setView] = useState<View>('Table')
  const store = useMemo(() => createMemoryStateStore({ pagination: { pageIndex: 0, pageSize: 5 } }), [])
  const { table, state, setGlobalFilter } = useTableCraft({ data: people, columns, store })

  const isMobile = frame.label === 'Mobile'
  // Only one filter exists on this page (the global search), so "active" is just "non-empty" --
  // a page with column filters too would sum however many of those are set as well.
  const activeFilterCount = state.globalFilter ? 1 : 0

  function renderSearchField(className?: string) {
    return (
      <SearchInput
        placeholder='Search all columns…'
        aria-label='Global filter'
        value={state.globalFilter}
        onChange={(event) => setGlobalFilter(event.target.value)}
        onClear={() => setGlobalFilter('')}
        className={className}
      />
    )
  }

  // Segmented Table/Cards control -- sits first on the toolbar's left side, with search (or, at
  // Mobile, the filter button) nested right next to it. The right side of the toolbar is left for
  // actual filter inputs (selects, date ranges, ...), same as the design system's toolbar layout;
  // this showcase only demonstrates the global search, so nothing occupies it here.
  const viewToggle = (
    <ViewToggle
      value={view}
      onValueChange={setView}
      options={[
        { value: 'Table', label: 'Table', icon: <TableIcon /> },
        { value: 'Card', label: 'Cards', icon: <LayoutGridIcon /> }
      ]}
    />
  )

  // At Mobile width there's no room for a full search field in the toolbar, so it collapses to a
  // single icon button instead -- a Badge shows how many filters are active (dot-on-icon is a
  // common pattern, but a number reads clearer once there's more than one filter to stack), a
  // Tooltip explains the icon on hover/focus, and the actual field moves into a Drawer opened by
  // that same button. Tablet/Desktop have room, so they just show the field inline, same as every
  // other showcase's toolbar.
  const filterButton = (
    <Drawer>
      <Tooltip>
        <TooltipTrigger
          render={
            <DrawerTrigger
              render={
                <Button type='button' variant='outline' size='icon' className='relative' aria-label='Open filters' />
              }
            />
          }
        >
          <FilterIcon className='size-4' />
          {activeFilterCount > 0 ? (
            // Inline style, not Tailwind classes, for the size/offset here: this site has no Tailwind
            // build of its own -- every utility class it uses comes from the package's precompiled
            // styles.css, which only contains classes that appear somewhere in the package's own
            // source (see the `@source` comment in packages/table-craft/src/styles/theme.css). A class
            // that exists only in this showcase file (like a one-off `-top-1.5` or `min-w-4`) silently
            // compiles to nothing.
            <span
              className='absolute flex items-center justify-center rounded-full bg-primary font-medium text-primary-foreground'
              style={{
                top: -6,
                right: -6,
                height: 16,
                minWidth: 16,
                padding: '0 4px',
                fontSize: 10,
                lineHeight: '16px'
              }}
            >
              {activeFilterCount}
            </span>
          ) : null}
        </TooltipTrigger>
        <TooltipContent>{activeFilterCount > 0 ? `${activeFilterCount} filter active` : 'Filters'}</TooltipContent>
      </Tooltip>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filters</DrawerTitle>
          <DrawerDescription>Search across every column.</DrawerDescription>
        </DrawerHeader>
        <div className='px-4 pb-4'>{renderSearchField('w-full')}</div>
        <DrawerFooter>
          <DrawerClose render={<Button variant='outline' />}>Done</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )

  const toolbar = isMobile ? (
    <div className='flex flex-wrap items-center justify-between gap-3'>
      {viewToggle}
      {filterButton}
    </div>
  ) : (
    <div className='flex flex-wrap items-center gap-3'>
      {viewToggle}
      {renderSearchField()}
    </div>
  )

  return (
    <TooltipProvider>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {FRAMES.map((candidate) => (
            <Button
              key={candidate.label}
              type='button'
              size='sm'
              variant={candidate.label === frame.label ? 'default' : 'outline'}
              onClick={() => setFrame(candidate)}
            >
              {candidate.label}
              {candidate.width ? ` (${candidate.width}px)` : ''}
            </Button>
          ))}
        </div>

        {/* This border is only here to make the chosen frame width visible on the page -- the
            scrolling behavior itself comes from Table's own wrapper (overflow-x-auto), which is
            exactly what a real narrow viewport gets too, framed or not. */}
        <div
          style={{
            width: frame.width,
            maxWidth: '100%',
            border: '1px dashed var(--ifm-color-emphasis-400)',
            borderRadius: 8,
            padding: 12
          }}
        >
          {view === 'Table' ? (
            <TableCard table={table} toolbar={toolbar} footer={<PaginationFooter table={table} />} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div className='rounded-[10px] border bg-card px-2 py-4'>{toolbar}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {table.getRowModel().rows.map((row) => (
                  <Card key={row.id}>
                    <CardHeader>
                      <CardTitle>{row.original.name}</CardTitle>
                      <CardDescription>{row.original.email}</CardDescription>
                    </CardHeader>
                    <CardContent className='flex flex-col gap-1'>
                      <div className='flex items-center justify-between text-[13px]'>
                        <span className='text-muted-foreground'>Role</span>
                        <span>{row.original.role}</span>
                      </div>
                      <div className='flex items-center justify-between text-[13px]'>
                        <span className='text-muted-foreground'>Team</span>
                        <span>{row.original.team}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className='rounded-[10px] border bg-card px-2 py-3'>
                <PaginationFooter table={table} />
              </div>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}

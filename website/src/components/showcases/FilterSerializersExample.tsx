import { useMemo, useState, type ReactNode } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import {
  Checkbox,
  commaSeparated,
  createDelimited,
  createUrlStateStore,
  dotSeparated,
  Label,
  multiKey,
  pipeSeparated,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useTableCraft,
  type FilterSerializer
} from 'another-table-craft'
import { people, type Person } from '../../data/people'
import { TableCard } from './TableCard'
import { PaginationFooter } from './PaginationFooter'
import { useLiveLocationSearch } from '../../hooks/useLiveLocationSearch'

const STRATEGIES: Record<string, { label: string; serializer: FilterSerializer }> = {
  dot: { label: 'dotSeparated (default) -- a.b.c', serializer: dotSeparated },
  comma: { label: 'commaSeparated -- a,b,c', serializer: commaSeparated },
  pipe: { label: 'pipeSeparated -- a|b|c', serializer: pipeSeparated },
  multi: { label: 'multiKey -- key=a&key=b&key=c', serializer: multiKey },
  // dotSeparated/commaSeparated/pipeSeparated are all just createDelimited with a fixed
  // separator -- this option calls the factory directly with one none of them use.
  custom: { label: "createDelimited(';') -- a;b;c", serializer: createDelimited(';') }
}

const ROLES = ['Engineer', 'Researcher', 'Analyst']
const TEAMS = ['Compilers', 'Runtime', 'Tooling']

const columns: ColumnDef<Person>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'role', header: 'Role', filterFn: 'arrIncludesSome' },
  { accessorKey: 'team', header: 'Team', filterFn: 'arrIncludesSome' }
]

function toggle(values: string[], value: string): string[] {
  return values.includes(value) ? values.filter((existing) => existing !== value) : [...values, value]
}

function CheckboxGroup({
  legend,
  options,
  selected,
  onToggle,
  prefix
}: {
  legend: string
  options: string[]
  selected: string[]
  onToggle: (value: string) => void
  prefix: string
}) {
  return (
    <fieldset className='m-0 flex min-w-40 flex-col gap-1.5 border-0 p-0'>
      <legend className='mb-1 text-[13px] font-medium text-foreground'>{legend}</legend>
      {options.map((option) => {
        const id = `${prefix}-${option}`
        return (
          <div key={option} className='flex items-center gap-2'>
            <Checkbox id={id} checked={selected.includes(option)} onCheckedChange={() => onToggle(option)} />
            <Label htmlFor={id} className='text-[13px] font-normal'>
              {option}
            </Label>
          </div>
        )
      })}
    </fieldset>
  )
}

export default function FilterSerializersExample(): ReactNode {
  const [strategyKey, setStrategyKey] = useState<keyof typeof STRATEGIES>('dot')
  const [selectedTeams, setSelectedTeams] = useState<string[]>([])
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])

  // `team` uses whichever default serializer is selected below; `role` always uses an
  // explicit override (multiKey), regardless of the default -- proving overrides win.
  const store = useMemo(
    () =>
      createUrlStateStore({
        defaultSerializer: STRATEGIES[strategyKey].serializer,
        filterSerializers: { role: multiKey }
      }),
    [strategyKey]
  )
  const { table, setColumnFilter } = useTableCraft({ data: people, columns, store })
  const currentSearch = useLiveLocationSearch()

  function updateTeams(next: string[]): void {
    setSelectedTeams(next)
    setColumnFilter('team', next)
  }

  function updateRoles(next: string[]): void {
    setSelectedRoles(next)
    setColumnFilter('role', next)
  }

  return (
    <TableCard
      table={table}
      toolbar={
        <>
          <div className='flex items-center gap-2'>
            <Label htmlFor='serializer-strategy' className='text-[13px] whitespace-nowrap'>
              default serializer (applies to the Team filter):
            </Label>
            <Select value={strategyKey} onValueChange={(value) => setStrategyKey(value as keyof typeof STRATEGIES)}>
              <SelectTrigger id='serializer-strategy' className='w-fit'>
                {/* Explicit children: Base UI's value->label resolution only works when an item's value and
                    its rendered label are the same string, which isn't true for any strategy key here. */}
                <SelectValue>{STRATEGIES[strategyKey].label}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {Object.entries(STRATEGIES).map(([key, { label }]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='flex flex-wrap gap-8'>
            <CheckboxGroup
              legend='Team (uses the selected default serializer)'
              options={TEAMS}
              selected={selectedTeams}
              onToggle={(team) => updateTeams(toggle(selectedTeams, team))}
              prefix='team'
            />
            <CheckboxGroup
              legend='Role (always uses a multiKey override)'
              options={ROLES}
              selected={selectedRoles}
              onToggle={(role) => updateRoles(toggle(selectedRoles, role))}
              prefix='role'
            />
          </div>
        </>
      }
      footer={
        <>
          <PaginationFooter table={table} />
          <p className='m-0 text-[13px] text-muted-foreground'>
            Query string: <code>{currentSearch || '(none yet -- check a box above)'}</code>
          </p>
        </>
      }
    />
  )
}

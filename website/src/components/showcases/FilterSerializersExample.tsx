import { useMemo, useState, type ReactNode } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import {
  commaSeparated,
  createDelimited,
  createUrlStateStore,
  dotSeparated,
  multiKey,
  pipeSeparated,
  useTableCraft,
  type FilterSerializer
} from 'another-table-craft'
import { people, type Person } from '../../data/people'
import { PaginationControls, SortableDataTable } from './SortableDataTable'
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
    <div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: 8, padding: '1rem' }}>
      <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
        <span>default serializer (applies to the Team filter):</span>
        <select value={strategyKey} onChange={(event) => setStrategyKey(event.target.value as keyof typeof STRATEGIES)}>
          {Object.entries(STRATEGIES).map(([key, { label }]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </label>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
          <legend>Team (uses the selected default serializer)</legend>
          {TEAMS.map((team) => (
            <label key={team} style={{ display: 'block' }}>
              <input
                type='checkbox'
                checked={selectedTeams.includes(team)}
                onChange={() => updateTeams(toggle(selectedTeams, team))}
              />
              {' ' + team}
            </label>
          ))}
        </fieldset>

        <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
          <legend>Role (always uses a multiKey override)</legend>
          {ROLES.map((role) => (
            <label key={role} style={{ display: 'block' }}>
              <input
                type='checkbox'
                checked={selectedRoles.includes(role)}
                onChange={() => updateRoles(toggle(selectedRoles, role))}
              />
              {' ' + role}
            </label>
          ))}
        </fieldset>
      </div>

      <SortableDataTable table={table} />
      <PaginationControls table={table} />

      <p style={{ marginTop: '1rem', marginBottom: 0 }}>
        Query string: <code>{currentSearch || '(none yet -- check a box above)'}</code>
      </p>
    </div>
  )
}

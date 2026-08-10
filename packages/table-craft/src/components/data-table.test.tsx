import { useMemo } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from './data-table'
import { useTableCraft } from '../hooks/use-table-craft'
import { createMemoryStateStore } from '../core/stores/memory-store'

interface Row {
  id: string
  name: string
}

const data: Row[] = [
  { id: '1', name: 'Bob' },
  { id: '2', name: 'Alice' }
]

const columns: ColumnDef<Row>[] = [
  { accessorKey: 'id', header: 'ID', enableSorting: false },
  { accessorKey: 'name', header: 'Name' }
]

function TestTable({ rows = data, sortable }: { rows?: Row[]; sortable?: boolean }) {
  const store = useMemo(() => createMemoryStateStore(), [])
  const { table } = useTableCraft({ data: rows, columns, store })
  return <DataTable table={table} sortable={sortable} />
}

describe('DataTable', () => {
  it('renders header labels and row cells from the table instance', () => {
    render(<TestTable />)

    expect(screen.getByText('ID')).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
  })

  it('renders a plain header (no button) for a column with sorting disabled', () => {
    render(<TestTable />)

    expect(screen.getByText('ID').closest('button')).toBeNull()
    expect(screen.getByText('Name').closest('button')).not.toBeNull()
  })

  it('toggles sort state and aria-sort when a sortable header is clicked', async () => {
    const user = userEvent.setup()
    render(<TestTable />)

    const nameHeader = screen.getByText('Name').closest('th')
    expect(nameHeader).toHaveAttribute('aria-sort', 'none')

    await user.click(screen.getByText('Name'))
    expect(nameHeader).toHaveAttribute('aria-sort', 'ascending')

    await user.click(screen.getByText('Name'))
    expect(nameHeader).toHaveAttribute('aria-sort', 'descending')
  })

  it('renders plain headers with no sort buttons when sortable={false}, even for sortable columns', () => {
    render(<TestTable sortable={false} />)

    expect(screen.getByText('Name').closest('button')).toBeNull()
    expect(screen.getByText('Name').closest('th')).toHaveAttribute('aria-sort', 'none')
  })

  it('shows the empty message when there are no rows', () => {
    render(<TestTable rows={[]} />)

    expect(screen.getByText('No results.')).toBeInTheDocument()
  })
})

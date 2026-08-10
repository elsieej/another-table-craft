import { useMemo } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTablePagination } from './data-table-pagination'
import { useTableCraft } from '../hooks/use-table-craft'
import { createMemoryStateStore } from '../core/stores/memory-store'

interface Row {
  id: string
}

const data: Row[] = Array.from({ length: 25 }, (_, i) => ({ id: `${i + 1}` }))
const columns: ColumnDef<Row>[] = [{ accessorKey: 'id', header: 'ID' }]

function TestPagination() {
  const store = useMemo(() => createMemoryStateStore({ pagination: { pageIndex: 0, pageSize: 10 } }), [])
  const { table } = useTableCraft({ data, columns, store })
  return <DataTablePagination table={table} pageSizeOptions={[10, 20]} />
}

describe('DataTablePagination', () => {
  it('shows the current page and total page count', () => {
    render(<TestPagination />)

    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument()
  })

  it('disables Previous on the first page and enables Next', () => {
    render(<TestPagination />)

    expect(screen.getByLabelText('Previous page')).toBeDisabled()
    expect(screen.getByLabelText('Next page')).toBeEnabled()
  })

  it('advances to the next page on click', async () => {
    const user = userEvent.setup()
    render(<TestPagination />)

    await user.click(screen.getByLabelText('Next page'))

    expect(screen.getByText('Page 2 of 3')).toBeInTheDocument()
    expect(screen.getByLabelText('Previous page')).toBeEnabled()
  })
})

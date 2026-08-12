import { useMemo, useState } from 'react'
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

function TestPagination({ maxVisiblePages }: { maxVisiblePages?: number } = {}) {
  const store = useMemo(() => createMemoryStateStore({ pagination: { pageIndex: 0, pageSize: 10 } }), [])
  const { table } = useTableCraft({ data, columns, store })
  return <DataTablePagination table={table} pageSizeOptions={[10, 20]} maxVisiblePages={maxVisiblePages} />
}

function TestPaginationWithCardColumns({ cardColumnOptions }: { cardColumnOptions?: number[] } = {}) {
  const store = useMemo(() => createMemoryStateStore({ pagination: { pageIndex: 0, pageSize: 10 } }), [])
  const { table } = useTableCraft({ data, columns, store })
  const [cardColumns, setCardColumns] = useState(2)
  return (
    <DataTablePagination
      table={table}
      pageSizeOptions={[10, 20]}
      cardColumns={cardColumns}
      onCardColumnsChange={setCardColumns}
      cardColumnOptions={cardColumnOptions}
    />
  )
}

describe('DataTablePagination', () => {
  it('renders a numbered button for every page when the total fits the window', () => {
    render(<TestPagination />)

    expect(screen.getByLabelText('Page 1')).toBeInTheDocument()
    expect(screen.getByLabelText('Page 2')).toBeInTheDocument()
    expect(screen.getByLabelText('Page 3')).toBeInTheDocument()
    expect(screen.queryByLabelText('Page 4')).not.toBeInTheDocument()
  })

  it('marks the current page button with aria-current', () => {
    render(<TestPagination />)

    expect(screen.getByLabelText('Page 1')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByLabelText('Page 2')).not.toHaveAttribute('aria-current')
  })

  it('disables First/Previous on the first page and enables Next/Last', () => {
    render(<TestPagination />)

    expect(screen.getByLabelText('First page')).toBeDisabled()
    expect(screen.getByLabelText('Previous page')).toBeDisabled()
    expect(screen.getByLabelText('Next page')).toBeEnabled()
    expect(screen.getByLabelText('Last page')).toBeEnabled()
  })

  it('advances to the next page on click', async () => {
    const user = userEvent.setup()
    render(<TestPagination />)

    await user.click(screen.getByLabelText('Next page'))

    expect(screen.getByLabelText('Page 2')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByLabelText('Previous page')).toBeEnabled()
  })

  it('jumps to a specific page number on click', async () => {
    const user = userEvent.setup()
    render(<TestPagination />)

    await user.click(screen.getByLabelText('Page 3'))

    expect(screen.getByLabelText('Page 3')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByLabelText('Next page')).toBeDisabled()
    expect(screen.getByLabelText('Last page')).toBeDisabled()
  })

  it('jumps to the last page via the Last button, then back to the first via First', async () => {
    const user = userEvent.setup()
    render(<TestPagination />)

    await user.click(screen.getByLabelText('Last page'))
    expect(screen.getByLabelText('Page 3')).toHaveAttribute('aria-current', 'page')

    await user.click(screen.getByLabelText('First page'))
    expect(screen.getByLabelText('Page 1')).toHaveAttribute('aria-current', 'page')
  })

  it('slides the page window to keep the current page visible when there are more pages than fit', async () => {
    const user = userEvent.setup()
    render(<TestPagination maxVisiblePages={2} />)

    expect(screen.getByLabelText('Page 1')).toBeInTheDocument()
    expect(screen.getByLabelText('Page 2')).toBeInTheDocument()
    expect(screen.queryByLabelText('Page 3')).not.toBeInTheDocument()

    await user.click(screen.getByLabelText('Last page'))

    expect(screen.getByLabelText('Page 3')).toBeInTheDocument()
    expect(screen.queryByLabelText('Page 1')).not.toBeInTheDocument()
  })

  it('renders no "Columns per page" control when cardColumns/onCardColumnsChange are omitted', () => {
    render(<TestPagination />)

    expect(screen.queryByLabelText('Columns per page')).not.toBeInTheDocument()
    expect(screen.queryByText('Columns per page')).not.toBeInTheDocument()
  })

  it('renders a "Columns per page" select next to "Rows per page" when cardColumns/onCardColumnsChange are provided', () => {
    render(<TestPaginationWithCardColumns />)

    expect(screen.getByLabelText('Rows per page')).toBeInTheDocument()
    expect(screen.getByLabelText('Columns per page')).toBeInTheDocument()
  })

  it('uses the default cardColumnOptions ([1, 2, 3, 4]) when none are provided', async () => {
    const user = userEvent.setup()
    render(<TestPaginationWithCardColumns />)

    await user.click(screen.getByLabelText('Columns per page'))
    await screen.findByRole('option', { name: '1' })

    for (const option of [1, 2, 3, 4]) {
      expect(screen.getByRole('option', { name: `${option}` })).toBeInTheDocument()
    }
  })

  it('respects custom cardColumnOptions when provided', async () => {
    const user = userEvent.setup()
    render(<TestPaginationWithCardColumns cardColumnOptions={[1, 2]} />)

    await user.click(screen.getByLabelText('Columns per page'))
    await screen.findByRole('option', { name: '1' })

    expect(screen.getByRole('option', { name: '1' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: '2' })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: '3' })).not.toBeInTheDocument()
  })

  it('calls onCardColumnsChange with the numeric value when a "Columns per page" option is selected', async () => {
    const user = userEvent.setup()
    render(<TestPaginationWithCardColumns />)

    await user.click(screen.getByLabelText('Columns per page'))
    const option = await screen.findByRole('option', { name: '3' })
    await user.click(option)

    expect(screen.getByLabelText('Columns per page')).toHaveTextContent('3')
  })
})

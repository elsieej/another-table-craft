import { renderHook } from '@testing-library/react'
import { getCoreRowModel, useReactTable, type ColumnDef, type RowSelectionState } from '@tanstack/react-table'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createCsvConfig, exportSelectedRowsCsv } from './csv-export'
import { logger } from './logger'

const { innerDownloadSpy, downloadSpy } = vi.hoisted(() => {
  const innerDownloadSpy = vi.fn()
  const downloadSpy = vi.fn(() => innerDownloadSpy)
  return { innerDownloadSpy, downloadSpy }
})

vi.mock('export-to-csv', async (importOriginal) => {
  const actual = await importOriginal<typeof import('export-to-csv')>()
  return { ...actual, download: downloadSpy }
})

vi.mock('./logger', () => ({
  logger: { error: vi.fn() }
}))

interface Row {
  id: string
  name: string
  email: string
  actions: string
}

const data: Row[] = [
  { id: '1', name: 'Alice', email: 'alice@example.com', actions: 'edit' },
  { id: '2', name: 'Bob', email: 'bob@example.com', actions: 'edit' }
]

const columns: ColumnDef<Row>[] = [
  // accessorFn (not tied to a real Row field) so this column would actually leak a
  // detectable value into the CSV if the "select" default-ignore ever broke.
  { id: 'select', header: 'Select', accessorFn: () => 'checkbox', cell: () => null },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'actions', header: 'Actions' }
]

function buildTable(rowSelection: RowSelectionState) {
  const { result } = renderHook(() =>
    useReactTable({
      data,
      columns,
      state: { rowSelection },
      onRowSelectionChange: () => {},
      getRowId: (row) => row.id,
      getCoreRowModel: getCoreRowModel(),
      enableRowSelection: true
    })
  )
  return result.current
}

describe('createCsvConfig', () => {
  it('defaults the filename to "table-export"', () => {
    expect(createCsvConfig().filename).toBe('table-export')
  })

  it('uses a custom filename when provided', () => {
    expect(createCsvConfig({ fileName: 'my-rows' }).filename).toBe('my-rows')
  })

  it('defaults the field separator to ","', () => {
    expect(createCsvConfig().fieldSeparator).toBe(',')
  })

  it('uses a custom field separator when provided', () => {
    expect(createCsvConfig({ fieldSeparator: ';' }).fieldSeparator).toBe(';')
  })
})

describe('exportSelectedRowsCsv', () => {
  beforeEach(() => {
    // mockReset (not mockClear) so a queued mockImplementationOnce from a prior test
    // can never leak forward — e.g. if an earlier test's queued throw goes unconsumed.
    downloadSpy.mockReset().mockImplementation(() => innerDownloadSpy)
    innerDownloadSpy.mockReset()
    vi.mocked(logger.error).mockReset()
  })

  it('does nothing when no rows are selected', () => {
    const table = buildTable({})
    exportSelectedRowsCsv(table)

    expect(downloadSpy).not.toHaveBeenCalled()
  })

  it('exports selected rows, excluding the default ignored columns (actions, select)', () => {
    const table = buildTable({ '1': true })
    exportSelectedRowsCsv(table)

    expect(downloadSpy).toHaveBeenCalledTimes(1)
    expect(innerDownloadSpy).toHaveBeenCalledTimes(1)
    const csv = String(innerDownloadSpy.mock.calls[0][0])
    expect(csv).toContain('Alice')
    expect(csv).not.toMatch(/edit/)
    expect(csv).not.toContain('checkbox')
  })

  it('passes a custom fieldSeparator through to the generated CSV output', () => {
    const table = buildTable({ '1': true })
    exportSelectedRowsCsv(table, { fieldSeparator: ';' })

    expect(innerDownloadSpy).toHaveBeenCalledTimes(1)
    const csv = String(innerDownloadSpy.mock.calls[0][0])
    expect(csv).toContain(';')
    expect(csv.split('\r\n')[0]).not.toContain(',')
  })

  it('also excludes caller-supplied ignoredCols on top of the defaults', () => {
    const table = buildTable({ '1': true })
    exportSelectedRowsCsv(table, { ignoredCols: ['name'] })

    expect(innerDownloadSpy).toHaveBeenCalledTimes(1)
    const csv = String(innerDownloadSpy.mock.calls[0][0])
    expect(csv).not.toContain('Alice')
    expect(csv).toContain('alice@example.com')
  })

  it('routes a failure during export through the shared logger, not raw console.error', () => {
    downloadSpy.mockImplementationOnce(() => {
      throw new Error('boom')
    })

    const table = buildTable({ '1': true })
    exportSelectedRowsCsv(table)

    expect(logger.error).toHaveBeenCalledWith('CSV export failed:', expect.any(Error))
  })
})

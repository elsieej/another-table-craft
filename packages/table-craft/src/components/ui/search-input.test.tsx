import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SearchInput } from './search-input'

describe('SearchInput', () => {
  it('renders without throwing', () => {
    render(<SearchInput placeholder='Search…' value='' onChange={() => {}} />)
    expect(screen.getByPlaceholderText('Search…')).toBeInTheDocument()
  })

  it('accepts typed input', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<SearchInput placeholder='Search…' value='' onChange={onChange} />)
    await user.type(screen.getByPlaceholderText('Search…'), 'a')
    expect(onChange).toHaveBeenCalled()
  })

  it('hides the clear button when value is empty', () => {
    render(<SearchInput placeholder='Search…' value='' onChange={() => {}} onClear={() => {}} />)
    expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument()
  })

  it('shows and wires up the clear button when value is non-empty', async () => {
    const user = userEvent.setup()
    const onClear = vi.fn()
    render(<SearchInput placeholder='Search…' value='ada' onChange={() => {}} onClear={onClear} />)
    await user.click(screen.getByLabelText('Clear search'))
    expect(onClear).toHaveBeenCalledOnce()
  })
})

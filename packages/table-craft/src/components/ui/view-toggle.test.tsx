import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ViewToggle } from './view-toggle'

const OPTIONS = [
  { value: 'table', label: 'Table' },
  { value: 'cards', label: 'Cards' }
] as const

describe('ViewToggle', () => {
  it('renders every option as a tab', () => {
    render(<ViewToggle value='table' onValueChange={vi.fn()} options={OPTIONS} />)
    expect(screen.getByRole('tab', { name: 'Table' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Cards' })).toBeInTheDocument()
  })

  it('marks the current value as the selected tab', () => {
    render(<ViewToggle value='cards' onValueChange={vi.fn()} options={OPTIONS} />)
    expect(screen.getByRole('tab', { name: 'Cards' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Table' })).toHaveAttribute('aria-selected', 'false')
  })

  it('calls onValueChange with the clicked option value', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<ViewToggle value='table' onValueChange={onValueChange} options={OPTIONS} />)
    await user.click(screen.getByRole('tab', { name: 'Cards' }))
    expect(onValueChange).toHaveBeenCalledWith('cards')
  })

  it('updates the selected tab when used as a controlled component', async () => {
    function Controlled() {
      const [value, setValue] = useState<(typeof OPTIONS)[number]['value']>('table')
      return <ViewToggle value={value} onValueChange={setValue} options={OPTIONS} />
    }
    const user = userEvent.setup()
    render(<Controlled />)
    await user.click(screen.getByRole('tab', { name: 'Cards' }))
    expect(screen.getByRole('tab', { name: 'Cards' })).toHaveAttribute('aria-selected', 'true')
  })
})

import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Checkbox } from './checkbox'

describe('Checkbox', () => {
  it('renders unchecked by default', () => {
    render(<Checkbox aria-label='Accept' />)
    const checkbox = screen.getByRole('checkbox', { name: 'Accept' })
    expect(checkbox).toHaveAttribute('data-unchecked')
    expect(checkbox).not.toHaveAttribute('data-checked')
  })

  it('toggles checked state and fires onCheckedChange', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<Checkbox aria-label='Accept' onCheckedChange={onCheckedChange} />)
    const checkbox = screen.getByRole('checkbox', { name: 'Accept' })

    await user.click(checkbox)

    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything())
    expect(checkbox).toHaveAttribute('data-checked')
  })

  it('supports the indeterminate state', () => {
    render(<Checkbox aria-label='Accept' indeterminate />)
    expect(screen.getByRole('checkbox', { name: 'Accept' })).toHaveAttribute('data-indeterminate')
  })

  it('respects the disabled state', () => {
    render(<Checkbox aria-label='Accept' disabled />)
    expect(screen.getByRole('checkbox', { name: 'Accept' })).toHaveAttribute('data-disabled')
  })

  it('forwards a ref to the underlying checkbox element', () => {
    const ref = createRef<HTMLElement>()
    render(<Checkbox aria-label='Accept' ref={ref} />)
    expect(ref.current).toBe(screen.getByRole('checkbox', { name: 'Accept' }))
  })

  it('tags the root and indicator with their data-slot for consumer styling hooks', () => {
    render(<Checkbox aria-label='Accept' defaultChecked />)
    const checkbox = screen.getByRole('checkbox', { name: 'Accept' })
    expect(checkbox).toHaveAttribute('data-slot', 'checkbox')
    expect(checkbox.querySelector('[data-slot="checkbox-indicator"]')).toBeInTheDocument()
  })
})

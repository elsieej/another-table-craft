import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'

function renderSelect(props: Partial<ComponentPropsForSelect> = {}) {
  return render(
    <Select {...props}>
      <SelectTrigger>
        <SelectValue placeholder='Pick a fruit' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='apple'>Apple</SelectItem>
        <SelectItem value='banana'>Banana</SelectItem>
      </SelectContent>
    </Select>
  )
}

type ComponentPropsForSelect = Parameters<typeof Select>[0]

describe('Select', () => {
  it('renders the trigger without throwing, content hidden until opened', () => {
    renderSelect()

    expect(screen.getByText('Pick a fruit')).toBeInTheDocument()
    expect(screen.queryByText('Apple')).not.toBeInTheDocument()
  })

  it('opens the content on trigger click and selects an item', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    renderSelect({ onValueChange })

    await user.click(screen.getByText('Pick a fruit'))
    const option = await screen.findByRole('option', { name: 'Apple' })
    await user.click(option)

    expect(onValueChange).toHaveBeenCalledWith('apple', expect.anything())
  })

  it('Select.List renders as an accessible listbox — evaluated as the faceted-filter checklist container', async () => {
    const user = userEvent.setup()
    renderSelect()

    await user.click(screen.getByText('Pick a fruit'))
    const listbox = await screen.findByRole('listbox')
    expect(listbox).toHaveAttribute('data-slot', 'select-list')
    expect(screen.getAllByRole('option')).toHaveLength(2)
  })
})

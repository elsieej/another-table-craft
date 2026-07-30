import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Command, CommandCollection, CommandEmpty, CommandInput, CommandItem, CommandList } from './command'

const FRUITS = ['Apple', 'Banana', 'Blueberry']

function renderCommand(onValueChange = vi.fn()) {
  return render(
    <Command items={FRUITS} onValueChange={onValueChange}>
      <CommandInput placeholder='Search fruit...' />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandCollection>
          {(item: string) => (
            <CommandItem key={item} value={item}>
              {item}
            </CommandItem>
          )}
        </CommandCollection>
      </CommandList>
    </Command>
  )
}

describe('Command', () => {
  it('renders the input and full item list without throwing', () => {
    renderCommand()
    expect(screen.getByPlaceholderText('Search fruit...')).toBeInTheDocument()
    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.getByText('Banana')).toBeInTheDocument()
    expect(screen.getByText('Blueberry')).toBeInTheDocument()
  })

  it('filters items as the user types, eliminating the cmdk DOM-filtering dependency', async () => {
    const user = userEvent.setup()
    renderCommand()

    await user.type(screen.getByPlaceholderText('Search fruit...'), 'blue')

    expect(screen.getByText('Blueberry')).toBeInTheDocument()
    expect(screen.queryByText('Apple')).not.toBeInTheDocument()
    expect(screen.queryByText('Banana')).not.toBeInTheDocument()
  })

  it('shows CommandEmpty when no items match', async () => {
    const user = userEvent.setup()
    renderCommand()

    await user.type(screen.getByPlaceholderText('Search fruit...'), 'zzz')

    expect(await screen.findByText('No results found.')).toBeInTheDocument()
  })

  it('fires onValueChange when an item is selected', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    renderCommand(onValueChange)

    await user.click(screen.getByText('Banana'))

    expect(onValueChange).toHaveBeenCalledWith('Banana', expect.anything())
  })
})

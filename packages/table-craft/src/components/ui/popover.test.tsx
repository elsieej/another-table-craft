import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

describe('Popover', () => {
  it('renders the trigger without throwing, content hidden until opened', () => {
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Popover body</PopoverContent>
      </Popover>
    )

    expect(screen.getByText('Open')).toBeInTheDocument()
    expect(screen.queryByText('Popover body')).not.toBeInTheDocument()
  })

  it('opens the content on trigger click', async () => {
    const user = userEvent.setup()
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Popover body</PopoverContent>
      </Popover>
    )

    await user.click(screen.getByText('Open'))
    expect(await screen.findByText('Popover body')).toBeInTheDocument()
  })

  it('tags the trigger and content with their data-slot for consumer styling hooks', async () => {
    const user = userEvent.setup()
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Popover body</PopoverContent>
      </Popover>
    )

    expect(screen.getByText('Open')).toHaveAttribute('data-slot', 'popover-trigger')
    await user.click(screen.getByText('Open'))
    expect(await screen.findByText('Popover body')).toHaveAttribute('data-slot', 'popover-content')
  })

  it('forwards a ref to the underlying trigger element', () => {
    const ref = createRef<HTMLButtonElement>()
    render(
      <Popover>
        <PopoverTrigger ref={ref}>Open</PopoverTrigger>
        <PopoverContent>Popover body</PopoverContent>
      </Popover>
    )
    expect(ref.current).toBe(screen.getByText('Open'))
  })

  it('keeps positioner-only props (align/alignOffset/side/sideOffset) off the content DOM node', async () => {
    const user = userEvent.setup()
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent align='start' alignOffset={8} side='right' sideOffset={12}>
          Popover body
        </PopoverContent>
      </Popover>
    )

    await user.click(screen.getByText('Open'))
    const content = await screen.findByText('Popover body')
    expect(content).not.toHaveAttribute('align')
    expect(content).not.toHaveAttribute('alignoffset')
    expect(content).not.toHaveAttribute('side')
    expect(content).not.toHaveAttribute('sideoffset')
  })
})

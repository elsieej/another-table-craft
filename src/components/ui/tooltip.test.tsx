import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'

describe('Tooltip', () => {
  it('renders the trigger without throwing, content hidden until opened', () => {
    render(
      <Tooltip>
        <TooltipTrigger>Hover me</TooltipTrigger>
        <TooltipContent>Helpful text</TooltipContent>
      </Tooltip>
    )

    expect(screen.getByText('Hover me')).toBeInTheDocument()
    expect(screen.queryByText('Helpful text')).not.toBeInTheDocument()
  })

  it('shows the content on hover', async () => {
    const user = userEvent.setup({ delay: null })
    render(
      <Tooltip defaultOpen={false}>
        <TooltipTrigger>Hover me</TooltipTrigger>
        <TooltipContent>Helpful text</TooltipContent>
      </Tooltip>
    )

    await user.hover(screen.getByText('Hover me'))
    expect(await screen.findByText('Helpful text')).toBeInTheDocument()
  })

  it('tags the trigger and content with their data-slot for consumer styling hooks', () => {
    render(
      <Tooltip defaultOpen>
        <TooltipTrigger>Hover me</TooltipTrigger>
        <TooltipContent>Helpful text</TooltipContent>
      </Tooltip>
    )

    expect(screen.getByText('Hover me')).toHaveAttribute('data-slot', 'tooltip-trigger')
    expect(screen.getByText('Helpful text')).toHaveAttribute('data-slot', 'tooltip-content')
  })

  it('forwards a ref to the underlying trigger element', () => {
    const ref = createRef<HTMLButtonElement>()
    render(
      <Tooltip>
        <TooltipTrigger ref={ref}>Hover me</TooltipTrigger>
        <TooltipContent>Helpful text</TooltipContent>
      </Tooltip>
    )
    expect(ref.current).toBe(screen.getByText('Hover me'))
  })

  it('does not embed its own provider, so an app-level TooltipProvider is not overridden', async () => {
    const user = userEvent.setup({ delay: null })
    render(
      <TooltipProvider delay={1000}>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Helpful text</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )

    await user.hover(screen.getByText('Hover me'))
    expect(await screen.findByText('Helpful text', undefined, { timeout: 2000 })).toBeInTheDocument()
  })
})

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Badge } from './badge'

describe('Badge', () => {
  it('renders without throwing', () => {
    render(<Badge>New</Badge>)
    expect(screen.getByText('New')).toBeInTheDocument()
  })

  it('tags itself with data-slot for consumer styling hooks', () => {
    render(<Badge>New</Badge>)
    expect(screen.getByText('New')).toHaveAttribute('data-slot', 'badge')
  })

  it('applies the requested variant class distinctly from the default', () => {
    render(<Badge variant='destructive'>Error</Badge>)
    expect(screen.getByText('Error').className).toContain('bg-destructive')
  })

  it('merges a caller-provided className with the variant classes', () => {
    render(<Badge className='extra-class'>New</Badge>)
    expect(screen.getByText('New').className).toContain('extra-class')
  })
})

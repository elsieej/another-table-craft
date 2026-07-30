import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Skeleton } from './skeleton'

describe('Skeleton', () => {
  it('renders without throwing', () => {
    render(<Skeleton data-testid='skel' />)
    expect(screen.getByTestId('skel')).toBeInTheDocument()
  })

  it('tags itself with data-slot and applies the pulse animation class', () => {
    render(<Skeleton data-testid='skel' />)
    const skel = screen.getByTestId('skel')
    expect(skel).toHaveAttribute('data-slot', 'skeleton')
    expect(skel.className).toContain('animate-pulse')
  })

  it('merges a caller-provided className', () => {
    render(<Skeleton data-testid='skel' className='h-4 w-4' />)
    expect(screen.getByTestId('skel').className).toContain('h-4')
  })
})

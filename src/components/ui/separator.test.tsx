import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Separator } from './separator'

describe('Separator', () => {
  it('renders without throwing', () => {
    render(<Separator data-testid='sep' />)
    expect(screen.getByTestId('sep')).toBeInTheDocument()
  })

  it('defaults to a horizontal, decorative separator', () => {
    render(<Separator data-testid='sep' />)
    const sep = screen.getByTestId('sep')
    expect(sep).toHaveAttribute('data-orientation', 'horizontal')
    expect(sep).toHaveAttribute('role', 'none')
  })

  it('supports a vertical, non-decorative separator', () => {
    render(<Separator data-testid='sep' orientation='vertical' decorative={false} />)
    const sep = screen.getByTestId('sep')
    expect(sep).toHaveAttribute('data-orientation', 'vertical')
    expect(sep).toHaveAttribute('role', 'separator')
    expect(sep).toHaveAttribute('aria-orientation', 'vertical')
  })
})

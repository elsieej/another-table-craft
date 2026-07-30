import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Label } from './label'
import { Input } from './input'

describe('Label', () => {
  it('renders without throwing', () => {
    render(<Label htmlFor='email'>Email</Label>)
    expect(screen.getByText('Email')).toBeInTheDocument()
  })

  it('tags itself with data-slot for consumer styling hooks', () => {
    render(<Label htmlFor='email'>Email</Label>)
    expect(screen.getByText('Email')).toHaveAttribute('data-slot', 'label')
  })

  it('associates with its input via htmlFor, so the input is reachable by accessible label', () => {
    render(
      <>
        <Label htmlFor='email'>Email</Label>
        <Input id='email' />
      </>
    )
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })

  it("uses Base UI's presence-only data-disabled selector, not the Radix data-[disabled=true] value form", () => {
    render(<Label htmlFor='email'>Email</Label>)
    const className = screen.getByText('Email').className
    expect(className).toContain('group-data-disabled:')
    expect(className).not.toContain('data-[disabled=true]')
  })
})

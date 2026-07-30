import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Input } from './input'

describe('Input', () => {
  it('renders without throwing', () => {
    render(<Input placeholder='Email' />)
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
  })

  it('accepts typed input', async () => {
    const user = userEvent.setup()
    render(<Input placeholder='Email' />)
    const input = screen.getByPlaceholderText('Email')
    await user.type(input, 'hello@example.com')
    expect(input).toHaveValue('hello@example.com')
  })

  it('forwards a ref to the underlying input element', () => {
    const ref = createRef<HTMLInputElement>()
    render(<Input ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('applies disabled state', () => {
    render(<Input disabled placeholder='Email' />)
    expect(screen.getByPlaceholderText('Email')).toBeDisabled()
  })
})

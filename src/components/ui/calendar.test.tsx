import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Calendar } from './calendar'

const JAN_2024 = new Date(2024, 0, 1)

describe('Calendar', () => {
  it('renders the given month without throwing', () => {
    render(<Calendar defaultMonth={JAN_2024} />)
    expect(screen.getByText('January 2024')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    // Dec 31 (leading pad) and Jan 31 both render as "31" -- the grid includes adjacent-month days.
    expect(screen.getAllByText('31')).toHaveLength(2)
  })

  it('navigates to the next and previous month', async () => {
    const user = userEvent.setup()
    render(<Calendar defaultMonth={JAN_2024} />)

    await user.click(screen.getByLabelText('Next month'))
    expect(screen.getByText('February 2024')).toBeInTheDocument()

    await user.click(screen.getByLabelText('Previous month'))
    expect(screen.getByText('January 2024')).toBeInTheDocument()
  })

  it('calls onSelect with the clicked date', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<Calendar defaultMonth={JAN_2024} onSelect={onSelect} />)

    await user.click(screen.getByText('15'))

    expect(onSelect).toHaveBeenCalledTimes(1)
    const calledWith = onSelect.mock.calls[0][0] as Date
    expect(calledWith.getFullYear()).toBe(2024)
    expect(calledWith.getMonth()).toBe(0)
    expect(calledWith.getDate()).toBe(15)
  })

  it('marks the selected date and does not fire onSelect for disabled dates', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(
      <Calendar
        defaultMonth={JAN_2024}
        selected={new Date(2024, 0, 10)}
        onSelect={onSelect}
        disabled={(date) => date.getDate() === 20}
      />
    )

    expect(screen.getByText('10')).toHaveAttribute('data-selected', '')
    const disabledDay = screen.getByText('20')
    expect(disabledDay).toBeDisabled()

    await user.click(disabledDay)
    expect(onSelect).not.toHaveBeenCalled()
  })
})

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

  describe('range mode', () => {
    it('sets `from` on the first click and `to` on the second', async () => {
      const user = userEvent.setup()
      const onSelect = vi.fn()
      const { rerender } = render(<Calendar mode='range' defaultMonth={JAN_2024} onSelect={onSelect} />)

      await user.click(screen.getByText('10'))
      expect(onSelect).toHaveBeenLastCalledWith({ from: new Date(2024, 0, 10), to: undefined })

      // Simulate the parent feeding the just-picked `from` back in as `selected`, same as real
      // controlled usage -- a fresh, uncontrolled render wouldn't know a `from` was already picked.
      rerender(
        <Calendar mode='range' defaultMonth={JAN_2024} selected={{ from: new Date(2024, 0, 10) }} onSelect={onSelect} />
      )
      await user.click(screen.getByText('15'))
      expect(onSelect).toHaveBeenLastCalledWith({ from: new Date(2024, 0, 10), to: new Date(2024, 0, 15) })
    })

    it('swaps `from`/`to` when the second click lands before the first', async () => {
      const user = userEvent.setup()
      const onSelect = vi.fn()
      render(
        <Calendar mode='range' defaultMonth={JAN_2024} selected={{ from: new Date(2024, 0, 15) }} onSelect={onSelect} />
      )

      await user.click(screen.getByText('10'))
      expect(onSelect).toHaveBeenCalledWith({ from: new Date(2024, 0, 10), to: new Date(2024, 0, 15) })
    })

    it('marks the endpoints and the days between them', () => {
      render(
        <Calendar
          mode='range'
          defaultMonth={JAN_2024}
          selected={{ from: new Date(2024, 0, 10), to: new Date(2024, 0, 12) }}
        />
      )

      expect(screen.getByText('10')).toHaveAttribute('data-selected', '')
      expect(screen.getByText('12')).toHaveAttribute('data-selected', '')
      expect(screen.getByText('11')).toHaveAttribute('data-range-middle', '')
      expect(screen.getByText('11')).not.toHaveAttribute('data-selected')
    })

    it('starts a fresh range when clicking again after a full range is already picked', async () => {
      const user = userEvent.setup()
      const onSelect = vi.fn()
      render(
        <Calendar
          mode='range'
          defaultMonth={JAN_2024}
          selected={{ from: new Date(2024, 0, 10), to: new Date(2024, 0, 12) }}
          onSelect={onSelect}
        />
      )

      await user.click(screen.getByText('20'))
      expect(onSelect).toHaveBeenCalledWith({ from: new Date(2024, 0, 20), to: undefined })
    })
  })
})

import { useState } from 'react'
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths
} from 'date-fns'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { Button } from 'another-table-craft'
import { cn } from '../../lib/utils'

const WEEKDAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export interface DateRange {
  from?: Date
  to?: Date
}

interface CalendarBaseProps {
  className?: string
  month?: Date
  defaultMonth?: Date
  onMonthChange?: (month: Date) => void
  disabled?: (date: Date) => boolean
}

interface CalendarSingleProps extends CalendarBaseProps {
  mode?: 'single'
  selected?: Date
  onSelect?: (date: Date) => void
}

interface CalendarRangeProps extends CalendarBaseProps {
  mode: 'range'
  selected?: DateRange
  onSelect?: (range: DateRange | undefined) => void
}

type CalendarProps = CalendarSingleProps | CalendarRangeProps

function Calendar(props: CalendarProps) {
  const { className, month: monthProp, defaultMonth = new Date(), onMonthChange, disabled } = props
  const [internalMonth, setInternalMonth] = useState(defaultMonth)
  const month = monthProp ?? internalMonth

  function goToMonth(next: Date) {
    if (!monthProp) {
      setInternalMonth(next)
    }
    onMonthChange?.(next)
  }

  // Two clicks pick a range: the first sets `from` (clearing any prior `to`), the second sets
  // `to` -- picking a day before the current `from` swaps them so `from` stays the earlier date.
  function handleDayClick(day: Date) {
    if (props.mode === 'range') {
      const current = props.selected
      if (!current?.from || current.to) {
        props.onSelect?.({ from: day, to: undefined })
      } else if (isBefore(day, current.from)) {
        props.onSelect?.({ from: day, to: current.from })
      } else {
        props.onSelect?.({ from: current.from, to: day })
      }
    } else {
      props.onSelect?.(day)
    }
  }

  const range = props.mode === 'range' ? props.selected : undefined

  const gridStart = startOfWeek(startOfMonth(month))
  const gridEnd = endOfWeek(endOfMonth(month))
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd })

  return (
    <div
      data-slot='calendar'
      className={cn('w-fit rounded-[10px] border bg-card p-3 text-card-foreground shadow-sm', className)}
    >
      <div className='flex items-center justify-between pb-4'>
        <Button
          type='button'
          variant='outline'
          size='icon'
          className='size-7'
          aria-label='Previous month'
          onClick={() => goToMonth(subMonths(month, 1))}
        >
          <ChevronLeftIcon className='size-4' />
        </Button>
        <div className='text-sm font-semibold' aria-live='polite'>
          {format(month, 'MMMM yyyy')}
        </div>
        <Button
          type='button'
          variant='outline'
          size='icon'
          className='size-7'
          aria-label='Next month'
          onClick={() => goToMonth(addMonths(month, 1))}
        >
          <ChevronRightIcon className='size-4' />
        </Button>
      </div>
      <div role='grid' className='grid grid-cols-7 gap-1'>
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className='flex size-8 items-center justify-center text-xs font-medium text-muted-foreground'
          >
            {label}
          </div>
        ))}
        {days.map((day) => {
          const isRangeStart = range?.from ? isSameDay(day, range.from) : false
          const isRangeEnd = range?.to ? isSameDay(day, range.to) : false
          const isRangeMiddle = range?.from && range?.to ? isAfter(day, range.from) && isBefore(day, range.to) : false
          const isSelected =
            props.mode === 'range'
              ? isRangeStart || isRangeEnd
              : props.selected
                ? isSameDay(day, props.selected)
                : false
          const isOutside = !isSameMonth(day, month)
          const isDisabled = disabled?.(day) ?? false
          const isCurrentDay = isToday(day)
          return (
            <button
              key={day.toISOString()}
              type='button'
              role='gridcell'
              disabled={isDisabled}
              aria-selected={isSelected}
              aria-current={isCurrentDay ? 'date' : undefined}
              data-selected={isSelected ? '' : undefined}
              data-range-middle={isRangeMiddle ? '' : undefined}
              data-outside={isOutside ? '' : undefined}
              data-today={isCurrentDay ? '' : undefined}
              onClick={() => handleDayClick(day)}
              className={cn(
                'relative flex size-8 items-center justify-center rounded-full border-0 bg-transparent p-0 text-sm font-normal outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-40 data-outside:text-muted-foreground/60 data-selected:bg-primary data-selected:font-semibold data-selected:text-primary-foreground data-selected:hover:bg-primary data-range-middle:bg-accent data-range-middle:text-accent-foreground data-today:font-semibold data-today:text-primary',
                isCurrentDay &&
                  !isSelected &&
                  'after:absolute after:bottom-1 after:size-1 after:rounded-full after:bg-primary after:content-[""]'
              )}
            >
              {format(day, 'd')}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export { Calendar }

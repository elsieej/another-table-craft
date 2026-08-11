import { useState } from 'react'
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths
} from 'date-fns'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'

const WEEKDAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

interface CalendarProps {
  className?: string
  month?: Date
  defaultMonth?: Date
  onMonthChange?: (month: Date) => void
  selected?: Date
  onSelect?: (date: Date) => void
  disabled?: (date: Date) => boolean
}

function Calendar({
  className,
  month: monthProp,
  defaultMonth = new Date(),
  onMonthChange,
  selected,
  onSelect,
  disabled
}: CalendarProps) {
  const [internalMonth, setInternalMonth] = useState(defaultMonth)
  const month = monthProp ?? internalMonth

  function goToMonth(next: Date) {
    if (!monthProp) {
      setInternalMonth(next)
    }
    onMonthChange?.(next)
  }

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
          const isSelected = selected ? isSameDay(day, selected) : false
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
              data-outside={isOutside ? '' : undefined}
              data-today={isCurrentDay ? '' : undefined}
              onClick={() => onSelect?.(day)}
              className={cn(
                'relative flex size-8 items-center justify-center rounded-full border-0 bg-transparent p-0 text-sm font-normal outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-40 data-outside:text-muted-foreground/60 data-selected:bg-primary data-selected:font-semibold data-selected:text-primary-foreground data-selected:hover:bg-primary data-today:font-semibold data-today:text-primary',
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

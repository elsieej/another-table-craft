import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface ViewToggleOption<TValue extends string> {
  value: TValue
  label: string
  icon?: ReactNode
}

export interface ViewToggleProps<TValue extends string> {
  value: TValue
  onValueChange: (value: TValue) => void
  options: readonly ViewToggleOption<TValue>[]
  className?: string
}

// Segmented control for switching a dataset's presentation (e.g. table vs. cards). Lives in the
// toolbar next to search -- not as standalone buttons outside the table -- with the active segment
// as a raised chip and inactive ones as muted text.
function ViewToggle<TValue extends string>({ value, onValueChange, options, className }: ViewToggleProps<TValue>) {
  return (
    <div
      data-slot='view-toggle'
      role='tablist'
      className={cn('inline-flex items-center gap-1 rounded-md border bg-muted p-1', className)}
    >
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type='button'
            role='tab'
            aria-selected={active}
            data-state={active ? 'active' : 'inactive'}
            onClick={() => onValueChange(option.value)}
            className={cn(
              "inline-flex h-7 items-center gap-1.5 rounded-sm border border-transparent px-2.5 text-sm font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5"
            )}
          >
            {option.icon}
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

export { ViewToggle }

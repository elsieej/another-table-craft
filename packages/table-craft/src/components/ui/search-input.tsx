import type { ComponentProps } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SearchInputProps extends Omit<ComponentProps<'input'>, 'type'> {
  /** Shown as a trailing clear (×) button whenever `value` is non-empty. Typically pairs `value`
   * with a state setter, e.g. `onClear={() => setGlobalFilter('')}`. */
  onClear?: () => void
}

/** A search field matching the design system's `.atc-field--search`: icon, input and an optional
 * clear button sharing one bordered shell, rather than an icon absolutely-positioned over a plain
 * `Input`. Sized for the packaged table's toolbar -- wrap it in a `className='w-full'` or similar
 * to opt out of the default 280px width. */
function SearchInput({ className, value, onClear, ...props }: SearchInputProps) {
  return (
    <div
      data-slot='search-input'
      className={cn(
        'flex h-9 w-[280px] min-w-0 items-center gap-2 rounded-md border border-input bg-background px-3 shadow-xs transition-[color,box-shadow] has-[input:focus-visible]:border-ring has-[input:focus-visible]:ring-[3px] has-[input:focus-visible]:ring-ring/50',
        className
      )}
    >
      <Search className='size-4 shrink-0 text-muted-foreground' aria-hidden='true' />
      <input
        type='search'
        data-slot='search-input-field'
        className='min-w-0 flex-1 border-0 bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:appearance-none'
        value={value}
        {...props}
      />
      {onClear && value ? (
        <button
          type='button'
          onClick={onClear}
          aria-label='Clear search'
          className='flex size-[18px] shrink-0 items-center justify-center rounded-full bg-accent text-muted-foreground hover:text-foreground'
        >
          <X className='size-3' aria-hidden='true' />
        </button>
      ) : null}
    </div>
  )
}

export { SearchInput }

import type { ComponentProps } from 'react'
import { Combobox as ComboboxPrimitive } from '@base-ui/react/combobox'
import { SearchIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Separator } from './separator'

function Command({ ...props }: ComponentProps<typeof ComboboxPrimitive.Root>) {
  return <ComboboxPrimitive.Root {...props} />
}

function CommandInput({ className, ...props }: ComponentProps<typeof ComboboxPrimitive.Input>) {
  return (
    <div data-slot='command-input-wrapper' className='flex h-9 items-center gap-2 border-b border-border px-3'>
      <SearchIcon className='size-4 shrink-0 text-muted-foreground' />
      {/* A consuming host that hasn't loaded Preflight (e.g. a Docusaurus site sharing layers with
          Infima) leaves a bare `<input>` with that host's default form-control border/radius.
          `border-0` overrides it -- without it the input gets a second, mismatched box drawn
          around it, layered on top of this wrapper's own border-b. */}
      <ComboboxPrimitive.Input
        data-slot='command-input'
        className={cn(
          'flex h-9 w-full min-w-0 border-0 bg-transparent p-0 text-[13px] text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      />
    </div>
  )
}

function CommandList({ className, ...props }: ComponentProps<typeof ComboboxPrimitive.List>) {
  return (
    <ComboboxPrimitive.List
      data-slot='command-list'
      className={cn(
        'max-h-[300px] overflow-x-hidden overflow-y-auto rounded-md bg-popover text-popover-foreground',
        className
      )}
      {...props}
    />
  )
}

// Base UI only auto-wraps a function child into a Collection when List's children is
// *purely* that function -- mixing it with a sibling like CommandEmpty breaks that
// heuristic ("Functions are not valid as a React child"). Use this explicitly instead.
function CommandCollection({ ...props }: ComponentProps<typeof ComboboxPrimitive.Collection>) {
  return <ComboboxPrimitive.Collection {...props} />
}

function CommandEmpty({ className, ...props }: ComponentProps<typeof ComboboxPrimitive.Empty>) {
  return (
    <ComboboxPrimitive.Empty
      data-slot='command-empty'
      // This element must stay mounted even when there are matches (Base UI uses it as an
      // aria-live region), so it renders as an empty <div> with no children rather than being
      // removed -- `empty:py-0` collapses the py-6 padding in that state instead of leaving a
      // blank gap between the input and the results.
      className={cn('py-6 text-center text-sm empty:py-0', className)}
      {...props}
    />
  )
}

function CommandGroup({ className, ...props }: ComponentProps<typeof ComboboxPrimitive.Group>) {
  return (
    <ComboboxPrimitive.Group
      data-slot='command-group'
      className={cn(
        'overflow-hidden p-1 text-foreground [&_[data-slot=command-group-label]]:px-2 [&_[data-slot=command-group-label]]:py-1.5 [&_[data-slot=command-group-label]]:text-xs [&_[data-slot=command-group-label]]:font-medium [&_[data-slot=command-group-label]]:text-muted-foreground',
        className
      )}
      {...props}
    />
  )
}

function CommandGroupLabel({ ...props }: ComponentProps<typeof ComboboxPrimitive.GroupLabel>) {
  return <ComboboxPrimitive.GroupLabel data-slot='command-group-label' {...props} />
}

function CommandItem({ className, ...props }: ComponentProps<typeof ComboboxPrimitive.Item>) {
  return (
    <ComboboxPrimitive.Item
      data-slot='command-item'
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-accent data-highlighted:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

// Unlike DropdownMenuSeparator (role="separator" is a valid child of role="menu"),
// this stays decorative: List renders role="listbox", whose only valid children per
// WAI-ARIA are option/group, so an assertive role="separator" here would be a real
// ARIA violation rather than an improvement.
function CommandSeparator({ className, ...props }: ComponentProps<typeof Separator>) {
  return <Separator data-slot='command-separator' className={cn('-mx-1 h-px', className)} {...props} />
}

function CommandShortcut({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      data-slot='command-shortcut'
      className={cn('ml-auto text-xs tracking-widest text-muted-foreground', className)}
      {...props}
    />
  )
}

export {
  Command,
  CommandInput,
  CommandList,
  CommandCollection,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandItem,
  CommandSeparator,
  CommandShortcut
}

import type { ComponentProps } from 'react'
import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip'
import { cn } from '../../lib/utils'

// Place once at the app root, not per-Tooltip — it groups sibling tooltips' delay timing,
// which a per-instance Provider would defeat by isolating each tooltip in its own context.
function TooltipProvider({ delay = 0, ...props }: ComponentProps<typeof TooltipPrimitive.Provider>) {
  return <TooltipPrimitive.Provider data-slot='tooltip-provider' delay={delay} {...props} />
}

function Tooltip({ ...props }: ComponentProps<typeof TooltipPrimitive.Root>) {
  return <TooltipPrimitive.Root {...props} />
}

function TooltipTrigger({ ...props }: ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot='tooltip-trigger' {...props} />
}

function TooltipContent({
  className,
  sideOffset = 4,
  children,
  ...props
}: ComponentProps<typeof TooltipPrimitive.Popup> &
  Pick<ComponentProps<typeof TooltipPrimitive.Positioner>, 'sideOffset'>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner className='z-50' sideOffset={sideOffset}>
        <TooltipPrimitive.Popup
          data-slot='tooltip-content'
          className={cn(
            'w-fit text-balance rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground',
            className
          )}
          {...props}
        >
          {children}
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }

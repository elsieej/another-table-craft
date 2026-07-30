import type { ComponentProps } from 'react'
import { Drawer as DrawerPrimitive } from '@base-ui/react/drawer'
import { cn } from '@/lib/utils'

function Drawer({ ...props }: ComponentProps<typeof DrawerPrimitive.Root>) {
  return <DrawerPrimitive.Root {...props} />
}

function DrawerTrigger({ ...props }: ComponentProps<typeof DrawerPrimitive.Trigger>) {
  return <DrawerPrimitive.Trigger data-slot='drawer-trigger' {...props} />
}

function DrawerClose({ ...props }: ComponentProps<typeof DrawerPrimitive.Close>) {
  return <DrawerPrimitive.Close data-slot='drawer-close' {...props} />
}

function DrawerContent({ className, children, ...props }: ComponentProps<typeof DrawerPrimitive.Popup>) {
  return (
    <DrawerPrimitive.Portal>
      <DrawerPrimitive.Backdrop data-slot='drawer-overlay' className='fixed inset-0 z-50 bg-black/50' />
      {/* Drawer.Viewport is required: without it, Drawer.Popup dev-warns and swipe-to-dismiss /
          snap-point gestures (the whole reason this uses @base-ui/react/drawer instead of vaul)
          silently don't work. It's the fixed, positioned container Popup slides within. */}
      <DrawerPrimitive.Viewport className='fixed inset-0 z-50 flex items-end justify-center'>
        <DrawerPrimitive.Popup
          data-slot='drawer-content'
          className={cn('flex h-auto w-full flex-col rounded-t-lg border bg-background', className)}
          {...props}
        >
          <div className='mx-auto mt-4 h-2 w-[100px] shrink-0 rounded-full bg-muted' />
          <DrawerPrimitive.Content data-slot='drawer-body' className='flex-1'>
            {children}
          </DrawerPrimitive.Content>
        </DrawerPrimitive.Popup>
      </DrawerPrimitive.Viewport>
    </DrawerPrimitive.Portal>
  )
}

function DrawerHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot='drawer-header' className={cn('grid gap-1.5 p-4', className)} {...props} />
}

function DrawerFooter({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot='drawer-footer' className={cn('mt-auto flex flex-col gap-2 p-4', className)} {...props} />
}

function DrawerTitle({ className, ...props }: ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      data-slot='drawer-title'
      className={cn('font-semibold text-foreground', className)}
      {...props}
    />
  )
}

function DrawerDescription({ className, ...props }: ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      data-slot='drawer-description'
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

export { Drawer, DrawerTrigger, DrawerClose, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription }

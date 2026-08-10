import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

function Card({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot='card'
      // rounded-[10px]: the design system's `--atc-radius-card`. No outer py/gap -- each section below
      // (header/content/footer) carries its own box padding per the design system, rather than a shared
      // outer inset plus a flex `gap` between them.
      className={cn(
        'flex flex-col overflow-hidden rounded-[10px] border bg-card text-card-foreground shadow-sm',
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-header'
      // px-5/py-4: `--atc-card__header` padding (--atc-space-9/--atc-space-8, 20px/16px).
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-5 py-4 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:border-border [.border-b]:pb-4',
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: ComponentProps<'div'>) {
  // text-lg/tracking-tight/leading-snug: the design system's `--atc-type-section-title` (600 18px/1.35).
  return (
    <div
      data-slot='card-title'
      className={cn('text-lg leading-snug font-semibold tracking-tight', className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: ComponentProps<'div'>) {
  // text-[13px]: the design system's `--atc-type-cell` (13px), not the stock `text-sm` (14px).
  return <div data-slot='card-description' className={cn('text-[13px] text-muted-foreground', className)} {...props} />
}

function CardAction({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-action'
      className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: ComponentProps<'div'>) {
  // px-5/py-4: `--atc-card__body` padding (--atc-space-9/--atc-space-8, 20px/16px), same box as the header.
  return <div data-slot='card-content' className={cn('px-5 py-4', className)} {...props} />
}

function CardFooter({ className, ...props }: ComponentProps<'div'>) {
  // px-5/py-3 + border-t: `--atc-card__footer` padding (--atc-space-9/--atc-space-6, 20px/12px) with an
  // always-on top border -- the design system's footer is a permanently separated band (it's where
  // pagination lives), not an optional divider like the header's `.border-b` escape hatch.
  return (
    <div
      data-slot='card-footer'
      className={cn('flex items-center border-t border-border px-5 py-3', className)}
      {...props}
    />
  )
}

export { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter }

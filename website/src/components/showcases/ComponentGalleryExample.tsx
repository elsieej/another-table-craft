import { useState, type ReactNode } from 'react'
import { format } from 'date-fns'
import { CalendarIcon, ChevronsUpDownIcon } from 'lucide-react'
import { Button } from 'another-table-craft'
import { Badge } from '../ui/badge'
import { Calendar } from '../ui/calendar'
import { Command, CommandCollection, CommandEmpty, CommandInput, CommandItem, CommandList } from '../ui/command'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '../ui/drawer'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Separator } from '../ui/separator'
import { Skeleton } from '../ui/skeleton'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'

const FRUITS = ['Apple', 'Banana', 'Blueberry', 'Cherry']

/** Every exported primitive, rendered together -- a live reference, and a regression check for the
 * one thing a per-page code snippet won't catch: something breaking site-wide across all of them. */
export default function ComponentGalleryExample(): ReactNode {
  const [fruit, setFruit] = useState('')
  const [fruitOpen, setFruitOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [dateOpen, setDateOpen] = useState(false)

  return (
    <TooltipProvider>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          <Button>Default</Button>
          <Button variant='secondary'>Secondary</Button>
          <Button variant='outline'>Outline</Button>
          <Button variant='ghost'>Ghost</Button>
          <Button variant='destructive'>Destructive</Button>
          <Button variant='link'>Link</Button>
          <Badge>Default</Badge>
          <Badge variant='secondary'>Secondary</Badge>
          <Badge variant='outline'>Outline</Badge>
          <Badge variant='destructive'>Destructive</Badge>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          <Popover>
            <PopoverTrigger render={<Button variant='outline' />}>Open popover</PopoverTrigger>
            <PopoverContent>Popover body content.</PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant='outline' />}>Open dropdown</DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Tooltip>
            <TooltipTrigger render={<Button variant='outline' />}>Hover me</TooltipTrigger>
            <TooltipContent>Helpful tooltip text</TooltipContent>
          </Tooltip>

          <Drawer>
            <DrawerTrigger render={<Button variant='outline' />}>Open drawer</DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Drawer title</DrawerTitle>
                <DrawerDescription>Drawer description text.</DrawerDescription>
              </DrawerHeader>
            </DrawerContent>
          </Drawer>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          {/* Command has no border/popup behavior of its own by design -- it's meant to sit inside
              a container that supplies both. Here that container is this Popover: closed, all you
              see is the trigger button showing the current value (or a placeholder), same as Select;
              click it and the search input + filtered list appear together in a floating panel,
              rather than always being rendered inline on the page. */}
          <Popover open={fruitOpen} onOpenChange={setFruitOpen}>
            <PopoverTrigger render={<Button variant='outline' className='w-[220px] justify-between font-normal' />}>
              {fruit || 'Search fruit...'}
              <ChevronsUpDownIcon className='size-4 shrink-0 opacity-50' />
            </PopoverTrigger>
            <PopoverContent align='start' className='w-[220px] p-0'>
              <Command
                items={FRUITS}
                value={fruit}
                onValueChange={(value) => {
                  setFruit(value as string)
                  setFruitOpen(false)
                }}
              >
                <CommandInput placeholder='Search fruit...' />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandCollection>
                    {(item: string) => (
                      <CommandItem key={item} value={item}>
                        {item}
                      </CommandItem>
                    )}
                  </CommandCollection>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Same click-to-open pattern for the date picker: the trigger shows the picked date (or a
              placeholder) and the Calendar itself only renders once the popover is open. */}
          <Popover open={dateOpen} onOpenChange={setDateOpen}>
            <PopoverTrigger render={<Button variant='outline' className='w-[220px] justify-start gap-2 font-normal' />}>
              <CalendarIcon className='size-4 shrink-0 opacity-50' />
              {date ? format(date, 'PPP') : 'Pick a date'}
            </PopoverTrigger>
            <PopoverContent align='start' className='w-auto p-0'>
              <Calendar
                className='border-none shadow-none'
                selected={date}
                onSelect={(value) => {
                  setDate(value)
                  setDateOpen(false)
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <Separator />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: 320 }}>
          <Skeleton style={{ height: '1rem', width: '100%' }} />
          <Skeleton style={{ height: '1rem', width: '80%' }} />
          <Skeleton style={{ height: '1rem', width: '60%' }} />
        </div>
      </div>
    </TooltipProvider>
  )
}

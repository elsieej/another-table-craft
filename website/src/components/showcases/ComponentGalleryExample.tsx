import { useState, type ReactNode } from 'react'
import {
  Badge,
  Button,
  Calendar,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Command,
  CommandCollection,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Separator,
  Skeleton,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from 'another-table-craft'

const FRUITS = ['Apple', 'Banana', 'Blueberry', 'Cherry']

/** Every exported primitive, rendered together -- a live reference, and a regression check for the
 * one thing a per-page code snippet won't catch: something breaking site-wide across all of them. */
export default function ComponentGalleryExample(): ReactNode {
  const [checked, setChecked] = useState(false)

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

        <Card style={{ maxWidth: 360 }}>
          <CardHeader>
            <CardTitle>Card title</CardTitle>
            <CardDescription>A short card description.</CardDescription>
          </CardHeader>
          <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <Label htmlFor='gallery-email'>Email</Label>
              <Input id='gallery-email' placeholder='you@example.com' />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Checkbox id='gallery-terms' checked={checked} onCheckedChange={(v) => setChecked(v === true)} />
              <Label htmlFor='gallery-terms'>Accept terms</Label>
            </div>
          </CardContent>
          <CardFooter style={{ display: 'flex', gap: '0.5rem' }}>
            <Button size='sm'>Save</Button>
            <Button size='sm' variant='outline'>
              Cancel
            </Button>
          </CardFooter>
        </Card>

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

        {/* Command has no border of its own by design -- it's meant to sit inside a bordered
            container (a dialog, a popover, ...) rather than impose one itself. */}
        <div style={{ maxWidth: 320, border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: 8 }}>
          <Command items={FRUITS}>
            <CommandInput placeholder='Search fruit...' />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandCollection>{(item: string) => <CommandItem key={item}>{item}</CommandItem>}</CommandCollection>
            </CommandList>
          </Command>
        </div>

        <Calendar />

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

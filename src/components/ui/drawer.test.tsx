import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from './drawer'

describe('Drawer', () => {
  // Runs first and mounts Popup for the first time in this file: Base UI's "expected to be
  // rendered within <Drawer.Viewport>" dev-warning dedupes identical messages module-wide, so
  // once it has fired once anywhere in this file's module lifetime, later renders never
  // re-trigger it -- this test would pass vacuously if placed after any other Popup mount.
  it('renders Popup within a Viewport, so swipe/snap-point gestures are not silently disabled', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const user = userEvent.setup()
    render(
      <Drawer>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>
          <DrawerTitle>Edit profile</DrawerTitle>
        </DrawerContent>
      </Drawer>
    )

    await user.click(screen.getByText('Open'))
    await screen.findByText('Edit profile')

    const viewportWarning = errorSpy.mock.calls.some((args) =>
      args.some((arg) => typeof arg === 'string' && arg.includes('Drawer.Viewport'))
    )
    expect(viewportWarning).toBe(false)

    errorSpy.mockRestore()
  })

  it('renders the trigger without throwing, content hidden until opened', () => {
    render(
      <Drawer>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Edit profile</DrawerTitle>
            <DrawerDescription>Update your details below.</DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    )

    expect(screen.getByText('Open')).toBeInTheDocument()
    expect(screen.queryByText('Edit profile')).not.toBeInTheDocument()
  })

  it('opens the content on trigger click', async () => {
    const user = userEvent.setup()
    render(
      <Drawer>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Edit profile</DrawerTitle>
            <DrawerDescription>Update your details below.</DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    )

    await user.click(screen.getByText('Open'))
    expect(await screen.findByText('Edit profile')).toBeInTheDocument()
    expect(screen.getByText('Update your details below.')).toBeInTheDocument()
  })

  it('closes via DrawerClose', async () => {
    const user = userEvent.setup()
    render(
      <Drawer>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>
          <DrawerTitle>Edit profile</DrawerTitle>
          <DrawerFooter>
            <DrawerClose>Cancel</DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )

    await user.click(screen.getByText('Open'))
    const closeButton = await screen.findByText('Cancel')
    await user.click(closeButton)

    expect(screen.queryByText('Edit profile')).not.toBeInTheDocument()
  })

  it('tags trigger and content with their data-slot for consumer styling hooks', async () => {
    const user = userEvent.setup()
    render(
      <Drawer>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>
          <DrawerTitle>Edit profile</DrawerTitle>
        </DrawerContent>
      </Drawer>
    )

    expect(screen.getByText('Open')).toHaveAttribute('data-slot', 'drawer-trigger')
    await user.click(screen.getByText('Open'))
    expect(await screen.findByText('Edit profile')).toHaveAttribute('data-slot', 'drawer-title')
  })
})

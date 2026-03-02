import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '../index'

function mountDialog(template: string) {
  return mount(
    {
      components: {
        Dialog,
        DialogTrigger,
        DialogContent,
        DialogHeader,
        DialogFooter,
        DialogTitle,
        DialogDescription,
        DialogClose,
      },
      template,
    },
    { attachTo: document.body },
  )
}

describe('Dialog', () => {
  it('renders without crashing and exposes trigger', () => {
    const w = mountDialog(
      '<Dialog><DialogTrigger>Open</DialogTrigger><DialogContent><DialogHeader><DialogTitle>Title</DialogTitle><DialogDescription>Desc</DialogDescription></DialogHeader></DialogContent></Dialog>',
    )
    expect(w.find('[data-slot="dialog-trigger"]').exists()).toBe(true)
    w.unmount()
  })

  it('DialogTrigger renders with data-slot="dialog-trigger"', () => {
    const w = mountDialog('<Dialog><DialogTrigger>Open</DialogTrigger></Dialog>')
    expect(w.find('[data-slot="dialog-trigger"]').exists()).toBe(true)
    w.unmount()
  })

  it('DialogTrigger renders as a button', () => {
    const w = mountDialog('<Dialog><DialogTrigger>Open</DialogTrigger></Dialog>')
    expect(w.find('[data-slot="dialog-trigger"]').element.tagName.toLowerCase()).toBe('button')
    w.unmount()
  })

  it('DialogContent has data-slot="dialog-content" when open', async () => {
    const w = mountDialog(
      '<Dialog :default-open="true"><DialogTrigger>Open</DialogTrigger><DialogContent>Body</DialogContent></Dialog>',
    )
    await flushPromises()
    expect(document.querySelector('[data-slot="dialog-content"]')).toBeTruthy()
    w.unmount()
  })

  it('DialogContent has role="dialog" when open', async () => {
    const w = mountDialog(
      '<Dialog :default-open="true"><DialogTrigger>Open</DialogTrigger><DialogContent>Body</DialogContent></Dialog>',
    )
    await flushPromises()
    expect(document.querySelector('[data-slot="dialog-content"]')?.getAttribute('role')).toBe('dialog')
    w.unmount()
  })

  it('DialogContent has data-state="open" when open', async () => {
    const w = mountDialog(
      '<Dialog :default-open="true"><DialogTrigger>Open</DialogTrigger><DialogContent>Body</DialogContent></Dialog>',
    )
    await flushPromises()
    expect(document.querySelector('[data-slot="dialog-content"]')?.getAttribute('data-state')).toBe('open')
    w.unmount()
  })

  it('DialogContent renders close button by default', async () => {
    const w = mountDialog(
      '<Dialog :default-open="true"><DialogTrigger>Open</DialogTrigger><DialogContent>Body</DialogContent></Dialog>',
    )
    await flushPromises()
    expect(document.querySelector('[data-slot="dialog-close"]')).toBeTruthy()
    w.unmount()
  })

  it('DialogContent hides close button when showCloseButton is false', async () => {
    const w = mountDialog(
      '<Dialog :default-open="true"><DialogTrigger>Open</DialogTrigger><DialogContent :show-close-button="false">Body</DialogContent></Dialog>',
    )
    await flushPromises()
    expect(document.querySelector('[data-slot="dialog-close"]')).toBeNull()
    w.unmount()
  })

  it('DialogHeader renders with data-slot="dialog-header"', async () => {
    const w = mountDialog(
      '<Dialog :default-open="true"><DialogTrigger>Open</DialogTrigger><DialogContent><DialogHeader>Header</DialogHeader></DialogContent></Dialog>',
    )
    await flushPromises()
    expect(document.querySelector('[data-slot="dialog-header"]')).toBeTruthy()
    w.unmount()
  })

  it('DialogFooter renders with data-slot="dialog-footer"', async () => {
    const w = mountDialog(
      '<Dialog :default-open="true"><DialogTrigger>Open</DialogTrigger><DialogContent><DialogFooter>Footer</DialogFooter></DialogContent></Dialog>',
    )
    await flushPromises()
    expect(document.querySelector('[data-slot="dialog-footer"]')).toBeTruthy()
    w.unmount()
  })

  it('DialogTitle renders with data-slot="dialog-title"', async () => {
    const w = mountDialog(
      '<Dialog :default-open="true"><DialogTrigger>Open</DialogTrigger><DialogContent><DialogTitle>Title</DialogTitle></DialogContent></Dialog>',
    )
    await flushPromises()
    expect(document.querySelector('[data-slot="dialog-title"]')).toBeTruthy()
    w.unmount()
  })

  it('DialogDescription renders with data-slot="dialog-description"', async () => {
    const w = mountDialog(
      '<Dialog :default-open="true"><DialogTrigger>Open</DialogTrigger><DialogContent><DialogDescription>Desc</DialogDescription></DialogContent></Dialog>',
    )
    await flushPromises()
    expect(document.querySelector('[data-slot="dialog-description"]')).toBeTruthy()
    w.unmount()
  })

  it('DialogClose renders with data-slot="dialog-close"', async () => {
    const w = mountDialog(
      '<Dialog :default-open="true"><DialogTrigger>Open</DialogTrigger><DialogContent><DialogClose>Close</DialogClose></DialogContent></Dialog>',
    )
    await flushPromises()
    expect(document.querySelectorAll('[data-slot="dialog-close"]').length).toBeGreaterThanOrEqual(1)
    w.unmount()
  })

  it('Dialog shows title text when open', async () => {
    const w = mountDialog(
      '<Dialog :default-open="true"><DialogTrigger>Open</DialogTrigger><DialogContent><DialogTitle>My Title</DialogTitle></DialogContent></Dialog>',
    )
    await flushPromises()
    expect(document.querySelector('[data-slot="dialog-title"]')?.textContent).toContain('My Title')
    w.unmount()
  })

  it('Dialog shows description text when open', async () => {
    const w = mountDialog(
      '<Dialog :default-open="true"><DialogTrigger>Open</DialogTrigger><DialogContent><DialogDescription>My Description</DialogDescription></DialogContent></Dialog>',
    )
    await flushPromises()
    expect(document.querySelector('[data-slot="dialog-description"]')?.textContent).toContain('My Description')
    w.unmount()
  })
})

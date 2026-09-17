import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { Popover, PopoverTrigger, PopoverContent, PopoverAnchor } from '../index'

function mountPopover(template: string) {
  return mount(
    {
      components: { Popover, PopoverTrigger, PopoverContent, PopoverAnchor },
      template,
    },
    { attachTo: document.body },
  )
}

describe('Popover', () => {
  it('PopoverTrigger renders with data-slot="popover-trigger"', () => {
    const w = mountPopover('<Popover><PopoverTrigger>Open</PopoverTrigger></Popover>')
    expect(w.find('[data-slot="popover-trigger"]').exists()).toBe(true)
    w.unmount()
  })

  it('PopoverTrigger renders as a button', () => {
    const w = mountPopover('<Popover><PopoverTrigger>Open</PopoverTrigger></Popover>')
    expect(w.find('[data-slot="popover-trigger"]').element.tagName.toLowerCase()).toBe('button')
    w.unmount()
  })

  it('PopoverContent has data-slot="popover-content" when open', async () => {
    const w = mountPopover(
      '<Popover :open="true"><PopoverTrigger>Open</PopoverTrigger><PopoverContent>Body</PopoverContent></Popover>',
    )
    await flushPromises()
    expect(document.querySelector('[data-slot="popover-content"]')).toBeTruthy()
    w.unmount()
  })

  it('PopoverContent has data-uipkge', async () => {
    const w = mountPopover(
      '<Popover :open="true"><PopoverTrigger>Open</PopoverTrigger><PopoverContent>Body</PopoverContent></Popover>',
    )
    await flushPromises()
    expect(document.querySelector('[data-slot="popover-content"]')?.getAttribute('data-uipkge')).toBeDefined()
    w.unmount()
  })

  it('PopoverContent has data-state="open" when open', async () => {
    const w = mountPopover(
      '<Popover :open="true"><PopoverTrigger>Open</PopoverTrigger><PopoverContent>Body</PopoverContent></Popover>',
    )
    await flushPromises()
    expect(document.querySelector('[data-slot="popover-content"]')?.getAttribute('data-state')).toBe('open')
    w.unmount()
  })

  it('PopoverContent renders slot content', async () => {
    const w = mountPopover(
      '<Popover :open="true"><PopoverTrigger>Open</PopoverTrigger><PopoverContent>My Popover Body</PopoverContent></Popover>',
    )
    await flushPromises()
    expect(document.querySelector('[data-slot="popover-content"]')?.textContent).toContain('My Popover Body')
    w.unmount()
  })

  it('PopoverContent has role="dialog"', async () => {
    const w = mountPopover(
      '<Popover :open="true"><PopoverTrigger>Open</PopoverTrigger><PopoverContent>Body</PopoverContent></Popover>',
    )
    await flushPromises()
    expect(document.querySelector('[data-slot="popover-content"]')?.getAttribute('role')).toBe('dialog')
    w.unmount()
  })

  it('PopoverAnchor renders without crashing', () => {
    const w = mountPopover(
      '<Popover><PopoverAnchor /><PopoverTrigger>Open</PopoverTrigger><PopoverContent>Body</PopoverContent></Popover>',
    )
    expect(w.find('[data-slot="popover-anchor"]').exists()).toBe(true)
    w.unmount()
  })
})

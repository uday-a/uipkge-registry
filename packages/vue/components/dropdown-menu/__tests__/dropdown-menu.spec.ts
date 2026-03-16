import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '../index'

function mountDropdown(template: string) {
  return mount(
    {
      components: {
        DropdownMenu,
        DropdownMenuTrigger,
        DropdownMenuContent,
        DropdownMenuItem,
        DropdownMenuGroup,
        DropdownMenuLabel,
        DropdownMenuSeparator,
      },
      template,
    },
    { attachTo: document.body },
  )
}

describe('DropdownMenu', () => {
  it('DropdownMenuTrigger renders with data-slot="dropdown-menu-trigger"', () => {
    const w = mountDropdown('<DropdownMenu><DropdownMenuTrigger>Open</DropdownMenuTrigger></DropdownMenu>')
    expect(w.find('[data-slot="dropdown-menu-trigger"]').exists()).toBe(true)
    w.unmount()
  })

  it('DropdownMenuTrigger renders as a button', () => {
    const w = mountDropdown('<DropdownMenu><DropdownMenuTrigger>Open</DropdownMenuTrigger></DropdownMenu>')
    expect(w.find('[data-slot="dropdown-menu-trigger"]').element.tagName.toLowerCase()).toBe('button')
    w.unmount()
  })

  it('DropdownMenuItem renders with data-slot="dropdown-menu-item"', async () => {
    const w = mountDropdown(
      '<DropdownMenu :default-open="true"><DropdownMenuTrigger>Open</DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem>Item</DropdownMenuItem></DropdownMenuContent></DropdownMenu>',
    )
    await flushPromises()
    expect(document.querySelector('[data-slot="dropdown-menu-item"]')).toBeTruthy()
    w.unmount()
  })

  it('DropdownMenuItem has data-uipkge', async () => {
    const w = mountDropdown(
      '<DropdownMenu :default-open="true"><DropdownMenuTrigger>Open</DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem>Item</DropdownMenuItem></DropdownMenuContent></DropdownMenu>',
    )
    await flushPromises()
    expect(document.querySelector('[data-slot="dropdown-menu-item"]')?.getAttribute('data-uipkge')).toBeDefined()
    w.unmount()
  })

  it('DropdownMenuItem applies data-inset when inset prop is true', async () => {
    const w = mountDropdown(
      '<DropdownMenu :default-open="true"><DropdownMenuTrigger>Open</DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem :inset="true">Item</DropdownMenuItem></DropdownMenuContent></DropdownMenu>',
    )
    await flushPromises()
    expect(document.querySelector('[data-slot="dropdown-menu-item"]')?.getAttribute('data-inset')).toBeDefined()
    w.unmount()
  })

  it('DropdownMenuItem applies data-variant when variant is destructive', async () => {
    const w = mountDropdown(
      '<DropdownMenu :default-open="true"><DropdownMenuTrigger>Open</DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem variant="destructive">Delete</DropdownMenuItem></DropdownMenuContent></DropdownMenu>',
    )
    await flushPromises()
    expect(document.querySelector('[data-slot="dropdown-menu-item"]')?.getAttribute('data-variant')).toBe('destructive')
    w.unmount()
  })

  it('DropdownMenuContent has data-slot="dropdown-menu-content" when open', async () => {
    const w = mountDropdown(
      '<DropdownMenu :default-open="true"><DropdownMenuTrigger>Open</DropdownMenuTrigger><DropdownMenuContent>Content</DropdownMenuContent></DropdownMenu>',
    )
    await flushPromises()
    expect(document.querySelector('[data-slot="dropdown-menu-content"]')).toBeTruthy()
    w.unmount()
  })

  it('DropdownMenuLabel renders with data-slot="dropdown-menu-label"', async () => {
    const w = mountDropdown(
      '<DropdownMenu :default-open="true"><DropdownMenuTrigger>Open</DropdownMenuTrigger><DropdownMenuContent><DropdownMenuLabel>Label</DropdownMenuLabel></DropdownMenuContent></DropdownMenu>',
    )
    await flushPromises()
    expect(document.querySelector('[data-slot="dropdown-menu-label"]')).toBeTruthy()
    w.unmount()
  })

  it('DropdownMenuSeparator renders with data-slot="dropdown-menu-separator"', async () => {
    const w = mountDropdown(
      '<DropdownMenu :default-open="true"><DropdownMenuTrigger>Open</DropdownMenuTrigger><DropdownMenuContent><DropdownMenuSeparator /></DropdownMenuContent></DropdownMenu>',
    )
    await flushPromises()
    expect(document.querySelector('[data-slot="dropdown-menu-separator"]')).toBeTruthy()
    w.unmount()
  })

  it('DropdownMenuItem renders slot content', async () => {
    const w = mountDropdown(
      '<DropdownMenu :default-open="true"><DropdownMenuTrigger>Open</DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem>My Item Text</DropdownMenuItem></DropdownMenuContent></DropdownMenu>',
    )
    await flushPromises()
    expect(document.querySelector('[data-slot="dropdown-menu-item"]')?.textContent).toContain('My Item Text')
    w.unmount()
  })

  it('DropdownMenuContent has data-uipkge', async () => {
    const w = mountDropdown(
      '<DropdownMenu :default-open="true"><DropdownMenuTrigger>Open</DropdownMenuTrigger><DropdownMenuContent>Content</DropdownMenuContent></DropdownMenu>',
    )
    await flushPromises()
    expect(document.querySelector('[data-slot="dropdown-menu-content"]')?.getAttribute('data-uipkge')).toBeDefined()
    w.unmount()
  })
})

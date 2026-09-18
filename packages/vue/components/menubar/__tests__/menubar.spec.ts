import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarGroup,
  MenubarSeparator,
  MenubarLabel,
  MenubarShortcut,
} from '../index'

function mountMenubar(template: string) {
  return mount(
    {
      components: {
        Menubar,
        MenubarMenu,
        MenubarTrigger,
        MenubarContent,
        MenubarItem,
        MenubarGroup,
        MenubarSeparator,
        MenubarLabel,
        MenubarShortcut,
      },
      template,
    },
    { attachTo: document.body },
  )
}

const openTemplate = `
  <Menubar default-value="file">
    <MenubarMenu value="file">
      <MenubarTrigger>File</MenubarTrigger>
      <MenubarContent>
        <MenubarGroup>
          <MenubarLabel>File</MenubarLabel>
          <MenubarItem>New Tab</MenubarItem>
          <MenubarItem variant="destructive">Exit</MenubarItem>
          <MenubarSeparator />
        </MenubarGroup>
      </MenubarContent>
    </MenubarMenu>
    <MenubarMenu value="edit">
      <MenubarTrigger>Edit</MenubarTrigger>
      <MenubarContent>
        <MenubarGroup>
          <MenubarItem>Undo <MenubarShortcut>⌘Z</MenubarShortcut></MenubarItem>
        </MenubarGroup>
      </MenubarContent>
    </MenubarMenu>
  </Menubar>
`

const closedTemplate = `
  <Menubar>
    <MenubarMenu value="file">
      <MenubarTrigger>File</MenubarTrigger>
    </MenubarMenu>
    <MenubarMenu value="edit">
      <MenubarTrigger>Edit</MenubarTrigger>
    </MenubarMenu>
  </Menubar>
`

describe('Menubar', () => {
  it('renders root with data-slot="menubar"', () => {
    const w = mountMenubar(closedTemplate)
    expect(w.find('[data-slot="menubar"]').exists()).toBe(true)
    w.unmount()
  })

  it('has data-uipkge on root', () => {
    const w = mountMenubar(closedTemplate)
    expect(w.find('[data-slot="menubar"]').attributes('data-uipkge')).toBeDefined()
    w.unmount()
  })

  it('renders triggers with data-slot="menubar-trigger"', () => {
    const w = mountMenubar(closedTemplate)
    expect(w.findAll('[data-slot="menubar-trigger"]').length).toBe(2)
    w.unmount()
  })

  it('applies data-orientation on root', () => {
    const w = mountMenubar(closedTemplate)
    expect(w.find('[data-slot="menubar"]').attributes('data-orientation')).toBe('horizontal')
    w.unmount()
  })

  it('renders menu items with data-slot="menubar-item" when open', async () => {
    const w = mountMenubar(openTemplate)
    await flushPromises()
    const items = document.querySelectorAll('[data-slot="menubar-item"]')
    expect(items.length).toBeGreaterThanOrEqual(2)
    w.unmount()
  })

  it('items have data-uipkge', async () => {
    const w = mountMenubar(openTemplate)
    await flushPromises()
    const item = document.querySelector('[data-slot="menubar-item"]')
    expect(item?.getAttribute('data-uipkge')).toBeDefined()
    w.unmount()
  })

  it('renders MenubarGroup with data-slot="menubar-group" when open', async () => {
    const w = mountMenubar(openTemplate)
    await flushPromises()
    expect(document.querySelector('[data-slot="menubar-group"]')).toBeTruthy()
    w.unmount()
  })

  it('renders MenubarSeparator with data-slot="menubar-separator" when open', async () => {
    const w = mountMenubar(openTemplate)
    await flushPromises()
    expect(document.querySelector('[data-slot="menubar-separator"]')).toBeTruthy()
    w.unmount()
  })
})

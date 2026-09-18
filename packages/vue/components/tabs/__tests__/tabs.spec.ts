import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../index'

function mountTabs(overrides: Record<string, unknown> = {}) {
  return mount(
    {
      components: { Tabs, TabsList, TabsTrigger, TabsContent },
      template:
        '<Tabs :default-value="val"><TabsList><TabsTrigger value="tab1">Tab 1</TabsTrigger><TabsTrigger value="tab2">Tab 2</TabsTrigger></TabsList><TabsContent value="tab1">Content 1</TabsContent><TabsContent value="tab2">Content 2</TabsContent></Tabs>',
      data() {
        return { val: overrides.defaultValue ?? 'tab1' }
      },
    },
    { attachTo: document.body },
  )
}

describe('Tabs', () => {
  it('renders with data-slot="tabs"', () => {
    const w = mountTabs()
    expect(w.find('[data-slot="tabs"]').exists()).toBe(true)
    w.unmount()
  })

  it('has data-uipkge', () => {
    const w = mountTabs()
    expect(w.find('[data-slot="tabs"]').attributes('data-uipkge')).toBeDefined()
    w.unmount()
  })

  it('TabsList renders with data-slot="tabs-list"', () => {
    const w = mountTabs()
    expect(w.find('[data-slot="tabs-list"]').exists()).toBe(true)
    w.unmount()
  })

  it('TabsTrigger renders with data-slot="tabs-trigger"', () => {
    const w = mountTabs()
    expect(w.findAll('[data-slot="tabs-trigger"]').length).toBe(2)
    w.unmount()
  })

  it('TabsContent renders with data-slot="tabs-content"', () => {
    const w = mountTabs()
    expect(w.findAll('[data-slot="tabs-content"]').length).toBe(2)
    w.unmount()
  })

  it('TabsTrigger has role="tab"', () => {
    const w = mountTabs()
    const trigger = w.find('[data-slot="tabs-trigger"]')
    expect(trigger.attributes('role')).toBe('tab')
    w.unmount()
  })

  it('TabsContent has role="tabpanel"', () => {
    const w = mountTabs()
    const content = w.find('[data-slot="tabs-content"]')
    expect(content.attributes('role')).toBe('tabpanel')
    w.unmount()
  })

  it('TabsTrigger shows data-state="active" when selected', () => {
    const w = mountTabs({ defaultValue: 'tab1' })
    const triggers = w.findAll('[data-slot="tabs-trigger"]')
    expect(triggers[0].attributes('data-state')).toBe('active')
    w.unmount()
  })

  it('TabsTrigger shows data-state="inactive" when not selected', () => {
    const w = mountTabs({ defaultValue: 'tab1' })
    const triggers = w.findAll('[data-slot="tabs-trigger"]')
    expect(triggers[1].attributes('data-state')).toBe('inactive')
    w.unmount()
  })

  it('TabsTrigger renders slot content', () => {
    const w = mountTabs()
    const triggers = w.findAll('[data-slot="tabs-trigger"]')
    expect(triggers[0].text()).toContain('Tab 1')
    w.unmount()
  })

  it('TabsContent renders slot content when active', () => {
    const w = mountTabs({ defaultValue: 'tab1' })
    const contents = w.findAll('[data-slot="tabs-content"]')
    expect(contents[0].text()).toContain('Content 1')
    w.unmount()
  })

  it('TabsTrigger is disabled when disabled prop is true', () => {
    const w = mount(
      {
        components: { Tabs, TabsList, TabsTrigger, TabsContent },
        template:
          '<Tabs :default-value="val"><TabsList><TabsTrigger value="tab1">Tab 1</TabsTrigger><TabsTrigger value="tab2" disabled>Tab 2</TabsTrigger></TabsList><TabsContent value="tab1">Content 1</TabsContent><TabsContent value="tab2">Content 2</TabsContent></Tabs>',
        data() {
          return { val: 'tab1' }
        },
      },
      { attachTo: document.body },
    )
    const triggers = w.findAll('[data-slot="tabs-trigger"]')
    expect(triggers[1].attributes('disabled')).toBeDefined()
    w.unmount()
  })

  it('TabsList has data-slot="tabs-indicator" when animated', () => {
    const w = mountTabs()
    expect(w.find('[data-slot="tabs-indicator"]').exists()).toBe(true)
    w.unmount()
  })

  it('Tabs applies data-orientation attribute', () => {
    const w = mountTabs()
    expect(w.find('[data-slot="tabs"]').attributes('data-orientation')).toBe('horizontal')
    w.unmount()
  })

  it('TabsTrigger has aria-selected when active', () => {
    const w = mountTabs({ defaultValue: 'tab1' })
    const triggers = w.findAll('[data-slot="tabs-trigger"]')
    expect(triggers[0].attributes('aria-selected')).toBe('true')
    w.unmount()
  })
})

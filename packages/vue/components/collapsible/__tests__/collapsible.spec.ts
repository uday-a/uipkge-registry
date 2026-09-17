import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '../index'

function mountCollapsible(defaultOpen: boolean | null = null) {
  const openAttr = defaultOpen === null ? '' : defaultOpen ? ' :default-open="true"' : ' :default-open="false"'
  return mount(
    {
      components: { Collapsible, CollapsibleTrigger, CollapsibleContent },
      template: `<Collapsible${openAttr}><CollapsibleTrigger>Toggle</CollapsibleTrigger><CollapsibleContent>Content</CollapsibleContent></Collapsible>`,
    },
    { attachTo: document.body },
  )
}

describe('Collapsible', () => {
  it('renders with data-slot="collapsible"', () => {
    const w = mountCollapsible()
    expect(w.find('[data-slot="collapsible"]').exists()).toBe(true)
    w.unmount()
  })

  it('has data-uipkge', () => {
    const w = mountCollapsible()
    expect(w.find('[data-slot="collapsible"]').attributes('data-uipkge')).toBeDefined()
    w.unmount()
  })

  it('CollapsibleTrigger renders with data-slot="collapsible-trigger"', () => {
    const w = mountCollapsible()
    expect(w.find('[data-slot="collapsible-trigger"]').exists()).toBe(true)
    w.unmount()
  })

  it('CollapsibleContent renders with data-slot="collapsible-content" when open', () => {
    const w = mountCollapsible(true)
    expect(w.find('[data-slot="collapsible-content"]').exists()).toBe(true)
    w.unmount()
  })

  it('CollapsibleTrigger is a button', () => {
    const w = mountCollapsible()
    const trigger = w.find('[data-slot="collapsible-trigger"]')
    expect(trigger.element.tagName.toLowerCase() === 'button' || trigger.attributes('as') === 'button').toBe(true)
    w.unmount()
  })

  it('Collapsible shows data-state="open" when open', () => {
    const w = mountCollapsible(true)
    expect(w.find('[data-slot="collapsible"]').attributes('data-state')).toBe('open')
    w.unmount()
  })

  it('Collapsible shows data-state="closed" when closed', () => {
    const w = mountCollapsible(false)
    expect(w.find('[data-slot="collapsible"]').attributes('data-state')).toBe('closed')
    w.unmount()
  })

  it('CollapsibleContent renders slot content when open', () => {
    const w = mountCollapsible(true)
    const content = w.find('[data-slot="collapsible-content"]')
    expect(content.text()).toContain('Content')
    w.unmount()
  })

  it('CollapsibleTrigger renders slot content', () => {
    const w = mountCollapsible()
    const trigger = w.find('[data-slot="collapsible-trigger"]')
    expect(trigger.text()).toContain('Toggle')
    w.unmount()
  })
})

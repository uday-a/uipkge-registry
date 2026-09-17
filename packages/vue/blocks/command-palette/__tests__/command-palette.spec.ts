import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CommandPalette from '../CommandPalette.vue'

describe('CommandPalette', () => {
  it('renders without crashing', () => {
    const w = mount(CommandPalette, { attachTo: document.body })
    expect(w.exists()).toBe(true)
    w.unmount()
  })

  it('renders trigger button', () => {
    const w = mount(CommandPalette, { attachTo: document.body })
    const trigger = w.find('button[aria-label="Open command palette"]')
    expect(trigger.exists()).toBe(true)
    w.unmount()
  })

  it('opens dialog when trigger is clicked', async () => {
    const w = mount(CommandPalette, { attachTo: document.body })
    const trigger = w.find('button[aria-label="Open command palette"]')
    await trigger.trigger('click')
    // CommandDialog teleports to document.body
    expect(document.body.textContent).toContain('Command palette')
    w.unmount()
  })

  it('renders command items', async () => {
    const w = mount(CommandPalette, { attachTo: document.body })
    await w.find('button[aria-label="Open command palette"]').trigger('click')
    expect(document.body.textContent).toContain('Dashboard')
    expect(document.body.textContent).toContain('Inbox')
    expect(document.body.textContent).toContain('Settings')
    w.unmount()
  })
})

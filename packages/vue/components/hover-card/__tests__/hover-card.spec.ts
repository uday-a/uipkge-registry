import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { HoverCard, HoverCardTrigger, HoverCardContent } from '../index'

function mountHoverCard(template: string) {
  return mount(
    {
      components: { HoverCard, HoverCardTrigger, HoverCardContent },
      template,
    },
    { attachTo: document.body },
  )
}

describe('HoverCard', () => {
  it('HoverCardTrigger renders with data-slot="hover-card-trigger"', () => {
    const w = mountHoverCard('<HoverCard><HoverCardTrigger>Hover</HoverCardTrigger></HoverCard>')
    expect(w.find('[data-slot="hover-card-trigger"]').exists()).toBe(true)
    w.unmount()
  })

  it('HoverCardContent has data-slot="hover-card-content" when open', async () => {
    const w = mountHoverCard(
      '<HoverCard :default-open="true"><HoverCardTrigger>Hover</HoverCardTrigger><HoverCardContent>Body</HoverCardContent></HoverCard>',
    )
    await flushPromises()
    expect(document.querySelector('[data-slot="hover-card-content"]')).toBeTruthy()
    w.unmount()
  })

  it('HoverCardContent has data-uipkge', async () => {
    const w = mountHoverCard(
      '<HoverCard :default-open="true"><HoverCardTrigger>Hover</HoverCardTrigger><HoverCardContent>Body</HoverCardContent></HoverCard>',
    )
    await flushPromises()
    expect(document.querySelector('[data-slot="hover-card-content"]')?.getAttribute('data-uipkge')).toBeDefined()
    w.unmount()
  })

  it('HoverCardContent has data-state="open" when open', async () => {
    const w = mountHoverCard(
      '<HoverCard :default-open="true"><HoverCardTrigger>Hover</HoverCardTrigger><HoverCardContent>Body</HoverCardContent></HoverCard>',
    )
    await flushPromises()
    expect(document.querySelector('[data-slot="hover-card-content"]')?.getAttribute('data-state')).toBe('open')
    w.unmount()
  })

  it('HoverCardContent renders slot content', async () => {
    const w = mountHoverCard(
      '<HoverCard :default-open="true"><HoverCardTrigger>Hover</HoverCardTrigger><HoverCardContent>My Hover Content</HoverCardContent></HoverCard>',
    )
    await flushPromises()
    expect(document.querySelector('[data-slot="hover-card-content"]')?.textContent).toContain('My Hover Content')
    w.unmount()
  })

  it('HoverCardTrigger renders slot content', () => {
    const w = mountHoverCard('<HoverCard><HoverCardTrigger>Trigger Label</HoverCardTrigger></HoverCard>')
    expect(w.find('[data-slot="hover-card-trigger"]').text()).toContain('Trigger Label')
    w.unmount()
  })
})

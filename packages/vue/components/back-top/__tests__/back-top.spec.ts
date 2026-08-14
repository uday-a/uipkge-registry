import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { BackTop } from '../index'

function mountBackTop(props: Record<string, unknown> = {}) {
  return mount(
    {
      components: { BackTop },
      template: `
        <BackTop
          :threshold="threshold"
          :size="size"
          :position="position"
          :aria-label="ariaLabel"
        />`,
      computed: {
        threshold: () => props.threshold ?? 0,
        size: () => props.size ?? 'default',
        position: () => props.position ?? 'bottom-right',
        ariaLabel: () => props.ariaLabel ?? 'Scroll to top',
      },
    },
    { attachTo: document.body },
  )
}

describe('BackTop', () => {
  it('renders button with data-slot="back-top"', () => {
    const w = mountBackTop({ threshold: 0 })
    expect(w.find('[data-slot="back-top"]').exists()).toBe(true)
    w.unmount()
  })

  it('has data-uipkge attribute', () => {
    const w = mountBackTop({ threshold: 0 })
    expect(w.find('[data-uipkge]').exists()).toBe(true)
    w.unmount()
  })

  it('renders a button element', () => {
    const w = mountBackTop({ threshold: 0 })
    const btn = w.find('[data-slot="back-top"]')
    expect(btn.element.tagName.toLowerCase()).toBe('button')
    w.unmount()
  })

  it('applies data-state="open" when visible', async () => {
    const w = mountBackTop({ threshold: 0 })
    await flushPromises()
    expect(w.find('[data-slot="back-top"]').attributes('data-state')).toBe('open')
    w.unmount()
  })

  it('applies data-size attribute', () => {
    const w = mountBackTop({ threshold: 0, size: 'lg' })
    expect(w.find('[data-slot="back-top"]').attributes('data-size')).toBe('lg')
    w.unmount()
  })

  it('applies data-position attribute', () => {
    const w = mountBackTop({ threshold: 0, position: 'top-left' })
    expect(w.find('[data-slot="back-top"]').attributes('data-position')).toBe('top-left')
    w.unmount()
  })

  it('renders arrow icon by default', () => {
    const w = mountBackTop({ threshold: 0 })
    expect(w.find('svg').exists()).toBe(true)
    w.unmount()
  })

  it('has accessible aria-label', () => {
    const w = mountBackTop({ threshold: 0, ariaLabel: 'Back to top' })
    expect(w.find('[data-slot="back-top"]').attributes('aria-label')).toBe('Back to top')
    w.unmount()
  })

  it('emits click event when clicked', async () => {
    const w = mountBackTop({ threshold: 0 })
    await w.find('[data-slot="back-top"]').trigger('click')
    expect(w.emitted('click')).toBeTruthy()
    w.unmount()
  })
})

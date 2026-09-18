import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Link } from '../index'

function mountLink(props: Record<string, unknown> = {}, slots: Record<string, string> = {}) {
  return mount(Link, { props, slots, attachTo: document.body })
}

describe('Link', () => {
  it('renders with data-slot="link"', () => {
    const w = mountLink({ href: '/about' })
    expect(w.find('[data-slot="link"]').exists()).toBe(true)
    w.unmount()
  })

  it('has data-uipkge', () => {
    const w = mountLink({ href: '/about' })
    expect(w.find('[data-uipkge]').exists()).toBe(true)
    w.unmount()
  })

  it('renders as an anchor element', () => {
    const w = mountLink({ href: '/about' })
    expect(w.find('[data-slot="link"]').element.tagName.toLowerCase()).toBe('a')
    w.unmount()
  })

  it('renders the href attribute', () => {
    const w = mountLink({ href: '/about' })
    expect(w.find('[data-slot="link"]').attributes('href')).toBe('/about')
    w.unmount()
  })

  it('renders slot children content', () => {
    const w = mountLink({ href: '/about' }, { default: 'Click here' })
    expect(w.text()).toContain('Click here')
    w.unmount()
  })

  it('applies data-color attribute', () => {
    const w = mountLink({ href: '/about', color: 'muted' })
    expect(w.find('[data-slot="link"]').attributes('data-color')).toBe('muted')
    w.unmount()
  })

  it('applies data-underline attribute', () => {
    const w = mountLink({ href: '/about', underline: 'always' })
    expect(w.find('[data-slot="link"]').attributes('data-underline')).toBe('always')
    w.unmount()
  })

  it('opens external http href in a new tab', () => {
    const w = mountLink({ href: 'https://example.com' })
    expect(w.find('[data-slot="link"]').attributes('target')).toBe('_blank')
    expect(w.find('[data-slot="link"]').attributes('rel')).toBe('noopener noreferrer')
    w.unmount()
  })
})

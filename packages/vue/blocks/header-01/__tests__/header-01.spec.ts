import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Header01 from '../Header01.vue'

describe('Header01', () => {
  it('renders without crashing', () => {
    const w = mount(Header01, { attachTo: document.body })
    expect(w.find('header').exists()).toBe(true)
    w.unmount()
  })

  it('renders brand/logo', () => {
    const w = mount(Header01, { attachTo: document.body })
    expect(w.text()).toContain('Acme')
    w.unmount()
  })

  it('renders navigation links', () => {
    const w = mount(Header01, { attachTo: document.body })
    const nav = w.find('nav[aria-label="Primary"]')
    expect(nav.exists()).toBe(true)
    expect(nav.findAll('a').length).toBeGreaterThanOrEqual(4)
    w.unmount()
  })

  it('renders sign in button', () => {
    const w = mount(Header01, { attachTo: document.body })
    const buttons = w.findAll('button')
    expect(buttons.some((b) => b.text().includes('Sign in'))).toBe(true)
    w.unmount()
  })

  it('renders mobile menu button', () => {
    const w = mount(Header01, { attachTo: document.body })
    const menuBtn = w.find('button[aria-label="Open menu"]')
    expect(menuBtn.exists()).toBe(true)
    w.unmount()
  })
})

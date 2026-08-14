import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Footer01 from '../Footer01.vue'

describe('Footer01', () => {
  it('renders without crashing', () => {
    const w = mount(Footer01, { attachTo: document.body })
    expect(w.find('footer').exists()).toBe(true)
    w.unmount()
  })

  it('renders brand section', () => {
    const w = mount(Footer01, { attachTo: document.body })
    expect(w.text()).toContain('Acme')
    w.unmount()
  })

  it('renders link columns', () => {
    const w = mount(Footer01, { attachTo: document.body })
    const headings = w.findAll('h3')
    expect(headings.length).toBeGreaterThanOrEqual(4)
    expect(w.text()).toContain('Product')
    expect(w.text()).toContain('Company')
    w.unmount()
  })

  it('renders newsletter form', () => {
    const w = mount(Footer01, { attachTo: document.body })
    const form = w.find('form')
    expect(form.exists()).toBe(true)
    expect(form.find('input[type="email"]').exists()).toBe(true)
    expect(w.text()).toContain('Subscribe')
    w.unmount()
  })

  it('renders social icons', () => {
    const w = mount(Footer01, { attachTo: document.body })
    const github = w.find('a[aria-label="GitHub"]')
    const twitter = w.find('a[aria-label="Twitter"]')
    const linkedin = w.find('a[aria-label="LinkedIn"]')
    expect(github.exists()).toBe(true)
    expect(twitter.exists()).toBe(true)
    expect(linkedin.exists()).toBe(true)
    w.unmount()
  })
})

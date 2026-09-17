import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { SectionCard } from '../index'

describe('SectionCard', () => {
  it('renders container with data-slot="card" (via Card)', () => {
    const w = mount(SectionCard, { props: { title: 'My Title' }, attachTo: document.body })
    expect(w.find('[data-slot="card"]').exists()).toBe(true)
    w.unmount()
  })

  it('has data-uipkge (via Card)', () => {
    const w = mount(SectionCard, { props: { title: 'My Title' }, attachTo: document.body })
    expect(w.find('[data-uipkge]').exists()).toBe(true)
    w.unmount()
  })

  it('renders the title', () => {
    const w = mount(SectionCard, { props: { title: 'My Title' }, attachTo: document.body })
    expect(w.text()).toContain('My Title')
    w.unmount()
  })

  it('renders the description when provided', () => {
    const w = mount(SectionCard, { props: { title: 'T', description: 'A description' }, attachTo: document.body })
    expect(w.text()).toContain('A description')
    w.unmount()
  })

  it('does not render description when omitted', () => {
    const w = mount(SectionCard, { props: { title: 'T' }, attachTo: document.body })
    expect(w.find('[data-slot="card-description"]').exists()).toBe(false)
    w.unmount()
  })

  it('renders default slot content', () => {
    const w = mount(SectionCard, {
      props: { title: 'T' },
      slots: { default: '<p>Body content</p>' },
      attachTo: document.body,
    })
    expect(w.text()).toContain('Body content')
    w.unmount()
  })

  it('renders header-action slot', () => {
    const w = mount(SectionCard, {
      props: { title: 'T' },
      slots: { 'header-action': '<button>Action</button>' },
      attachTo: document.body,
    })
    expect(w.text()).toContain('Action')
    w.unmount()
  })

  it('renders footer slot', () => {
    const w = mount(SectionCard, {
      props: { title: 'T' },
      slots: { footer: '<div>Footer text</div>' },
      attachTo: document.body,
    })
    expect(w.text()).toContain('Footer text')
    w.unmount()
  })
})

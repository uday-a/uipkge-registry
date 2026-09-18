import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../index'

describe('Card', () => {
  it('renders with data-slot="card"', () => {
    const w = mount(Card, { attachTo: document.body })
    expect(w.find('[data-slot="card"]').exists()).toBe(true)
    w.unmount()
  })

  it('has data-uipkge', () => {
    const w = mount(Card, { attachTo: document.body })
    expect(w.find('[data-uipkge]').exists()).toBe(true)
    w.unmount()
  })

  it('renders as a div', () => {
    const w = mount(Card, { attachTo: document.body })
    expect(w.find('div[data-slot="card"]').exists()).toBe(true)
    w.unmount()
  })

  it('renders slot content', () => {
    const w = mount(Card, { slots: { default: '<p>Body</p>' }, attachTo: document.body })
    expect(w.text()).toContain('Body')
    w.unmount()
  })

  it('applies default variant classes', () => {
    const w = mount(Card, { props: { variant: 'default' }, attachTo: document.body })
    expect(w.find('[data-slot="card"]').classes()).toContain('border-border')
    w.unmount()
  })

  it('applies elevated variant classes', () => {
    const w = mount(Card, { props: { variant: 'elevated' }, attachTo: document.body })
    expect(w.find('[data-slot="card"]').classes()).toContain('shadow-md')
    w.unmount()
  })

  it('applies outline variant classes', () => {
    const w = mount(Card, { props: { variant: 'outline' }, attachTo: document.body })
    expect(w.find('[data-slot="card"]').classes()).toContain('border-2')
    w.unmount()
  })

  it('applies ghost variant classes', () => {
    const w = mount(Card, { props: { variant: 'ghost' }, attachTo: document.body })
    expect(w.find('[data-slot="card"]').classes()).toContain('shadow-none')
    w.unmount()
  })
})

describe('CardHeader', () => {
  it('renders with data-slot="card-header"', () => {
    const w = mount(CardHeader, { attachTo: document.body })
    expect(w.find('[data-slot="card-header"]').exists()).toBe(true)
    w.unmount()
  })

  it('renders slot content', () => {
    const w = mount(CardHeader, { slots: { default: '<div>Header</div>' }, attachTo: document.body })
    expect(w.text()).toContain('Header')
    w.unmount()
  })
})

describe('CardTitle', () => {
  it('renders with data-slot="card-title"', () => {
    const w = mount(CardTitle, { slots: { default: 'Title' }, attachTo: document.body })
    expect(w.find('[data-slot="card-title"]').exists()).toBe(true)
    w.unmount()
  })

  it('renders as h3 by default', () => {
    const w = mount(CardTitle, { slots: { default: 'Title' }, attachTo: document.body })
    expect(w.find('h3[data-slot="card-title"]').exists()).toBe(true)
    w.unmount()
  })
})

describe('CardDescription', () => {
  it('renders with data-slot="card-description"', () => {
    const w = mount(CardDescription, { slots: { default: 'Desc' }, attachTo: document.body })
    expect(w.find('[data-slot="card-description"]').exists()).toBe(true)
    w.unmount()
  })

  it('renders as a p element', () => {
    const w = mount(CardDescription, { slots: { default: 'Desc' }, attachTo: document.body })
    expect(w.find('p[data-slot="card-description"]').exists()).toBe(true)
    w.unmount()
  })
})

describe('CardContent', () => {
  it('renders with data-slot="card-content"', () => {
    const w = mount(CardContent, { attachTo: document.body })
    expect(w.find('[data-slot="card-content"]').exists()).toBe(true)
    w.unmount()
  })

  it('renders slot content', () => {
    const w = mount(CardContent, { slots: { default: '<p>Content</p>' }, attachTo: document.body })
    expect(w.text()).toContain('Content')
    w.unmount()
  })
})

describe('CardFooter', () => {
  it('renders with data-slot="card-footer"', () => {
    const w = mount(CardFooter, { attachTo: document.body })
    expect(w.find('[data-slot="card-footer"]').exists()).toBe(true)
    w.unmount()
  })

  it('renders slot content', () => {
    const w = mount(CardFooter, { slots: { default: '<button>Action</button>' }, attachTo: document.body })
    expect(w.text()).toContain('Action')
    w.unmount()
  })
})

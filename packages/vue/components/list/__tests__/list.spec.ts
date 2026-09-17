import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { List, ListItem, ListSubheader } from '../index'

describe('List', () => {
  it('renders with data-slot="list"', () => {
    const w = mount(List, { attachTo: document.body })
    expect(w.find('[data-slot="list"]').exists()).toBe(true)
    w.unmount()
  })

  it('has data-uipkge', () => {
    const w = mount(List, { attachTo: document.body })
    expect(w.find('[data-uipkge]').exists()).toBe(true)
    w.unmount()
  })

  it('renders as ul by default', () => {
    const w = mount(List, { attachTo: document.body })
    expect(w.find('ul[data-slot="list"]').exists()).toBe(true)
    w.unmount()
  })

  it('renders as ol when as="ol"', () => {
    const w = mount(List, { props: { as: 'ol' }, attachTo: document.body })
    expect(w.find('ol[data-slot="list"]').exists()).toBe(true)
    w.unmount()
  })

  it('renders slot content', () => {
    const w = mount(List, { slots: { default: '<li>Item</li>' }, attachTo: document.body })
    expect(w.text()).toContain('Item')
    w.unmount()
  })
})

describe('ListItem', () => {
  it('renders with data-slot="list-item"', () => {
    const w = mount(ListItem, { slots: { default: 'Text' }, attachTo: document.body })
    expect(w.find('[data-slot="list-item"]').exists()).toBe(true)
    w.unmount()
  })

  it('has data-uipkge', () => {
    const w = mount(ListItem, { slots: { default: 'Text' }, attachTo: document.body })
    expect(w.find('[data-uipkge]').exists()).toBe(true)
    w.unmount()
  })

  it('sets data-active when active', () => {
    const w = mount(ListItem, { props: { active: true }, slots: { default: 'Text' }, attachTo: document.body })
    expect(w.find('[data-slot="list-item"]').attributes('data-active')).toBe('')
    w.unmount()
  })

  it('sets data-disabled when disabled', () => {
    const w = mount(ListItem, { props: { disabled: true }, slots: { default: 'Text' }, attachTo: document.body })
    expect(w.find('[data-slot="list-item"]').attributes('data-disabled')).toBe('')
    w.unmount()
  })

  it('renders as li by default', () => {
    const w = mount(ListItem, { slots: { default: 'Text' }, attachTo: document.body })
    expect(w.find('li[data-slot="list-item"]').exists()).toBe(true)
    w.unmount()
  })
})

describe('ListSubheader', () => {
  it('renders with data-slot="list-subheader"', () => {
    const w = mount(ListSubheader, { slots: { default: 'Header' }, attachTo: document.body })
    expect(w.find('[data-slot="list-subheader"]').exists()).toBe(true)
    w.unmount()
  })

  it('has data-uipkge', () => {
    const w = mount(ListSubheader, { slots: { default: 'Header' }, attachTo: document.body })
    expect(w.find('[data-uipkge]').exists()).toBe(true)
    w.unmount()
  })
})

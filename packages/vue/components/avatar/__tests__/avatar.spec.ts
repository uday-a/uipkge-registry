import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Avatar, AvatarImage, AvatarFallback, AvatarGroup } from '../index'

describe('Avatar', () => {
  it('renders with data-slot="avatar"', () => {
    const w = mount(Avatar, { attachTo: document.body })
    expect(w.find('[data-slot="avatar"]').exists()).toBe(true)
    w.unmount()
  })

  it('has data-uipkge', () => {
    const w = mount(Avatar, { attachTo: document.body })
    expect(w.find('[data-uipkge]').exists()).toBe(true)
    w.unmount()
  })

  it('renders as a span', () => {
    const w = mount(Avatar, { attachTo: document.body })
    expect(w.find('span[data-slot="avatar"]').exists()).toBe(true)
    w.unmount()
  })

  it('renders children', () => {
    const w = mount(Avatar, { slots: { default: '<span class="child">A</span>' }, attachTo: document.body })
    expect(w.find('.child').exists()).toBe(true)
    w.unmount()
  })

  it('applies size classes', () => {
    const w = mount(Avatar, { props: { size: 'lg' }, attachTo: document.body })
    expect(w.find('[data-slot="avatar"]').classes()).toContain('size-12')
    w.unmount()
  })

  it('applies xs size classes', () => {
    const w = mount(Avatar, { props: { size: 'xs' }, attachTo: document.body })
    expect(w.find('[data-slot="avatar"]').classes()).toContain('size-4')
    w.unmount()
  })

  it('applies color classes', () => {
    const w = mount(Avatar, { props: { color: 'primary' }, attachTo: document.body })
    expect(w.find('[data-slot="avatar"]').classes()).toContain('bg-primary')
    w.unmount()
  })
})

describe('AvatarImage', () => {
  it('renders with data-slot="avatar-image"', () => {
    const w = mount(AvatarImage, { props: { src: 'https://example.com/a.png' }, attachTo: document.body })
    expect(w.find('[data-slot="avatar-image"]').exists()).toBe(true)
    w.unmount()
  })

  it('renders an img element with src', () => {
    const w = mount(AvatarImage, { props: { src: 'https://example.com/a.png' }, attachTo: document.body })
    const img = w.find('img[data-slot="avatar-image"]')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('https://example.com/a.png')
    w.unmount()
  })
})

describe('AvatarFallback', () => {
  it('renders with data-slot="avatar-fallback"', () => {
    const w = mount(AvatarFallback, { attachTo: document.body })
    expect(w.find('[data-slot="avatar-fallback"]').exists()).toBe(true)
    w.unmount()
  })

  it('renders as a span', () => {
    const w = mount(AvatarFallback, { attachTo: document.body })
    expect(w.find('span[data-slot="avatar-fallback"]').exists()).toBe(true)
    w.unmount()
  })

  it('renders text prop', () => {
    const w = mount(AvatarFallback, { props: { text: 'AB' }, attachTo: document.body })
    expect(w.find('[data-slot="avatar-fallback"]').text()).toBe('AB')
    w.unmount()
  })

  it('renders slot content', () => {
    const w = mount(AvatarFallback, { slots: { default: '<span>CD</span>' }, attachTo: document.body })
    expect(w.find('[data-slot="avatar-fallback"]').text()).toContain('CD')
    w.unmount()
  })
})

describe('AvatarGroup', () => {
  it('renders with data-slot="avatar-group"', () => {
    const w = mount(AvatarGroup, { attachTo: document.body })
    expect(w.find('[data-slot="avatar-group"]').exists()).toBe(true)
    w.unmount()
  })

  it('has data-uipkge', () => {
    const w = mount(AvatarGroup, { attachTo: document.body })
    expect(w.find('[data-uipkge]').exists()).toBe(true)
    w.unmount()
  })

  it('renders as a div', () => {
    const w = mount(AvatarGroup, { attachTo: document.body })
    expect(w.find('div[data-slot="avatar-group"]').exists()).toBe(true)
    w.unmount()
  })
})

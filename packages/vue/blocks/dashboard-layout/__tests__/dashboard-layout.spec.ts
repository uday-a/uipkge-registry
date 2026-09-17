import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DashboardLayout from '../DashboardLayout.vue'

describe('DashboardLayout', () => {
  it('renders without crashing', () => {
    const w = mount(DashboardLayout, { attachTo: document.body })
    expect(w.find('[data-slot="dashboard-layout"]').exists()).toBe(true)
    w.unmount()
  })

  it('renders sidebar', () => {
    const w = mount(DashboardLayout, { attachTo: document.body })
    expect(w.find('[data-slot="sidebar"]').exists()).toBe(true)
    w.unmount()
  })

  it('renders header area', () => {
    const w = mount(DashboardLayout, { attachTo: document.body })
    expect(w.find('header').exists()).toBe(true)
    w.unmount()
  })

  it('renders slot content', () => {
    const w = mount(DashboardLayout, {
      slots: { default: '<p data-testid="slot-content">Main content</p>' },
      attachTo: document.body,
    })
    expect(w.find('[data-testid="slot-content"]').exists()).toBe(true)
    expect(w.text()).toContain('Main content')
    w.unmount()
  })

  it('renders breadcrumbs when provided', () => {
    const w = mount(DashboardLayout, {
      props: { breadcrumbs: [{ label: 'Home', href: '/' }, { label: 'Dashboard' }] },
      attachTo: document.body,
    })
    expect(w.text()).toContain('Home')
    expect(w.text()).toContain('Dashboard')
    w.unmount()
  })
})

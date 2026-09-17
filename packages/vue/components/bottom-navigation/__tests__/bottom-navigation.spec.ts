import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Home, Search, User } from 'lucide-vue-next'
import { BottomNavigation } from '../index'

const items = [
  { value: 'home', label: 'Home', icon: Home },
  { value: 'search', label: 'Search', icon: Search },
  { value: 'profile', label: 'Profile', icon: User },
]

function mountNav(props: Record<string, unknown> = {}) {
  return mount(
    {
      components: { BottomNavigation },
      data() {
        return { val: props.modelValue ?? 'home', ...props }
      },
      template: `
        <BottomNavigation
          :items="navItems"
          :model-value="val"
          :fixed="fixed"
          :show-indicator="showIndicator"
          @update:model-value="val = $event"
        />`,
      computed: {
        navItems: () => props.items ?? items,
        fixed: () => props.fixed ?? false,
        showIndicator: () => props.showIndicator ?? true,
      },
    },
    { attachTo: document.body },
  )
}

describe('BottomNavigation', () => {
  it('renders nav with data-slot="bottom-navigation"', () => {
    const w = mountNav()
    expect(w.find('[data-slot="bottom-navigation"]').exists()).toBe(true)
    w.unmount()
  })

  it('has data-uipkge attribute', () => {
    const w = mountNav()
    expect(w.find('[data-uipkge]').exists()).toBe(true)
    w.unmount()
  })

  it('renders nav element', () => {
    const w = mountNav()
    expect(w.find('nav').exists()).toBe(true)
    w.unmount()
  })

  it('renders correct number of items', () => {
    const w = mountNav()
    const navItems = w.findAll('[data-slot="bottom-navigation-item"]')
    expect(navItems.length).toBe(3)
    w.unmount()
  })

  it('applies data-active to the active item', () => {
    const w = mountNav({ modelValue: 'search' })
    const activeItem = w.find('[data-slot="bottom-navigation-item"][data-active]')
    expect(activeItem.exists()).toBe(true)
    expect(activeItem.text()).toContain('Search')
    w.unmount()
  })

  it('renders icons for each item', () => {
    const w = mountNav()
    const icons = w.findAll('[data-slot="bottom-navigation-icon"]')
    expect(icons.length).toBe(3)
    expect(w.findAll('svg').length).toBe(3)
    w.unmount()
  })

  it('renders item labels', () => {
    const w = mountNav()
    expect(w.text()).toContain('Home')
    expect(w.text()).toContain('Search')
    expect(w.text()).toContain('Profile')
    w.unmount()
  })

  it('emits update:modelValue when item is clicked', async () => {
    const w = mountNav({ modelValue: 'home' })
    const navItems = w.findAll('[data-slot="bottom-navigation-item"]')
    await navItems[1].trigger('click')
    expect((w.vm as any).val).toBe('search')
    w.unmount()
  })

  it('renders indicator when showIndicator is true', () => {
    const w = mountNav({ showIndicator: true })
    expect(w.find('[data-slot="bottom-navigation-indicator"]').exists()).toBe(true)
    w.unmount()
  })

  it('does not render indicator when showIndicator is false', () => {
    const w = mountNav({ showIndicator: false })
    expect(w.find('[data-slot="bottom-navigation-indicator"]').exists()).toBe(false)
    w.unmount()
  })
})

import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { Home, Search, User } from 'lucide-react'
import { BottomNavigation } from '../index'

const items = [
  { value: 'home', label: 'Home', icon: Home },
  { value: 'search', label: 'Search', icon: Search },
  { value: 'profile', label: 'Profile', icon: User },
]

describe('BottomNavigation', () => {
  it('renders nav with data-slot="bottom-navigation"', () => {
    const { container } = render(<BottomNavigation items={items} value="home" onValueChange={() => {}} />)
    expect(container.querySelector('[data-slot="bottom-navigation"]')).toBeTruthy()
  })

  it('has data-uipkge attribute', () => {
    const { container } = render(<BottomNavigation items={items} value="home" onValueChange={() => {}} />)
    expect(container.querySelector('[data-uipkge]')).toBeTruthy()
  })

  it('renders nav element', () => {
    const { container } = render(<BottomNavigation items={items} value="home" onValueChange={() => {}} />)
    expect(container.querySelector('nav')).toBeTruthy()
  })

  it('renders correct number of items', () => {
    const { container } = render(<BottomNavigation items={items} value="home" onValueChange={() => {}} />)
    const navItems = container.querySelectorAll('[data-slot="bottom-navigation-item"]')
    expect(navItems.length).toBe(3)
  })

  it('applies data-active to the active item', () => {
    const { container } = render(<BottomNavigation items={items} value="search" onValueChange={() => {}} />)
    const activeItem = container.querySelector('[data-slot="bottom-navigation-item"][data-active]')
    expect(activeItem).toBeTruthy()
    expect(activeItem?.textContent).toContain('Search')
  })

  it('renders icons for each item', () => {
    const { container } = render(<BottomNavigation items={items} value="home" onValueChange={() => {}} />)
    const icons = container.querySelectorAll('[data-slot="bottom-navigation-icon"]')
    expect(icons.length).toBe(3)
    expect(container.querySelectorAll('svg').length).toBe(3)
  })

  it('renders item labels', () => {
    const { container } = render(<BottomNavigation items={items} value="home" onValueChange={() => {}} />)
    expect(container.textContent).toContain('Home')
    expect(container.textContent).toContain('Search')
    expect(container.textContent).toContain('Profile')
  })

  it('calls onValueChange when item is clicked', () => {
    const onValueChange = vi.fn()
    const { container } = render(<BottomNavigation items={items} value="home" onValueChange={onValueChange} />)
    const navItems = container.querySelectorAll('[data-slot="bottom-navigation-item"]')
    fireEvent.click(navItems[1])
    expect(onValueChange).toHaveBeenCalledWith('search')
  })

  it('renders indicator when showIndicator is true', () => {
    const { container } = render(<BottomNavigation items={items} value="home" showIndicator onValueChange={() => {}} />)
    expect(container.querySelector('[data-slot="bottom-navigation-indicator"]')).toBeTruthy()
  })

  it('does not render indicator when showIndicator is false', () => {
    const { container } = render(
      <BottomNavigation items={items} value="home" showIndicator={false} onValueChange={() => {}} />,
    )
    expect(container.querySelector('[data-slot="bottom-navigation-indicator"]')).toBeNull()
  })
})

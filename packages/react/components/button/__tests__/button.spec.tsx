import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { Button } from '../Button'

describe('Button', () => {
  it('renders with data-slot="button"', () => {
    const { container } = render(<Button>Click</Button>)
    expect(container.querySelector('[data-slot="button"]')).toBeTruthy()
  })

  it('has data-uipkge', () => {
    const { container } = render(<Button>Click</Button>)
    expect(container.querySelector('[data-slot="button"]')?.hasAttribute('data-uipkge')).toBe(true)
  })

  it('renders as a button element', () => {
    const { container } = render(<Button>Click</Button>)
    expect(container.querySelector('[data-slot="button"]')?.tagName.toLowerCase()).toBe('button')
  })

  it('renders children', () => {
    const { container } = render(<Button>Click me</Button>)
    expect(container.querySelector('[data-slot="button"]')?.textContent).toContain('Click me')
  })

  it.each(['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const)(
    'applies data-variant="%s"',
    (variant) => {
      const { container } = render(<Button variant={variant}>Click</Button>)
      expect(container.querySelector('[data-slot="button"]')?.getAttribute('data-variant')).toBe(variant)
    },
  )

  it.each(['default', 'sm', 'lg', 'xs', 'icon', 'icon-sm', 'icon-lg'] as const)('applies data-size="%s"', (size) => {
    const { container } = render(<Button size={size}>Click</Button>)
    expect(container.querySelector('[data-slot="button"]')?.getAttribute('data-size')).toBe(size)
  })

  it('sets type attribute', () => {
    const { container } = render(<Button type="submit">Submit</Button>)
    expect(container.querySelector('[data-slot="button"]')?.getAttribute('type')).toBe('submit')
  })

  it('defaults type to button', () => {
    const { container } = render(<Button>Click</Button>)
    expect(container.querySelector('[data-slot="button"]')?.getAttribute('type')).toBe('button')
  })

  it('calls onClick when clicked', () => {
    const onClick = vi.fn()
    const { container } = render(<Button onClick={onClick}>Click</Button>)
    fireEvent.click(container.querySelector('[data-slot="button"]')!)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('supports asChild prop (renders child element)', () => {
    const { container } = render(
      <Button asChild>
        <a href="/test">Link</a>
      </Button>,
    )
    const el = container.querySelector('[data-slot="button"]')
    expect(el).toBeTruthy()
    expect(el?.tagName.toLowerCase()).toBe('a')
  })

  it('does not set type when asChild is true', () => {
    const { container } = render(
      <Button asChild>
        <a href="/test">Link</a>
      </Button>,
    )
    expect(container.querySelector('[data-slot="button"]')?.hasAttribute('type')).toBe(false)
  })

  it('applies custom className', () => {
    const { container } = render(<Button className="custom-class">Click</Button>)
    expect(container.querySelector('[data-slot="button"]')?.className).toContain('custom-class')
  })

  it('merges custom className with variant classes', () => {
    const { container } = render(
      <Button variant="outline" className="custom-class">
        Click
      </Button>,
    )
    const el = container.querySelector('[data-slot="button"]')
    expect(el?.className).toContain('custom-class')
    expect(el?.className).toContain('border')
  })
})

describe('ButtonGroup', () => {
  it('renders with data-slot="button-group" and role="group"', async () => {
    const { ButtonGroup } = await import('../index')
    const { container } = render(
      <ButtonGroup>
        <Button>First</Button>
        <Button>Second</Button>
      </ButtonGroup>,
    )
    const el = container.querySelector('[data-slot="button-group"]')
    expect(el).not.toBeNull()
    expect(el?.getAttribute('role')).toBe('group')
    expect(el?.getAttribute('data-orientation')).toBe('horizontal')
  })

  it('renders vertical orientation attribute', async () => {
    const { ButtonGroup } = await import('../index')
    const { container } = render(
      <ButtonGroup orientation="vertical">
        <Button>Top</Button>
        <Button>Bottom</Button>
      </ButtonGroup>,
    )
    const el = container.querySelector('[data-slot="button-group"]')
    expect(el?.getAttribute('data-orientation')).toBe('vertical')
  })

  it('renders attached attribute by default', async () => {
    const { ButtonGroup } = await import('../index')
    const { container } = render(
      <ButtonGroup>
        <Button>A</Button>
        <Button>B</Button>
      </ButtonGroup>,
    )
    const el = container.querySelector('[data-slot="button-group"]')
    expect(el?.hasAttribute('data-attached')).toBe(true)
  })
})

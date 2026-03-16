import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '../dropdown-menu'

afterEach(cleanup)

describe('DropdownMenu', () => {
  it('DropdownMenuTrigger renders with data-slot="dropdown-menu-trigger"', () => {
    const { container } = render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )
    expect(container.querySelector('[data-slot="dropdown-menu-trigger"]')).toBeTruthy()
  })

  it('DropdownMenuTrigger renders as a button', () => {
    const { container } = render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )
    expect(container.querySelector('[data-slot="dropdown-menu-trigger"]')?.tagName.toLowerCase()).toBe('button')
  })

  it('DropdownMenuItem has data-slot="dropdown-menu-item" when open', () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )
    expect(document.body.querySelector('[data-slot="dropdown-menu-item"]')).toBeTruthy()
  })

  it('DropdownMenuItem has data-uipkge', () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )
    expect(document.body.querySelector('[data-slot="dropdown-menu-item"]')?.hasAttribute('data-uipkge')).toBe(true)
  })

  it('DropdownMenuItem applies data-inset when inset prop is true', () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem inset>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )
    expect(document.body.querySelector('[data-slot="dropdown-menu-item"]')?.hasAttribute('data-inset')).toBe(true)
  })

  it('DropdownMenuItem applies data-variant when variant is destructive', () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )
    expect(document.body.querySelector('[data-slot="dropdown-menu-item"]')?.getAttribute('data-variant')).toBe(
      'destructive',
    )
  })

  it('DropdownMenuContent has data-slot="dropdown-menu-content" when open', () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )
    expect(document.body.querySelector('[data-slot="dropdown-menu-content"]')).toBeTruthy()
  })

  it('DropdownMenuLabel renders with data-slot="dropdown-menu-label"', () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Label</DropdownMenuLabel>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )
    expect(document.body.querySelector('[data-slot="dropdown-menu-label"]')).toBeTruthy()
  })

  it('DropdownMenuSeparator renders with data-slot="dropdown-menu-separator"', () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Item 2</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )
    expect(document.body.querySelector('[data-slot="dropdown-menu-separator"]')).toBeTruthy()
  })

  it('DropdownMenuItem renders children', () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>My Item Text</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )
    expect(document.body.querySelector('[data-slot="dropdown-menu-item"]')?.textContent).toContain('My Item Text')
  })

  it('DropdownMenuContent has data-uipkge', () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )
    expect(document.body.querySelector('[data-slot="dropdown-menu-content"]')?.hasAttribute('data-uipkge')).toBe(true)
  })
})

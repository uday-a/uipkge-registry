import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { List, ListItem, ListSubheader } from '../list'

describe('List', () => {
  it('renders with data-slot="list"', () => {
    const { container } = render(<List />)
    expect(container.querySelector('[data-slot="list"]')).toBeTruthy()
  })

  it('has data-uipkge', () => {
    const { container } = render(<List />)
    expect(container.querySelector('[data-uipkge]')).toBeTruthy()
  })

  it('renders as ul by default', () => {
    const { container } = render(<List />)
    expect(container.querySelector('[data-slot="list"]')?.tagName.toLowerCase()).toBe('ul')
  })

  it('renders as ol when as="ol"', () => {
    const { container } = render(<List as="ol" />)
    expect(container.querySelector('[data-slot="list"]')?.tagName.toLowerCase()).toBe('ol')
  })

  it('renders children', () => {
    const { container } = render(
      <List>
        <li>Item</li>
      </List>,
    )
    expect(container.textContent).toContain('Item')
  })
})

describe('ListItem', () => {
  it('renders with data-slot="list-item"', () => {
    const { container } = render(<ListItem>Text</ListItem>)
    expect(container.querySelector('[data-slot="list-item"]')).toBeTruthy()
  })

  it('has data-uipkge', () => {
    const { container } = render(<ListItem>Text</ListItem>)
    expect(container.querySelector('[data-uipkge]')).toBeTruthy()
  })

  it('sets data-active when active', () => {
    const { container } = render(<ListItem active>Text</ListItem>)
    expect(container.querySelector('[data-slot="list-item"]')?.getAttribute('data-active')).toBe('')
  })

  it('sets data-disabled when disabled', () => {
    const { container } = render(<ListItem disabled>Text</ListItem>)
    expect(container.querySelector('[data-slot="list-item"]')?.getAttribute('data-disabled')).toBe('')
  })

  it('renders as li by default', () => {
    const { container } = render(<ListItem>Text</ListItem>)
    expect(container.querySelector('[data-slot="list-item"]')?.tagName.toLowerCase()).toBe('li')
  })
})

describe('ListSubheader', () => {
  it('renders with data-slot="list-subheader"', () => {
    const { container } = render(<ListSubheader>Header</ListSubheader>)
    expect(container.querySelector('[data-slot="list-subheader"]')).toBeTruthy()
  })

  it('has data-uipkge', () => {
    const { container } = render(<ListSubheader>Header</ListSubheader>)
    expect(container.querySelector('[data-uipkge]')).toBeTruthy()
  })
})

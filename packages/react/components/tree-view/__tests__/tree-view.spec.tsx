import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { TreeView } from '../tree-view'

const items = [
  { id: '1', label: 'Folder 1', children: [{ id: '1-1', label: 'File 1' }] },
  { id: '2', label: 'Folder 2' },
]

describe('TreeView', () => {
  it('renders with role="tree"', () => {
    const { container } = render(<TreeView items={items} />)
    expect(container.querySelector('[role="tree"]')).toBeTruthy()
  })

  it('renders treeitem elements', () => {
    const { container } = render(<TreeView items={items} />)
    expect(container.querySelectorAll('[role="treeitem"]').length).toBeGreaterThan(0)
  })

  it('renders item labels', () => {
    const { container } = render(<TreeView items={items} />)
    expect(container.textContent).toContain('Folder 1')
    expect(container.textContent).toContain('Folder 2')
  })

  it('shows chevron for items with children', () => {
    const { container } = render(<TreeView items={items} />)
    const toggleButtons = container.querySelectorAll('button[aria-label="Expand"], button[aria-label="Collapse"]')
    expect(toggleButtons.length).toBeGreaterThan(0)
  })

  it('does not show chevron for leaf items', () => {
    const { container } = render(<TreeView items={[{ id: '2', label: 'Folder 2' }]} />)
    const toggleButtons = container.querySelectorAll('button[aria-label="Expand"], button[aria-label="Collapse"]')
    expect(toggleButtons.length).toBe(0)
  })

  it('shows icons when showIcons is true', () => {
    const { container } = render(<TreeView items={items} showIcons />)
    // Icons render as inline svg (lucide). Leaf items get a File icon.
    expect(container.querySelectorAll('svg').length).toBeGreaterThan(0)
  })

  it('does not show icons when showIcons is false', () => {
    const { container } = render(<TreeView items={[{ id: '2', label: 'Folder 2' }]} showIcons={false} />)
    expect(container.querySelectorAll('svg').length).toBe(0)
  })

  it('disables items when disabled', () => {
    const { container } = render(<TreeView items={[{ id: '1', label: 'Folder 1', disabled: true }]} />)
    const row = container.querySelector('[data-tree-row]')
    expect(row?.getAttribute('data-disabled')).toBe('true')
    expect(row?.getAttribute('tabindex')).toBe('-1')
  })

  it('renders nested children when expanded', () => {
    const { container } = render(<TreeView items={items} defaultExpanded />)
    expect(container.textContent).toContain('File 1')
  })

  it('does not render nested children when collapsed', () => {
    const { container } = render(<TreeView items={items} />)
    expect(container.textContent).not.toContain('File 1')
  })
})

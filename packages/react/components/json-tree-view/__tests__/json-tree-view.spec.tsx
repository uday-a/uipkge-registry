import { describe, expect, it } from 'vitest'
import { fireEvent, render } from '@testing-library/react'
import { JsonTreeView } from '../index'

describe('JsonTreeView layout', () => {
  it('contains a max-height tree inside its own scroll region', () => {
    const { container } = render(<JsonTreeView data={{ nested: { value: true } }} />)
    const root = container.querySelector('[data-slot="json-tree-view"]')!
    const tree = container.querySelector('[role="tree"]')!

    expect(root.classList.contains('flex')).toBe(true)
    expect(root.classList.contains('flex-col')).toBe(true)
    expect(root.classList.contains('overflow-hidden')).toBe(true)
    expect(tree.classList.contains('min-h-0')).toBe(true)
    expect(tree.classList.contains('flex-1')).toBe(true)
    expect(tree.classList.contains('overflow-auto')).toBe(true)
  })

  it('does not insert a path row when a tree row is hovered', () => {
    const { container } = render(<JsonTreeView data={{ nested: { value: true } }} />)
    const root = container.querySelector('[data-slot="json-tree-view"]')!
    const childCount = root.children.length

    fireEvent.mouseEnter(container.querySelector('[data-tree-row]')!)

    expect(root.children.length).toBe(childCount)
  })
})

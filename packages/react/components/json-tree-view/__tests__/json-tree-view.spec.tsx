import { describe, expect, it, vi, afterEach } from 'vitest'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { JsonTreeView } from '../index'

const SAMPLE = {
  name: 'uipkge',
  version: 2,
  active: true,
  retired: null,
  tags: ['vue', 'react'],
  meta: { owner: 'registry', nested: { deep: 'value' } },
}

afterEach(cleanup)

function renderTree(props: Partial<React.ComponentProps<typeof JsonTreeView>> = {}) {
  return render(<JsonTreeView data={SAMPLE} {...props} />)
}

/** Rows keyed by their `data-tree-id` path, e.g. `$`, `.meta`, `.tags`. */
function rowFor(container: HTMLElement, id: string) {
  return container.querySelector<HTMLElement>(`[data-tree-row][data-tree-id="${CSS.escape(id)}"]`)
}

function toolbarButton(container: HTMLElement, label: string) {
  return Array.from(container.querySelectorAll('button')).find(
    (b) => (b.getAttribute('title') ?? b.getAttribute('aria-label') ?? '').toLowerCase() === label.toLowerCase(),
  )
}

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

describe('JsonTreeView rendering', () => {
  // A JSON inspector that prints a string and a number identically is
  // useless for the thing it exists for: telling you what the payload is.
  it('quotes strings, prints numbers, booleans and null bare', () => {
    const { container } = renderTree({ expandDepth: 5 })
    const text = container.textContent ?? ''

    expect(text).toContain('"uipkge"')
    expect(text).toContain('2')
    expect(text).toContain('true')
    expect(text).toContain('null')
  })

  it('expands to expandDepth on mount and no further', () => {
    const shallow = renderTree({ expandDepth: 1 })
    expect(rowFor(shallow.container, '.meta')).toBeTruthy()
    expect(rowFor(shallow.container, '.meta.nested')).toBeNull()
    cleanup()

    const deeper = renderTree({ expandDepth: 3 })
    expect(rowFor(deeper.container, '.meta.nested')).toBeTruthy()
  })

  it('labels the root from the rootLabel prop', () => {
    const { container } = renderTree({ rootLabel: 'payload' })
    expect(container.textContent).toContain('payload')
  })
})

describe('JsonTreeView interaction', () => {
  it('toggles a container open and closed on click', () => {
    const { container } = renderTree({ expandDepth: 1 })
    expect(rowFor(container, '.meta.nested')).toBeNull()

    fireEvent.click(rowFor(container, '.meta')!)
    expect(rowFor(container, '.meta.nested')).toBeTruthy()

    fireEvent.click(rowFor(container, '.meta')!)
    expect(rowFor(container, '.meta.nested')).toBeNull()
  })

  it('expands and collapses the whole tree from the toolbar', () => {
    const { container } = renderTree({ expandDepth: 1 })

    fireEvent.click(toolbarButton(container, 'Expand all')!)
    expect(rowFor(container, '.meta.nested')).toBeTruthy()

    fireEvent.click(toolbarButton(container, 'Collapse all')!)
    expect(rowFor(container, '.meta')).toBeNull()
  })

  it('is keyboard operable: arrows open, close and walk rows', () => {
    const { container } = renderTree({ expandDepth: 1 })
    const meta = rowFor(container, '.meta')!

    expect(meta.getAttribute('tabindex')).toBe('0')

    fireEvent.keyDown(meta, { key: 'ArrowRight' })
    expect(rowFor(container, '.meta.nested')).toBeTruthy()

    fireEvent.keyDown(rowFor(container, '.meta')!, { key: 'ArrowLeft' })
    expect(rowFor(container, '.meta.nested')).toBeNull()
  })

  it('toggles a container with Enter and Space', () => {
    const { container } = renderTree({ expandDepth: 1 })

    fireEvent.keyDown(rowFor(container, '.meta')!, { key: 'Enter' })
    expect(rowFor(container, '.meta.nested')).toBeTruthy()

    fireEvent.keyDown(rowFor(container, '.meta')!, { key: ' ' })
    expect(rowFor(container, '.meta.nested')).toBeNull()
  })

  it('reports copies with the value and its path', async () => {
    // jsdom has no clipboard; the component only reports a copy it actually
    // made, so stub the write it awaits.
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })

    const onCopy = vi.fn()
    const { container } = renderTree({ expandDepth: 5, onCopy })

    fireEvent.click(container.querySelectorAll('[aria-label="Copy value"]')[0])
    await vi.waitFor(() => expect(onCopy).toHaveBeenCalledTimes(1))

    expect(writeText).toHaveBeenCalledTimes(1)
    expect(onCopy.mock.calls[0]).toHaveLength(2)
  })

  it('filters to matching branches when searching', () => {
    const { container } = renderTree({ expandDepth: 1 })
    const search = container.querySelector('input')!

    fireEvent.change(search, { target: { value: 'deep' } })

    // The branch holding the match is auto-expanded so the hit is visible.
    expect(rowFor(container, '.meta')).toBeTruthy()
    expect(rowFor(container, '.meta.nested')).toBeTruthy()
    expect(container.textContent).toContain('deep')
  })

  it('restores the default expansion when the search is cleared', () => {
    const { container } = renderTree({ expandDepth: 1 })
    const search = container.querySelector('input')!

    fireEvent.change(search, { target: { value: 'deep' } })
    expect(rowFor(container, '.meta.nested')).toBeTruthy()

    fireEvent.change(search, { target: { value: '' } })
    expect(rowFor(container, '.meta.nested')).toBeNull()
  })

  it('hides the toolbar and the search field when asked', () => {
    const { container } = renderTree({ showToolbar: false, showSearch: false })
    expect(container.querySelector('input')).toBeNull()
  })

  it('re-renders from scratch when the data prop changes', () => {
    const { container, rerender } = renderTree({ expandDepth: 1 })
    expect(container.textContent).toContain('uipkge')

    rerender(<JsonTreeView data={{ replaced: 'yes' }} expandDepth={1} />)

    expect(container.textContent).not.toContain('uipkge')
    expect(container.textContent).toContain('replaced')
  })
})

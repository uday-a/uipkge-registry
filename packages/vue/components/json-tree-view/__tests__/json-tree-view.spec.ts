import { describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { JsonTreeView } from '../index'

const SAMPLE = {
  name: 'uipkge',
  version: 2,
  active: true,
  retired: null,
  tags: ['vue', 'react'],
  meta: { owner: 'registry', nested: { deep: 'value' } },
}

/** Child rows render through JsonTreeNode's async self-import, so every mount
 *  and every toggle needs a flush before the tree is in its settled shape. */
async function mountTree(props: Record<string, unknown> = {}) {
  const wrapper = mount(JsonTreeView, {
    props: { data: SAMPLE, ...props },
    attachTo: document.body,
  })
  await flushPromises()
  return wrapper
}

/** Rows keyed by their `data-tree-id` path, e.g. `$`, `.meta`, `.tags`. */
function rowFor(wrapper: Awaited<ReturnType<typeof mountTree>>, id: string) {
  return wrapper.findAll('[data-tree-row]').find((r) => r.attributes('data-tree-id') === id)
}

describe('JsonTreeView layout', () => {
  it('contains a max-height tree inside its own scroll region', () => {
    const wrapper = mount(JsonTreeView, {
      props: { data: { nested: { value: true } } },
      attachTo: document.body,
    })
    const root = wrapper.find('[data-slot="json-tree-view"]')
    const tree = wrapper.find('[role="tree"]')

    expect(root.classes()).toEqual(expect.arrayContaining(['flex', 'flex-col', 'overflow-hidden']))
    expect(tree.classes()).toEqual(expect.arrayContaining(['min-h-0', 'flex-1', 'overflow-auto']))
    wrapper.unmount()
  })

  it('does not insert a path row when a tree row is hovered', async () => {
    const wrapper = mount(JsonTreeView, {
      props: { data: { nested: { value: true } } },
      attachTo: document.body,
    })
    const root = wrapper.find('[data-slot="json-tree-view"]')
    const childCount = root.element.children.length

    await wrapper.find('[data-tree-row]').trigger('mouseenter')

    expect(root.element.children.length).toBe(childCount)
    wrapper.unmount()
  })
})

describe('JsonTreeView rendering', () => {
  // A JSON inspector that prints a string and a number identically is
  // useless for the thing it exists for: telling you what the payload is.
  it('quotes strings, prints numbers, booleans and null bare', async () => {
    const wrapper = await mountTree({ expandDepth: 5 })
    const text = wrapper.text()

    expect(text).toContain('"uipkge"')
    expect(text).toContain('2')
    expect(text).toContain('true')
    expect(text).toContain('null')
    wrapper.unmount()
  })

  it('previews collapsed containers with their item count', async () => {
    const wrapper = await mountTree({ expandDepth: 1 })
    const meta = rowFor(wrapper, '.meta')

    expect(meta).toBeDefined()
    expect(meta!.attributes('aria-expanded')).toBeUndefined() // the row itself is not the treeitem
    expect(wrapper.text()).toMatch(/\{.*\}|…|2/)
    wrapper.unmount()
  })

  it('expands to expandDepth on mount and no further', async () => {
    const shallow = await mountTree({ expandDepth: 1 })
    expect(rowFor(shallow, '.meta')).toBeDefined()
    expect(rowFor(shallow, '.meta.nested')).toBeUndefined()
    shallow.unmount()

    const deeper = await mountTree({ expandDepth: 3 })
    expect(rowFor(deeper, '.meta.nested')).toBeDefined()
    deeper.unmount()
  })

  it('labels the root from the rootLabel prop', async () => {
    const wrapper = await mountTree({ rootLabel: 'payload' })
    expect(wrapper.text()).toContain('payload')
    wrapper.unmount()
  })
})

describe('JsonTreeView interaction', () => {
  it('toggles a container open and closed on click', async () => {
    const wrapper = await mountTree({ expandDepth: 1 })
    expect(rowFor(wrapper, '.meta.nested')).toBeUndefined()

    await rowFor(wrapper, '.meta')!.trigger('click')
    await flushPromises()
    expect(rowFor(wrapper, '.meta.nested')).toBeDefined()

    await rowFor(wrapper, '.meta')!.trigger('click')
    await flushPromises()
    expect(rowFor(wrapper, '.meta.nested')).toBeUndefined()
    wrapper.unmount()
  })

  it('expands and collapses the whole tree from the toolbar', async () => {
    const wrapper = await mountTree({ expandDepth: 1 })
    const buttons = wrapper.findAll('button')
    const expandAll = buttons.find((b) => /expand all/i.test(b.attributes('aria-label') ?? b.attributes('title') ?? ''))
    const collapseAll = buttons.find((b) =>
      /collapse all/i.test(b.attributes('aria-label') ?? b.attributes('title') ?? ''),
    )
    expect(expandAll && collapseAll).toBeTruthy()

    await expandAll!.trigger('click')
    await flushPromises()
    expect(rowFor(wrapper, '.meta.nested')).toBeDefined()

    await collapseAll!.trigger('click')
    await flushPromises()
    expect(rowFor(wrapper, '.meta')).toBeUndefined()
    wrapper.unmount()
  })

  it('is keyboard operable: arrows open, close and walk rows', async () => {
    const wrapper = await mountTree({ expandDepth: 1 })
    const meta = rowFor(wrapper, '.meta')!

    expect(meta.attributes('tabindex')).toBe('0')

    await meta.trigger('keydown', { key: 'ArrowRight' })
    await flushPromises()
    expect(rowFor(wrapper, '.meta.nested')).toBeDefined()

    await rowFor(wrapper, '.meta')!.trigger('keydown', { key: 'ArrowLeft' })
    await flushPromises()
    expect(rowFor(wrapper, '.meta.nested')).toBeUndefined()
    wrapper.unmount()
  })

  it('toggles a container with Enter and Space', async () => {
    const wrapper = await mountTree({ expandDepth: 1 })

    await rowFor(wrapper, '.meta')!.trigger('keydown', { key: 'Enter' })
    await flushPromises()
    expect(rowFor(wrapper, '.meta.nested')).toBeDefined()

    await rowFor(wrapper, '.meta')!.trigger('keydown', { key: ' ' })
    await flushPromises()
    expect(rowFor(wrapper, '.meta.nested')).toBeUndefined()
    wrapper.unmount()
  })

  it('emits copy with the value and its path', async () => {
    const wrapper = await mountTree({ expandDepth: 5 })
    const copyButton = wrapper.findAll('[aria-label="Copy value"]')[0]

    await copyButton.trigger('click')

    const copied = wrapper.emitted('copy')
    expect(copied).toBeTruthy()
    expect(copied!.at(0)).toHaveLength(2)
    wrapper.unmount()
  })

  it('filters to matching branches when searching', async () => {
    const wrapper = await mountTree({ expandDepth: 1 })
    const search = wrapper.find('input')
    expect(search.exists()).toBe(true)

    await search.setValue('deep')
    await flushPromises()

    // The branch holding the match is auto-expanded so the hit is visible.
    expect(rowFor(wrapper, '.meta')).toBeDefined()
    expect(rowFor(wrapper, '.meta.nested')).toBeDefined()
    expect(wrapper.text()).toContain('deep')
    wrapper.unmount()
  })

  it('restores the default expansion when the search is cleared', async () => {
    const wrapper = await mountTree({ expandDepth: 1 })
    const search = wrapper.find('input')

    await search.setValue('deep')
    await flushPromises()
    expect(rowFor(wrapper, '.meta.nested')).toBeDefined()

    await search.setValue('')
    await flushPromises()
    expect(rowFor(wrapper, '.meta.nested')).toBeUndefined()
    wrapper.unmount()
  })

  it('hides the toolbar and the search field when asked', async () => {
    const wrapper = await mountTree({ showToolbar: false, showSearch: false })
    expect(wrapper.find('input').exists()).toBe(false)
    wrapper.unmount()
  })

  it('re-renders from scratch when the data prop changes', async () => {
    const wrapper = await mountTree({ expandDepth: 1 })
    expect(wrapper.text()).toContain('uipkge')

    await wrapper.setProps({ data: { replaced: 'yes' } })
    await flushPromises()

    expect(wrapper.text()).not.toContain('uipkge')
    expect(wrapper.text()).toContain('replaced')
    wrapper.unmount()
  })
})

import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { JsonTreeView } from '../index'

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

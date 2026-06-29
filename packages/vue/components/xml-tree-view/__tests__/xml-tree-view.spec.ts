import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { XmlTreeView } from '../index'

const xml = '<catalog><book><title>Example</title></book></catalog>'

describe('XmlTreeView layout', () => {
  it('contains a max-height tree inside its own scroll region', () => {
    const wrapper = mount(XmlTreeView, { props: { data: xml }, attachTo: document.body })
    const root = wrapper.find('[data-slot="xml-tree-view"]')
    const tree = wrapper.find('[role="tree"]')

    expect(root.classes()).toEqual(expect.arrayContaining(['flex', 'flex-col', 'overflow-hidden']))
    expect(tree.classes()).toEqual(expect.arrayContaining(['min-h-0', 'flex-1', 'overflow-auto']))
    wrapper.unmount()
  })

  it('does not insert a path row when a tree row is hovered', async () => {
    const wrapper = mount(XmlTreeView, { props: { data: xml }, attachTo: document.body })
    const root = wrapper.find('[data-slot="xml-tree-view"]')
    const childCount = root.element.children.length

    await vi.waitFor(() => expect(wrapper.find('[data-tree-row]').exists()).toBe(true))
    await wrapper.find('[data-tree-row]').trigger('mouseenter')

    expect(root.element.children.length).toBe(childCount)
    wrapper.unmount()
  })
})

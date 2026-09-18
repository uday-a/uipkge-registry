import { describe, it, expect, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { TreeSelect } from '../index'
import type { TreeSelectNode as TreeNode } from '../types'

afterEach(() => {
  document.body.innerHTML = ''
})

const data: TreeNode[] = [
  {
    value: 'fruits',
    label: 'Fruits',
    children: [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
    ],
  },
  {
    value: 'vegs',
    label: 'Vegetables',
    children: [
      { value: 'carrot', label: 'Carrot' },
      { value: 'potato', label: 'Potato' },
    ],
  },
]

function mountTreeSelect(props: Record<string, unknown> = {}) {
  return mount(
    {
      components: { TreeSelect },
      data() {
        return { val: props.modelValue ?? null }
      },
      template: `
        <TreeSelect
          :data="data"
          :model-value="val"
          :multiple="multiple"
          :placeholder="placeholder"
          :disabled="disabled"
          :default-expand-all="defaultExpandAll"
          @update:model-value="val = $event"
        />`,
      computed: {
        data: () => props.data ?? data,
        multiple: () => props.multiple ?? false,
        placeholder: () => props.placeholder ?? 'Select...',
        disabled: () => props.disabled ?? false,
        defaultExpandAll: () => props.defaultExpandAll ?? false,
      },
    },
    { attachTo: document.body },
  )
}

describe('TreeSelect', () => {
  it('renders container with data-slot="tree-select"', () => {
    const w = mountTreeSelect()
    expect(w.find('[data-slot="tree-select"]').exists()).toBe(true)
    w.unmount()
  })

  it('has data-uipkge on trigger', () => {
    const w = mountTreeSelect()
    expect(w.find('[data-slot="tree-select"]').attributes('data-uipkge')).toBeDefined()
    w.unmount()
  })

  it('renders trigger button with combobox role', () => {
    const w = mountTreeSelect()
    const trigger = w.find('[data-slot="tree-select"]')
    expect(trigger.element.tagName.toLowerCase()).toBe('button')
    expect(trigger.attributes('role')).toBe('combobox')
    w.unmount()
  })

  it('renders placeholder text when no value selected', () => {
    const w = mountTreeSelect({ placeholder: 'Pick an item' })
    expect(w.text()).toContain('Pick an item')
    w.unmount()
  })

  it('renders tree options when open', async () => {
    const w = mountTreeSelect({ defaultExpandAll: true })
    await w.find('[data-slot="tree-select"]').trigger('click')
    await flushPromises()
    const tree = document.querySelector('[role="tree"]')
    expect(tree).toBeTruthy()
    const rows = document.querySelectorAll('[data-tree-row]')
    expect(rows.length).toBeGreaterThanOrEqual(2)
    w.unmount()
  })

  it('supports multiple selection with checkboxes', async () => {
    const w = mountTreeSelect({ multiple: true, defaultExpandAll: true })
    await w.find('[data-slot="tree-select"]').trigger('click')
    await flushPromises()
    const checkboxes = document.querySelectorAll('[role="tree"] input[type="checkbox"]')
    expect(checkboxes.length).toBeGreaterThan(0)
    w.unmount()
  })

  it('disables trigger when disabled is true', () => {
    const w = mountTreeSelect({ disabled: true })
    expect(w.find('[data-slot="tree-select"]').attributes('disabled')).toBeDefined()
    w.unmount()
  })
})

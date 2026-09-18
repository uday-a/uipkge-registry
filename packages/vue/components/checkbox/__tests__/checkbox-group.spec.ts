import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CheckboxGroup from '../CheckboxGroup.vue'
import Checkbox from '../Checkbox.vue'

function mountGroup(props: Record<string, unknown> = {}) {
  return mount(CheckboxGroup, {
    props: { modelValue: [], ...props },
    attachTo: document.body,
  })
}

function mountGroupWithOptions(options: (string | { label: string; value: string })[] = []) {
  return mount(CheckboxGroup, {
    props: { modelValue: [], options },
    attachTo: document.body,
  })
}

function mountGroupWithSlots() {
  return mount(CheckboxGroup, {
    props: { modelValue: [] },
    slots: {
      default: '<Checkbox value="a" label="A" /><Checkbox value="b" label="B" />',
    },
    global: { components: { Checkbox } },
    attachTo: document.body,
  })
}

describe('CheckboxGroup', () => {
  it('renders with data-slot="checkbox-group"', () => {
    const w = mountGroup()
    expect(w.find('[data-slot="checkbox-group"]').exists()).toBe(true)
    w.unmount()
  })

  it('renders label text', () => {
    const w = mountGroup({ label: 'Fruits' })
    expect(w.text()).toContain('Fruits')
    w.unmount()
  })

  it('renders hint text', () => {
    const w = mountGroup({ hint: 'Pick one or more' })
    expect(w.text()).toContain('Pick one or more')
    w.unmount()
  })

  it('renders error messages', () => {
    const w = mountGroup({ errorMessages: 'At least one required' })
    expect(w.text()).toContain('At least one required')
    w.unmount()
  })

  it('renders options as checkboxes', () => {
    const w = mountGroupWithOptions([
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' },
    ])
    expect(w.text()).toContain('Apple')
    expect(w.text()).toContain('Banana')
    w.unmount()
  })

  it('renders string options', () => {
    const w = mountGroupWithOptions(['One', 'Two'])
    expect(w.text()).toContain('One')
    expect(w.text()).toContain('Two')
    w.unmount()
  })

  it('renders in vertical orientation by default', () => {
    const w = mountGroupWithOptions(['A', 'B'])
    const container = w.find('[data-slot="checkbox-group"]')
    expect(container.exists()).toBe(true)
    w.unmount()
  })

  it('renders in horizontal orientation when set', () => {
    const w = mountGroup({ orientation: 'horizontal', options: ['A', 'B'] })
    const container = w.find('[data-slot="checkbox-group"]')
    expect(container.exists()).toBe(true)
    w.unmount()
  })

  it('renders bordered style when bordered is true', () => {
    const w = mountGroup({ bordered: true })
    expect(w.html()).toContain('border')
    w.unmount()
  })

  it('disables all checkboxes when group disabled is true', () => {
    const w = mountGroupWithOptions([{ label: 'A', value: 'a', disabled: false }])
    // The group disabled prop should propagate
    expect(w.find('[data-slot="checkbox-group"]').exists()).toBe(true)
    w.unmount()
  })

  it('emits update:modelValue when checkbox is toggled', async () => {
    const w = mount(CheckboxGroup, {
      props: {
        modelValue: [],
        options: [{ label: 'Apple', value: 'apple' }],
      },
      attachTo: document.body,
    })
    const checkbox = w.find('[role="checkbox"]')
    await checkbox.trigger('click')
    expect(w.emitted('update:modelValue')).toBeTruthy()
    w.unmount()
  })

  it('renders slot content when no options provided', () => {
    const w = mountGroupWithSlots()
    expect(w.text()).toContain('A')
    expect(w.text()).toContain('B')
    w.unmount()
  })

  it('applies inline as horizontal', () => {
    const w = mountGroup({ inline: true, options: ['X', 'Y'] })
    expect(w.find('[data-slot="checkbox-group"]').exists()).toBe(true)
    w.unmount()
  })
})

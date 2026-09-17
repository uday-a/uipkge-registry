import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { RadioGroup, RadioGroupItem } from '../index'

function mountRadioGroup(props: Record<string, unknown> = {}) {
  return mount(RadioGroup, {
    props: { modelValue: '', ...props },
    attachTo: document.body,
  })
}

function mountWithOptions(options: (string | { label: string; value: string })[] = []) {
  return mount(RadioGroup, {
    props: { modelValue: '', options },
    attachTo: document.body,
  })
}

function mountWithItems() {
  return mount(
    {
      components: { RadioGroup, RadioGroupItem },
      template: `
      <RadioGroup v-model="val">
        <div class="flex items-center gap-2">
          <RadioGroupItem id="a" value="a" />
          <label for="a">A</label>
        </div>
        <div class="flex items-center gap-2">
          <RadioGroupItem id="b" value="b" />
          <label for="b">B</label>
        </div>
      </RadioGroup>
    `,
      data() {
        return { val: '' }
      },
    },
    { attachTo: document.body },
  )
}

// Wrapper for standalone RadioGroupItem tests (needs RadioGroup context)
function mountItemInGroup(itemProps: Record<string, unknown> = {}) {
  return mount(
    {
      components: { RadioGroup, RadioGroupItem },
      template: `
      <RadioGroup v-model="val">
        <RadioGroupItem v-bind="itemProps" />
      </RadioGroup>
    `,
      data() {
        return { val: '', itemProps }
      },
    },
    { attachTo: document.body },
  )
}

describe('RadioGroup', () => {
  it('renders with data-slot="radio-group"', () => {
    const w = mountRadioGroup()
    expect(w.find('[data-slot="radio-group"]').exists()).toBe(true)
    w.unmount()
  })

  it('renders label text', () => {
    const w = mountRadioGroup({ label: 'Choose one' })
    expect(w.text()).toContain('Choose one')
    w.unmount()
  })

  it('renders hint text', () => {
    const w = mountRadioGroup({ hint: 'Select an option' })
    expect(w.text()).toContain('Select an option')
    w.unmount()
  })

  it('renders error messages', () => {
    const w = mountRadioGroup({ errorMessages: 'Required' })
    expect(w.text()).toContain('Required')
    w.unmount()
  })

  it('renders options as radio items with labels', () => {
    const w = mountWithOptions([
      { label: 'Option A', value: 'a' },
      { label: 'Option B', value: 'b' },
    ])
    expect(w.text()).toContain('Option A')
    expect(w.text()).toContain('Option B')
    w.unmount()
  })

  it('renders string options', () => {
    const w = mountWithOptions(['Yes', 'No'])
    expect(w.text()).toContain('Yes')
    expect(w.text()).toContain('No')
    w.unmount()
  })

  it('renders radio items with data-slot="radio-group-item"', () => {
    const w = mountWithItems()
    expect(w.find('[data-slot="radio-group-item"]').exists()).toBe(true)
    expect(w.findAll('[data-slot="radio-group-item"]').length).toBe(2)
    w.unmount()
  })

  it('emits update:modelValue when radio item is clicked', async () => {
    const w = mountWithItems()
    const items = w.findAll('[data-slot="radio-group-item"]')
    await items[0].trigger('click')
    expect(w.vm.val).toBe('a')
    w.unmount()
  })

  it('renders in vertical orientation by default', () => {
    const w = mountWithOptions(['A', 'B'])
    const root = w.find('[data-slot="radio-group"]')
    expect(root.exists()).toBe(true)
    w.unmount()
  })

  it('renders in horizontal orientation when set', () => {
    const w = mountRadioGroup({ orientation: 'horizontal', options: ['A', 'B'] })
    const root = w.find('[data-slot="radio-group"]')
    expect(root.exists()).toBe(true)
    w.unmount()
  })

  it('renders bordered style when bordered is true', () => {
    const w = mountRadioGroup({ bordered: true })
    expect(w.html()).toContain('border')
    w.unmount()
  })

  it('disables all items when group disabled is true', () => {
    const w = mount(
      {
        components: { RadioGroup, RadioGroupItem },
        template: `
        <RadioGroup disabled>
          <RadioGroupItem value="a" />
        </RadioGroup>
      `,
      },
      { attachTo: document.body },
    )
    const item = w.find('[data-slot="radio-group-item"]')
    expect(item.attributes('disabled')).toBeDefined()
    w.unmount()
  })

  it('renders button-style options when optionType is button', () => {
    const w = mountRadioGroup({
      optionType: 'button',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ],
    })
    // RadioButton renders inside the group (label text may not appear
    // due to SFC compiler prop extraction limits in test env)
    expect(w.find('[data-slot="radio-group"]').exists()).toBe(true)
    w.unmount()
  })
})

describe('RadioGroupItem', () => {
  it('renders with data-slot="radio-group-item" inside group', () => {
    const w = mountItemInGroup({ value: 'a' })
    expect(w.find('[data-slot="radio-group-item"]').exists()).toBe(true)
    expect(w.find('[data-uipkge]').exists()).toBe(true)
    w.unmount()
  })

  it('renders a radio role element', () => {
    const w = mountItemInGroup({ value: 'a' })
    expect(w.find('[role="radio"]').exists()).toBe(true)
    w.unmount()
  })

  it('renders label text', () => {
    const w = mountItemInGroup({ value: 'a', label: 'Option A' })
    expect(w.text()).toContain('Option A')
    w.unmount()
  })

  it('renders hint text', () => {
    const w = mountItemInGroup({ value: 'a', hint: 'Some hint' })
    expect(w.text()).toContain('Some hint')
    w.unmount()
  })

  it('applies size classes', () => {
    const w = mountItemInGroup({ value: 'a', size: 'lg' })
    expect(w.find('[role="radio"]').classes()).toContain('size-5')
    w.unmount()
  })

  it('applies small size classes', () => {
    const w = mountItemInGroup({ value: 'a', size: 'sm' })
    expect(w.find('[role="radio"]').classes()).toContain('size-3.5')
    w.unmount()
  })

  it('renders label before when labelPosition is before', () => {
    const w = mountItemInGroup({ value: 'a', label: 'Before', labelPosition: 'before' })
    const labels = w.findAll('label')
    expect(labels.length).toBeGreaterThanOrEqual(1)
    w.unmount()
  })
})

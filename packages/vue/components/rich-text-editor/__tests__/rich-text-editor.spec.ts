import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import RichTextEditor from '../RichTextEditor.vue'

async function mountEditor(props: Record<string, unknown> = {}) {
  const wrapper = mount(RichTextEditor, { props, attachTo: document.body })
  await flushPromises()
  return wrapper
}

/** Toolbar controls are labelled, not ordered — find by accessible name. */
function control(wrapper: Awaited<ReturnType<typeof mountEditor>>, label: string) {
  return wrapper.findAll('button').find((b) => b.attributes('aria-label') === label)
}

describe('RichTextEditor (Vue)', () => {
  it('renders editor container with data-slot="rich-text-editor"', () => {
    const wrapper = mount(RichTextEditor, {
      props: { placeholder: 'Type here...' },
    })
    expect(wrapper.find('[data-slot="rich-text-editor"]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('renders editor content area and handles input', async () => {
    const wrapper = mount(RichTextEditor, {
      props: { modelValue: '<p>Initial text</p>' },
    })
    await flushPromises()
    expect(wrapper.find('[data-slot="rich-text-editor"]').exists()).toBe(true)
    expect(wrapper.classes()).toContain('rich-text-editor')
    wrapper.unmount()
  })

  it('renders the incoming modelValue as editable content', async () => {
    const wrapper = await mountEditor({ modelValue: '<p>Initial text</p>' })
    const surface = wrapper.find('.tiptap')

    expect(surface.exists()).toBe(true)
    expect(surface.attributes('contenteditable')).toBe('true')
    expect(wrapper.text()).toContain('Initial text')
    wrapper.unmount()
  })

  it('exposes a labelled formatting toolbar', async () => {
    const wrapper = await mountEditor({ modelValue: '<p>Hi</p>' })
    const toolbar = wrapper.find('[role="toolbar"]')

    expect(toolbar.exists()).toBe(true)
    expect(toolbar.attributes('aria-label')).toBe('Text formatting')
    for (const label of ['Bold', 'Italic', 'Underline', 'Bullet list', 'Link', 'Undo', 'Redo']) {
      expect(control(wrapper, label), `missing control: ${label}`).toBeDefined()
    }
    wrapper.unmount()
  })

  it('reflects the active mark on its toolbar toggle', async () => {
    const wrapper = await mountEditor({ modelValue: '<p>Hello</p>' })
    const bold = control(wrapper, 'Bold')!

    expect(bold.attributes('aria-pressed')).toBe('false')

    await bold.trigger('click')
    await flushPromises()

    // Bold is armed for the next keystroke, so the control reads as pressed
    // even though a collapsed selection leaves the document unchanged.
    expect(bold.attributes('aria-pressed')).toBe('true')
    expect(bold.attributes('data-state')).toBe('on')
    wrapper.unmount()
  })

  it('announces the extended toolbar row as expanded when opened', async () => {
    const wrapper = await mountEditor({ modelValue: '<p>Hi</p>' })
    const expand = wrapper.findAll('button').find((b) => b.attributes('aria-label') === 'Show more options')!

    expect(expand.attributes('aria-expanded')).toBe('false')

    await expand.trigger('click')
    await flushPromises()

    expect(expand.attributes('aria-expanded')).toBe('true')
    expect(expand.attributes('aria-label')).toBe('Hide more options')
    // Heading / alignment / task-list controls live in that second row.
    expect(control(wrapper, 'Heading 1')).toBeDefined()
    expect(control(wrapper, 'Align center')).toBeDefined()
    wrapper.unmount()
  })

  // The link control used to be window.prompt — unstyleable, untestable and
  // blocked in sandboxed iframes. These cover the popover that replaced it.
  it('opens a labelled URL field instead of a native prompt', async () => {
    const wrapper = await mountEditor({ modelValue: '<p>Hello</p>' })

    await control(wrapper, 'Link')!.trigger('click')
    await flushPromises()

    const field = document.querySelector<HTMLInputElement>('[data-slot="popover-content"] input')
    expect(field).toBeTruthy()
    expect(field!.type).toBe('url')
    expect(document.querySelector('[data-slot="popover-content"] label')?.textContent?.trim()).toBe('Link URL')
    wrapper.unmount()
  })

  it('closes the popover once a URL is submitted', async () => {
    // Applying the mark itself needs a real ProseMirror selection, which this
    // environment cannot produce; that path is covered in the browser. What is
    // testable here is that the form commits and dismisses.
    const wrapper = await mountEditor({ modelValue: '<p>Hello</p>' })

    await control(wrapper, 'Link')!.trigger('click')
    await flushPromises()

    const field = document.querySelector<HTMLInputElement>('[data-slot="popover-content"] input')!
    field.value = 'https://uipkge.dev'
    field.dispatchEvent(new Event('input', { bubbles: true }))
    await flushPromises()

    document
      .querySelector('[data-slot="popover-content"] form')!
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    await flushPromises()

    expect(document.querySelector('[data-slot="popover-content"]')).toBeNull()
    wrapper.unmount()
  })

  it('keeps Apply disabled until a URL is typed', async () => {
    const wrapper = await mountEditor({ modelValue: '<p>Hello</p>' })

    await control(wrapper, 'Link')!.trigger('click')
    await flushPromises()

    const apply = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-slot="popover-content"] button')).find(
      (b) => b.textContent?.trim() === 'Apply',
    )
    expect(apply?.disabled).toBe(true)
    wrapper.unmount()
  })

  it('renders content updates pushed in through the model', async () => {
    const wrapper = await mountEditor({ modelValue: '<p>First</p>' })
    expect(wrapper.text()).toContain('First')

    await wrapper.setProps({ modelValue: '<p>Second</p>' })
    await flushPromises()

    expect(wrapper.text()).toContain('Second')
    expect(wrapper.text()).not.toContain('First')
    wrapper.unmount()
  })

  it('applies the configured minimum height to the editing surface', async () => {
    const wrapper = await mountEditor({ modelValue: '<p>Hi</p>', minHeight: '240px' })
    expect(wrapper.html()).toContain('240px')
    wrapper.unmount()
  })
})

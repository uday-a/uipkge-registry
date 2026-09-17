import { describe, it, expect, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { AlertModal } from '../index'

afterEach(() => {
  document.body.innerHTML = ''
})

function mountModal(props: Record<string, unknown> = {}, slots: Record<string, string> = {}) {
  const slotTemplates: Record<string, string> = {}
  if (slots.trigger) slotTemplates.trigger = slots.trigger
  return mount(
    {
      components: { AlertModal },
      data() {
        return { open: props.open ?? false }
      },
      template: `
        <AlertModal
          :open="open"
          :title="title"
          :description="description"
          :action-label="actionLabel"
          :cancel-label="cancelLabel"
          :tone="tone"
          :icon="icon"
          @update:open="open = $event"
        >
          ${slots.trigger ? '<template #trigger><button data-testid="trigger-btn">Open</button></template>' : ''}
        </AlertModal>
      `,
      computed: {
        title: () => props.title ?? 'Are you sure?',
        description: () => props.description ?? 'This action cannot be undone.',
        actionLabel: () => props.actionLabel ?? 'Continue',
        cancelLabel: () => (props.cancelLabel !== undefined ? props.cancelLabel : 'Cancel'),
        tone: () => props.tone ?? 'default',
        icon: () => props.icon ?? null,
      },
    },
    { attachTo: document.body },
  )
}

describe('AlertModal', () => {
  it('renders trigger slot when provided', () => {
    const w = mountModal({}, { trigger: 'trigger' })
    expect(w.find('[data-testid="trigger-btn"]').exists()).toBe(true)
    w.unmount()
  })

  it('opens modal when open is true', async () => {
    const w = mountModal({ open: true })
    await flushPromises()
    expect(document.querySelector('[role="alertdialog"]')).toBeTruthy()
    w.unmount()
  })

  it('renders title text', async () => {
    const w = mountModal({ open: true, title: 'Delete item?' })
    await flushPromises()
    expect(document.body.textContent).toContain('Delete item?')
    w.unmount()
  })

  it('renders description text', async () => {
    const w = mountModal({ open: true, description: 'This is permanent.' })
    await flushPromises()
    expect(document.body.textContent).toContain('This is permanent.')
    w.unmount()
  })

  it('renders cancel button with default label', async () => {
    const w = mountModal({ open: true })
    await flushPromises()
    const buttons = document.querySelectorAll('button')
    const texts = Array.from(buttons).map((b) => b.textContent?.trim())
    expect(texts).toContain('Cancel')
    w.unmount()
  })

  it('renders action button with default label', async () => {
    const w = mountModal({ open: true })
    await flushPromises()
    const buttons = document.querySelectorAll('button')
    const texts = Array.from(buttons).map((b) => b.textContent?.trim())
    expect(texts).toContain('Continue')
    w.unmount()
  })

  it('hides cancel button when cancelLabel is null', async () => {
    const w = mountModal({ open: true, cancelLabel: null })
    await flushPromises()
    const buttons = document.querySelectorAll('button')
    const texts = Array.from(buttons).map((b) => b.textContent?.trim())
    expect(texts).not.toContain('Cancel')
    w.unmount()
  })

  it('renders icon when icon prop is set', async () => {
    const w = mountModal({ open: true, icon: 'warning' })
    await flushPromises()
    expect(document.querySelectorAll('svg').length).toBeGreaterThan(0)
    w.unmount()
  })
})

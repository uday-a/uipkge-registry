import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { Clipboard } from '../index'

const writeText = vi.fn().mockResolvedValue(undefined)

beforeEach(() => {
  writeText.mockClear()
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText },
    configurable: true,
    writable: true,
  })
})

function mountClipboard(props: Record<string, unknown> = {}) {
  return mount(Clipboard, { props, attachTo: document.body })
}

describe('Clipboard', () => {
  it('renders a trigger button', () => {
    const w = mountClipboard({ text: 'hello' })
    expect(w.find('button').exists()).toBe(true)
    w.unmount()
  })

  it('has data-slot="clipboard" and data-uipkge', () => {
    const w = mountClipboard({ text: 'hello' })
    const btn = w.find('[data-slot="clipboard"]')
    expect(btn.exists()).toBe(true)
    expect(btn.attributes('data-uipkge')).toBeDefined()
    w.unmount()
  })

  it('copies text on click', async () => {
    const w = mountClipboard({ text: 'copy-me' })
    await w.find('button').trigger('click')
    await flushPromises()
    expect(writeText).toHaveBeenCalledWith('copy-me')
    w.unmount()
  })

  it('shows copied state (data-feedback-state="success") after click', async () => {
    const w = mountClipboard({ text: 'copy-me' })
    await w.find('button').trigger('click')
    await flushPromises()
    expect(w.find('[data-slot="clipboard"]').attributes('data-feedback-state')).toBe('success')
    w.unmount()
  })

  it('emits success event with copied text', async () => {
    const w = mountClipboard({ text: 'emitted' })
    await w.find('button').trigger('click')
    await flushPromises()
    expect(w.emitted('success')).toBeTruthy()
    expect(w.emitted('success')![0]).toEqual(['emitted'])
    w.unmount()
  })

  it('supports custom value via text prop', async () => {
    const w = mountClipboard({ text: 'custom-value-123' })
    await w.find('button').trigger('click')
    await flushPromises()
    expect(writeText).toHaveBeenCalledWith('custom-value-123')
    w.unmount()
  })

  it('does not copy when disabled', async () => {
    const w = mountClipboard({ text: 'no-copy', disabled: true })
    await w.find('button').trigger('click')
    await flushPromises()
    expect(writeText).not.toHaveBeenCalled()
    w.unmount()
  })
})

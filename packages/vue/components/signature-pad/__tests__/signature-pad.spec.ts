import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { SignaturePad } from '../index'

function mountSignaturePad(props: Record<string, unknown> = {}) {
  return mount(SignaturePad, {
    props: {
      width: props.width ?? 400,
      height: props.height ?? 200,
      disabled: props.disabled ?? false,
      readonly: props.readonly ?? false,
      showClearButton: props.showClearButton ?? true,
      clearLabel: props.clearLabel ?? 'Clear',
      ...props,
    },
    attachTo: document.body,
  })
}

describe('SignaturePad', () => {
  it('renders container with data-slot="signature-pad"', () => {
    const w = mountSignaturePad()
    expect(w.find('[data-slot="signature-pad"]').exists()).toBe(true)
    w.unmount()
  })

  it('has data-uipkge on container', () => {
    const w = mountSignaturePad()
    expect(w.find('[data-slot="signature-pad"]').attributes('data-uipkge')).toBeDefined()
    w.unmount()
  })

  it('renders a canvas element', () => {
    const w = mountSignaturePad()
    expect(w.find('canvas').exists()).toBe(true)
    w.unmount()
  })

  it('renders clear button with default label', () => {
    const w = mountSignaturePad()
    expect(w.text()).toContain('Clear')
    w.unmount()
  })

  it('does not render clear button when showClearButton is false', () => {
    const w = mountSignaturePad({ showClearButton: false })
    const btns = w.findAll('button')
    expect(btns.length).toBe(0)
    w.unmount()
  })

  it('applies data-disabled when disabled is true', () => {
    const w = mountSignaturePad({ disabled: true })
    expect(w.find('[data-slot="signature-pad"]').attributes('data-disabled')).toBeDefined()
    w.unmount()
  })

  it('does not render clear button when disabled', () => {
    const w = mountSignaturePad({ disabled: true })
    const btns = w.findAll('button')
    expect(btns.length).toBe(0)
    w.unmount()
  })
})

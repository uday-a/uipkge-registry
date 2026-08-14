import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { FileUpload } from '../index'

function mountFileUpload(props: Record<string, unknown> = {}, slots: Record<string, string> = {}) {
  return mount(FileUpload, {
    props,
    slots,
    attachTo: document.body,
  })
}

describe('FileUpload', () => {
  it('renders without crashing', () => {
    const w = mountFileUpload()
    expect(w.exists()).toBe(true)
    w.unmount()
  })

  it('renders a dropzone area with role="button"', () => {
    const w = mountFileUpload()
    expect(w.find('[role="button"]').exists()).toBe(true)
    w.unmount()
  })

  it('renders hidden file input', () => {
    const w = mountFileUpload()
    const input = w.find('input[type="file"]')
    expect(input.exists()).toBe(true)
    expect(input.classes()).toContain('sr-only')
    w.unmount()
  })

  it('input has type="file"', () => {
    const w = mountFileUpload()
    expect(w.find('input').attributes('type')).toBe('file')
    w.unmount()
  })

  it('disables dropzone when disabled prop is true', () => {
    const w = mountFileUpload({ disabled: true })
    const dropzone = w.find('[role="button"]')
    expect(dropzone.attributes('aria-disabled')).toBeDefined()
    expect(dropzone.attributes('tabindex')).toBe('-1')
    w.unmount()
  })

  it('disables file input when disabled prop is true', () => {
    const w = mountFileUpload({ disabled: true })
    expect(w.find('input[type="file"]').attributes('disabled')).toBeDefined()
    w.unmount()
  })

  it('renders slot content', () => {
    const w = mountFileUpload({}, { default: 'Drop files here' })
    expect(w.text()).toContain('Drop files here')
    w.unmount()
  })

  it('renders default icon slot when no custom icon provided', () => {
    const w = mountFileUpload()
    expect(w.find('svg').exists()).toBe(true)
    w.unmount()
  })

  it('renders custom icon slot content', () => {
    const w = mountFileUpload({}, { icon: '<span data-testid="custom-icon">Icon</span>' })
    expect(w.find('[data-testid="custom-icon"]').exists()).toBe(true)
    w.unmount()
  })
})

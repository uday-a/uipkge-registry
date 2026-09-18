import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { FileUpload } from '../file-upload'

describe('FileUpload', () => {
  it('renders without crashing', () => {
    const { container } = render(<FileUpload>Drop files here</FileUpload>)
    expect(container.firstChild).toBeTruthy()
  })

  it('renders a dropzone area', () => {
    const { container } = render(<FileUpload>Drop files here</FileUpload>)
    const dropzone = container.querySelector('[role="button"]')
    expect(dropzone).toBeTruthy()
  })

  it('renders hidden file input', () => {
    const { container } = render(<FileUpload>Drop files here</FileUpload>)
    const input = container.querySelector('input[type="file"]')
    expect(input).toBeTruthy()
    // sr-only hides via class; verify it is present
    expect(input?.className).toContain('sr-only')
  })

  it('has role="button" on dropzone', () => {
    const { container } = render(<FileUpload>Drop files here</FileUpload>)
    const dropzone = container.querySelector('[role="button"]')
    expect(dropzone?.getAttribute('role')).toBe('button')
  })

  it('disables when disabled', () => {
    const { container } = render(<FileUpload disabled>Drop files here</FileUpload>)
    const input = container.querySelector('input[type="file"]') as HTMLInputElement | null
    expect(input?.disabled).toBe(true)
    const dropzone = container.querySelector('[role="button"]')
    expect(dropzone?.getAttribute('aria-disabled')).toBe('true')
  })

  it('renders children', () => {
    const { container } = render(<FileUpload>Drop files here</FileUpload>)
    expect(container.textContent).toContain('Drop files here')
  })

  it('input has type="file"', () => {
    const { container } = render(<FileUpload>Drop files here</FileUpload>)
    const input = container.querySelector('input')
    expect(input?.getAttribute('type')).toBe('file')
  })

  it('dropzone is focusable when enabled', () => {
    const { container } = render(<FileUpload>Drop files here</FileUpload>)
    const dropzone = container.querySelector('[role="button"]')
    expect(dropzone?.getAttribute('tabindex')).toBe('0')
  })
})

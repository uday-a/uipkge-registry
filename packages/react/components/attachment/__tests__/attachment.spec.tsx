import { describe, it, expect, vi } from 'vitest'
import { fireEvent, render } from '@testing-library/react'
import { Attachment } from '../attachment'

describe('Attachment', () => {
  it('renders with data-slot="attachment"', () => {
    const { container } = render(<Attachment title="notes.pdf" />)
    expect(container.querySelector('[data-slot="attachment"]')).toBeTruthy()
  })

  it('shows title and description', () => {
    const { container } = render(<Attachment title="notes.pdf" description="PDF · 2.4 MB" />)
    expect(container.textContent).toContain('notes.pdf')
    expect(container.textContent).toContain('PDF · 2.4 MB')
  })

  it('sets state from the state prop', () => {
    const { container } = render(<Attachment title="a" state="uploading" />)
    expect(container.querySelector('[data-slot="attachment"]')?.getAttribute('data-state')).toBe('uploading')
  })

  it('sets size and orientation from props', () => {
    const { container } = render(<Attachment title="a" size="xs" orientation="vertical" />)
    const el = container.querySelector('[data-slot="attachment"]')
    expect(el?.getAttribute('data-size')).toBe('xs')
    expect(el?.getAttribute('data-orientation')).toBe('vertical')
  })

  it('calls onRemove when removable', () => {
    const onRemove = vi.fn()
    const { container } = render(<Attachment title="notes.pdf" removable onRemove={onRemove} />)
    fireEvent.click(container.querySelector('[data-slot="attachment-remove"]')!)
    expect(onRemove).toHaveBeenCalledTimes(1)
  })
})

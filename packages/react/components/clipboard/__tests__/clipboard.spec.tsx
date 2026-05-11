import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, fireEvent, cleanup } from '@testing-library/react'
import { Clipboard } from '../index'

const writeText = vi.fn().mockResolvedValue(undefined)

beforeEach(() => {
  writeText.mockClear()
  // @ts-expect-error test mock
  navigator.clipboard = { writeText }
})

afterEach(cleanup)

describe('Clipboard', () => {
  it('renders a trigger button', () => {
    const { container } = render(<Clipboard text="hello" />)
    expect(container.querySelector('button')).toBeTruthy()
  })

  it('has data-slot="clipboard" and data-uipkge', () => {
    const { container } = render(<Clipboard text="hello" />)
    const btn = container.querySelector('[data-slot="clipboard"]')
    expect(btn).toBeTruthy()
    expect(btn?.hasAttribute('data-uipkge')).toBe(true)
  })

  it('copies text on click', async () => {
    const { container } = render(<Clipboard text="copy-me" />)
    fireEvent.click(container.querySelector('button')!)
    await vi.waitFor(() => expect(writeText).toHaveBeenCalledWith('copy-me'))
  })

  it('shows copied state (data-feedback-state="success") after click', async () => {
    const { container } = render(<Clipboard text="copy-me" />)
    fireEvent.click(container.querySelector('button')!)
    await vi.waitFor(() => {
      expect(container.querySelector('[data-slot="clipboard"]')?.getAttribute('data-feedback-state')).toBe('success')
    })
  })

  it('calls onSuccess with copied text', async () => {
    const onSuccess = vi.fn()
    const { container } = render(<Clipboard text="emitted" onSuccess={onSuccess} />)
    fireEvent.click(container.querySelector('button')!)
    await vi.waitFor(() => expect(onSuccess).toHaveBeenCalledWith('emitted'))
  })

  it('supports custom value via text prop', async () => {
    const { container } = render(<Clipboard text="custom-value-123" />)
    fireEvent.click(container.querySelector('button')!)
    await vi.waitFor(() => expect(writeText).toHaveBeenCalledWith('custom-value-123'))
  })

  it('does not copy when disabled', async () => {
    const { container } = render(<Clipboard text="no-copy" disabled />)
    fireEvent.click(container.querySelector('button')!)
    await vi.waitFor(() => expect(writeText).not.toHaveBeenCalled())
  })
})

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ProgressItem } from '../ProgressItem'

describe('ProgressItem', () => {
  it('renders with data-slot="progress-item"', () => {
    const { container } = render(<ProgressItem label="CPU" value={50} />)
    expect(container.querySelector('[data-slot="progress-item"]')).toBeTruthy()
  })

  it('has data-uipkge', () => {
    const { container } = render(<ProgressItem label="CPU" value={50} />)
    expect(container.querySelector('[data-uipkge]')).toBeTruthy()
  })

  it('renders the label text', () => {
    const { container } = render(<ProgressItem label="CPU Usage" value={50} />)
    expect(container.textContent).toContain('CPU Usage')
  })

  it('renders the value as percentage by default', () => {
    const { container } = render(<ProgressItem label="CPU" value={75} />)
    expect(container.textContent).toContain('75%')
  })

  it('renders secondaryLabel when provided', () => {
    const { container } = render(<ProgressItem label="CPU" value={75} secondaryLabel="3.2 GHz" />)
    expect(container.textContent).toContain('3.2 GHz')
  })

  it('renders a progress bar element', () => {
    const { container } = render(<ProgressItem label="CPU" value={50} />)
    expect(container.querySelector('[data-slot="progress"]')).toBeTruthy()
  })
})

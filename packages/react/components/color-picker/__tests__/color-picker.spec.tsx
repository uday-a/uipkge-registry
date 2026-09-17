import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { ColorPicker } from '../index'

describe('ColorPicker', () => {
  it('renders root with data-slot="color-picker"', () => {
    const { container } = render(<ColorPicker value="#ff0000" onValueChange={() => {}} />)
    expect(container.querySelector('[data-slot="color-picker"]')).toBeTruthy()
  })

  it('has data-uipkge attribute', () => {
    const { container } = render(<ColorPicker value="#ff0000" onValueChange={() => {}} />)
    expect(container.querySelector('[data-uipkge]')).toBeTruthy()
  })

  it('renders color preview trigger', () => {
    const { container } = render(<ColorPicker value="#ff0000" onValueChange={() => {}} />)
    const colorInput = container.querySelector('input[type="color"]')
    expect(colorInput).toBeTruthy()
  })

  it('renders hex text input by default', () => {
    const { container } = render(<ColorPicker value="#ff0000" onValueChange={() => {}} />)
    const textInput = container.querySelector('input[type="text"]')
    expect(textInput).toBeTruthy()
  })

  it('hides hex input when hideHexInput is true', () => {
    const { container } = render(<ColorPicker value="#ff0000" hideHexInput onValueChange={() => {}} />)
    const textInput = container.querySelector('input[type="text"]')
    expect(textInput).toBeNull()
  })

  it('renders default preset swatches', () => {
    const { container } = render(<ColorPicker value="#ff0000" onValueChange={() => {}} />)
    const swatches = container.querySelectorAll('button[aria-label^="Select"]')
    expect(swatches.length).toBe(12)
  })

  it('renders custom presets when provided', () => {
    const { container } = render(
      <ColorPicker value="#ff0000" presets={['#ff0000', '#00ff00', '#0000ff']} onValueChange={() => {}} />,
    )
    const swatches = container.querySelectorAll('button[aria-label^="Select"]')
    expect(swatches.length).toBe(3)
  })

  it('disables inputs when disabled is true', () => {
    const { container } = render(<ColorPicker value="#ff0000" disabled onValueChange={() => {}} />)
    const colorInput = container.querySelector('input[type="color"]')
    const textInput = container.querySelector('input[type="text"]')
    expect(colorInput?.hasAttribute('disabled')).toBe(true)
    expect(textInput?.hasAttribute('disabled')).toBe(true)
  })

  it('calls onValueChange when a swatch is clicked', () => {
    const onValueChange = vi.fn()
    const { container } = render(<ColorPicker value="#ff0000" onValueChange={onValueChange} />)
    const swatches = container.querySelectorAll('button[aria-label^="Select"]')
    fireEvent.click(swatches[0])
    expect(onValueChange).toHaveBeenCalledWith('#ef4444')
  })
})

import { describe, it, expect, afterEach } from 'vitest'
import { render, fireEvent, cleanup } from '@testing-library/react'
import { FloatLabel } from '../index'

afterEach(cleanup)

describe('FloatLabel', () => {
  it('renders container with data-slot="float-label" and data-uipkge', () => {
    const { container } = render(
      <FloatLabel label="Email">
        <input />
      </FloatLabel>,
    )
    const el = container.querySelector('[data-slot="float-label"]')
    expect(el).toBeTruthy()
    expect(el?.hasAttribute('data-uipkge')).toBe(true)
  })

  it('renders an input from children', () => {
    const { container } = render(
      <FloatLabel label="Email">
        <input />
      </FloatLabel>,
    )
    expect(container.querySelector('input')).toBeTruthy()
  })

  it('renders a label element', () => {
    const { container } = render(
      <FloatLabel label="Email">
        <input />
      </FloatLabel>,
    )
    expect(container.querySelector('label')).toBeTruthy()
  })

  it('label text matches prop', () => {
    const { container } = render(
      <FloatLabel label="Username">
        <input />
      </FloatLabel>,
    )
    expect(container.querySelector('label')?.textContent).toBe('Username')
  })

  it('data-floating is false initially when input is empty', () => {
    const { container } = render(
      <FloatLabel label="Email">
        <input />
      </FloatLabel>,
    )
    expect(container.querySelector('[data-slot="float-label"]')?.getAttribute('data-floating')).toBe('false')
  })

  it('label floats on focus (data-floating becomes true)', () => {
    const { container } = render(
      <FloatLabel label="Email">
        <input />
      </FloatLabel>,
    )
    fireEvent.focus(container.querySelector('input')!)
    expect(container.querySelector('[data-slot="float-label"]')?.getAttribute('data-floating')).toBe('true')
  })

  it('shows required indicator when required prop is set', () => {
    const { container } = render(
      <FloatLabel label="Email" required>
        <input />
      </FloatLabel>,
    )
    const label = container.querySelector('label')
    expect(label?.className).toContain('destructive')
  })
})

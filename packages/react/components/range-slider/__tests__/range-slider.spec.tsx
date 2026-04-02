import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { RangeSlider } from '../RangeSlider'

describe('RangeSlider', () => {
  it('renders with data-slot="range-slider"', () => {
    const { container } = render(<RangeSlider value={[20, 80]} onValueChange={() => {}} />)
    expect(container.querySelector('[data-slot="range-slider"]')).toBeTruthy()
  })

  it('renders track', () => {
    const { container } = render(<RangeSlider value={[20, 80]} onValueChange={() => {}} />)
    expect(container.querySelector('[data-slot="slider-track"]')).toBeTruthy()
  })

  it('renders range', () => {
    const { container } = render(<RangeSlider value={[20, 80]} onValueChange={() => {}} />)
    expect(container.querySelector('[data-slot="slider-range"]')).toBeTruthy()
  })

  it('renders two thumbs', () => {
    const { container } = render(<RangeSlider value={[20, 80]} onValueChange={() => {}} />)
    expect(container.querySelectorAll('[data-slot="slider-thumb"]').length).toBe(2)
  })

  it('renders label', () => {
    const { getByText } = render(<RangeSlider value={[20, 80]} label="Price range" onValueChange={() => {}} />)
    expect(getByText('Price range')).toBeTruthy()
  })

  it('renders hint', () => {
    const { getByText } = render(<RangeSlider value={[20, 80]} hint="Drag to adjust" onValueChange={() => {}} />)
    expect(getByText('Drag to adjust')).toBeTruthy()
  })

  it('renders error messages', () => {
    const { getByText } = render(
      <RangeSlider value={[20, 80]} errorMessages="Invalid range" onValueChange={() => {}} />,
    )
    expect(getByText('Invalid range')).toBeTruthy()
  })

  it('shows min value display', () => {
    const { container } = render(<RangeSlider value={[20, 80]} onValueChange={() => {}} />)
    expect(container.textContent).toContain('20')
  })

  it('shows max value display', () => {
    const { container } = render(<RangeSlider value={[20, 80]} onValueChange={() => {}} />)
    expect(container.textContent).toContain('80')
  })

  it('disables when disabled', () => {
    const { container } = render(<RangeSlider value={[20, 80]} disabled onValueChange={() => {}} />)
    expect(container.querySelector('[data-slot="range-slider"]')?.hasAttribute('data-disabled')).toBe(true)
  })

  it('sets aria-valuenow on thumbs', () => {
    const { container } = render(<RangeSlider value={[20, 80]} onValueChange={() => {}} />)
    const thumbs = container.querySelectorAll('[role="slider"]')
    expect(thumbs[0].getAttribute('aria-valuenow')).toBe('20')
    expect(thumbs[1].getAttribute('aria-valuenow')).toBe('80')
  })

  it('uses defaultValue when uncontrolled', () => {
    const { container } = render(<RangeSlider defaultValue={[10, 90]} />)
    const thumbs = container.querySelectorAll('[role="slider"]')
    expect(thumbs[0].getAttribute('aria-valuenow')).toBe('10')
    expect(thumbs[1].getAttribute('aria-valuenow')).toBe('90')
  })

  it('respects min and max props', () => {
    const { container } = render(<RangeSlider value={[5, 15]} min={0} max={50} onValueChange={() => {}} />)
    const thumbs = container.querySelectorAll('[role="slider"]')
    expect(thumbs[0].getAttribute('aria-valuemin')).toBe('0')
    expect(thumbs[1].getAttribute('aria-valuemax')).toBe('50')
  })
})

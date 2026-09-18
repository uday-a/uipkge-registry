import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { Slider } from '../Slider'

describe('Slider', () => {
  it('renders with data-slot="slider"', () => {
    const { container } = render(<Slider value={[50]} onValueChange={() => {}} />)
    expect(container.querySelector('[data-slot="slider"]')).toBeTruthy()
  })

  it('renders track', () => {
    const { container } = render(<Slider value={[50]} onValueChange={() => {}} />)
    expect(container.querySelector('[data-slot="slider-track"]')).toBeTruthy()
  })

  it('renders range', () => {
    const { container } = render(<Slider value={[50]} onValueChange={() => {}} />)
    expect(container.querySelector('[data-slot="slider-range"]')).toBeTruthy()
  })

  it('renders thumb', () => {
    const { container } = render(<Slider value={[50]} onValueChange={() => {}} />)
    expect(container.querySelector('[data-slot="slider-thumb"]')).toBeTruthy()
  })

  it('renders slider role', () => {
    const { container } = render(<Slider value={[50]} onValueChange={() => {}} />)
    expect(container.querySelector('[role="slider"]')).toBeTruthy()
  })

  it('sets aria-valuenow', () => {
    const { container } = render(<Slider value={[50]} onValueChange={() => {}} />)
    expect(container.querySelector('[role="slider"]')?.getAttribute('aria-valuenow')).toBe('50')
  })

  it('sets aria-valuemin', () => {
    const { container } = render(<Slider value={[50]} min={10} onValueChange={() => {}} />)
    expect(container.querySelector('[role="slider"]')?.getAttribute('aria-valuemin')).toBe('10')
  })

  it('sets aria-valuemax', () => {
    const { container } = render(<Slider value={[50]} max={200} onValueChange={() => {}} />)
    expect(container.querySelector('[role="slider"]')?.getAttribute('aria-valuemax')).toBe('200')
  })

  it('disables when disabled', () => {
    const { container } = render(<Slider value={[50]} disabled onValueChange={() => {}} />)
    expect(container.querySelector('[data-slot="slider"]')?.hasAttribute('data-disabled')).toBe(true)
  })

  it('renders two thumbs in range mode', () => {
    const { container } = render(<Slider value={[20, 80]} range onValueChange={() => {}} />)
    expect(container.querySelectorAll('[data-slot="slider-thumb"]').length).toBe(2)
  })

  it('uses defaultValue when uncontrolled', () => {
    const { container } = render(<Slider defaultValue={[30]} />)
    expect(container.querySelector('[role="slider"]')?.getAttribute('aria-valuenow')).toBe('30')
  })

  it('renders a single thumb by default', () => {
    const { container } = render(<Slider value={[50]} onValueChange={() => {}} />)
    expect(container.querySelectorAll('[data-slot="slider-thumb"]').length).toBe(1)
  })

  it('calls onValueChange when thumb moved', () => {
    const onValueChange = vi.fn()
    const { container } = render(<Slider value={[50]} onValueChange={onValueChange} />)
    const thumb = container.querySelector('[role="slider"]')!
    fireEvent.keyDown(thumb, { key: 'ArrowRight' })
    expect(onValueChange).toHaveBeenCalled()
  })
})

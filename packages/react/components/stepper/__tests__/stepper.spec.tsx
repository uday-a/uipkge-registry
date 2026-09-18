import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { Stepper, StepperContent, StepperHeader } from '../stepper'

describe('Stepper', () => {
  it('Stepper renders with role="tablist"', () => {
    const { container } = render(
      <Stepper
        steps={[
          { id: 1, title: 'Step 1' },
          { id: 2, title: 'Step 2' },
        ]}
        value={1}
      >
        <StepperContent step={1}>Content 1</StepperContent>
        <StepperContent step={2}>Content 2</StepperContent>
      </Stepper>,
    )
    expect(container.querySelector('[role="tablist"]')).toBeTruthy()
  })

  it('StepperItem renders with data-slot="stepper-item"', () => {
    const { container } = render(
      <Stepper
        steps={[
          { id: 1, title: 'Step 1' },
          { id: 2, title: 'Step 2' },
        ]}
        value={1}
      >
        <StepperContent step={1}>Content 1</StepperContent>
      </Stepper>,
    )
    expect(container.querySelector('[data-slot="stepper-item"]')).toBeTruthy()
  })

  it('StepperItem has data-status', () => {
    const { container } = render(
      <Stepper
        steps={[
          { id: 1, title: 'Step 1' },
          { id: 2, title: 'Step 2' },
        ]}
        value={1}
      >
        <StepperContent step={1}>Content 1</StepperContent>
      </Stepper>,
    )
    expect(container.querySelector('[data-slot="stepper-item"]')?.hasAttribute('data-status')).toBe(true)
  })

  it('StepperItem shows active status for current step', () => {
    const { container } = render(
      <Stepper
        steps={[
          { id: 1, title: 'Step 1' },
          { id: 2, title: 'Step 2' },
        ]}
        value={1}
      >
        <StepperContent step={1}>Content 1</StepperContent>
      </Stepper>,
    )
    const items = container.querySelectorAll('[data-slot="stepper-item"]')
    expect(items[0].getAttribute('data-status')).toBe('active')
    expect(items[1].getAttribute('data-status')).toBe('pending')
  })

  it('StepperContent renders with data-slot="stepper-content"', () => {
    const { container } = render(
      <Stepper steps={[{ id: 1, title: 'Step 1' }]} value={1}>
        <StepperContent step={1}>Content 1</StepperContent>
      </Stepper>,
    )
    expect(container.querySelector('[data-slot="stepper-content"]')).toBeTruthy()
  })

  it('StepperContent shows content for active step', () => {
    const { container } = render(
      <Stepper
        steps={[
          { id: 1, title: 'Step 1' },
          { id: 2, title: 'Step 2' },
        ]}
        value={1}
      >
        <StepperContent step={1}>Content 1</StepperContent>
        <StepperContent step={2}>Content 2</StepperContent>
      </Stepper>,
    )
    const contents = container.querySelectorAll('[data-slot="stepper-content"]')
    expect(contents[0].textContent).toContain('Content 1')
    expect(contents[0].getAttribute('aria-hidden')).toBe('false')
  })

  it('StepperContent hides content for inactive step', () => {
    const { container } = render(
      <Stepper
        steps={[
          { id: 1, title: 'Step 1' },
          { id: 2, title: 'Step 2' },
        ]}
        value={1}
      >
        <StepperContent step={1}>Content 1</StepperContent>
        <StepperContent step={2}>Content 2</StepperContent>
      </Stepper>,
    )
    const contents = container.querySelectorAll('[data-slot="stepper-content"]')
    expect(contents[1].getAttribute('aria-hidden')).toBe('true')
    expect(contents[1].style.display).toBe('none')
  })

  it('Stepper applies data-orientation', () => {
    const { container } = render(
      <Stepper steps={[{ id: 1, title: 'Step 1' }]} value={1} orientation="vertical">
        <StepperContent step={1}>Content 1</StepperContent>
      </Stepper>,
    )
    expect(container.querySelector('[role="tablist"]')?.getAttribute('data-orientation')).toBe('vertical')
  })

  it('StepperHeader renders', () => {
    const { container } = render(<StepperHeader>Header</StepperHeader>)
    expect(container.querySelector('.stepper-header')).toBeTruthy()
    expect(container.textContent).toContain('Header')
  })

  it('Stepper calls onValueChange when step changes', () => {
    const onValueChange = vi.fn()
    const { container } = render(
      <Stepper
        steps={[
          { id: 1, title: 'Step 1' },
          { id: 2, title: 'Step 2' },
        ]}
        value={2}
        onValueChange={onValueChange}
      >
        <StepperContent step={1}>Content 1</StepperContent>
        <StepperContent step={2}>Content 2</StepperContent>
      </Stepper>,
    )
    // Step 1 indicator is clickable (completed) when value=2
    const indicators = container.querySelectorAll('[data-slot="stepper-indicator"]')
    fireEvent.click(indicators[0])
    expect(onValueChange).toHaveBeenCalledWith(1)
  })

  it('Stepper renders step indicators', () => {
    const { container } = render(
      <Stepper
        steps={[
          { id: 1, title: 'Step 1' },
          { id: 2, title: 'Step 2' },
          { id: 3, title: 'Step 3' },
        ]}
        value={1}
      >
        <StepperContent step={1}>Content 1</StepperContent>
      </Stepper>,
    )
    expect(container.querySelectorAll('[data-slot="stepper-indicator"]').length).toBe(3)
  })

  it('Stepper renders step titles', () => {
    const { container } = render(
      <Stepper
        steps={[
          { id: 1, title: 'First Step' },
          { id: 2, title: 'Second Step' },
        ]}
        value={1}
      >
        <StepperContent step={1}>Content 1</StepperContent>
      </Stepper>,
    )
    expect(container.textContent).toContain('First Step')
    expect(container.textContent).toContain('Second Step')
  })
})

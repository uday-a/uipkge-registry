import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { RadioGroup, RadioGroupItem } from '../radio-group'

describe('RadioGroup', () => {
  it('renders with data-slot="radio-group"', () => {
    const { container } = render(<RadioGroup value="" onValueChange={() => {}} />)
    expect(container.querySelector('[data-slot="radio-group"]')).toBeTruthy()
  })

  it('renders label', () => {
    const { getByText } = render(<RadioGroup value="" label="Group label" onValueChange={() => {}} />)
    expect(getByText('Group label')).toBeTruthy()
  })

  it('renders hint', () => {
    const { getByText } = render(<RadioGroup value="" hint="Pick one" onValueChange={() => {}} />)
    expect(getByText('Pick one')).toBeTruthy()
  })

  it('renders error messages', () => {
    const { getByText } = render(<RadioGroup value="" errorMessages="Selection required" onValueChange={() => {}} />)
    expect(getByText('Selection required')).toBeTruthy()
  })

  it('renders options with labels', () => {
    const { getByText, container } = render(
      <RadioGroup value="" onValueChange={() => {}} options={[{ label: 'Option A', value: 'a' }]} />,
    )
    expect(getByText('Option A')).toBeTruthy()
    expect(container.querySelectorAll('[data-slot="radio-group-item"]').length).toBe(1)
  })

  it('renders radio items', () => {
    const { container } = render(
      <RadioGroup
        value=""
        onValueChange={() => {}}
        options={[
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
        ]}
      />,
    )
    expect(container.querySelectorAll('[data-slot="radio-group-item"]').length).toBe(2)
  })

  it('disables items when group disabled', () => {
    const { container } = render(
      <RadioGroup value="" disabled onValueChange={() => {}} options={[{ label: 'A', value: 'a' }]} />,
    )
    expect(container.querySelector('[data-slot="radio-group-item"]')?.hasAttribute('disabled')).toBe(true)
  })

  it('renders button-style options', () => {
    const { container } = render(
      <RadioGroup
        value=""
        optionType="button"
        onValueChange={() => {}}
        options={[
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
        ]}
      />,
    )
    expect(container.querySelectorAll('[data-slot="radio-button"]').length).toBe(2)
  })

  it('renders string options', () => {
    const { container } = render(<RadioGroup value="" onValueChange={() => {}} options={['x', 'y']} />)
    expect(container.querySelectorAll('[data-slot="radio-group-item"]').length).toBe(2)
  })

  it('emits onValueChange when option clicked', () => {
    const onValueChange = vi.fn()
    const { container } = render(
      <RadioGroup value="" onValueChange={onValueChange} options={[{ label: 'A', value: 'a' }]} />,
    )
    const item = container.querySelector('[data-slot="radio-group-item"]')!
    fireEvent.click(item)
    expect(onValueChange).toHaveBeenCalledWith('a')
  })
})

describe('RadioGroupItem', () => {
  it('renders with data-slot="radio-group-item" inside group', () => {
    const { container } = render(
      <RadioGroup value="">
        <RadioGroupItem value="a" />
      </RadioGroup>,
    )
    expect(container.querySelector('[data-slot="radio-group-item"]')).toBeTruthy()
  })

  it('renders radio role', () => {
    const { container } = render(
      <RadioGroup value="">
        <RadioGroupItem value="a" />
      </RadioGroup>,
    )
    expect(container.querySelector('[role="radio"]')).toBeTruthy()
  })

  it('renders label', () => {
    const { getByText } = render(
      <RadioGroup value="">
        <RadioGroupItem value="a" label="My label" />
      </RadioGroup>,
    )
    expect(getByText('My label')).toBeTruthy()
  })

  it('applies size classes (sm)', () => {
    const { container } = render(
      <RadioGroup value="">
        <RadioGroupItem value="a" size="sm" />
      </RadioGroup>,
    )
    const item = container.querySelector('[data-slot="radio-group-item"]')!
    expect(item.className).toContain('size-3.5')
  })

  it('applies size classes (lg)', () => {
    const { container } = render(
      <RadioGroup value="">
        <RadioGroupItem value="a" size="lg" />
      </RadioGroup>,
    )
    const item = container.querySelector('[data-slot="radio-group-item"]')!
    expect(item.className).toContain('size-5')
  })

  it('is disabled when group is disabled', () => {
    const { container } = render(
      <RadioGroup value="" disabled>
        <RadioGroupItem value="a" />
      </RadioGroup>,
    )
    expect(container.querySelector('[data-slot="radio-group-item"]')?.hasAttribute('disabled')).toBe(true)
  })
})

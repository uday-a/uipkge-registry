import React from 'react'
import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { TextReveal } from '../TextReveal'

afterEach(cleanup)

describe('TextReveal (React)', () => {
  it('renders container with data-slot="text-reveal"', () => {
    const { container } = render(<TextReveal text="Crafting interfaces" />)
    expect(container.querySelector('[data-slot="text-reveal"]')).toBeTruthy()
  })

  it('renders segmented words with text content', () => {
    const { container } = render(<TextReveal text="Fluid tactile motion" />)
    expect(container.textContent).toContain('Fluid')
    expect(container.textContent).toContain('tactile')
    expect(container.textContent).toContain('motion')
  })
})

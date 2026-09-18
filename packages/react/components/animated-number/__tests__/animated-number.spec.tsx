import React from 'react'
import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { AnimatedNumber } from '../AnimatedNumber'

afterEach(cleanup)

describe('AnimatedNumber (React)', () => {
  it('renders container with data-slot="animated-number"', () => {
    const { container } = render(<AnimatedNumber value={100} />)
    expect(container.querySelector('[data-slot="animated-number"]')).toBeTruthy()
  })

  it('formats displayed value using format prop', () => {
    const { container } = render(<AnimatedNumber value={250} disabled format={(v) => `$${v}.00`} />)
    expect(container.textContent).toBe('$250.00')
  })
})

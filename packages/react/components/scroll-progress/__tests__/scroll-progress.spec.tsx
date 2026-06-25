import React from 'react'
import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { ScrollProgress } from '../ScrollProgress'

afterEach(cleanup)

describe('ScrollProgress (React)', () => {
  it('renders container with data-slot="scroll-progress"', () => {
    const { container } = render(<ScrollProgress />)
    expect(container.querySelector('[data-slot="scroll-progress"]')).toBeTruthy()
  })

  it('applies absolute position attribute and class', () => {
    const { container } = render(<ScrollProgress position="absolute" height={4} />)
    const el = container.querySelector('[data-slot="scroll-progress"]')
    expect(el?.getAttribute('data-position')).toBe('absolute')
    expect(el?.className).toContain('absolute')
  })
})

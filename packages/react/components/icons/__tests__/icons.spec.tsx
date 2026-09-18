import React from 'react'
import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { Icon } from '../icons'

afterEach(cleanup)

describe('Icon (React)', () => {
  it('renders container with data-slot="icon"', () => {
    const { container } = render(
      <Icon>
        <svg data-testid="test-svg" />
      </Icon>,
    )
    expect(container.querySelector('[data-slot="icon"]')).toBeTruthy()
  })

  it('applies size class and passes children', () => {
    const { container } = render(
      <Icon size="xl">
        <svg />
      </Icon>,
    )
    const el = container.querySelector('[data-slot="icon"]')
    expect(el?.className).toContain('size-8')
  })
})

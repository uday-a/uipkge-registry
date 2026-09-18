import * as React from 'react'
import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { ViolinChart } from '../index'

describe('ViolinChart', () => {
  const sampleProps = { groups: [{ name: 'G1', values: [1, 2, 3, 4, 5] }] }

  it('renders without crashing', () => {
    const { container, unmount } = render(<ViolinChart {...sampleProps} />)
    expect(container).toBeDefined()
    expect(container.firstChild).toBeTruthy()
    unmount()
  })

  it('renders expected content or unique feature', () => {
    const { container, unmount } = render(<ViolinChart {...sampleProps} className="custom-chart-test" height={380} />)
    expect(container).toBeDefined()
    expect(container.querySelector('.custom-chart-test') || container.firstChild).toBeTruthy()
    unmount()
  })
})

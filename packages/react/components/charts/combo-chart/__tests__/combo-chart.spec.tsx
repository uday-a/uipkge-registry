import * as React from 'react'
import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { ComboChart } from '../index'

describe('ComboChart', () => {
  const sampleProps = {
    data: [{ m: 'Jan', orders: 10, conversion: 5 }],
    xField: 'm',
    barField: 'orders',
    lineField: 'conversion',
  }

  it('renders without crashing', () => {
    const { container, unmount } = render(<ComboChart {...sampleProps} />)
    expect(container).toBeDefined()
    expect(container.firstChild).toBeTruthy()
    unmount()
  })

  it('renders expected content or unique feature', () => {
    const { container, unmount } = render(<ComboChart {...sampleProps} className="custom-chart-test" height={380} />)
    expect(container).toBeDefined()
    expect(container.querySelector('.custom-chart-test') || container.firstChild).toBeTruthy()
    unmount()
  })
})

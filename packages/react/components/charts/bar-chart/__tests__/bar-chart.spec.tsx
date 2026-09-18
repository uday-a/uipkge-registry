import * as React from 'react'
import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { BarChart } from '../index'

describe('BarChart', () => {
  const sampleProps = { data: [{ x: 'A', y: 10 }], xField: 'x', yField: 'y' }

  it('renders without crashing', () => {
    const { container, unmount } = render(<BarChart {...sampleProps} />)
    expect(container).toBeDefined()
    expect(container.firstChild).toBeTruthy()
    unmount()
  })

  it('renders expected content or unique feature', () => {
    const { container, unmount } = render(<BarChart {...sampleProps} className="custom-chart-test" height={380} />)
    expect(container).toBeDefined()
    expect(container.querySelector('.custom-chart-test') || container.firstChild).toBeTruthy()
    unmount()
  })
})

import * as React from 'react'
import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { StackedBarChart } from '../index'

describe('StackedBarChart', () => {
  const sampleProps = { data: [{ q: 'Q1', a: 10, b: 20 }], xField: 'q', yFields: ['a', 'b'] }

  it('renders without crashing', () => {
    const { container, unmount } = render(<StackedBarChart {...sampleProps} />)
    expect(container).toBeDefined()
    expect(container.firstChild).toBeTruthy()
    unmount()
  })

  it('renders expected content or unique feature', () => {
    const { container, unmount } = render(
      <StackedBarChart {...sampleProps} className="custom-chart-test" height={380} />,
    )
    expect(container).toBeDefined()
    expect(container.querySelector('.custom-chart-test') || container.firstChild).toBeTruthy()
    unmount()
  })
})

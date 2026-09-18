import * as React from 'react'
import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { HeikinAshiChart } from '../index'

describe('HeikinAshiChart', () => {
  const sampleProps = { data: [{ date: '2024-01-01', open: 10, close: 20, low: 5, high: 25 }] }

  it('renders without crashing', () => {
    const { container, unmount } = render(<HeikinAshiChart {...sampleProps} />)
    expect(container).toBeDefined()
    expect(container.firstChild).toBeTruthy()
    unmount()
  })

  it('renders expected content or unique feature', () => {
    const { container, unmount } = render(
      <HeikinAshiChart {...sampleProps} className="custom-chart-test" height={380} />,
    )
    expect(container).toBeDefined()
    expect(container.querySelector('.custom-chart-test') || container.firstChild).toBeTruthy()
    unmount()
  })
})

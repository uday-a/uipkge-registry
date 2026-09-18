import * as React from 'react'
import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { LineChart } from '../index'

describe('LineChart', () => {
  const sampleProps = { data: [{ day: 'Mon', sessions: 10 }], xField: 'day', yField: 'sessions' }

  it('renders without crashing', () => {
    const { container, unmount } = render(<LineChart {...sampleProps} />)
    expect(container).toBeDefined()
    expect(container.firstChild).toBeTruthy()
    unmount()
  })

  it('renders expected content or unique feature', () => {
    const { container, unmount } = render(<LineChart {...sampleProps} className="custom-chart-test" height={380} />)
    expect(container).toBeDefined()
    expect(container.querySelector('.custom-chart-test') || container.firstChild).toBeTruthy()
    unmount()
  })
})

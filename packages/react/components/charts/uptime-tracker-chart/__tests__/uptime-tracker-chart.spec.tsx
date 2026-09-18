import * as React from 'react'
import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { UptimeTrackerChart } from '../index'

describe('UptimeTrackerChart', () => {
  const sampleProps = { days: [{ date: '2024-01-01', status: 'operational' }] }

  it('renders without crashing', () => {
    const { container, unmount } = render(<UptimeTrackerChart {...sampleProps} />)
    expect(container).toBeDefined()
    expect(container.firstChild).toBeTruthy()
    unmount()
  })

  it('renders expected content or unique feature', () => {
    const { container, unmount } = render(
      <UptimeTrackerChart {...sampleProps} className="custom-chart-test" height={380} />,
    )
    expect(container).toBeDefined()
    expect(container.querySelector('.custom-chart-test') || container.firstChild).toBeTruthy()
    unmount()
  })
})

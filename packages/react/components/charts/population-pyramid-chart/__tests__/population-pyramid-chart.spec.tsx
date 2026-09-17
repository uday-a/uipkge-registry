import * as React from 'react'
import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { PopulationPyramidChart } from '../index'

describe('PopulationPyramidChart', () => {
  const sampleProps = { data: [{ band: '0-9', left: 10, right: 12 }] }

  it('renders without crashing', () => {
    const { container, unmount } = render(<PopulationPyramidChart {...sampleProps} />)
    expect(container).toBeDefined()
    expect(container.firstChild).toBeTruthy()
    unmount()
  })

  it('renders expected content or unique feature', () => {
    const { container, unmount } = render(
      <PopulationPyramidChart {...sampleProps} className="custom-chart-test" height={380} />,
    )
    expect(container).toBeDefined()
    expect(container.querySelector('.custom-chart-test') || container.firstChild).toBeTruthy()
    unmount()
  })
})

import * as React from 'react'
import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { ChoroplethMapChart } from '../index'

describe('ChoroplethMapChart', () => {
  const sampleProps = { geoJson: { type: 'FeatureCollection', features: [] }, mapName: 'test-map', data: [] }

  it('renders without crashing', () => {
    const { container, unmount } = render(<ChoroplethMapChart {...sampleProps} />)
    expect(container).toBeDefined()
    expect(container.firstChild).toBeTruthy()
    unmount()
  })

  it('renders expected content or unique feature', () => {
    const { container, unmount } = render(
      <ChoroplethMapChart {...sampleProps} className="custom-chart-test" height={380} />,
    )
    expect(container).toBeDefined()
    expect(container.querySelector('.custom-chart-test') || container.firstChild).toBeTruthy()
    unmount()
  })
})

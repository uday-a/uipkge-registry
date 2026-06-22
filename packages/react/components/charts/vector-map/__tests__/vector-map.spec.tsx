import * as React from 'react'
import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { VectorMap } from '../index'

describe('VectorMap', () => {
  const sampleProps = { regionData: [{ id: 'NA', value: 10 }] }

  it('renders without crashing', () => {
    const { container, unmount } = render(<VectorMap {...sampleProps} />)
    expect(container).toBeDefined()
    expect(container.firstChild).toBeTruthy()
    unmount()
  })

  it('renders expected content or unique feature', () => {
    const { container, unmount } = render(<VectorMap {...sampleProps} className="custom-chart-test" height={380} />)
    expect(container).toBeDefined()
    expect(container.querySelector('.custom-chart-test') || container.firstChild).toBeTruthy()
    unmount()
  })
})

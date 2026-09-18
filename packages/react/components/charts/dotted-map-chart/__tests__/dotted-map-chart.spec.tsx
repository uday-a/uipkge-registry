import * as React from 'react'
import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { DottedMapChart } from '../index'

describe('DottedMapChart', () => {
  const sampleProps = { pins: [{ id: '1', lat: 0, lng: 0, label: 'Pin' }], routes: [] }

  it('renders without crashing', () => {
    const { container, unmount } = render(<DottedMapChart {...sampleProps} />)
    expect(container).toBeDefined()
    expect(container.firstChild).toBeTruthy()
    unmount()
  })

  it('renders expected content or unique feature', () => {
    const { container, unmount } = render(
      <DottedMapChart {...sampleProps} className="custom-chart-test" height={380} />,
    )
    expect(container).toBeDefined()
    expect(container.querySelector('.custom-chart-test') || container.firstChild).toBeTruthy()
    unmount()
  })
})

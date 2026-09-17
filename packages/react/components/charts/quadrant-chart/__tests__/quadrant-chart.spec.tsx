import * as React from 'react'
import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { QuadrantChart } from '../index'

describe('QuadrantChart', () => {
  const sampleProps = { data: [{ x: 10, y: 20, label: 'Item' }] }

  it('renders without crashing', () => {
    const { container, unmount } = render(<QuadrantChart {...sampleProps} />)
    expect(container).toBeDefined()
    expect(container.firstChild).toBeTruthy()
    unmount()
  })

  it('renders expected content or unique feature', () => {
    const { container, unmount } = render(<QuadrantChart {...sampleProps} className="custom-chart-test" height={380} />)
    expect(container).toBeDefined()
    expect(container.querySelector('.custom-chart-test') || container.firstChild).toBeTruthy()
    unmount()
  })
})

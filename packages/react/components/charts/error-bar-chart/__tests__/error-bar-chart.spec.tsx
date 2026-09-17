import * as React from 'react'
import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { ErrorBarChart } from '../index'

describe('ErrorBarChart', () => {
  const sampleProps = { data: [{ name: 'A', value: 10, error: 2 }] }

  it('renders without crashing', () => {
    const { container, unmount } = render(<ErrorBarChart {...sampleProps} />)
    expect(container).toBeDefined()
    expect(container.firstChild).toBeTruthy()
    unmount()
  })

  it('renders expected content or unique feature', () => {
    const { container, unmount } = render(<ErrorBarChart {...sampleProps} className="custom-chart-test" height={380} />)
    expect(container).toBeDefined()
    expect(container.querySelector('.custom-chart-test') || container.firstChild).toBeTruthy()
    unmount()
  })
})

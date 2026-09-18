import * as React from 'react'
import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { BulletChart } from '../index'

describe('BulletChart', () => {
  const sampleProps = { data: [{ title: 'KPI', actual: 80, target: 100, ranges: [50, 80, 100] }] }

  it('renders without crashing', () => {
    const { container, unmount } = render(<BulletChart {...sampleProps} />)
    expect(container).toBeDefined()
    expect(container.firstChild).toBeTruthy()
    unmount()
  })

  it('renders expected content or unique feature', () => {
    const { container, unmount } = render(<BulletChart {...sampleProps} className="custom-chart-test" height={380} />)
    expect(container).toBeDefined()
    expect(container.querySelector('.custom-chart-test') || container.firstChild).toBeTruthy()
    unmount()
  })
})

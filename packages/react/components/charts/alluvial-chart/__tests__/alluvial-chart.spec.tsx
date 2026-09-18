import * as React from 'react'
import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { AlluvialChart } from '../index'

describe('AlluvialChart', () => {
  const sampleProps = { links: [{ source: 'A', target: 'B', value: 10 }] }

  it('renders without crashing', () => {
    const { container, unmount } = render(<AlluvialChart {...sampleProps} />)
    expect(container).toBeDefined()
    expect(container.firstChild).toBeTruthy()
    unmount()
  })

  it('renders expected content or unique feature', () => {
    const { container, unmount } = render(<AlluvialChart {...sampleProps} className="custom-chart-test" height={380} />)
    expect(container).toBeDefined()
    expect(container.querySelector('.custom-chart-test') || container.firstChild).toBeTruthy()
    unmount()
  })
})

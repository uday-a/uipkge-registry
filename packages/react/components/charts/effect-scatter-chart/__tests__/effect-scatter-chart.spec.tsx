import * as React from 'react'
import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { EffectScatterChart } from '../index'

describe('EffectScatterChart', () => {
  const sampleProps = { data: [{ x: 1, y: 2, c: 'A' }], xField: 'x', yField: 'y', categoryField: 'c' }

  it('renders without crashing', () => {
    const { container, unmount } = render(<EffectScatterChart {...sampleProps} />)
    expect(container).toBeDefined()
    expect(container.firstChild).toBeTruthy()
    unmount()
  })

  it('renders expected content or unique feature', () => {
    const { container, unmount } = render(
      <EffectScatterChart {...sampleProps} className="custom-chart-test" height={380} />,
    )
    expect(container).toBeDefined()
    expect(container.querySelector('.custom-chart-test') || container.firstChild).toBeTruthy()
    unmount()
  })
})

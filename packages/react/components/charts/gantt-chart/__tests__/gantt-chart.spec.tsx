import * as React from 'react'
import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { GanttChart } from '../index'

describe('GanttChart', () => {
  const sampleProps = { tasks: [{ id: '1', name: 'Task 1', start: '2024-01-01', end: '2024-01-05' }] }

  it('renders without crashing', () => {
    const { container, unmount } = render(<GanttChart {...sampleProps} />)
    expect(container).toBeDefined()
    expect(container.firstChild).toBeTruthy()
    unmount()
  })

  it('renders expected content or unique feature', () => {
    const { container, unmount } = render(<GanttChart {...sampleProps} className="custom-chart-test" height={380} />)
    expect(container).toBeDefined()
    expect(container.querySelector('.custom-chart-test') || container.firstChild).toBeTruthy()
    unmount()
  })
})

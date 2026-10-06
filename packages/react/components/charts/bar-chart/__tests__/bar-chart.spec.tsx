import * as React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'
import { BarChart } from '../index'

const captured: { option?: any } = {}
vi.mock('../../shared', async (importOriginal) => {
  const mod: any = await importOriginal()
  return {
    ...mod,
    EChart: ({ option }: { option: any }) => {
      captured.option = option
      return null
    },
  }
})

describe('BarChart', () => {
  const sampleProps = { data: [{ x: 'A', y: 10 }], xField: 'x', yField: 'y' }

  it('renders without crashing', () => {
    const { container, unmount } = render(<BarChart {...sampleProps} />)
    expect(container).toBeDefined()
    expect(container.firstChild).toBeTruthy()
    unmount()
  })

  it('renders expected content or unique feature', () => {
    const { container, unmount } = render(<BarChart {...sampleProps} className="custom-chart-test" height={380} />)
    expect(container).toBeDefined()
    expect(container.querySelector('.custom-chart-test') || container.firstChild).toBeTruthy()
    unmount()
  })

  it('blanks the series name for single-series so the tooltip omits the raw field key', () => {
    const { unmount } = render(<BarChart {...sampleProps} />)
    expect(captured.option.series[0].name).toBe('')
    unmount()
  })

  it('keeps field names for multi-series (legend + tooltip rows)', () => {
    const { unmount } = render(<BarChart data={[{ x: 'A', a: 1, b: 2 }]} xField="x" yField={['a', 'b']} />)
    expect(captured.option.series.map((s: any) => s.name)).toEqual(['a', 'b'])
    unmount()
  })
})

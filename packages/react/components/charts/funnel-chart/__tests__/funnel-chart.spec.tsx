import * as React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, renderHook } from '@testing-library/react'
import { FunnelChart } from '../index'
import { useChartTheme } from '../../useChartTheme'

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

describe('FunnelChart', () => {
  const sampleProps = { data: [{ name: 'A', value: 10 }] }

  it('renders without crashing', () => {
    const { container, unmount } = render(<FunnelChart {...sampleProps} />)
    expect(container).toBeDefined()
    expect(container.firstChild).toBeTruthy()
    unmount()
  })

  it('renders expected content or unique feature', () => {
    const { container, unmount } = render(<FunnelChart {...sampleProps} className="custom-chart-test" height={380} />)
    expect(container).toBeDefined()
    expect(container.querySelector('.custom-chart-test') || container.firstChild).toBeTruthy()
    unmount()
  })

  it('softens corners with a round-join stroke matching each stage fill', () => {
    const { unmount } = render(
      <FunnelChart data={[{ name: 'A', value: 10 }, { name: 'B', value: 5, itemStyle: { color: '#123456' } } as any]} />,
    )
    const s = captured.option.series[0]
    expect(s.itemStyle.borderJoin).toBe('round')
    expect(s.data[0].itemStyle.borderColor).toBe(captured.option.color[0])
    expect(s.data[1].itemStyle).toEqual({ color: '#123456', borderColor: '#123456' })
    unmount()
  })

  it('labels each stage with its name and value · share of the top stage in card ink', () => {
    const { unmount } = render(
      <FunnelChart data={[{ name: 'Visitors', value: 24850 }, { name: 'Signups', value: 1789 }]} />,
    )
    const label = captured.option.series[0].label
    expect(label.color).toBe(renderHook(() => useChartTheme()).result.current.bgColor)
    expect(label.formatter({ name: 'Visitors', value: 24850 })).toBe(
      `{t|Visitors}\n{v|${(24850).toLocaleString()} · 100%}`,
    )
    expect(label.formatter({ name: 'Signups', value: 1789 })).toContain('· 7.2%')
    unmount()
  })
})

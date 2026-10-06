import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiBarRaceChartComponent } from './bar-race-chart.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './bar-race-chart.component.ts'), 'utf8')

describe('BarRaceChart (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror Vue (topN=8 autoPlay interval=1400 height=380)', () => {
    const c = new UiBarRaceChartComponent()
    expect(c.topN).toBe(8)
    expect(c.autoPlay).toBe(true)
    expect(c.interval).toBe(1400)
    expect(c.height).toBe(380)
  })
  it('3: host class contains base w-full', () => {
    expect(new UiBarRaceChartComponent().hostClass).toContain('w-full')
  })
  it('4: first frame sorts ascending for horizontal race layout', () => {
    const c = new UiBarRaceChartComponent()
    c.frames = [
      {
        label: '2024',
        values: [
          { category: 'A', value: 30 },
          { category: 'B', value: 50 },
          { category: 'C', value: 10 },
        ],
      },
    ]
    const opt = c.getOption() as any
    expect(opt.yAxis.data).toEqual(['C', 'A', 'B'])
    expect(opt.series[0].data).toEqual([10, 30, 50])
    expect(opt.yAxis.inverse).toBe(true)
    expect(opt.animationDurationUpdate).toBe(900)
    expect(opt.graphic.elements[0].style.text).toBe('2024')
    expect(c.accessibleLabel).toBe('Bar race chart, frame 2024')
  })
  it('5: key series type is bar', () => {
    const c = new UiBarRaceChartComponent()
    c.frames = [
      {
        label: '2024',
        values: [
          { category: 'A', value: 30 },
          { category: 'B', value: 50 },
          { category: 'C', value: 10 },
        ],
      },
    ]
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('bar')
  })
  it('6: topN slices to the leaders', () => {
    const c = new UiBarRaceChartComponent()
    c.frames = [
      {
        label: 'f',
        values: [
          { category: 'A', value: 1 },
          { category: 'B', value: 2 },
          { category: 'C', value: 3 },
        ],
      },
    ]
    c.topN = 2
    const opt = c.getOption() as any
    expect(opt.yAxis.data).toEqual(['B', 'C'])
  })
  it('7: x max pads the leader value by 1.25x (React/Vue parity)', () => {
    const c = new UiBarRaceChartComponent()
    c.frames = [{ label: 'f', values: [{ category: 'A', value: 42 }] }]
    const opt = c.getOption() as any
    expect(opt.xAxis.max).toBe(42 * 1.25)
  })
  it('8: user option merges without dropping computed series', () => {
    const c = new UiBarRaceChartComponent()
    c.frames = [
      {
        label: '2024',
        values: [
          { category: 'A', value: 30 },
          { category: 'B', value: 50 },
          { category: 'C', value: 10 },
        ],
      },
    ]
    c.option = { series: [{ name: 'override' }], title: { text: 'Hi' } } as any
    const opt = c.getOption() as any
    expect(opt.title).toEqual({ text: 'Hi' })
    const types = (Array.isArray(opt.series) ? opt.series : [opt.series]).map((x: any) => x?.type)
    expect(types).toContain('bar')
  })
  it('9: type-only echarts import + lazy init + data-slot contract', () => {
    const runtimeEcharts = componentSrc
      .split('\n')
      .filter((l) => l.includes("from 'echarts") && !l.trim().startsWith('import type'))
    expect(runtimeEcharts).toEqual([])
    expect(componentSrc).toContain('import(')
    expect(componentSrc).toContain('echarts')
    expect(componentSrc).toContain('data-slot')
    expect(componentSrc).toContain('"bar-race-chart"')
  })
  it('10: custom class merges + empty-data edge case', () => {
    const c = new UiBarRaceChartComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
    const e = new UiBarRaceChartComponent()
    expect(() => e.getOption()).not.toThrow()
    expect((e.getOption() as any).series[0].data).toEqual([])
  })
})

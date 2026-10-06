import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiPictorialBarChartComponent } from './pictorial-bar-chart.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './pictorial-bar-chart.component.ts'), 'utf8')

describe('PictorialBarChart (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror Vue (symbol=rect height=300)', () => {
    const c = new UiPictorialBarChartComponent()
    expect(c.symbol).toBe('rect')
    expect(c.height).toBe(300)
  })
  it('3: host class contains base w-full', () => {
    expect(new UiPictorialBarChartComponent().hostClass).toContain('w-full')
  })
  it('4: values wire to repeated symbols', () => {
    const c = new UiPictorialBarChartComponent()
    c.data = [
      { category: 'A', value: 4 },
      { category: 'B', value: 7 },
    ]
    const opt = c.getOption() as any
    expect(opt.series[0].data).toEqual([
      { value: 4, symbolBoundingData: 7 },
      { value: 7, symbolBoundingData: 7 },
    ])
    expect(opt.xAxis.data).toEqual(['A', 'B'])
    expect(opt.yAxis.max).toBe(7)
    expect(opt.series[0].symbolClip).toBe(true)
    expect(opt.series[0].symbolSize).toEqual([12, 8])
  })
  it('5: key series type is pictorialBar', () => {
    const c = new UiPictorialBarChartComponent()
    c.data = [
      { category: 'A', value: 4 },
      { category: 'B', value: 7 },
    ]
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('pictorialBar')
  })
  it('6: symbols repeat to the value', () => {
    const c = new UiPictorialBarChartComponent()
    c.data = [{ category: 'A', value: 1 }]
    const opt = c.getOption() as any
    expect(opt.series[0].symbolRepeat).toBe(true)
    expect(opt.series[0].symbol).toBe('rect')
  })
  it('7: symbol shape is configurable', () => {
    const c = new UiPictorialBarChartComponent()
    c.data = [{ category: 'A', value: 1 }]
    c.symbol = 'circle'
    expect((c.getOption() as any).series[0].symbol).toBe('circle')
  })
  it('8: user option merges without dropping computed series', () => {
    const c = new UiPictorialBarChartComponent()
    c.data = [
      { category: 'A', value: 4 },
      { category: 'B', value: 7 },
    ]
    c.option = { series: [{ name: 'override' }], title: { text: 'Hi' } } as any
    const opt = c.getOption() as any
    expect(opt.title).toEqual({ text: 'Hi' })
    const types = (Array.isArray(opt.series) ? opt.series : [opt.series]).map((x: any) => x?.type)
    expect(types).toContain('pictorialBar')
  })
  it('9: type-only echarts import + lazy init + data-slot contract', () => {
    const runtimeEcharts = componentSrc
      .split('\n')
      .filter((l) => l.includes("from 'echarts") && !l.trim().startsWith('import type'))
    expect(runtimeEcharts).toEqual([])
    expect(componentSrc).toContain('import(')
    expect(componentSrc).toContain('echarts')
    expect(componentSrc).toContain('data-slot')
    expect(componentSrc).toContain('"pictorial-bar-chart"')
  })
  it('10: custom class merges + empty-data edge case', () => {
    const c = new UiPictorialBarChartComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
    const e = new UiPictorialBarChartComponent()
    expect(() => e.getOption()).not.toThrow()
    expect((e.getOption() as any).series[0].data).toEqual([])
  })
})

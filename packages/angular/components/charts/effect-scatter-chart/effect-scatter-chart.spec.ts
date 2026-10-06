import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiEffectScatterChartComponent } from './effect-scatter-chart.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './effect-scatter-chart.component.ts'), 'utf8')

describe('EffectScatterChart (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror Vue (ripplePeriod=4 height=300)', () => {
    const c = new UiEffectScatterChartComponent()
    expect(c.ripplePeriod).toBe(4)
    expect(c.height).toBe(300)
  })
  it('3: host class contains base w-full', () => {
    expect(new UiEffectScatterChartComponent().hostClass).toContain('w-full')
  })
  it('4: points wire to [x, y] pairs', () => {
    const c = new UiEffectScatterChartComponent()
    c.data = [
      { x: 1, y: 2 },
      { x: 3, y: 4 },
    ]
    const opt = c.getOption() as any
    expect(opt.series[0].data).toEqual([
      [1, 2],
      [3, 4],
    ])
  })
  it('5: key series type is effectScatter', () => {
    const c = new UiEffectScatterChartComponent()
    c.data = [
      { x: 1, y: 2 },
      { x: 3, y: 4 },
    ]
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('effectScatter')
  })
  it('6: ripple period is configurable', () => {
    const c = new UiEffectScatterChartComponent()
    c.data = [{ x: 1, y: 1 }]
    c.ripplePeriod = 2
    const opt = c.getOption() as any
    expect(opt.series[0].rippleEffect.period).toBe(2)
    expect(opt.series[0].showEffectOn).toBe('render')
  })
  it('7: categoryField splits ripple series; legend only for 2+ categories; value axes scale', () => {
    const c = new UiEffectScatterChartComponent()
    c.data = [
      { x: 1, y: 1, k: 'a' },
      { x: 2, y: 2, k: 'b' },
    ]
    c.categoryField = 'k'
    const opt = c.getOption() as any
    expect(opt.series).toHaveLength(2)
    expect(opt.legend.bottom).toBe(0)
    expect(opt.grid.bottom).toBe(32)
    expect(opt.xAxis.scale).toBe(true)
    expect(opt.yAxis.scale).toBe(true)
    const single = new UiEffectScatterChartComponent()
    single.data = [{ x: 1, y: 1 }]
    const singleOpt = single.getOption() as any
    expect(singleOpt.legend).toBeUndefined()
    expect(singleOpt.grid.bottom).toBe(24)
  })
  it('8: user option merges without dropping computed series', () => {
    const c = new UiEffectScatterChartComponent()
    c.data = [
      { x: 1, y: 2 },
      { x: 3, y: 4 },
    ]
    c.option = { series: [{ name: 'override' }], title: { text: 'Hi' } } as any
    const opt = c.getOption() as any
    expect(opt.title).toEqual({ text: 'Hi' })
    const types = (Array.isArray(opt.series) ? opt.series : [opt.series]).map((x: any) => x?.type)
    expect(types).toContain('effectScatter')
  })
  it('9: type-only echarts import + lazy init + data-slot contract', () => {
    const runtimeEcharts = componentSrc
      .split('\n')
      .filter((l) => l.includes("from 'echarts") && !l.trim().startsWith('import type'))
    expect(runtimeEcharts).toEqual([])
    expect(componentSrc).toContain('import(')
    expect(componentSrc).toContain('echarts')
    expect(componentSrc).toContain('data-slot')
    expect(componentSrc).toContain('"effect-scatter-chart"')
  })
  it('10: custom class merges + empty-data edge case', () => {
    const c = new UiEffectScatterChartComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
    const e = new UiEffectScatterChartComponent()
    expect(() => e.getOption()).not.toThrow()
    expect((e.getOption() as any).series[0].data).toEqual([])
  })
})

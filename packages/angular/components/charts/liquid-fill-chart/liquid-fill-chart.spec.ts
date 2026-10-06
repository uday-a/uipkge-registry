import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiLiquidFillChartComponent } from './liquid-fill-chart.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './liquid-fill-chart.component.ts'), 'utf8')

describe('LiquidFillChart (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror Vue (value=0 height=220 color/showLabel/unit)', () => {
    const c = new UiLiquidFillChartComponent()
    expect(c.value).toBe(0)
    expect(c.height).toBe(220)
    expect(c.color).toBe('var(--chart-1)')
    expect(c.showLabel).toBe(true)
    expect(c.unit).toBe('%')
  })
  it('3: host class contains base w-full', () => {
    expect(new UiLiquidFillChartComponent().hostClass).toContain('w-full')
  })
  it('4: fill level wires to gauge progress', () => {
    const c = new UiLiquidFillChartComponent()
    c.value = 75
    const opt = c.getOption() as any
    expect(opt.series[0].data).toEqual([{ value: 0.75 }])
    expect(opt.series[0].detail.formatter(0.75)).toBe('75%')
  })
  it('5: key series type is gauge', () => {
    const c = new UiLiquidFillChartComponent()
    c.value = 75
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('gauge')
  })
  it('6: levels clamp to 0..100', () => {
    const c = new UiLiquidFillChartComponent()
    c.value = 900
    expect(c.pct).toBe(100)
    expect((c.getOption() as any).series[0].data).toEqual([{ value: 1 }])
    c.value = -20
    expect(c.pct).toBe(0)
    expect((c.getOption() as any).series[0].data).toEqual([{ value: 0 }])
  })
  it('7: dial is a full 360 ring without a needle', () => {
    const c = new UiLiquidFillChartComponent()
    const opt = c.getOption() as any
    expect(opt.series[0].pointer.show).toBe(false)
    expect(opt.series[0].progress.show).toBe(true)
  })
  it('8: user option merges without dropping computed series', () => {
    const c = new UiLiquidFillChartComponent()
    c.value = 75
    c.option = { series: [{ name: 'override' }], title: { text: 'Hi' } } as any
    const opt = c.getOption() as any
    expect(opt.title).toEqual({ text: 'Hi' })
    const types = (Array.isArray(opt.series) ? opt.series : [opt.series]).map((x: any) => x?.type)
    expect(types).toContain('gauge')
  })
  it('9: type-only echarts import + lazy init + data-slot contract', () => {
    const runtimeEcharts = componentSrc
      .split('\n')
      .filter((l) => l.includes("from 'echarts") && !l.trim().startsWith('import type'))
    expect(runtimeEcharts).toEqual([])
    expect(componentSrc).toContain('import(')
    expect(componentSrc).toContain('echarts')
    expect(componentSrc).toContain('data-slot')
    expect(componentSrc).toContain('"liquid-fill-chart"')
  })
  it('10: custom class merges + empty-data edge case', () => {
    const c = new UiLiquidFillChartComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
    const e = new UiLiquidFillChartComponent()
    expect(() => e.getOption()).not.toThrow()
    expect((e.getOption() as any).series[0].data).toEqual([{ value: 0 }])
  })
  it('11: color/showLabel/unit wire through + aria-label names the level', () => {
    const c = new UiLiquidFillChartComponent()
    c.value = 68
    c.color = '#3b82f6'
    c.showLabel = false
    c.unit = 'pts'
    const opt = c.getOption() as any
    expect(opt.series[0].progress.itemStyle.color).toBe('#3b82f6')
    expect(opt.series[0].detail.show).toBe(false)
    expect(opt.series[0].detail.formatter(0.68)).toBe('68pts')
    expect(c.resolvedAriaLabel).toBe('Liquid fill chart at 68pts')
    c.ariaLabel = 'Custom'
    expect(c.resolvedAriaLabel).toBe('Custom')
  })
})

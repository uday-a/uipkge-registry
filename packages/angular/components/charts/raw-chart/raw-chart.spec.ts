import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiRawChartComponent } from './raw-chart.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './raw-chart.component.ts'), 'utf8')

describe('RawChart (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror Vue (empty passthrough height=300)', () => {
    const c = new UiRawChartComponent()
    expect(c.height).toBe(300)
    expect(c.rawOption).toEqual({})
  })
  it('3: host class contains base w-full', () => {
    expect(new UiRawChartComponent().hostClass).toContain('w-full')
  })
  it('4: raw option passes straight through', () => {
    const c = new UiRawChartComponent()
    c.rawOption = { series: [{ type: 'sunburst', data: [{ name: 'A', value: 1 }] }] }
    const opt = c.getOption() as any
    expect(opt.series[0].data).toEqual([{ name: 'A', value: 1 }])
  })
  it('5: key series type passes through untouched', () => {
    const c = new UiRawChartComponent()
    c.rawOption = { series: [{ type: 'sunburst', data: [{ name: 'A', value: 1 }] }] }
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('sunburst')
  })
  it('6: option input merges over rawOption', () => {
    const c = new UiRawChartComponent()
    c.rawOption = { title: { text: 'raw' } }
    c.option = { title: { text: 'override' } } as any
    expect((c.getOption() as any).title).toEqual({ text: 'override' })
  })
  it('7: palette seeds a default color ramp', () => {
    const c = new UiRawChartComponent()
    expect(((c.getOption() as any).color as unknown[]).length).toBeGreaterThan(0)
  })
  it('8: user option merges without dropping computed series', () => {
    const c = new UiRawChartComponent()
    c.option = { series: [{ type: 'sunburst', data: [] }], title: { text: 'Hi' } } as any
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('sunburst')
    expect(opt.title).toEqual({ text: 'Hi' })
  })
  it('9: type-only echarts import + lazy init + data-slot contract', () => {
    const runtimeEcharts = componentSrc
      .split('\n')
      .filter((l) => l.includes("from 'echarts") && !l.trim().startsWith('import type'))
    expect(runtimeEcharts).toEqual([])
    expect(componentSrc).toContain('import(')
    expect(componentSrc).toContain('echarts')
    expect(componentSrc).toContain('data-slot')
    expect(componentSrc).toContain('"raw-chart"')
  })
  it('10: custom class merges + empty-data edge case', () => {
    const c = new UiRawChartComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
    const e = new UiRawChartComponent()
    expect(() => e.getOption()).not.toThrow()
    expect((e.getOption() as any).color).toBeTruthy()
  })
})

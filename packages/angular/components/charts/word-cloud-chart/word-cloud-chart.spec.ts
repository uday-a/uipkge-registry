import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiWordCloudChartComponent } from './word-cloud-chart.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './word-cloud-chart.component.ts'), 'utf8')

describe('WordCloudChart (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror Vue (height=280)', () => {
    const c = new UiWordCloudChartComponent()
    expect(c.height).toBe(280)
    expect(c.data).toEqual([])
    expect(c.colors).toBeUndefined()
  })
  it('3: host class contains base w-full', () => {
    expect(new UiWordCloudChartComponent().hostClass).toContain('w-full')
  })
  it('4: words wire to labelled points', () => {
    const c = new UiWordCloudChartComponent()
    c.data = [
      { name: 'alpha', value: 100 },
      { name: 'beta', value: 25 },
    ]
    const opt = c.getOption() as any
    expect(opt.series[0].data.map((d: any) => d.name)).toEqual(['alpha', 'beta'])
    expect(opt.series[0].data[0].label.fontSize).toBeGreaterThan(opt.series[0].data[1].label.fontSize)
  })
  it('5: key series type is scatter', () => {
    const c = new UiWordCloudChartComponent()
    c.data = [
      { name: 'alpha', value: 100 },
      { name: 'beta', value: 25 },
    ]
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('scatter')
  })
  it('6: fonts scale linearly 14..44 like React', () => {
    const c = new UiWordCloudChartComponent()
    expect(c.fontFor(100, 0, 100)).toBe(44)
    expect(c.fontFor(0, 0, 100)).toBe(14)
    expect(c.fontFor(50, 0, 100)).toBe(29)
    expect(c.weightFor(100, 0, 100)).toEqual({ weight: 700, opacity: 1 })
    expect(c.weightFor(0, 0, 100).weight).toBe(500)
  })
  it('7: words cycle the palette', () => {
    const c = new UiWordCloudChartComponent()
    c.data = [
      { name: 'a', value: 1 },
      { name: 'b', value: 1 },
    ]
    const opt = c.getOption() as any
    expect(opt.series[0].data[0].label.color).not.toBe(opt.series[0].data[1].label.color)
  })
  it('8: user option merges without dropping computed series', () => {
    const c = new UiWordCloudChartComponent()
    c.data = [
      { name: 'alpha', value: 100 },
      { name: 'beta', value: 25 },
    ]
    c.option = { series: [{ name: 'override' }], title: { name: 'Hi' } } as any
    const opt = c.getOption() as any
    expect(opt.title).toEqual({ name: 'Hi' })
    const types = (Array.isArray(opt.series) ? opt.series : [opt.series]).map((x: any) => x?.type)
    expect(types).toContain('scatter')
  })
  it('9: type-only echarts import + lazy init + data-slot contract', () => {
    const runtimeEcharts = componentSrc
      .split('\n')
      .filter((l) => l.includes("from 'echarts") && !l.trim().startsWith('import type'))
    expect(runtimeEcharts).toEqual([])
    expect(componentSrc).toContain('import(')
    expect(componentSrc).toContain('echarts')
    expect(componentSrc).toContain('data-slot')
    expect(componentSrc).toContain('"word-cloud-chart"')
  })
  it('10b: colors override re-palettes labels + words sort desc', () => {
    const c = new UiWordCloudChartComponent()
    c.colors = ['#111111', '#222222']
    c.data = [
      { name: 'small', value: 10 },
      { name: 'big', value: 90 },
    ]
    expect(c.ordered().map((w) => w.name)).toEqual(['big', 'small'])
    const opt = c.getOption() as any
    expect(opt.series[0].data[0].label.color).toBe('#111111')
    expect(opt.series[0].data[1].label.color).toBe('#222222')
  })
  it('10: custom class merges + empty-data edge case', () => {
    const c = new UiWordCloudChartComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
    const e = new UiWordCloudChartComponent()
    expect(() => e.getOption()).not.toThrow()
    expect((e.getOption() as any).series[0].data).toEqual([])
  })
})

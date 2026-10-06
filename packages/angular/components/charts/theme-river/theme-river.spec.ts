import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiThemeRiverComponent } from './theme-river.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './theme-river.component.ts'), 'utf8')

describe('ThemeRiver (angular parity, 14 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror Vue (height=320)', () => {
    const c = new UiThemeRiverComponent()
    expect(c.height).toBe(320)
    expect(c.data).toEqual([])
  })
  it('3: host class contains base w-full', () => {
    expect(new UiThemeRiverComponent().hostClass).toContain('w-full')
  })
  it('4: event tuples wire through, legend lists layers', () => {
    const c = new UiThemeRiverComponent()
    c.data = [
      ['2024-01-01', 5, 'alpha'],
      ['2024-01-02', 7, 'alpha'],
    ]
    const opt = c.getOption() as any
    expect(opt.series[0].data).toHaveLength(2)
    expect(opt.legend.data).toEqual(['alpha'])
  })
  it('5: key series type is themeRiver', () => {
    const c = new UiThemeRiverComponent()
    c.data = [
      ['2024-01-01', 5, 'alpha'],
      ['2024-01-02', 7, 'alpha'],
    ]
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('themeRiver')
  })
  it('6: axis is temporal', () => {
    const c = new UiThemeRiverComponent()
    const opt = c.getOption() as any
    expect(opt.singleAxis.type).toBe('time')
  })
  it('7: multiple layers all surface in the legend', () => {
    const c = new UiThemeRiverComponent()
    c.data = [
      ['t', 1, 'a'],
      ['t', 2, 'b'],
    ]
    const opt = c.getOption() as any
    expect(opt.legend.data).toEqual(['a', 'b'])
  })
  it('8: user option merges without dropping computed series', () => {
    const c = new UiThemeRiverComponent()
    c.data = [
      ['2024-01-01', 5, 'alpha'],
      ['2024-01-02', 7, 'alpha'],
    ]
    c.option = { series: [{ name: 'override' }], title: { text: 'Hi' } } as any
    const opt = c.getOption() as any
    expect(opt.title).toEqual({ text: 'Hi' })
    const types = (Array.isArray(opt.series) ? opt.series : [opt.series]).map((x: any) => x?.type)
    expect(types).toContain('themeRiver')
  })
  it('9: type-only echarts import + lazy init + data-slot contract', () => {
    const runtimeEcharts = componentSrc
      .split('\n')
      .filter((l) => l.includes("from 'echarts") && !l.trim().startsWith('import type'))
    expect(runtimeEcharts).toEqual([])
    expect(componentSrc).toContain('import(')
    expect(componentSrc).toContain('echarts')
    expect(componentSrc).toContain('data-slot')
    expect(componentSrc).toContain('"theme-river"')
  })
  it('10: custom class merges + empty-data edge case', () => {
    const c = new UiThemeRiverComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
    const e = new UiThemeRiverComponent()
    expect(() => e.getOption()).not.toThrow()
    expect((e.getOption() as any).series[0].data).toEqual([])
  })
  it('11: series hides labels and lifts on emphasis like React/Vue', () => {
    const c = new UiThemeRiverComponent()
    const opt = c.getOption() as any
    expect(opt.series[0].label).toEqual({ show: false })
    expect(opt.series[0].emphasis.itemStyle.shadowBlur).toBe(12)
  })
  it('12: tooltip axis pointer + axis line use the axis color, tooltip text uses the tooltip color', () => {
    const c = new UiThemeRiverComponent()
    const opt = c.getOption() as any
    expect(opt.tooltip.axisPointer.type).toBe('line')
    expect(opt.tooltip.axisPointer.lineStyle.opacity).toBe(0.8)
    expect(opt.tooltip.axisPointer.lineStyle.color).toBe(opt.singleAxis.axisLine.lineStyle.color)
    expect(opt.singleAxis.top).toBe(12)
    expect(opt.singleAxis.bottom).toBe(40)
    expect(opt.singleAxis.axisTick).toEqual({ show: false })
  })
  it('13: legend show:false suppresses the legend like React/Vue', () => {
    const c = new UiThemeRiverComponent()
    c.option = { legend: { show: false } } as any
    expect((c.getOption() as any).legend).toBeUndefined()
  })
  it('14: bare frame like React focusable={false}: no tab stop, no focus ring', () => {
    expect(new UiThemeRiverComponent().hostClass).not.toContain('focus-visible')
    expect(componentSrc).not.toContain("'[attr.tabindex]'")
  })
})

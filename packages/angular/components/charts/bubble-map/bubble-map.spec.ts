import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiBubbleMapComponent } from './bubble-map.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './bubble-map.component.ts'), 'utf8')

describe('BubbleMap (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror Vue (min/max radius height=420)', () => {
    const c = new UiBubbleMapComponent()
    expect(c.minRadius).toBe(10)
    expect(c.maxRadius).toBe(42)
    expect(c.height).toBe(420)
  })
  it('3: host class contains base w-full', () => {
    expect(new UiBubbleMapComponent().hostClass).toContain('w-full')
  })
  it('4: bubbles wire to lng/lat/value tuples', () => {
    const c = new UiBubbleMapComponent()
    c.bubbles = [
      { id: 'a', name: 'A', lat: 10, lng: 20, value: 100 },
      { id: 'b', name: 'B', lat: -5, lng: 30, value: 25 },
    ]
    const opt = c.getOption() as any
    expect(opt.series[0].data[0].value).toEqual([20, 10, 100])
    expect(opt.series[0].data).toHaveLength(2)
  })
  it('5: key series type is scatter', () => {
    const c = new UiBubbleMapComponent()
    c.bubbles = [
      { id: 'a', name: 'A', lat: 10, lng: 20, value: 100 },
      { id: 'b', name: 'B', lat: -5, lng: 30, value: 25 },
    ]
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('scatter')
  })
  it('6: square-root area normalization (4x value = 2x radius span)', () => {
    const c = new UiBubbleMapComponent()
    const span = c.maxRadius - c.minRadius
    expect(c.radiusFor(100, 100) - c.minRadius).toBeCloseTo(span, 8)
    expect(c.radiusFor(25, 100) - c.minRadius).toBeCloseTo(span / 2, 8)
  })
  it('7: custom bubble color wins; status maps like React/Vue', () => {
    const c = new UiBubbleMapComponent()
    c.bubbles = [{ id: 'a', name: 'A', lat: 0, lng: 0, value: 1, color: '#ff0000' }]
    const opt = c.getOption() as any
    expect(opt.series[0].data[0].itemStyle.color).toBe('#ff0000')
    const s = new UiBubbleMapComponent()
    s.bubbles = [
      { id: 'b', name: 'B', lat: 0, lng: 0, value: 1, status: 'destructive' },
      { id: 'c', name: 'C', lat: 0, lng: 0, value: 1 },
    ]
    const sopt = s.getOption() as any
    expect(sopt.series[0].data[0].itemStyle.color).toBe('oklch(0.60 0.22 25)')
    expect(sopt.series[0].data[1].itemStyle.color).toBe('oklch(0.60 0.20 250)')
  })
  it('8: user option merges without dropping computed series', () => {
    const c = new UiBubbleMapComponent()
    c.bubbles = [
      { id: 'a', name: 'A', lat: 10, lng: 20, value: 100 },
      { id: 'b', name: 'B', lat: -5, lng: 30, value: 25 },
    ]
    c.option = { series: [{ name: 'override' }], title: { text: 'Hi' } } as any
    const opt = c.getOption() as any
    expect(opt.title).toEqual({ text: 'Hi' })
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
    expect(componentSrc).toContain('"bubble-map"')
  })
  it('10: custom class merges + empty-data edge case', () => {
    const c = new UiBubbleMapComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
    const e = new UiBubbleMapComponent()
    expect(() => e.getOption()).not.toThrow()
    expect((e.getOption() as any).series[0].data).toEqual([])
  })
})

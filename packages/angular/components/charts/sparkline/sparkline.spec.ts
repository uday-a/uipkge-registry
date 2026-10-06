import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiSparklineComponent } from './sparkline.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './sparkline.component.ts'), 'utf8')

describe('Sparkline (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults are data=[] height=40', () => {
    const c = new UiSparklineComponent()
    expect(c.data).toEqual([])
    expect(c.height).toBe(40)
  })
  it('3: host class contains base w-full', () => {
    expect(new UiSparklineComponent().hostClass).toContain('w-full')
  })
  it('4: numeric height becomes px, string height passes through', () => {
    const c = new UiSparklineComponent()
    expect(c.heightStyle).toBe('40px')
    c.height = '100%'
    expect(c.heightStyle).toBe('100%')
  })
  it('5: option builds a smooth line series from data', () => {
    const c = new UiSparklineComponent()
    c.data = [1, 2, 3]
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('line')
    expect(opt.series[0].smooth).toBe(true)
    expect(opt.series[0].data.map((d: any) => d.value)).toEqual([1, 2, 3])
  })
  it('6: only the last point carries a dot symbol', () => {
    const c = new UiSparklineComponent()
    c.data = [1, 2, 3]
    const pts = (c.getOption() as any).series[0].data
    expect(pts[0].symbol).toBe('none')
    expect(pts[2].symbol).toBe('circle')
  })
  it('7: default color resolves to the theme palette', () => {
    const c = new UiSparklineComponent()
    expect(c.resolveColor()).toBe('#14b8a6')
  })
  it('8: explicit color wins over the theme palette', () => {
    const c = new UiSparklineComponent()
    c.color = '#ff0000'
    expect(c.resolveColor()).toBe('#ff0000')
  })
  it('9: user option merges per-series (bar escape hatch)', () => {
    const c = new UiSparklineComponent()
    c.data = [1, -2, 3]
    c.option = { series: [{ type: 'bar' }] }
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('bar')
    expect(opt.series[0].smooth).toBe(true)
  })
  it('10: data-slot sparkline contract + echarts retained + custom class', () => {
    expect(componentSrc).toContain('data-slot')
    expect(componentSrc).toContain('"sparkline"')
    expect(componentSrc).toContain('echarts')
    const c = new UiSparklineComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
  })
})

import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiRouteFlowMapComponent } from './route-flow-map.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './route-flow-map.component.ts'), 'utf8')

describe('RouteFlowMap (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror React/Vue (height=480, empty hubs/routes, no selection)', () => {
    const c = new UiRouteFlowMapComponent()
    expect(c.height).toBe(480)
    expect(c.hubs).toEqual([])
    expect(c.routes).toEqual([])
    expect(c.selectedRoute).toBeUndefined()
    expect(c.activeRouteId).toBe('')
  })
  it('3: host class contains base w-full + custom class merges', () => {
    expect(new UiRouteFlowMapComponent().hostClass).toContain('w-full')
    const c = new UiRouteFlowMapComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
  })
  it('4: routes resolve hub ids to curved arcs', () => {
    const c = new UiRouteFlowMapComponent()
    c.hubs = [
      { id: 'a', name: 'A', lat: 0, lng: 0 },
      { id: 'b', name: 'B', lat: 10, lng: 20 },
    ]
    c.routes = [{ id: 'r1', from: 'a', to: 'b' }]
    const opt = c.getOption() as any
    expect(opt.series[0].data[0].coords).toEqual([
      [0, 0],
      [20, 10],
    ])
    expect(opt.series[1].data).toHaveLength(2)
  })
  it('5: key series type is lines', () => {
    const c = new UiRouteFlowMapComponent()
    c.hubs = [
      { id: 'a', name: 'A', lat: 0, lng: 0 },
      { id: 'b', name: 'B', lat: 10, lng: 20 },
    ]
    c.routes = [{ id: 'r1', from: 'a', to: 'b' }]
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('lines')
  })
  it('6: dangling routes drop out + empty data renders empty series', () => {
    const c = new UiRouteFlowMapComponent()
    c.hubs = [{ id: 'a', name: 'A', lat: 0, lng: 0 }]
    c.routes = [{ id: 'ghost', from: 'a', to: 'missing' }]
    expect((c.getOption() as any).series[0].data).toEqual([])
    const e = new UiRouteFlowMapComponent()
    expect(() => e.getOption()).not.toThrow()
    expect((e.getOption() as any).series[0].data).toEqual([])
  })
  it('7: flows animate with travelling pulses', () => {
    const c = new UiRouteFlowMapComponent()
    c.hubs = [
      { id: 'a', name: 'A', lat: 0, lng: 0 },
      { id: 'b', name: 'B', lat: 1, lng: 1 },
    ]
    c.routes = [{ id: 'r', from: 'a', to: 'b' }]
    const opt = c.getOption() as any
    expect(opt.series[0].effect.show).toBe(true)
  })
  it('8: user option merges without dropping computed series', () => {
    const c = new UiRouteFlowMapComponent()
    c.hubs = [
      { id: 'a', name: 'A', lat: 0, lng: 0 },
      { id: 'b', name: 'B', lat: 10, lng: 20 },
    ]
    c.routes = [{ id: 'r1', from: 'a', to: 'b' }]
    c.option = { series: [{ name: 'override' }], title: { text: 'Hi' } } as any
    const opt = c.getOption() as any
    expect(opt.title).toEqual({ text: 'Hi' })
    const types = (Array.isArray(opt.series) ? opt.series : [opt.series]).map((x: any) => x?.type)
    expect(types).toContain('lines')
  })
  it('9: type-only echarts import + lazy init + data-slot contract', () => {
    const runtimeEcharts = componentSrc
      .split('\n')
      .filter((l) => l.includes("from 'echarts") && !l.trim().startsWith('import type'))
    expect(runtimeEcharts).toEqual([])
    expect(componentSrc).toContain('import(')
    expect(componentSrc).toContain('echarts')
    expect(componentSrc).toContain('data-slot')
    expect(componentSrc).toContain('"route-flow-map"')
  })
  it('10: selected route encodes + emits like React handleSelectRoute', () => {
    const c = new UiRouteFlowMapComponent()
    c.hubs = [
      { id: 'a', name: 'A', lat: 0, lng: 0 },
      { id: 'b', name: 'B', lat: 10, lng: 20 },
    ]
    c.routes = [
      { id: 'r1', from: 'a', to: 'b' },
      { id: 'r2', from: 'b', to: 'a', color: '#38bdf8' },
    ]
    let changed = ''
    let selected: unknown = null
    c.selectedRouteChange.subscribe((v: string) => (changed = v))
    c.routeSelect.subscribe((v: unknown) => (selected = v))
    c.selectRoute('r1')
    expect(changed).toBe('r1')
    expect(selected).toEqual({ id: 'r1', from: 'a', to: 'b' })
    const opt = c.getOption() as any
    expect(opt.series[0].data[0].lineStyle).toEqual({ color: expect.any(String), width: 3, opacity: 1 })
    expect(opt.series[0].data[1].lineStyle).toEqual({ color: '#38bdf8' })
  })
})

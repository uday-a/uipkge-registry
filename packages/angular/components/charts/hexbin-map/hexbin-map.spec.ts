import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiHexbinMapComponent, US_HEX_STATES, WORLD_HEX_REGIONS } from './hexbin-map.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './hexbin-map.component.ts'), 'utf8')

describe('HexbinMap (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror React/Vue', () => {
    const c = new UiHexbinMapComponent()
    expect(c.shape).toBe('hexagon')
    expect(c.preset).toBe('us-states')
    expect(c.data).toEqual({})
    expect(c.showLabels).toBe(true)
    expect(c.showValues).toBe(false)
    expect(c.emptyColor).toBe('rgba(255, 255, 255, 0.08)')
    expect(c.height).toBe(480)
    expect(c.interactive).toBe(true)
    expect(c.accessToken).toBe('')
    expect(c.ariaLabel).toBe('Cartogram Tile Grid Map')
    expect(c.colorRamp).toHaveLength(6)
  })
  it('3: presets ship 51 US states + 21 world regions with fallback', () => {
    expect(US_HEX_STATES).toHaveLength(51)
    expect(WORLD_HEX_REGIONS).toHaveLength(21)
    expect(new UiHexbinMapComponent().activeItems).toBe(US_HEX_STATES)
    const w = new UiHexbinMapComponent()
    w.preset = 'world-regions'
    expect(w.activeItems).toBe(WORLD_HEX_REGIONS)
    const custom = [{ id: 'X', name: 'Custom', col: 0, row: 0 }]
    const c = new UiHexbinMapComponent()
    c.items = custom
    expect(c.activeItems).toBe(custom)
  })
  it('4: color ramp maps min/max, empty and explicit colors', () => {
    const c = new UiHexbinMapComponent()
    c.data = { A: { value: 10 }, B: { value: 20 } }
    expect(c.getColor(undefined)).toBe(c.emptyColor)
    expect(c.getColor({ value: 15, color: '#fff' })).toBe('#fff')
    expect(c.getColor({ value: 10 })).toBe(c.colorRamp[0])
    expect(c.getColor({ value: 20 })).toBe(c.colorRamp[c.colorRamp.length - 1])
  })
  it('5: coords use centroids with col/row fallback', () => {
    const c = new UiHexbinMapComponent()
    expect(c.getCoords({ id: 'CA', name: 'California', col: 1, row: 3 })).toEqual([-119.4, 36.8])
    expect(c.getCoords({ id: 'XX', name: 'Unknown', col: 2, row: 1 })).toEqual([-120 + 2 * 14, 50 - 1 * 8])
  })
  it('6: select emits both outputs; interactive=false blocks', () => {
    const c = new UiHexbinMapComponent()
    c.data = { CA: { value: 94 } }
    const changed: (string | undefined)[] = []
    const selected: { id: string; name: string }[] = []
    c.selectedChange.subscribe((v) => changed.push(v))
    c.select.subscribe((v) => selected.push(v))
    c.handleSelect({ id: 'CA', name: 'California', col: 1, row: 3 })
    expect(c.activeSelected).toBe('CA')
    expect(changed).toEqual(['CA'])
    expect(selected).toEqual([{ id: 'CA', name: 'California', datum: { value: 94 } }])
    const d = new UiHexbinMapComponent()
    d.interactive = false
    d.handleSelect({ id: 'CA', name: 'California', col: 1, row: 3 })
    expect(d.activeSelected).toBeUndefined()
  })
  it('7: clearSelection resets and emits undefined; controlled input wins', () => {
    const c = new UiHexbinMapComponent()
    c.handleSelect({ id: 'CA', name: 'California', col: 1, row: 3 })
    const changed: (string | undefined)[] = []
    c.selectedChange.subscribe((v) => changed.push(v))
    c.clearSelection()
    expect(c.activeSelected).toBeUndefined()
    expect(changed).toEqual([undefined])
    c.selected = 'TX'
    c.handleSelect({ id: 'CA', name: 'California', col: 1, row: 3 })
    expect(c.activeSelected).toBe('TX')
  })
  it('8: center/zoom per preset; projection toggles', () => {
    const c = new UiHexbinMapComponent()
    expect(c.mapCenter).toEqual([-97, 39])
    expect(c.mapZoom).toBe(3.6)
    expect(c.currentProjection).toBe('mercator')
    c.toggleProjection()
    expect(c.currentProjection).toBe('globe')
    const w = new UiHexbinMapComponent()
    w.preset = 'world-regions'
    expect(w.mapCenter).toEqual([0, 20])
    expect(w.mapZoom).toBe(1.5)
    expect(w.currentProjection).toBe('globe')
  })
  it('9: valueFormatter defaults to locale string', () => {
    const c = new UiHexbinMapComponent()
    expect(c.valueFormatter(1234)).toBe((1234).toLocaleString())
    c.valueFormatter = (v) => `${v}%`
    expect(c.valueFormatter(12)).toBe('12%')
  })
  it('10: map-based render, no echarts, data-slot contract', () => {
    expect(componentSrc).not.toContain('echarts')
    expect(componentSrc).not.toContain('use-chart-theme')
    expect(componentSrc).toContain('ui-map')
    expect(componentSrc).toContain('ui-map-marker')
    expect(componentSrc).toContain('data-slot')
    expect(componentSrc).toContain('"hexbin-map"')
  })
})

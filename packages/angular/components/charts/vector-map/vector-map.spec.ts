import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  UiVectorMapComponent,
  WORLD_REGIONS,
  WORLD_COUNTRIES,
  projectPoint,
  buildRoutesGeoJson,
} from './vector-map.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './vector-map.component.ts'), 'utf8')

describe('VectorMap (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror React/Vue (continents, globe, height 460, interactive)', () => {
    const c = new UiVectorMapComponent()
    expect(c.mode).toBe('continents')
    expect(c.regions).toEqual(WORLD_REGIONS)
    expect(c.regionData).toEqual({})
    expect(c.pins).toEqual([])
    expect(c.routes).toEqual([])
    expect(c.height).toBe(460)
    expect(c.interactive).toBe(true)
    expect(c.projection).toBe('globe')
  })
  it('3: host class contains card chrome + world presets ship 8 regions / 10 countries', () => {
    const cls = new UiVectorMapComponent().hostClass
    expect(cls).toContain('rounded-xl')
    expect(cls).toContain('w-full')
    expect(WORLD_REGIONS).toHaveLength(8)
    expect(WORLD_COUNTRIES).toHaveLength(10)
  })
  it('4: region select commits + emits both events, interactive gates it', () => {
    const c = new UiVectorMapComponent()
    const changed: string[] = []
    const selected: string[] = []
    c.selectedRegionChange.subscribe((v) => changed.push(v))
    c.selectRegion.subscribe((v) => selected.push(v))
    c.handleSelectRegion('europe')
    expect(c.activeRegion).toBe('europe')
    expect(changed).toEqual(['europe'])
    expect(selected).toEqual(['europe'])
    c.interactive = false
    c.handleSelectRegion('asia')
    expect(c.activeRegion).toBe('europe')
    expect(changed).toEqual(['europe'])
  })
  it('5: controlled selectedRegion wins + active record resolves', () => {
    const c = new UiVectorMapComponent()
    c.selectedRegion = 'asia'
    c.regionData = { asia: { value: 52100, status: 'optimal' } }
    expect(c.activeRegion).toBe('asia')
    expect(c.activeRecord).toEqual({ value: 52100, status: 'optimal' })
    expect(c.displayRegionName).toBe('asia')
    c.selectedRegion = 'northAmerica'
    expect(c.displayRegionName).toBe('north America')
  })
  it('6: projection toggles globe/mercator', () => {
    const c = new UiVectorMapComponent()
    expect(c.currentProjection).toBe('globe')
    c.toggleProjection()
    expect(c.currentProjection).toBe('mercator')
    c.toggleProjection()
    expect(c.currentProjection).toBe('globe')
  })
  it('7: routes build a midpoint-lifted GeoJSON collection', () => {
    expect(buildRoutesGeoJson([])).toBeNull()
    const gj = buildRoutesGeoJson([{ from: { lng: 0, lat: 0 }, to: { lng: 10, lat: 10 } }]) as any
    expect(gj.type).toBe('FeatureCollection')
    expect(gj.features[0].geometry.coordinates).toEqual([
      [0, 0],
      [5, 10],
      [10, 10],
    ])
    expect(gj.features[0].properties.color).toContain('56, 189, 248')
  })
  it('8: projectPoint maps lng/lat to the 1000x500 plane, x/y pass through', () => {
    expect(projectPoint({ x: 1, y: 2 })).toEqual({ x: 1, y: 2 })
    expect(projectPoint({ lng: -180, lat: 90 })).toEqual({ x: 0, y: 0 })
    expect(projectPoint({ lng: 0, lat: 0 })).toEqual({ x: 500, y: 250 })
  })
  it('9: mapbox-backed — no echarts import + data-slot contract', () => {
    expect(componentSrc).not.toContain('echarts')
    expect(componentSrc).toContain('@/ui/map/map.component')
    expect(componentSrc).toContain('data-slot')
    expect(componentSrc).toContain('"vector-map"')
  })
  it('10: heightStyle normalizes numbers + custom class merges', () => {
    const c = new UiVectorMapComponent()
    expect(c.heightStyle).toBe('460px')
    c.height = '50vh'
    expect(c.heightStyle).toBe('50vh')
    c.height = '300'
    expect(c.heightStyle).toBe('300px')
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
  })
})

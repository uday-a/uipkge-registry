import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiChoroplethMapChartComponent } from './choropleth-map-chart.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './choropleth-map-chart.component.ts'), 'utf8')

const worldGeo = {
  type: 'FeatureCollection',
  features: [
    { id: 'USA', properties: { name: 'United States of America' } },
    { id: 'FRA', properties: { name: 'France' } },
  ],
}

describe('ChoroplethMapChart (angular parity, 11 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror React/Vue (mapName, height, center, zoom, variant, projection)', () => {
    const c = new UiChoroplethMapChartComponent()
    expect(c.mapName).toBe('uipkge-map')
    expect(c.idField).toBe('id')
    expect(c.showScale).toBe(true)
    expect(c.height).toBe(420)
    expect(c.center).toEqual([0, 20])
    expect(c.zoom).toBe(1.5)
    expect(c.variant).toBe('dark')
    expect(c.projection).toBe('globe')
  })
  it('3: host class contains the card chrome', () => {
    const hostClass = new UiChoroplethMapChartComponent().hostClass
    expect(hostClass).toContain('relative')
    expect(hostClass).toContain('overflow-hidden')
  })
  it('4: initial projection seeds from the input, toggle flips it', () => {
    const c = new UiChoroplethMapChartComponent()
    c.projection = 'mercator'
    c.ngOnInit()
    expect(c.currentProjection()).toBe('mercator')
    c.toggleProjection()
    expect(c.currentProjection()).toBe('globe')
  })
  it('5: data map keys both id and name, lowercased', () => {
    const c = new UiChoroplethMapChartComponent()
    c.data = [{ id: 'USA', value: 92, name: 'United States of America' }]
    expect(c.dataMap.get('usa')).toBe(92)
    expect(c.dataMap.get('united states of america')).toBe(92)
  })
  it('6: GeoJSON features are enriched with matched values + titles', () => {
    const c = new UiChoroplethMapChartComponent()
    c.geoJson = worldGeo
    c.data = [{ id: 'USA', value: 92 }]
    const enriched = c.enrichedGeoJson
    expect(enriched.features[0].properties.value).toBe(92)
    expect(enriched.features[0].properties.title).toBe('United States of America')
    expect(enriched.features[1].properties.value).toBeNull()
  })
  it('7: min/max default to 0/100 without data', () => {
    const c = new UiChoroplethMapChartComponent()
    expect(c.minValue).toBe(0)
    expect(c.maxValue).toBe(100)
    c.data = [
      { id: 'a', value: 5 },
      { id: 'b', value: 50 },
    ]
    expect(c.minValue).toBe(5)
    expect(c.maxValue).toBe(50)
  })
  it('8: fill paint interpolates across the data range', () => {
    const c = new UiChoroplethMapChartComponent()
    c.data = [{ id: 'a', value: 50 }]
    const paint = c.fillPaint['fill-color'] as unknown[]
    expect(JSON.stringify(paint)).toContain('rgba(56, 189, 248, 0.9)')
    expect(JSON.stringify(paint)).toContain(',50,')
  })
  it('9: links build a LineString FeatureCollection, null when empty', () => {
    const c = new UiChoroplethMapChartComponent()
    expect(c.linksGeoJson).toBeNull()
    c.links = [{ from: [0, 0], to: [10, 20], label: 'A → B' }]
    const geo = c.linksGeoJson!
    expect(geo['type']).toBe('FeatureCollection')
    const features = geo['features'] as any[]
    expect(features[0].geometry.coordinates).toEqual([
      [0, 0],
      [10, 20],
    ])
    expect(features[0].properties.label).toBe('A → B')
  })
  it('10: mapbox composition + data-slot contract, no echarts', () => {
    expect(componentSrc).not.toContain('echarts')
    expect(componentSrc).toContain('UiMapComponent')
    expect(componentSrc).toContain('UiMapMarkerComponent')
    expect(componentSrc).toContain('data-slot')
    expect(componentSrc).toContain('"choropleth-map-chart"')
  })
  it('11: height style handles number, numeric string, and css', () => {
    const c = new UiChoroplethMapChartComponent()
    c.height = 420
    expect(c.heightStyle).toBe('420px')
    c.height = '440'
    expect(c.heightStyle).toBe('440px')
    c.height = '50vh'
    expect(c.heightStyle).toBe('50vh')
  })
})

// @vitest-environment jsdom
import { ChangeDetectionStrategy, Component, ElementRef } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import type * as L from 'leaflet'
import { create } from '../../test-utils/inject'
import { describe, it, expect, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  UiLeafletMapComponent,
  UiLeafletMarkerComponent,
  UiLeafletPolylineComponent,
  UiLeafletPolygonComponent,
  UiLeafletCircleComponent,
  UiLeafletCircleMarkerComponent,
  UiLeafletGeoJsonComponent,
  UiLeafletPopupComponent,
  UiLeafletTooltipComponent,
  UiLeafletTileLayerComponent,
  LEAFLET_TILES,
} from './leaflet-map.component'
import * as barrel from './index'
import { toLatLng, defined } from './leaflet-context'
import { LEAFLET_MAP_CSS } from './leaflet-map.styles'
import registryItem from './leaflet-map.registry'

const here = dirname(fileURLToPath(import.meta.url))
const shared = readFileSync(resolve(here, '../../../shared/variants/leaflet-map.variants.ts'), 'utf8')
const vueSrc = readFileSync(
  resolve(here, '../../../registry-vue/components/leaflet-map/leaflet-map.variants.ts'),
  'utf8',
)
const angularSrc = readFileSync(resolve(here, './leaflet-map.variants.ts'), 'utf8')
const componentSrc = readFileSync(resolve(here, './leaflet-map.component.ts'), 'utf8')
const reactDir = resolve(here, '../../../registry-react/components/leaflet-map')
const reactSrc = readFileSync(resolve(reactDir, 'leaflet-map.tsx'), 'utf8')
const reactCss = readFileSync(resolve(reactDir, 'leaflet-map.css'), 'utf8')

// jsdom has no SVGSVGElement#createSVGRect, so Leaflet (which feature-detects it once, at import)
// would pick the canvas renderer, which jsdom cannot draw. Leaflet is imported lazily by the map,
// so stubbing it here, before any map exists, gives the vector children a working SVG renderer.
;(SVGElement.prototype as unknown as { createSVGRect: () => object }).createSVGRect = () => ({})

function stripComments(s: string): string {
  return s.replace(/\/\/.*$/gm, '')
}

describe('LeafletMap (angular parity checks)', () => {
  it('1: variants file is byte-identical to shared canonical', () => {
    expect(stripComments(angularSrc)).toBe(stripComments(shared))
  })
  it('2: variants file matches Vue registry copy', () => {
    expect(stripComments(angularSrc)).toBe(stripComments(vueSrc))
  })
  it('3: map + sub-components are standalone', () => {
    expect(componentSrc.match(/standalone: true/g)?.length).toBeGreaterThanOrEqual(7)
  })
  it('4: defaults are center=[0,20] zoom=2 variant=default', () => {
    const c = new UiLeafletMapComponent()
    expect(c.center).toEqual([0, 20])
    expect(c.zoom).toBe(2)
    expect(c.variant).toBe('default')
  })
  it('5: host class contains base relative + bg-muted', () => {
    const c = new UiLeafletMapComponent()
    expect(c.hostClass).toContain('relative')
    expect(c.hostClass).toContain('bg-muted')
  })
  it('6: streets variant resolves to OSM tile preset', () => {
    const c = new UiLeafletMapComponent()
    c.variant = 'streets'
    expect(c.resolveTiles().url).toBe(LEAFLET_TILES.streets.url)
  })
  it('7: explicit tileUrl wins over variant', () => {
    const c = new UiLeafletMapComponent()
    c.variant = 'satellite'
    c.tileUrl = 'https://tiles.example.com/{z}/{x}/{y}.png'
    expect(c.resolveTiles().url).toBe('https://tiles.example.com/{z}/{x}/{y}.png')
  })
  it('8: helpers keep Mapbox-order parity (toLatLng flips, defined strips)', () => {
    expect(toLatLng([10, 20])).toEqual([20, 10])
    expect(defined({ a: 1, b: undefined })).toEqual({ a: 1 })
    const m = create(UiLeafletMarkerComponent, [{ provide: ElementRef, useValue: new ElementRef({}) }])
    m.lngLat = [10, 20]
    expect(m.buildOptions()).toMatchObject({ interactive: true })
    const t = create(UiLeafletTileLayerComponent)
    t.url = 'https://tiles.example.com/{z}/{x}/{y}.png'
    expect(t.buildOptions()).toEqual({})
    const p = create(UiLeafletPolylineComponent)
    p.color = '#ff0000'
    expect(p.buildOptions()).toMatchObject({ color: '#ff0000' })
  })
  it('9: custom class merges via cn()', () => {
    const c = new UiLeafletMapComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
  })
  it('10: data-slot leaflet-map contract + leaflet retained', () => {
    expect(componentSrc).toContain('data-slot')
    expect(componentSrc).toContain('"leaflet-map"')
    expect(componentSrc).toContain('leaflet')
  })
  it('11: marker exposes host element for popup pairing', () => {
    const host = { nodeName: 'UI-LEAFLET-MARKER' }
    const m = create(UiLeafletMarkerComponent, [{ provide: ElementRef, useValue: { nativeElement: host } }])
    expect(m.el.nativeElement).toBe(host)
    expect(m.lngLat).toEqual([0, 0])
  })
  it('12: marker buildOptions maps inputs, strips undefined', () => {
    const m = create(UiLeafletMarkerComponent, [{ provide: ElementRef, useValue: new ElementRef({}) }])
    m.draggable = true
    m.title = 'HQ'
    const opts = m.buildOptions()
    expect(opts).toMatchObject({ interactive: true, draggable: true, title: 'HQ' })
    expect('opacity' in opts).toBe(false)
  })
  it('13: children draw themselves through the map (no ContentChildren snapshot / syncMarkers)', () => {
    expect(componentSrc).not.toContain('syncMarkers')
    expect(componentSrc).not.toContain('ContentChildren')
    expect(componentSrc).toContain('whenMap(')
    expect(componentSrc).toContain('bindPopup')
  })
})

// ---------------------------------------------------------------------------------------------
// Regression tests for the verifier-reported gaps vs React. Each one fails on the old port:
// no CSS, vector children never drawn, markers ignoring their content/anchor, and no chrome.
// ---------------------------------------------------------------------------------------------

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true,
  imports: [
    UiLeafletMapComponent,
    UiLeafletMarkerComponent,
    UiLeafletPopupComponent,
    UiLeafletTooltipComponent,
    UiLeafletCircleComponent,
    UiLeafletCircleMarkerComponent,
    UiLeafletGeoJsonComponent,
    UiLeafletPolygonComponent,
    UiLeafletPolylineComponent,
  ],
  template: `
    <ui-leaflet-map
      [center]="[-84.39, 33.75]"
      [zoom]="10"
      [navigation]="navigation"
      [navigationPosition]="navigationPosition"
      [fullscreen]="fullscreen"
      [attribution]="attribution"
    >
      @if (showLayers) {
        <ui-leaflet-circle
          [center]="circleCenter"
          [radius]="radius"
          color="#3b82f6"
          [weight]="weight"
          [fill]="true"
          fillColor="#3b82f6"
          [fillOpacity]="0.07"
          (layerClick)="layerClicks = layerClicks + 1"
        />
        <ui-leaflet-polygon
          [lngLatPath]="ring"
          color="#10b981"
          fillColor="#10b981"
          [fillOpacity]="0.2"
          (layerClick)="layerClicks = layerClicks + 1"
        />
        <ui-leaflet-polyline
          [lngLatPath]="line"
          color="#0284c7"
          [weight]="3"
          dashArray="6 6"
          (layerClick)="layerClicks = layerClicks + 1"
        />
        <ui-leaflet-circle-marker
          [center]="[-84.2, 33.8]"
          [radius]="markerRadius"
          color="#f59e0b"
          [fill]="true"
          fillColor="#f59e0b"
          [fillOpacity]="0.9"
          (layerClick)="layerClicks = layerClicks + 1"
        >
          <ui-leaflet-tooltip direction="top" [offset]="[0, -12]"
            ><span class="tooltip-body">Depot {{ label }}</span></ui-leaflet-tooltip
          >
        </ui-leaflet-circle-marker>
        <ui-leaflet-tooltip [lngLat]="[-84.0, 33.5]" direction="top" [opacity]="0.95"
          ><span class="standalone-tip">Standalone</span></ui-leaflet-tooltip
        >
        <ui-leaflet-geojson
          [geojson]="zones"
          [options]="geojsonOptions"
          (layerClick)="layerClicks = layerClicks + 1"
        />
      }
      <ui-leaflet-marker
        [lngLat]="[-84.39, 33.75]"
        anchor="bottom"
        (layerClick)="layerClicks = layerClicks + 1"
      >
        <button type="button" class="hub-pin" (click)="clicks = clicks + 1">{{ label }}</button>
        <ui-leaflet-popup
          ><p class="popup-body">Hub {{ label }}</p></ui-leaflet-popup
        >
      </ui-leaflet-marker>
      <ui-leaflet-marker [lngLat]="[-84.0, 33.5]" />
    </ui-leaflet-map>
  `,
})
class MapHostComponent {
  navigation = true
  navigationPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' = 'bottom-right'
  fullscreen = false
  attribution = true
  showLayers = true
  circleCenter: [number, number] = [-84.39, 33.75]
  radius = 5000
  weight = 1.5
  ring: [number, number][] = [
    [-84.5, 33.6],
    [-84.2, 33.6],
    [-84.2, 33.9],
  ]
  line: [number, number][] = [
    [-84.5, 33.7],
    [-84.1, 33.8],
  ]
  label = 'ATL'
  clicks = 0
  layerClicks = 0
  markerRadius = 10
  zones: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { name: 'Zone A' },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-84.3, 33.7],
              [-84.1, 33.7],
              [-84.1, 33.85],
              [-84.3, 33.85],
              [-84.3, 33.7],
            ],
          ],
        },
      },
    ],
  }
  geojsonOptions = { style: () => ({ color: '#2563eb', weight: 2 }) }
}

async function renderMap(setup?: (host: MapHostComponent) => void) {
  const fixture = TestBed.createComponent(MapHostComponent)
  setup?.(fixture.componentInstance)
  fixture.detectChanges()
  const mapCmp = fixture.debugElement.query(By.directive(UiLeafletMapComponent))
    .componentInstance as UiLeafletMapComponent
  await vi.waitFor(() => {
    if (!mapCmp.getMap()) throw new Error('map not created yet')
  })
  fixture.detectChanges()
  const Lmod = await import('leaflet')
  const map = mapCmp.getMap()!
  const layers = () => {
    const out: L.Layer[] = []
    map.eachLayer((l) => void out.push(l))
    return out
  }
  const root = fixture.nativeElement as HTMLElement
  /** Mutate host fields, then re-render (plain fields don't mark the root view dirty). */
  const update = (fn: (host: MapHostComponent) => void) => {
    fn(fixture.componentInstance)
    fixture.componentRef.changeDetectorRef.markForCheck()
    fixture.detectChanges()
  }
  return { fixture, host: fixture.componentInstance, mapCmp, map, Lmod, layers, root, update }
}

describe('LeafletMap (angular regressions vs React)', () => {
  it('bug 1: constructing the map injects Leaflet core + the React chrome CSS into <head>, once', () => {
    document.head.querySelectorAll('style[data-uipkge-leaflet]').forEach((s) => s.remove())
    new UiLeafletMapComponent()
    new UiLeafletMapComponent()
    const styles = document.head.querySelectorAll('style[data-uipkge-leaflet]')
    expect(styles).toHaveLength(1)
    const css = styles[0]!.textContent!
    // Leaflet core: panes/tiles absolutely positioned — without it tiles and markers scatter.
    expect(css).toMatch(/\.leaflet-pane,\s*\n\.leaflet-tile,/)
    expect(css).toContain('.leaflet-tile-pane    { z-index: 200; }')
    // Chrome: the React/Vue leaflet-map.css verbatim, after the core so its token overrides win.
    expect(LEAFLET_MAP_CSS).toBe(reactCss)
    expect(css.indexOf('.uipkge-leaflet-anchor')).toBeGreaterThan(css.indexOf('.leaflet-pane'))
    // The styles module ships with the installed item.
    expect(registryItem.files.map((f: { path: string }) => f.path)).toContain('leaflet-map.styles.ts')
  })

  it('bug 2: circle / polygon / polyline children are drawn, follow input changes and are removed on destroy', async () => {
    const { host, Lmod, layers, update } = await renderMap()
    const circle = layers().find((l) => l instanceof Lmod.Circle) as L.Circle
    const polygon = layers().find((l) => l instanceof Lmod.Polygon) as L.Polygon
    const polyline = layers().find((l) => l instanceof Lmod.Polyline && !(l instanceof Lmod.Polygon)) as L.Polyline
    expect(circle).toBeTruthy()
    expect(polygon).toBeTruthy()
    expect(polyline).toBeTruthy()
    // [lng, lat] inputs become Leaflet [lat, lng].
    expect(circle.getLatLng()).toMatchObject({ lat: 33.75, lng: -84.39 })
    expect(circle.getRadius()).toBe(5000)
    expect(circle.options).toMatchObject({
      color: '#3b82f6',
      weight: 1.5,
      fill: true,
      fillColor: '#3b82f6',
      fillOpacity: 0.07,
    })
    expect((polygon.getLatLngs()[0] as L.LatLng[]).map((p) => [p.lng, p.lat])).toEqual(host.ring)
    expect(polygon.options).toMatchObject({ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.2 })
    expect((polyline.getLatLngs() as L.LatLng[]).map((p) => [p.lng, p.lat])).toEqual(host.line)
    expect(polyline.options).toMatchObject({ color: '#0284c7', weight: 3, dashArray: '6 6' })

    update((h) => {
      h.radius = 8000
      h.weight = 2
      h.circleCenter = [-84.1, 33.6]
    })
    expect(circle.getRadius()).toBe(8000)
    expect(circle.options.weight).toBe(2)
    expect(circle.getLatLng()).toMatchObject({ lat: 33.6, lng: -84.1 })

    update((h) => (h.showLayers = false))
    expect(layers().some((l) => l instanceof Lmod.Path)).toBe(false)
  })

  it('bug 3: marker content becomes a div-icon at its anchor (live bindings); no content keeps the default pin', async () => {
    const { host, Lmod, layers, root, update } = await renderMap()
    const markers = layers().filter((l) => l instanceof Lmod.Marker) as L.Marker[]
    expect(markers).toHaveLength(2)
    const custom = markers.find((m) => m.getLatLng().lng === -84.39)!
    const plain = markers.find((m) => m.getLatLng().lng === -84.0)!
    expect(custom.options.icon).toBeInstanceOf(Lmod.DivIcon)
    expect(plain.options.icon).toBeInstanceOf(Lmod.Icon.Default)

    const icon = root.querySelector('.leaflet-marker-pane .leaflet-marker-icon.uipkge-leaflet-div-icon')!
    expect(icon).toBeTruthy()
    const anchor = icon.querySelector(':scope > .uipkge-leaflet-anchor') as HTMLElement
    expect(anchor.dataset['anchor']).toBe('bottom')
    const pin = anchor.querySelector('button.hub-pin') as HTMLButtonElement
    expect(pin.textContent!.trim()).toBe('ATL')
    // The popup is not icon content: it binds to the marker, with its content moved into it.
    expect(anchor.querySelector('.popup-body')).toBeNull()
    const popupContent = custom.getPopup()!.getContent() as HTMLElement
    expect(popupContent.className).toBe('uipkge-leaflet-popup-src')
    expect(popupContent.textContent!.trim()).toBe('Hub ATL')

    // Real DOM moved, not copied: listeners and bindings survive.
    pin.click()
    expect(host.clicks).toBe(1)
    update((h) => (h.label = 'ATL-01'))
    expect(pin.textContent!.trim()).toBe('ATL-01')
    expect(popupContent.textContent!.trim()).toBe('Hub ATL-01')
  })

  it('bug 4: renders the React chrome (zoom group, fullscreen, attribution ⓘ) and honours its inputs', async () => {
    const { fixture, mapCmp, root, update } = await renderMap((h) => (h.fullscreen = true))
    const zoomIn = root.querySelector('button[aria-label="Zoom in"]') as HTMLButtonElement
    const zoomOut = root.querySelector('button[aria-label="Zoom out"]') as HTMLButtonElement
    expect(zoomIn && zoomOut).toBeTruthy()
    // Angular's [class] binding may reorder tokens; compare as sets.
    const classSet = (el: Element) => [...el.classList].sort()
    const expected = (s: string) => s.split(' ').sort()
    expect(classSet(zoomIn.closest('div.absolute')!)).toEqual(
      expected('absolute z-[1000] flex flex-col gap-2.5 bottom-3 right-3'),
    )
    const fsButton = root.querySelector('button[aria-label="Toggle fullscreen"]')!
    expect(classSet(fsButton.closest('div.absolute')!)).toEqual(
      expected('absolute z-[1000] flex flex-col gap-2.5 right-3 top-3'),
    )
    const info = root.querySelector('button[aria-label="Map data attribution"]') as HTMLButtonElement
    expect(info.getAttribute('aria-expanded')).toBe('false')
    const note = root.querySelector('[role="note"]')!
    const credit = document.createElement('div')
    credit.innerHTML = mapCmp.resolveTiles().attribution!
    expect(note.textContent!.trim()).toBe(credit.textContent!.trim())
    expect(['invisible', 'opacity-0', 'group-hover:visible'].every((c) => note.classList.contains(c))).toBe(true)
    info.click()
    fixture.detectChanges()
    expect(info.getAttribute('aria-expanded')).toBe('true')
    expect(note.classList.contains('opacity-100') && !note.classList.contains('invisible')).toBe(true)

    const zoomSpy = vi.spyOn(mapCmp.getMap()!, 'zoomIn')
    zoomIn.click()
    expect(zoomSpy).toHaveBeenCalled()

    update((h) => (h.navigationPosition = 'top-left'))
    const moved = root.querySelector('button[aria-label="Zoom in"]')!.closest('div.absolute')!
    expect(moved.classList.contains('left-3') && moved.classList.contains('top-3')).toBe(true)
    update((h) => {
      h.navigation = false
      h.fullscreen = false
      h.attribution = false
    })
    expect(root.querySelector('button[aria-label="Zoom in"]')).toBeNull()
    expect(root.querySelector('button[aria-label="Toggle fullscreen"]')).toBeNull()
    expect(root.querySelector('button[aria-label="Map data attribution"]')).toBeNull()
  })

  it('bug 4: chrome class strings and SVG paths are copied verbatim from React', () => {
    const template = componentSrc.slice(
      componentSrc.indexOf('template: `'),
      componentSrc.indexOf('export class UiLeafletMapComponent'),
    )
    const classes = [...template.matchAll(/ class="([^"]+)"/g)].map((m) => m[1]!)
    expect(classes.length).toBeGreaterThanOrEqual(6)
    for (const c of classes) expect(reactSrc, c).toContain(`className="${c}"`)
    const paths = [...template.matchAll(/ d="([^"]+)"/g)].map((m) => m[1]!)
    expect(paths).toHaveLength(5)
    for (const d of paths) expect(reactSrc).toContain(`d="${d}"`)
  })
})

describe('LeafletMap (tooltip / circle-marker / geojson / layerClick)', () => {
  it('barrel exports the new children', () => {
    expect(barrel.UiLeafletTooltipComponent).toBe(UiLeafletTooltipComponent)
    expect(barrel.UiLeafletCircleMarkerComponent).toBe(UiLeafletCircleMarkerComponent)
    expect(barrel.UiLeafletGeoJsonComponent).toBe(UiLeafletGeoJsonComponent)
  })

  it('tooltip + circle-marker buildOptions map inputs and strip undefined', () => {
    const t = create(UiLeafletTooltipComponent)
    t.direction = 'top'
    t.opacity = 0.95
    expect(t.buildOptions()).toMatchObject({ direction: 'top', opacity: 0.95 })
    expect('sticky' in t.buildOptions()).toBe(false)
    const cm = create(UiLeafletCircleMarkerComponent)
    cm.color = '#f59e0b'
    expect(cm.buildOptions()).toMatchObject({ color: '#f59e0b', interactive: true })
    expect('weight' in cm.buildOptions()).toBe(false)
  })

  it('circle-marker draws with a pixel radius; tooltips bind or float standalone with live content', async () => {
    const { Lmod, layers, update } = await renderMap()
    // L.Circle extends L.CircleMarker, so exclude the meter-radius circle.
    const cm = layers().find((l) => l instanceof Lmod.CircleMarker && !(l instanceof Lmod.Circle)) as L.CircleMarker
    expect(cm).toBeTruthy()
    expect(cm.getLatLng()).toMatchObject({ lat: 33.8, lng: -84.2 })
    expect(cm.getRadius()).toBe(10)
    expect(cm.options).toMatchObject({ color: '#f59e0b', fill: true, fillColor: '#f59e0b', fillOpacity: 0.9 })
    update((h) => (h.markerRadius = 14))
    expect(cm.getRadius()).toBe(14)

    const bound = cm.getTooltip()!.getContent() as HTMLElement
    expect(bound.className).toBe('uipkge-leaflet-tooltip-src')
    expect(bound.textContent!.trim()).toBe('Depot ATL')
    expect(cm.getTooltip()!.options).toMatchObject({ direction: 'top' })
    update((h) => (h.label = 'ATL-02'))
    expect(bound.textContent!.trim()).toBe('Depot ATL-02')

    const standalone = layers().find(
      (l) => l instanceof Lmod.Tooltip && (l as L.Tooltip).getLatLng?.()?.lat === 33.5,
    ) as L.Tooltip
    expect(standalone).toBeTruthy()
    expect((standalone.getContent() as HTMLElement).textContent!.trim()).toBe('Standalone')
    expect(standalone.options).toMatchObject({ direction: 'top', opacity: 0.95 })
  })

  it('layerClick fires on every layer; geojson follows input changes; children are removed on destroy', async () => {
    const { host, Lmod, layers, update, fixture } = await renderMap()
    const marker = layers().find((l) => l instanceof Lmod.Marker) as L.Marker
    const circle = layers().find((l) => l instanceof Lmod.Circle) as L.Circle
    const polygon = layers().find((l) => l instanceof Lmod.Polygon) as L.Polygon
    const polyline = layers().find((l) => l instanceof Lmod.Polyline && !(l instanceof Lmod.Polygon)) as L.Polyline
    const cm = layers().find((l) => l instanceof Lmod.CircleMarker && !(l instanceof Lmod.Circle)) as L.CircleMarker
    const gj = layers().find((l) => l instanceof Lmod.GeoJSON) as L.GeoJSON
    expect(gj).toBeTruthy()
    expect(gj.getLayers()).toHaveLength(1)
    for (const layer of [marker, circle, polygon, polyline, cm, gj]) layer.fire('click', {})
    expect(host.layerClicks).toBe(6)

    const clearSpy = vi.spyOn(gj, 'clearLayers')
    const addSpy = vi.spyOn(gj, 'addData')
    update((h) => (h.zones = { ...h.zones, features: [...h.zones.features] }))
    expect(clearSpy).toHaveBeenCalled()
    expect(addSpy).toHaveBeenCalled()

    update((h) => (h.showLayers = false))
    expect(layers().some((l) => l instanceof Lmod.CircleMarker)).toBe(false)
    expect(layers().some((l) => l instanceof Lmod.GeoJSON)).toBe(false)
    expect(layers().some((l) => l instanceof Lmod.Tooltip)).toBe(false)
    fixture.destroy()
  })
})

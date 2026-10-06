// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TestBed } from '@angular/core/testing'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiDottedMapChartComponent, resolvePaintColor, routeCoordinates, type MapPin, type MapRoute } from './index'

// DottedMapChart is React's Mapbox GL dotted map 1:1. If these break, pins stop reporting
// clicks/hovers to the host block (its inspector goes dead), theme-token route colours reach
// Mapbox as unparseable `var(...)` strings (routes vanish), or a missing token shows a blank box.

// jsdom has no WebGL: stand mapbox-gl's Marker in with a recorder.
const markers: { el: HTMLElement; lngLat?: [number, number]; removed: boolean }[] = []
vi.mock('mapbox-gl', () => {
  class Marker {
    rec: { el: HTMLElement; lngLat?: [number, number]; removed: boolean }
    constructor(opts: { element: HTMLElement }) {
      this.rec = { el: opts.element, removed: false }
      markers.push(this.rec)
    }
    setLngLat(ll: [number, number]) {
      this.rec.lngLat = ll
      return this
    }
    addTo() {
      return this
    }
    remove() {
      this.rec.removed = true
      return this
    }
  }
  return { default: { Marker }, Marker }
})

const here = dirname(fileURLToPath(import.meta.url))
const source = readFileSync(resolve(here, './dotted-map-chart.component.ts'), 'utf8')
const reactSource = readFileSync(
  resolve(here, '../../../../registry-react/components/charts/dotted-map-chart/DottedMapChart.tsx'),
  'utf8',
)

const PINS: MapPin[] = [
  { lat: 51.5, lng: -0.12, label: 'London (LHR)', color: 'var(--chart-1)', description: 'Edge PoP', value: '18ms' },
  { lat: 1.35, lng: 103.8 },
]
const ROUTES: MapRoute[] = [
  { from: { lat: 0, lng: 0 }, to: { lat: 10, lng: 20 } },
  {
    from: { lat: 0, lng: 0 },
    to: { lat: 0, lng: 40 },
    color: 'var(--chart-2)',
    width: 3,
    dashed: false,
    curvature: 0.25,
  },
]

function render(inputs: Record<string, unknown> = {}) {
  const fixture = TestBed.createComponent(UiDottedMapChartComponent)
  fixture.componentRef.setInput('accessToken', '')
  for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v)
  fixture.detectChanges()
  const host = fixture.nativeElement as HTMLElement
  return { fixture, host, cmp: fixture.componentInstance }
}

const fakeMap = () => {
  const setData = vi.fn()
  const map = {
    getSource: vi.fn(() => ({ setData })),
    getLayer: vi.fn(() => ({})),
    setPaintProperty: vi.fn(),
    setProjection: vi.fn(),
  }
  return { map, setData }
}

beforeEach(() => {
  markers.length = 0
  document.documentElement.style.setProperty('--chart-1', 'oklch(0.65 0.2 145)')
  document.documentElement.style.setProperty('--chart-2', '#ff8800')
})

describe('DottedMapChart (angular parity with React)', () => {
  it('1: renders the React card chrome: rounded bordered root, height, projection toggle', () => {
    const { host } = render({ height: 380, class: 'custom-chart-test' })
    const root = host.firstElementChild as HTMLElement
    for (const cls of 'border-border bg-card group relative w-full overflow-hidden rounded-xl border shadow-xs custom-chart-test'.split(
      ' ',
    ))
      expect(root.classList).toContain(cls)
    expect(root.style.height).toBe('380px')
    const toggle = host.querySelector('button')!
    expect(toggle.textContent!.trim()).toBe('globe')
    expect(host.querySelector('ui-map')!.className).toContain('size-full')
  })

  it('2: without a Mapbox token it shows the map primitive\'s "Mapbox token required" fallback', () => {
    const { host, cmp } = render()
    expect(cmp.resolvedToken).toBe('')
    expect(host.textContent).toContain('Mapbox token required')
    expect(host.textContent).toContain('Pass an access token to render the map.')
  })

  it('3: an explicit token is forwarded to ui-map', () => {
    const { cmp } = render()
    cmp.accessToken = 'pk.test'
    expect(cmp.resolvedToken).toBe('pk.test')
  })

  it('4: dot grid, routes and layers mirror React (world grid 6°, route defaults, dashed [2,2])', () => {
    const { cmp } = render({ routes: ROUTES })
    const grid = cmp.buildDotGrid()
    expect(grid.features).toHaveLength(21 * 57) // lat -55..65 step 6, lng -170..166 step 6
    expect(cmp.mapCenter).toEqual([0, 20])
    expect(cmp.mapZoom).toBe(1.5)
    const [first] = cmp.buildRoutes().features as any[]
    expect(first.properties).toEqual({ color: 'rgba(56, 189, 248, 0.75)', dashed: true })
    expect(first.geometry.coordinates).toEqual([
      [0, 0],
      [10, 10],
      [20, 10],
    ])
    const routeLayers = cmp.mapLayers.filter((l) => l.id.startsWith('routes'))
    expect(routeLayers).toHaveLength(1)
    expect(routeLayers[0].paint).toEqual({
      'line-color': ['get', 'color'],
      'line-width': 1.5,
      'line-dasharray': [2, 2],
    })
    expect(cmp.mapLayers.find((l) => l.id === 'dot-grid-layer')!.paint).toMatchObject({
      'circle-radius': 1.5,
      'circle-opacity': 0.4,
    })
  })

  it('5: USA map switches grid extent, centre and zoom', () => {
    const { cmp } = render({ map: 'usa' })
    expect(cmp.mapCenter).toEqual([-98, 39])
    expect(cmp.mapZoom).toBe(3.5)
    expect(cmp.buildDotGrid().features).toHaveLength(9 * 20)
  })

  it('6: like React/Vue, only route colour is read — width/dashed/curvature are ignored and colour is passed as given', () => {
    const { cmp } = render({ routes: ROUTES })
    const second = (cmp.buildRoutes().features as any[])[1]
    // React and Vue both hand `var(--chart-2)` to Mapbox unresolved; Angular matches them.
    expect(second.properties).toEqual({ color: 'var(--chart-2)', dashed: false })
    expect(second.geometry.coordinates).toEqual([
      [0, 0],
      [20, 5],
      [40, 0],
    ])
    expect(routeCoordinates(ROUTES[1])).toEqual([
      [0, 0],
      [20, 5],
      [40, 0],
    ])
    // Paint is fixed, so the per-route `dashed: false` / `width: 3` never reach the line.
    expect(cmp.mapLayers.find((l) => l.id === 'routes-layer')!.paint).toMatchObject({
      'line-width': 1.5,
      'line-dasharray': [2, 2],
    })
  })

  it('7: var(--token) colours resolve to concrete canvas colours (React resolvePaintColor)', () => {
    expect(resolvePaintColor('var(--chart-2)')).toBe('#ff8800')
    const resolved = resolvePaintColor('var(--chart-1)')
    expect(resolved).not.toContain('var(')
    expect(resolved).not.toContain('oklch')
    expect(resolvePaintColor('var(--missing)')).toBe('var(--missing)')
    expect(resolvePaintColor('#123456')).toBe('#123456')
    const { cmp } = render({ dotColor: 'var(--chart-2)' })
    expect(cmp.buildDotPaint()['circle-color']).toBe('#ff8800')
  })

  it('8: pins become Mapbox markers at their lng/lat once the map exists; colour and pulse follow the pin', async () => {
    const { fixture, host, cmp } = render({ pins: PINS })
    const { map } = fakeMap()
    await cmp.onMapCreated(map as any)
    expect(markers.map((m) => m.lngLat)).toEqual([
      [-0.12, 51.5],
      [103.8, 1.35],
    ])
    const pin = markers[0].el.querySelector('[data-slot="dotted-map-pin"]')!
    expect(markers[0].el.className).toBe('cursor-pointer select-none')
    const [ping, dot] = [...pin.querySelectorAll('span')] as HTMLElement[]
    expect(ping.className).toContain('animate-ping')
    expect(dot.getAttribute('style')).toContain('var(--chart-1)')
    const fallback = markers[1].el.querySelectorAll('span')[1] as HTMLElement
    expect(fallback.getAttribute('style')).toContain('oklch(0.65 0.2 145)')
    fixture.componentRef.setInput('pulse', false)
    fixture.detectChanges()
    expect(host.querySelector('.animate-ping')).toBeNull()
  })

  it('9: pin hover emits pinHover(pin) / pinHover(null) and toggles the hover card; click emits pinClick', async () => {
    const { fixture, host, cmp } = render({ pins: PINS })
    const hovers: (MapPin | null)[] = []
    const clicks: MapPin[] = []
    cmp.pinHover.subscribe((p) => hovers.push(p))
    cmp.pinClick.subscribe((p) => clicks.push(p))
    const pin = host.querySelector('[data-slot="dotted-map-pin"]') as HTMLElement
    pin.dispatchEvent(new MouseEvent('mouseenter'))
    fixture.detectChanges()
    const card = host.querySelector('[data-slot="dotted-map-hover-card"]')!
    expect(card.textContent).toContain('London (LHR)')
    expect(card.textContent).toContain('Edge PoP')
    expect(card.textContent).toContain('18ms')
    pin.click()
    pin.dispatchEvent(new MouseEvent('mouseleave'))
    fixture.detectChanges()
    expect(host.querySelector('[data-slot="dotted-map-hover-card"]')).toBeNull()
    expect(hovers).toEqual([PINS[0], null])
    expect(clicks).toEqual([PINS[0]])
  })

  it('10: interactive=false hides the hover card but still emits; unlabeled pins read "Telemetry Node"', () => {
    const { fixture, host, cmp } = render({ pins: PINS })
    const pins = host.querySelectorAll('[data-slot="dotted-map-pin"]')
    pins[1].dispatchEvent(new MouseEvent('mouseenter'))
    fixture.detectChanges()
    expect(host.querySelector('[data-slot="dotted-map-hover-card"]')!.textContent).toContain('Telemetry Node')
    fixture.componentRef.setInput('interactive', false)
    const hovers: (MapPin | null)[] = []
    cmp.pinHover.subscribe((p) => hovers.push(p))
    pins[0].dispatchEvent(new MouseEvent('mouseenter'))
    fixture.detectChanges()
    expect(host.querySelector('[data-slot="dotted-map-hover-card"]')).toBeNull()
    expect(hovers).toEqual([PINS[0]])
  })

  it('11: route changes push new data onto the live map; pin changes re-place markers', async () => {
    const { fixture, cmp } = render({ pins: PINS, routes: ROUTES })
    const { map, setData } = fakeMap()
    await cmp.onMapCreated(map as any)
    fixture.componentRef.setInput('routes', [ROUTES[0]])
    fixture.componentRef.setInput('pins', [PINS[1]])
    fixture.detectChanges()
    const routeData = setData.mock.calls.map((c) => c[0]).at(-1)
    expect(routeData.features).toHaveLength(1)
    const live = markers.filter((m) => !m.removed)
    expect(live.map((m) => m.lngLat)).toEqual([[103.8, 1.35]])
  })

  it('12: projection toggle flips label and the live map projection', async () => {
    const { fixture, host, cmp } = render({ projection: 'mercator' })
    const { map } = fakeMap()
    await cmp.onMapCreated(map as any)
    const btn = host.querySelector('button')!
    expect(btn.textContent!.trim()).toBe('mercator')
    btn.click()
    fixture.detectChanges()
    expect(btn.textContent!.trim()).toBe('globe')
    expect(map.setProjection).toHaveBeenCalledWith('globe')
  })

  it('13: same Tailwind classes as React for toggle, pin and hover card', () => {
    for (const cls of [
      'border-border/70 bg-card/85 absolute top-3 right-3 z-10 flex items-center gap-1 rounded-lg border p-1 shadow-xs backdrop-blur-md',
      'text-muted-foreground hover:bg-muted hover:text-foreground flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition',
      'relative flex size-6 items-center justify-center',
      'ring-background relative inline-flex size-2.5 rounded-full shadow-xs ring-2',
      'border-border/80 bg-card/95 animate-in fade-in slide-in-from-bottom-2 absolute bottom-3 left-3 z-10 max-w-xs rounded-xl border p-3 shadow-lg backdrop-blur-md duration-150',
      'border-border/60 mt-2 flex items-baseline justify-between border-t pt-1.5 font-mono text-xs',
    ]) {
      expect(reactSource).toContain(cls)
      expect(source).toContain(cls)
    }
    expect(source).toContain('changeDetection: ChangeDetectionStrategy.Eager')
    expect(source).not.toMatch(/from 'echarts/)
  })
})

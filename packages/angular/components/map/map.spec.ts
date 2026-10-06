// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  MAP_CSS,
  UiMapComponent,
  UiMapLayerComponent,
  UiMapMarkerComponent,
  UiMapPopupComponent,
  UiMapSourceComponent,
  ensureMapboxCss,
} from './map.component'
import * as barrel from './index'
import { create } from '../../test-utils/inject'
import { DOCUMENT } from '@angular/core'

// jsdom has no WebGL: a fake mapbox-gl records the Map, the Markers and the Popups the components create.
const created = vi.hoisted(() => ({
  maps: [] as { container: HTMLElement }[],
  markers: [] as { el: HTMLElement; anchor?: string; lngLat?: [number, number]; addedTo?: unknown; removed: boolean }[],
  popups: [] as {
    options?: Record<string, unknown>
    el?: HTMLElement
    lngLat?: [number, number]
    addedTo?: unknown
    removed: boolean
    closeHandlers: (() => void)[]
  }[],
}))
vi.mock('mapbox-gl', () => {
  class Map {
    container: HTMLElement
    constructor(opts: { container: HTMLElement }) {
      this.container = opts.container
      created.maps.push(this)
    }
    resize() {}
    setProjection() {}
    addControl() {}
    removeControl() {}
    isStyleLoaded() {
      return false
    }
    once() {}
    on() {}
    remove() {}
  }
  class NavigationControl {}
  class FullscreenControl {}
  class Marker {
    rec: (typeof created.markers)[number]
    constructor(opts: { element: HTMLElement; anchor?: string }) {
      this.rec = { el: opts.element, anchor: opts.anchor, removed: false }
      created.markers.push(this.rec)
    }
    setLngLat(ll: [number, number]) {
      this.rec.lngLat = ll
      return this
    }
    addTo(map: unknown) {
      this.rec.addedTo = map
      return this
    }
    remove() {
      this.rec.removed = true
    }
  }
  class Popup {
    rec: (typeof created.popups)[number]
    constructor(opts: Record<string, unknown>) {
      this.rec = { options: opts, removed: false, closeHandlers: [] }
      created.popups.push(this.rec)
    }
    setLngLat(ll: [number, number]) {
      this.rec.lngLat = ll
      return this
    }
    setDOMContent(el: HTMLElement) {
      this.rec.el = el
      return this
    }
    addTo(map: unknown) {
      this.rec.addedTo = map
      return this
    }
    on(ev: string, cb: () => void) {
      if (ev === 'close') this.rec.closeHandlers.push(cb)
      return this
    }
    remove() {
      this.rec.removed = true
    }
  }
  return { default: { version: '3.31.0', Map, NavigationControl, FullscreenControl, Marker, Popup } }
})
import { MAPBOX_STYLES } from './map.variants'

const here = dirname(fileURLToPath(import.meta.url))
const shared = readFileSync(resolve(here, '../../../shared/variants/map.variants.ts'), 'utf8')
const vueSrc = readFileSync(resolve(here, '../../../registry-vue/components/map/map.variants.ts'), 'utf8')
const angularSrc = readFileSync(resolve(here, './map.variants.ts'), 'utf8')
const componentSrc = readFileSync(resolve(here, './map.component.ts'), 'utf8')

const newMap = () => TestBed.runInInjectionContext(() => new UiMapComponent())

function stripComments(s: string): string {
  return s.replace(/\/\/.*$/gm, '')
}

describe('Map (angular parity, 10 checks)', () => {
  it('1: variants file is byte-identical to shared canonical', () => {
    expect(stripComments(angularSrc)).toBe(stripComments(shared))
  })
  it('2: variants file matches Vue registry copy', () => {
    expect(stripComments(angularSrc)).toBe(stripComments(vueSrc))
  })
  it('3: components are standalone', () => {
    expect(componentSrc.match(/standalone: true/g)?.length).toBeGreaterThanOrEqual(3)
  })
  it('4: defaults are center=[0,20] zoom=1.4 variant=default', () => {
    const c = newMap()
    expect(c.center).toEqual([0, 20])
    expect(c.zoom).toBe(1.4)
    expect(c.variant).toBe('default')
  })
  it('5: host class contains base relative + bg-muted', () => {
    const c = newMap()
    expect(c.hostClass).toContain('relative')
    expect(c.hostClass).toContain('bg-muted')
  })
  it('6: streets variant resolves to MAPBOX_STYLES preset', () => {
    const c = newMap()
    c.variant = 'streets'
    expect(c.resolveStyle()).toBe(MAPBOX_STYLES.streets)
  })
  it('7: explicit style/mapStyle input wins over variant', () => {
    const c = newMap()
    c.variant = 'streets'
    c.mapStyle = 'mapbox://styles/mapbox/dark-v11'
    expect(c.resolveStyle()).toBe('mapbox://styles/mapbox/dark-v11')
    c.mapStyle = undefined
    c.style = 'custom://style'
    expect(c.resolveStyle()).toBe('custom://style')
  })
  it('8: source + layer helpers build mapbox configs', () => {
    const s = new UiMapSourceComponent()
    s.id = 'places'
    s.data = { type: 'FeatureCollection', features: [] }
    expect(s.getSourceOptions()).toMatchObject({ type: 'geojson' })
    const l = new UiMapLayerComponent()
    l.id = 'places-fill'
    l.type = 'fill'
    l.source = 'places'
    expect(l.getLayerConfig()).toMatchObject({ id: 'places-fill', type: 'fill', source: 'places' })
  })
  it('9: custom class merges via cn()', () => {
    const c = newMap()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
  })
  it('10: data-slot map contract + mapbox-gl retained', () => {
    expect(componentSrc).toContain('data-slot')
    expect(componentSrc).toContain('"map"')
    expect(componentSrc).toContain('mapbox-gl')
  })
})

const reactCss = readFileSync(resolve(here, '../../../registry-react/components/map/map.css'), 'utf8')
const angularCss = readFileSync(resolve(here, './map.css'), 'utf8')
const reactTsx = readFileSync(resolve(here, '../../../registry-react/components/map/map.tsx'), 'utf8')
const registrySrc = readFileSync(resolve(here, './map.registry.ts'), 'utf8')
const norm = (css: string) =>
  css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .trim()
const flush = () => new Promise((r) => setTimeout(r, 0))

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true,
  imports: [UiMapComponent],
  template: `<ui-map [accessToken]="token()" />`,
})
class TokenHost {
  token = signal('')
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true,
  imports: [UiMapComponent, UiMapMarkerComponent],
  template: `
    <ui-map accessToken="pk.test">
      <ui-map-marker [lngLat]="[-98.5, 39.8]" anchor="bottom"><button type="button">NA-ENT</button></ui-map-marker>
    </ui-map>
  `,
})
class MarkerHost {}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true,
  imports: [UiMapComponent, UiMapPopupComponent],
  template: `
    <ui-map accessToken="pk.test">
      @if (show) {
        <ui-map-popup
          [lngLat]="[-73.985, 40.748]"
          [offset]="[0, -32]"
          className="pop-card"
          (close)="closed = closed + 1"
        >
          <div class="pop-title">Global Operations HQ</div>
        </ui-map-popup>
      }
    </ui-map>
  `,
})
class PopupHost {
  show = true
  closed = 0
}

describe('Map (angular regressions vs React)', () => {
  beforeEach(() => {
    created.maps.length = 0
    created.markers.length = 0
    created.popups.length = 0
    document.head.querySelectorAll('style[data-uipkge-map], link[data-uipkge-mapbox]').forEach((n) => n.remove())
  })

  // Bug 1 — without Mapbox's stylesheet and the design-system chrome, markers are position:static
  // under the canvas and the controls are unstyled. React/Vue import both.
  it('ships map.css verbatim from React and lists it in the registry item', () => {
    expect(angularCss).toBe(reactCss)
    expect(registrySrc).toContain("path: 'map.css'")
    expect(norm(MAP_CSS)).toBe(norm(reactCss))
    expect(reactTsx).toContain("import './map.css'")
  })

  it('a rendered map puts the design-system map chrome into <head> once', () => {
    TestBed.createComponent(TokenHost).detectChanges()
    TestBed.createComponent(TokenHost).detectChanges()
    const styles = document.head.querySelectorAll('style[data-uipkge-map]')
    expect(styles).toHaveLength(1)
    expect(styles[0]!.textContent).toContain('.mapboxgl-ctrl-group')
  })

  it("links Mapbox GL's stylesheet for the installed version when the map is created", async () => {
    const f = TestBed.createComponent(MarkerHost)
    f.detectChanges()
    await flush()
    const link = document.head.querySelector<HTMLLinkElement>('link[data-uipkge-mapbox]')
    expect(link?.href).toBe('https://api.mapbox.com/mapbox-gl-js/v3.31.0/mapbox-gl.css')
  })

  it("does not add the CDN link when Mapbox GL's stylesheet is already on the page", () => {
    const own = document.createElement('style')
    own.textContent = '.mapboxgl-marker { position: absolute; }'
    document.head.appendChild(own)
    ensureMapboxCss(document, '3.31.0')
    own.remove()
    expect(document.head.querySelector('link[data-uipkge-mapbox]')).toBeNull()
  })

  // Bug 2 — the placeholder rendered after a full-size map div and was clipped out of view.
  it('without a token renders ONLY the React placeholder (no map element before it)', () => {
    const f = TestBed.createComponent(TokenHost)
    f.detectChanges()
    const host = f.nativeElement.querySelector('[data-slot="map"]') as HTMLElement
    expect(host.children).toHaveLength(1)
    const placeholder = host.firstElementChild as HTMLElement
    expect(placeholder.className).toBe(
      'text-muted-foreground flex size-full flex-col items-center justify-center gap-1 px-6 text-center text-sm',
    )
    expect(placeholder.textContent).toContain('Mapbox token required')
    expect(placeholder.textContent).toContain('Pass an access token to render the map.')
  })

  it('with a token renders the map element and no placeholder; a late token creates the map', async () => {
    const f = TestBed.createComponent(TokenHost)
    f.detectChanges()
    await flush()
    expect(created.maps).toHaveLength(0)
    f.componentInstance.token.set('pk.test')
    f.detectChanges()
    await flush()
    const host = f.nativeElement.querySelector('[data-slot="map"]') as HTMLElement
    expect(host.textContent).not.toContain('Mapbox token required')
    expect(created.maps).toHaveLength(1)
    expect(created.maps[0]!.container.className).toBe('size-full')
  })

  // Bug 3 — no marker component: React/Vue export MapMarker (lngLat + anchor, HTML children).
  it('exports UiMapMarkerComponent (ui-map-marker) from the barrel', () => {
    expect(barrel.UiMapMarkerComponent).toBe(UiMapMarkerComponent)
  })

  it('ui-map-marker hands its projected content to a mapbox Marker at lngLat with the anchor', async () => {
    const f = TestBed.createComponent(MarkerHost)
    f.detectChanges()
    await flush()
    await flush()
    expect(created.markers).toHaveLength(1)
    const m = created.markers[0]!
    expect(m.lngLat).toEqual([-98.5, 39.8])
    expect(m.anchor).toBe('bottom')
    expect(m.addedTo).toBe(created.maps[0])
    expect(m.el.querySelector('button')?.textContent).toBe('NA-ENT')
    f.destroy()
    expect(m.removed).toBe(true)
  })

  // Bug 4 — no popup component: React/Vue export MapPopup (lngLat + offset + onClose, HTML children).
  it('exports UiMapPopupComponent (ui-map-popup) from the barrel', () => {
    expect(barrel.UiMapPopupComponent).toBe(UiMapPopupComponent)
  })

  it('popup buildOptions maps inputs and strips undefined', () => {
    const p = create(UiMapPopupComponent, [{ provide: DOCUMENT, useValue: document }])
    p.offset = [0, -32]
    p.className = 'pop-card'
    expect(p.buildOptions()).toMatchObject({ offset: [0, -32], className: 'pop-card' })
    expect('anchor' in p.buildOptions()).toBe(false)
  })

  it('ui-map-popup hands its projected content to a mapbox Popup, emits close, removes on destroy', async () => {
    const f = TestBed.createComponent(PopupHost)
    f.detectChanges()
    await flush()
    await flush()
    expect(created.popups).toHaveLength(1)
    const p = created.popups[0]!
    expect(p.lngLat).toEqual([-73.985, 40.748])
    expect(p.options).toMatchObject({ offset: [0, -32], className: 'pop-card' })
    expect(p.addedTo).toBe(created.maps[0])
    expect(p.el!.querySelector('.pop-title')?.textContent).toBe('Global Operations HQ')
    p.closeHandlers[0]!()
    expect(f.componentInstance.closed).toBe(1)
    f.componentInstance.show = false
    f.detectChanges()
    await flush()
    expect(p.removed).toBe(true)
    f.destroy()
  })
})

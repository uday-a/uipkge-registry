import { Component, Input, ViewChild } from '@angular/core'
import {
  UiLeafletCircleComponent,
  UiLeafletCircleMarkerComponent,
  UiLeafletGeoJsonComponent,
  UiLeafletMapComponent,
  UiLeafletMarkerComponent,
  UiLeafletPolygonComponent,
  UiLeafletPolylineComponent,
  UiLeafletPopupComponent,
  UiLeafletTileLayerComponent,
  UiLeafletTooltipComponent,
  type LeafletMapVariant,
} from '../../../../../packages/registry-angular/components/leaflet-map/leaflet-map.component'

/** Angular demo for the leaflet-map page. Mirrors demos/react/leaflet-map.tsx story by story. */
@Component({
  selector: 'angular-leaflet-map-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    UiLeafletCircleComponent,
    UiLeafletCircleMarkerComponent,
    UiLeafletGeoJsonComponent,
    UiLeafletMapComponent,
    UiLeafletMarkerComponent,
    UiLeafletPolygonComponent,
    UiLeafletPolylineComponent,
    UiLeafletPopupComponent,
    UiLeafletTileLayerComponent,
    UiLeafletTooltipComponent,
  ],
  template: `
    @switch (story) {
      @case ('Basemap Variants') {
        <div class="space-y-3">
          <div class="flex flex-wrap gap-1.5">
            @for (v of leafletVariants; track v.id) {
              <button
                type="button"
                [title]="v.desc"
                [class]="
                  'rounded-md border px-2.5 py-1 font-mono text-xs transition-colors ' +
                  (leafletVariant === v.id
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-card text-muted-foreground hover:text-foreground')
                "
                (click)="leafletVariant = v.id"
              >
                {{ v.label }}
              </button>
            }
          </div>
          <ui-leaflet-map
            [variant]="leafletVariant"
            [center]="defaultCenter"
            [zoom]="12"
            class="h-96 w-full rounded-lg border"
          />
        </div>
      }
      @case ('Markers & Popups') {
        <ui-leaflet-map variant="light" [center]="markersCenter" [zoom]="13.5" class="h-96 w-full rounded-lg border">
          @for (m of landmarks; track m.id) {
            <ui-leaflet-marker [lngLat]="m.lngLat" anchor="bottom">
              <div class="group flex cursor-pointer flex-col items-center">
                <span
                  class="bg-primary ring-primary/25 size-3.5 rounded-full ring-4 transition-transform group-hover:scale-110"
                ></span>
                <span
                  class="border-border bg-background/95 mt-1 rounded border px-1.5 py-0.5 font-mono text-xs font-bold shadow-xs"
                >
                  {{ m.name }}
                </span>
              </div>
              <ui-leaflet-popup [offset]="popupOffset" class="space-y-1 text-xs">
                <div class="text-foreground font-bold">{{ m.name }}</div>
                <div class="text-muted-foreground">{{ m.detail }}</div>
                <div class="font-mono text-xs font-medium text-emerald-500">{{ m.status }}</div>
              </ui-leaflet-popup>
            </ui-leaflet-marker>
          }
        </ui-leaflet-map>
      }
      @case ('Tooltips') {
        <ui-leaflet-map [center]="tooltipCenter" [zoom]="12.5" class="h-96 w-full rounded-lg border">
          <ui-leaflet-circle-marker
            [center]="empireState"
            [radius]="10"
            color="#3b82f6"
            [fill]="true"
            fillColor="#3b82f6"
            [fillOpacity]="0.9"
          >
            <ui-leaflet-tooltip direction="top" [offset]="[0, -12]">
              <span class="font-mono text-xs font-bold">Empire State — 1,250 ft</span>
            </ui-leaflet-tooltip>
          </ui-leaflet-circle-marker>
          <ui-leaflet-circle-marker
            [center]="eastVillage"
            [radius]="10"
            color="#f59e0b"
            [fill]="true"
            fillColor="#f59e0b"
            [fillOpacity]="0.9"
          >
            <ui-leaflet-tooltip direction="top" [offset]="[0, -12]">
              <span class="font-mono text-xs font-bold">East Village Hub</span>
            </ui-leaflet-tooltip>
          </ui-leaflet-circle-marker>
        </ui-leaflet-map>
      }
      @case ('Route Layer') {
        <ui-leaflet-map variant="streets" [center]="routeCenter" [zoom]="13" class="h-96 w-full rounded-lg border">
          <ui-leaflet-polyline [lngLatPath]="routePath" color="#0f172a" [weight]="7" [opacity]="0.35" />
          <ui-leaflet-polyline [lngLatPath]="routePath" color="#3b82f6" [weight]="4" [opacity]="1" dashArray="1 0" />
          @for (w of routeWaypoints; track w.name) {
            <ui-leaflet-marker [lngLat]="w.lngLat" anchor="bottom">
              <div class="flex flex-col items-center">
                <span class="border-background size-3 rounded-full border-2 bg-blue-600 shadow"></span>
                <span
                  class="border-border bg-background/95 mt-1 rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold shadow-xs"
                >
                  {{ w.name }}
                </span>
              </div>
            </ui-leaflet-marker>
          }
        </ui-leaflet-map>
      }
      @case ('GeoJSON Zones') {
        <div class="space-y-3">
          <div class="flex gap-1.5">
            <button
              type="button"
              class="border-border bg-card text-foreground hover:bg-muted rounded-md border px-2.5 py-1 font-mono text-xs transition-colors"
              (click)="fitZones()"
            >
              Fit zones
            </button>
            <button
              type="button"
              class="border-border bg-card text-foreground hover:bg-muted rounded-md border px-2.5 py-1 font-mono text-xs transition-colors"
              (click)="resetGeoView()"
            >
              Reset view
            </button>
          </div>
          <ui-leaflet-map
            #geoMap
            variant="muted"
            [center]="geoCenter"
            [zoom]="13"
            class="h-96 w-full rounded-lg border"
          >
            <ui-leaflet-geojson [geojson]="zones" [options]="zoneOptions" />
          </ui-leaflet-map>
        </div>
      }
      @case ('Circles & Radii') {
        <ui-leaflet-map variant="outdoors" [center]="yosemite" [zoom]="11" class="h-96 w-full rounded-lg border">
          <ui-leaflet-circle
            [center]="yosemite"
            [radius]="9000"
            color="#f59e0b"
            [weight]="2"
            [fill]="true"
            fillColor="#f59e0b"
            [fillOpacity]="0.12"
          />
          <ui-leaflet-circle
            [center]="yosemite"
            [radius]="4500"
            color="#f59e0b"
            [weight]="2"
            [fill]="true"
            fillColor="#f59e0b"
            [fillOpacity]="0.2"
            dashArray="6 4"
          />
          <ui-leaflet-marker [lngLat]="yosemite" anchor="bottom">
            <div class="flex flex-col items-center">
              <span class="border-background size-3 rounded-full border-2 bg-amber-500 shadow"></span>
              <span
                class="border-border bg-background/95 mt-1 rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold shadow-xs"
                >Yosemite Gate</span
              >
            </div>
          </ui-leaflet-marker>
        </ui-leaflet-map>
      }
      @case ('Custom Tile Layer') {
        <ui-leaflet-map variant="satellite" [center]="goldenGate" [zoom]="13" class="h-96 w-full rounded-lg border">
          <ui-leaflet-tile-layer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
            [opacity]="0.9"
          />
          <ui-leaflet-marker [lngLat]="goldenGate" anchor="bottom">
            <div class="flex flex-col items-center">
              <span class="border-background size-3 rounded-full border-2 bg-white shadow"></span>
              <span
                class="mt-1 rounded border border-white/20 bg-black/70 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-white shadow-xs"
                >Golden Gate</span
              >
            </div>
          </ui-leaflet-marker>
        </ui-leaflet-map>
      }
      @case ('World View — Compact') {
        <ui-leaflet-map
          [center]="worldCenter"
          [zoom]="1.4"
          [minZoom]="1.2"
          [navigation]="false"
          [scrollWheelZoom]="false"
          size="sm"
          class="rounded-lg border"
        />
      }
      @case ('Polygon Boundary') {
        <ui-leaflet-map variant="navigation-day" [center]="rotterdam" [zoom]="11" class="h-96 w-full rounded-lg border">
          <ui-leaflet-polygon
            [lngLatPath]="rotterdamRing"
            color="#e11d48"
            [weight]="2"
            dashArray="8 6"
            [fill]="true"
            fillColor="#e11d48"
            [fillOpacity]="0.08"
          />
          <ui-leaflet-marker [lngLat]="rotterdam" anchor="center">
            <span
              class="border-border bg-card text-foreground rounded-md border px-2 py-1 font-mono text-[10px] font-bold shadow-xs"
              >PORT OF ROTTERDAM</span
            >
          </ui-leaflet-marker>
        </ui-leaflet-map>
      }
      @default {
        <ui-leaflet-map [center]="defaultCenter" [zoom]="12.5" class="h-96 w-full rounded-lg border" />
      }
    }
  `,
})
export class AngularLeafletMapDemoComponent {
  @Input() story = 'Default — theme-aware'

  protected leafletVariant: LeafletMapVariant = 'default'

  protected readonly leafletVariants: { id: LeafletMapVariant; label: string; desc: string }[] = [
    { id: 'default', label: 'Default', desc: 'Theme-aware Esri light/dark' },
    { id: 'streets', label: 'Streets', desc: 'OpenStreetMap Standard tiles' },
    { id: 'light', label: 'Light', desc: 'Esri Light Gray — clean editorial canvas' },
    { id: 'dark', label: 'Dark', desc: 'Esri Dark Gray — dashboard canvas' },
    { id: 'muted', label: 'Muted', desc: 'Theme-aware + desaturated tile pane' },
    { id: 'outdoors', label: 'Outdoors', desc: 'OpenTopoMap contours & trails' },
    { id: 'satellite-streets', label: 'Satellite Hybrid', desc: 'Esri imagery + label overlay' },
    { id: 'satellite', label: 'Satellite', desc: 'Esri World Imagery, no labels' },
    { id: 'navigation-day', label: 'Nav Day', desc: 'Esri Street Map high contrast' },
    { id: 'navigation-night', label: 'Nav Night', desc: 'Esri dark canvas HUD' },
  ]

  protected readonly defaultCenter: [number, number] = [-73.985, 40.748]
  protected readonly markersCenter: [number, number] = [-73.975, 40.755]
  protected readonly routeCenter: [number, number] = [-73.985, 40.745]
  protected readonly yosemite: [number, number] = [-119.5383, 37.8651]
  protected readonly goldenGate: [number, number] = [-122.478, 37.819]
  protected readonly rotterdam: [number, number] = [4.4, 51.9]
  protected readonly worldCenter: [number, number] = [15, 20]
  protected readonly popupOffset: [number, number] = [0, -38]
  protected readonly tooltipCenter: [number, number] = [-73.985, 40.748]
  protected readonly empireState: [number, number] = [-73.985, 40.748]
  protected readonly eastVillage: [number, number] = [-73.95, 40.73]
  protected readonly geoCenter: [number, number] = [-73.99, 40.735]

  protected readonly zones: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { name: 'Zone A — Midtown', quota: '92%' },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-74.01, 40.735],
              [-73.975, 40.735],
              [-73.975, 40.765],
              [-74.01, 40.765],
              [-74.01, 40.735],
            ],
          ],
        },
      },
      {
        type: 'Feature',
        properties: { name: 'Zone B — FiDi', quota: '71%' },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-74.02, 40.7],
              [-73.99, 40.7],
              [-73.99, 40.722],
              [-74.02, 40.722],
              [-74.02, 40.7],
            ],
          ],
        },
      },
    ],
  }

  protected readonly zoneOptions = {
    style: (f?: { properties?: { quota?: string } }) => ({
      color: '#2563eb',
      weight: 2,
      fillColor: '#3b82f6',
      fillOpacity: f?.properties?.quota === '92%' ? 0.3 : 0.15,
    }),
  }

  @ViewChild('geoMap', { read: UiLeafletMapComponent }) protected geoMap?: UiLeafletMapComponent

  protected fitZones(): void {
    this.geoMap?.fitBounds([
      [-74.03, 40.69],
      [-73.95, 40.78],
    ])
  }

  protected resetGeoView(): void {
    this.geoMap?.flyTo({ center: [-73.99, 40.735], zoom: 13, duration: 700 })
  }

  protected readonly landmarks: {
    id: string
    name: string
    detail: string
    status: string
    lngLat: [number, number]
  }[] = [
    {
      id: 'hq',
      name: 'Global Operations HQ',
      detail: '350 5th Ave, New York',
      status: 'Active · 1,420 staff',
      lngLat: [-73.985, 40.748],
    },
    {
      id: 'depot',
      name: 'East River Depot',
      detail: '12 W 34th St, New York',
      status: 'Active · 24 bays',
      lngLat: [-73.961, 40.763],
    },
  ]

  protected readonly routePath: [number, number][] = [
    [-74.006, 40.7128],
    [-73.977, 40.7312],
    [-73.985, 40.7484],
    [-73.968, 40.7614],
    [-73.9776, 40.7736],
  ]

  protected readonly routeWaypoints: { name: string; lngLat: [number, number] }[] = [
    { name: 'Pickup · SoHo', lngLat: [-74.006, 40.7128] },
    { name: 'Drop-off · UWS', lngLat: [-73.9776, 40.7736] },
  ]

  protected readonly rotterdamRing: [number, number][] = [
    [4.28, 51.82],
    [4.55, 51.82],
    [4.55, 51.98],
    [4.28, 51.98],
    [4.28, 51.82],
  ]
}

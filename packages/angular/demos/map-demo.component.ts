import { Component, Input } from '@angular/core'
import {
  UiMapComponent,
  UiMapMarkerComponent,
  UiMapPopupComponent,
  type MapLayerInput,
  type MapSourceInput,
} from '../../../../../packages/registry-angular/components/map/map.component'

const token: string = (import.meta.env['PUBLIC_MAPBOX_TOKEN'] as string | undefined) ?? ''

/**
 * Angular demo for the map page. Mirrors demos/react/map.tsx story by story, folding the key
 * single-variant demos (map-light, map-dark, map-marker-popups, map-muted) in as stories.
 * Without a Mapbox token the map renders its built-in "token required" placeholder.
 */
@Component({
  selector: 'angular-map-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiMapComponent, UiMapMarkerComponent, UiMapPopupComponent],
  template: `
    @switch (story) {
      @case ('Light') {
        <ui-map
          [accessToken]="token"
          variant="light"
          [center]="paris"
          [zoom]="12.5"
          class="h-96 w-full rounded-lg border"
        >
          <ui-map-marker [lngLat]="paris" anchor="bottom">
            <div class="flex flex-col items-center">
              <span class="bg-primary ring-primary/20 size-3 rounded-full ring-4"></span>
              <span
                class="border-border bg-background/90 mt-1 rounded border px-1.5 py-0.5 font-mono text-xs font-semibold shadow-xs"
              >
                Paris Central District
              </span>
            </div>
          </ui-map-marker>
        </ui-map>
      }
      @case ('Dark') {
        <ui-map
          [accessToken]="token"
          variant="dark"
          [center]="manhattan"
          [zoom]="12"
          class="h-96 w-full rounded-lg border"
        >
          <ui-map-marker [lngLat]="manhattan" anchor="bottom">
            <div class="flex flex-col items-center">
              <span class="bg-primary ring-primary/20 size-3 rounded-full ring-4"></span>
              <span
                class="border-border bg-background/90 mt-1 rounded border px-1.5 py-0.5 font-mono text-xs font-semibold shadow-xs"
              >
                Manhattan Night Grid
              </span>
            </div>
          </ui-map-marker>
        </ui-map>
      }
      @case ('With Markers') {
        <ui-map [accessToken]="token" [center]="world" [zoom]="1.6" class="h-96 w-full rounded-lg border">
          @for (hub of worldHubs; track hub.name) {
            <ui-map-marker [lngLat]="hub.coords" anchor="bottom">
              <div class="flex flex-col items-center">
                <span
                  class="size-2.5 animate-pulse rounded-full bg-emerald-500 shadow-sm ring-4 ring-emerald-500/25"
                ></span>
                <span
                  class="border-border bg-background/90 mt-1 rounded border px-1.5 py-0.5 font-mono text-xs font-bold shadow-xs"
                >
                  {{ hub.name }}
                </span>
              </div>
            </ui-map-marker>
          }
        </ui-map>
      }
      @case ('Marker Popups') {
        <ui-map
          [accessToken]="token"
          variant="light"
          [center]="hq"
          [zoom]="13.5"
          class="h-96 w-full rounded-lg border"
        >
          <ui-map-marker [lngLat]="hq" anchor="bottom">
            <div class="group flex cursor-pointer flex-col items-center" (click)="activeMarker = 'hq'">
              <span
                class="bg-primary ring-primary/25 size-3.5 rounded-full ring-4 transition-transform group-hover:scale-110"
              ></span>
              <span
                class="border-border bg-background/95 mt-1 rounded border px-1.5 py-0.5 font-mono text-xs font-bold shadow-xs"
              >
                Headquarters
              </span>
            </div>
          </ui-map-marker>
          @if (activeMarker === 'hq') {
            <ui-map-popup
              [lngLat]="hq"
              [offset]="[0, -32]"
              className="border-border bg-popover space-y-1 rounded-lg border p-3 text-xs shadow-md"
              (close)="activeMarker = null"
            >
              <div class="text-foreground font-bold">Global Operations HQ</div>
              <div class="text-muted-foreground">350 5th Ave, New York, NY 10118</div>
              <div class="font-mono text-xs font-medium text-emerald-500">Status: Active • 1,420 Staff</div>
            </ui-map-popup>
          }
        </ui-map>
      }
      @case ('Muted Minimal') {
        <ui-map
          [accessToken]="token"
          variant="muted"
          [center]="berlin"
          [zoom]="12"
          class="h-96 w-full rounded-lg border"
        >
          <ui-map-marker [lngLat]="berlin" anchor="bottom">
            <div class="flex flex-col items-center">
              <span class="bg-primary ring-primary/20 size-3 rounded-full ring-4"></span>
              <span
                class="border-border bg-background/90 mt-1 rounded border px-1.5 py-0.5 font-mono text-xs font-semibold shadow-xs"
              >
                Berlin Hub
              </span>
            </div>
          </ui-map-marker>
        </ui-map>
      }
      @case ('Missing access token') {
        <ui-map accessToken="" class="h-80 w-full rounded-lg border" />
      }
      @case ('Controls off') {
        <ui-map
          [accessToken]="token"
          variant="light"
          [center]="parisCenter"
          [zoom]="11.5"
          [navigation]="false"
          [fullscreen]="false"
          class="h-64 w-full rounded-lg border"
        />
      }
      @case ('Sizes') {
        <div class="grid h-full min-h-[480px] grid-cols-1 gap-3 sm:grid-cols-2">
          <div class="flex min-h-0 flex-col gap-1">
            <p class="text-muted-foreground font-mono text-xs">sm</p>
            <div class="min-h-64 flex-1 overflow-hidden rounded-lg border">
              <ui-map
                [accessToken]="token"
                variant="light"
                [center]="london"
                [zoom]="10"
                size="full"
                class="size-full"
              />
            </div>
          </div>
          <div class="flex min-h-0 flex-col gap-1">
            <p class="text-muted-foreground font-mono text-xs">lg</p>
            <div class="min-h-64 flex-1 overflow-hidden rounded-lg border">
              <ui-map
                [accessToken]="token"
                variant="streets"
                [center]="nyc"
                [zoom]="11"
                size="full"
                class="size-full"
              />
            </div>
          </div>
        </div>
      }
      @case ('Declarative source and layer') {
        <ui-map
          [accessToken]="token"
          variant="light"
          [center]="sf"
          [zoom]="12"
          [sources]="routeSources"
          [layers]="routeLayers"
          class="h-80 w-full rounded-lg border"
        >
          <ui-map-marker [lngLat]="deliveryOrigin" anchor="bottom">
            <span class="bg-primary ring-background size-2.5 rounded-full ring-2"></span>
          </ui-map-marker>
          <ui-map-marker [lngLat]="deliveryDest" anchor="bottom">
            <span class="bg-foreground ring-background size-2.5 rounded-full ring-2"></span>
          </ui-map-marker>
        </ui-map>
      }
      @default {
        <ui-map [accessToken]="token" [center]="manhattanLower" [zoom]="11" class="h-80 w-full rounded-lg border">
          <ui-map-marker [lngLat]="manhattanLower" anchor="bottom">
            <span class="bg-primary ring-background size-3 rounded-full ring-2"></span>
          </ui-map-marker>
        </ui-map>
      }
    }
  `,
})
export class AngularMapDemoComponent {
  @Input() story = 'Default'

  protected readonly token = token

  protected readonly nyc: [number, number] = [-73.985, 40.748]
  protected readonly manhattan: [number, number] = [-74.006, 40.7128]
  protected readonly manhattanLower: [number, number] = [-74.006, 40.713]
  protected readonly paris: [number, number] = [2.3522, 48.8566]
  protected readonly parisCenter: [number, number] = [2.352, 48.857]
  protected readonly london: [number, number] = [-0.128, 51.507]
  protected readonly berlin: [number, number] = [13.405, 52.52]
  protected readonly world: [number, number] = [15, 20]
  protected readonly sf: [number, number] = [-122.4, 37.78]
  protected readonly deliveryOrigin: [number, number] = [-122.414, 37.788]
  protected readonly deliveryDest: [number, number] = [-122.392, 37.776]
  protected readonly hq: [number, number] = [-73.985, 40.748]
  protected activeMarker: string | null = 'hq'

  protected readonly worldHubs: { name: string; coords: [number, number] }[] = [
    { name: 'New York (JFK)', coords: [-74.006, 40.713] },
    { name: 'London (LHR)', coords: [-0.128, 51.507] },
    { name: 'Tokyo (HND)', coords: [139.692, 35.689] },
    { name: 'Singapore (SIN)', coords: [103.852, 1.29] },
    { name: 'Sydney (SYD)', coords: [151.209, -33.868] },
  ]

  protected readonly routeSources: MapSourceInput[] = [
    {
      id: 'demo-route',
      options: {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [
              [-122.414, 37.788],
              [-122.411, 37.785],
              [-122.407, 37.784],
              [-122.402, 37.782],
              [-122.397, 37.779],
              [-122.392, 37.776],
            ],
          },
        },
      },
    },
  ]

  protected readonly routeLayers: MapLayerInput[] = [
    {
      id: 'demo-route-line',
      options: {
        type: 'line',
        source: 'demo-route',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': '#18181b', 'line-width': 3.5 },
      },
    },
  ]
}

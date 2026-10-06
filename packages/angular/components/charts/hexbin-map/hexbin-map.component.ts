import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'
import { cn } from '@/lib/utils'
import { UiMapComponent, UiMapMarkerComponent } from '@/ui/map/map.component'

export interface HexState {
  id: string
  name: string
  col: number
  row: number
}

export interface HexbinDatum {
  value: number
  /** Display-only status label (rendered uppercase). React/Vue declare a narrow union, but their
   * own demos use domain statuses ('optimal', 'normal', ...), so this port accepts any string. */
  status?: string
  description?: string
  color?: string
}

export type HexbinShape = 'hexagon' | 'square'
export type HexbinPreset = 'us-states' | 'world-regions'

export const US_HEX_STATES: HexState[] = [
  { id: 'AK', name: 'Alaska', col: 0, row: 0 },
  { id: 'ME', name: 'Maine', col: 11, row: 0 },
  { id: 'WA', name: 'Washington', col: 1, row: 1 },
  { id: 'ID', name: 'Idaho', col: 2, row: 1 },
  { id: 'MT', name: 'Montana', col: 3, row: 1 },
  { id: 'ND', name: 'North Dakota', col: 4, row: 1 },
  { id: 'MN', name: 'Minnesota', col: 5, row: 1 },
  { id: 'IL', name: 'Illinois', col: 6, row: 1 },
  { id: 'WI', name: 'Wisconsin', col: 7, row: 1 },
  { id: 'MI', name: 'Michigan', col: 8, row: 1 },
  { id: 'NY', name: 'New York', col: 9, row: 1 },
  { id: 'VT', name: 'Vermont', col: 10, row: 1 },
  { id: 'NH', name: 'New Hampshire', col: 11, row: 1 },
  { id: 'OR', name: 'Oregon', col: 1, row: 2 },
  { id: 'NV', name: 'Nevada', col: 2, row: 2 },
  { id: 'WY', name: 'Wyoming', col: 3, row: 2 },
  { id: 'SD', name: 'South Dakota', col: 4, row: 2 },
  { id: 'IA', name: 'Iowa', col: 5, row: 2 },
  { id: 'IN', name: 'Indiana', col: 6, row: 2 },
  { id: 'OH', name: 'Ohio', col: 7, row: 2 },
  { id: 'PA', name: 'Pennsylvania', col: 8, row: 2 },
  { id: 'NJ', name: 'New Jersey', col: 9, row: 2 },
  { id: 'MA', name: 'Massachusetts', col: 10, row: 2 },
  { id: 'RI', name: 'Rhode Island', col: 11, row: 2 },
  { id: 'CA', name: 'California', col: 1, row: 3 },
  { id: 'UT', name: 'Utah', col: 2, row: 3 },
  { id: 'CO', name: 'Colorado', col: 3, row: 3 },
  { id: 'NE', name: 'Nebraska', col: 4, row: 3 },
  { id: 'MO', name: 'Missouri', col: 5, row: 3 },
  { id: 'KY', name: 'Kentucky', col: 6, row: 3 },
  { id: 'WV', name: 'West Virginia', col: 7, row: 3 },
  { id: 'VA', name: 'Virginia', col: 8, row: 3 },
  { id: 'MD', name: 'Maryland', col: 9, row: 3 },
  { id: 'DE', name: 'Delaware', col: 10, row: 3 },
  { id: 'AZ', name: 'Arizona', col: 2, row: 4 },
  { id: 'NM', name: 'New Mexico', col: 3, row: 4 },
  { id: 'KS', name: 'Kansas', col: 4, row: 4 },
  { id: 'AR', name: 'Arkansas', col: 5, row: 4 },
  { id: 'TN', name: 'Tennessee', col: 6, row: 4 },
  { id: 'NC', name: 'North Carolina', col: 7, row: 4 },
  { id: 'SC', name: 'South Carolina', col: 8, row: 4 },
  { id: 'DC', name: 'District of Columbia', col: 9, row: 4 },
  { id: 'CT', name: 'Connecticut', col: 10, row: 4 },
  { id: 'OK', name: 'Oklahoma', col: 4, row: 5 },
  { id: 'LA', name: 'Louisiana', col: 5, row: 5 },
  { id: 'MS', name: 'Mississippi', col: 6, row: 5 },
  { id: 'AL', name: 'Alabama', col: 7, row: 5 },
  { id: 'GA', name: 'Georgia', col: 8, row: 5 },
  { id: 'HI', name: 'Hawaii', col: 0, row: 6 },
  { id: 'TX', name: 'Texas', col: 4, row: 6 },
  { id: 'FL', name: 'Florida', col: 8, row: 6 },
]

export const WORLD_HEX_REGIONS: HexState[] = [
  { id: 'CA', name: 'Canada', col: 2, row: 0 },
  { id: 'GL', name: 'Greenland', col: 4, row: 0 },
  { id: 'NO', name: 'Nordics', col: 6, row: 0 },
  { id: 'US-W', name: 'US West', col: 1, row: 1 },
  { id: 'US-E', name: 'US East', col: 2, row: 1 },
  { id: 'UK', name: 'United Kingdom', col: 5, row: 1 },
  { id: 'EU-W', name: 'Western Europe', col: 6, row: 1 },
  { id: 'EU-E', name: 'Eastern Europe', col: 7, row: 1 },
  { id: 'RU', name: 'Northern Eurasia', col: 8, row: 1 },
  { id: 'MX', name: 'Mexico', col: 1, row: 2 },
  { id: 'MED', name: 'Mediterranean', col: 6, row: 2 },
  { id: 'ME', name: 'Middle East', col: 7, row: 2 },
  { id: 'CN', name: 'East Asia', col: 8, row: 2 },
  { id: 'JP', name: 'Japan', col: 9, row: 2 },
  { id: 'BR', name: 'Brazil', col: 2, row: 3 },
  { id: 'AF-N', name: 'North Africa', col: 5, row: 3 },
  { id: 'IN', name: 'South Asia', col: 7, row: 3 },
  { id: 'SEA', name: 'Southeast Asia', col: 8, row: 3 },
  { id: 'AR', name: 'South Cone', col: 2, row: 4 },
  { id: 'AF-S', name: 'Sub-Saharan', col: 5, row: 4 },
  { id: 'AU', name: 'Australia & Oceania', col: 8, row: 4 },
]

// Geographic coordinates mapping for placing Hexbins in space
const US_CENTROIDS: Record<string, [number, number]> = {
  AK: [-152.4, 64.2],
  ME: [-69.4, 45.3],
  WA: [-120.7, 47.7],
  ID: [-114.7, 44.1],
  MT: [-110.4, 46.9],
  ND: [-100.5, 47.5],
  MN: [-94.6, 46.7],
  IL: [-89.4, 40.6],
  WI: [-89.6, 43.8],
  MI: [-85.6, 44.3],
  NY: [-74.2, 43.3],
  VT: [-72.6, 44.6],
  NH: [-71.6, 43.2],
  OR: [-120.5, 43.8],
  NV: [-116.4, 38.8],
  WY: [-107.3, 43.1],
  SD: [-99.9, 44.3],
  IA: [-93.5, 42.0],
  IN: [-86.1, 40.3],
  OH: [-82.9, 40.4],
  PA: [-77.2, 41.2],
  NJ: [-74.4, 40.1],
  MA: [-71.4, 42.4],
  RI: [-71.5, 41.6],
  CA: [-119.4, 36.8],
  UT: [-111.1, 39.3],
  CO: [-105.8, 39.5],
  NE: [-99.9, 41.5],
  MO: [-91.8, 37.9],
  KY: [-84.3, 37.8],
  WV: [-80.4, 38.6],
  VA: [-78.7, 37.4],
  MD: [-76.6, 39.0],
  DE: [-75.5, 39.0],
  AZ: [-111.1, 34.0],
  NM: [-106.0, 34.5],
  KS: [-98.5, 38.5],
  AR: [-92.3, 34.8],
  TN: [-86.6, 35.5],
  NC: [-79.0, 35.8],
  SC: [-81.2, 33.8],
  DC: [-77.0, 38.9],
  CT: [-72.7, 41.6],
  OK: [-97.5, 35.0],
  LA: [-91.9, 30.9],
  MS: [-89.7, 32.4],
  AL: [-86.9, 32.3],
  GA: [-83.6, 32.2],
  HI: [-157.8, 21.3],
  TX: [-99.9, 31.9],
  FL: [-81.5, 27.6],
}

function defaultValueFormatter(v: number): string {
  return v.toLocaleString()
}

/**
 * Angular port of the UIPKGE HexbinMap (React/Vue parity): an interactive Mapbox hex
 * cartogram. Value-shaded hex markers at geographic centroids, click-to-select with a
 * detail card, a globe/mercator projection switcher, and a color-ramp legend.
 * `accessToken` is passed through to the inner map (React/Vue read it from env; Angular
 * needs it as an input).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-hexbin-map, [ui-hexbin-map]',
  standalone: true,
  imports: [UiMapComponent, UiMapMarkerComponent],
  host: {
    '[attr.data-slot]': '"hexbin-map"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
  },
  template: `
    <div [class]="bodyClass" [style.height]="heightStyle" [attr.aria-label]="ariaLabel">
      <ui-map
        variant="dark"
        [projection]="currentProjection"
        [center]="mapCenter"
        [zoom]="mapZoom"
        [accessToken]="accessToken"
        class="size-full"
      >
        @for (item of activeItems; track item.id) {
          <ui-map-marker [lngLat]="getCoords(item)" anchor="center">
            <button type="button" [class]="markerClass(item)" (click)="handleSelect(item)">
              <div
                class="absolute inset-0 flex items-center justify-center"
                [style.clip-path]="hexClipPath"
                [style.background-color]="getColor(data[item.id])"
                [style.border]="markerBorder(item)"
                [style.box-shadow]="markerShadow(item)"
              ></div>
              <div class="relative z-10 flex flex-col items-center justify-center text-center">
                @if (showLabels) {
                  <span class="text-[10px] font-bold text-white drop-shadow-sm">{{ item.id }}</span>
                }
                @if (showValues && data[item.id]) {
                  <span class="text-[8px] font-semibold text-white/90">{{ roundedValue(item) }}</span>
                }
              </div>
            </button>
          </ui-map-marker>
        }
      </ui-map>

      <div
        class="border-border/70 bg-card/85 absolute top-3 right-3 z-10 flex items-center gap-1 rounded-lg border p-1 shadow-xs backdrop-blur-md"
      >
        <button
          type="button"
          class="text-muted-foreground hover:bg-muted hover:text-foreground flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition"
          (click)="toggleProjection()"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-globe size-3.5"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
            <path d="M2 12h20" />
          </svg>
          <span class="capitalize">{{ currentProjection }}</span>
        </button>
      </div>

      @if (activeStateItem) {
        <div
          class="border-border/80 bg-card/95 animate-in fade-in slide-in-from-bottom-2 absolute bottom-3 left-3 z-10 max-w-sm rounded-xl border p-3.5 shadow-lg backdrop-blur-md duration-150"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <div class="flex items-center gap-2">
                <span class="size-2 rounded-full" [style.background-color]="getColor(activeStateDatum)"></span>
                <span class="text-muted-foreground font-mono text-xs tracking-wider uppercase">
                  {{ activeStateDatum?.status || 'Region' }}
                </span>
              </div>
              <h4 class="text-foreground mt-0.5 text-sm font-semibold">
                {{ activeStateItem.name }} ({{ activeStateItem.id }})
              </h4>
            </div>
            <button
              type="button"
              aria-label="Clear selection"
              class="text-muted-foreground hover:text-foreground text-xs"
              (click)="clearSelection()"
            >
              ✕
            </button>
          </div>

          @if (activeStateDatum) {
            <div
              class="border-border/60 mt-2.5 flex items-baseline justify-between border-t pt-2 font-mono text-xs"
            >
              <span class="text-muted-foreground">Adoption Metric</span>
              <span class="text-foreground font-semibold">{{ valueFormatter(activeStateDatum.value) }}%</span>
            </div>
          }

          @if (activeStateDatum?.description) {
            <p class="text-muted-foreground mt-1.5 text-xs leading-relaxed">
              {{ activeStateDatum?.description }}
            </p>
          }
        </div>
      }

      @if (values.length > 0) {
        <div
          class="border-border/70 bg-card/85 absolute right-3 bottom-3 z-10 hidden items-center gap-2 rounded-lg border px-3 py-2 text-xs shadow-xs backdrop-blur-md sm:flex"
        >
          <span class="text-muted-foreground font-mono text-[10px]">{{ minValue }}</span>
          <div class="flex h-2.5 gap-0.5 overflow-hidden rounded-xs">
            @for (c of colorRamp; track $index) {
              <div class="w-3" [style.background-color]="c"></div>
            }
          </div>
          <span class="text-foreground font-mono text-[10px] font-semibold">{{ maxValue }}</span>
        </div>
      }
    </div>
  `,
})
export class UiHexbinMapComponent {
  @Input() shape: HexbinShape = 'hexagon'
  @Input() preset: HexbinPreset = 'us-states'
  @Input() items: HexState[] = []
  @Input() data: Record<string, HexbinDatum> = {}
  @Input() selected?: string
  @Input() showLabels = true
  @Input() showValues = false
  @Input() valueFormatter: (value: number) => string = defaultValueFormatter
  @Input() colorRamp: string[] = [
    'oklch(0.92 0.05 162)',
    'oklch(0.82 0.10 162)',
    'oklch(0.72 0.14 162)',
    'oklch(0.62 0.17 162)',
    'oklch(0.50 0.18 162)',
    'oklch(0.38 0.16 162)',
  ]
  @Input() emptyColor = 'rgba(255, 255, 255, 0.08)'
  @Input() height: number | string = 480
  @Input() interactive = true
  /** Mapbox token, passed through to the inner map (React/Vue read it from env). */
  @Input() accessToken = ''
  @Input() ariaLabel = 'Cartogram Tile Grid Map'
  @Input('class') className?: string
  @Output() selectedChange = new EventEmitter<string | undefined>()
  @Output() select = new EventEmitter<{ id: string; name: string; datum?: HexbinDatum }>()

  private internalSelected?: string
  private projectionOverride?: 'globe' | 'mercator'

  get hostClass(): string {
    return cn('block w-full', this.className)
  }

  get bodyClass(): string {
    return cn('border-border bg-card group relative w-full overflow-hidden rounded-xl border shadow-xs')
  }

  get heightStyle(): string {
    if (typeof this.height === 'number') return `${this.height}px`
    return /^\d+$/.test(String(this.height)) ? `${this.height}px` : String(this.height)
  }

  get activeItems(): HexState[] {
    if (this.items && this.items.length > 0) return this.items
    return this.preset === 'world-regions' ? WORLD_HEX_REGIONS : US_HEX_STATES
  }

  get values(): number[] {
    return Object.values(this.data)
      .map((d) => d.value)
      .filter((v) => typeof v === 'number')
  }

  get minValue(): number {
    return this.values.length ? Math.min(...this.values) : 0
  }

  get maxValue(): number {
    return this.values.length ? Math.max(...this.values) : 100
  }

  get activeSelected(): string | undefined {
    return this.selected ?? this.internalSelected
  }

  get activeStateItem(): HexState | undefined {
    return this.activeItems.find((it) => it.id === this.activeSelected)
  }

  get activeStateDatum(): HexbinDatum | undefined {
    return this.activeSelected ? this.data[this.activeSelected] : undefined
  }

  get mapCenter(): [number, number] {
    return this.preset === 'world-regions' ? [0, 20] : [-97, 39]
  }

  get mapZoom(): number {
    return this.preset === 'world-regions' ? 1.5 : 3.6
  }

  get currentProjection(): 'globe' | 'mercator' {
    return this.projectionOverride ?? (this.preset === 'world-regions' ? 'globe' : 'mercator')
  }

  get hexClipPath(): string {
    return this.shape === 'hexagon' ? 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' : 'none'
  }

  getColor(datum?: HexbinDatum): string {
    if (!datum) return this.emptyColor
    if (datum.color) return datum.color
    const span = this.maxValue - this.minValue
    const normalized = span > 0 ? (datum.value - this.minValue) / span : 0.5
    const idx = Math.min(this.colorRamp.length - 1, Math.floor(normalized * this.colorRamp.length))
    return this.colorRamp[idx]
  }

  getCoords(item: HexState): [number, number] {
    if (US_CENTROIDS[item.id]) return US_CENTROIDS[item.id]
    const lng = -120 + item.col * 14
    const lat = 50 - item.row * 8
    return [lng, lat]
  }

  markerClass(item: HexState): string {
    // Merges React's MapMarker className + button className: the Angular marker takes no class.
    return cn(
      'group/hex relative flex size-10 cursor-pointer items-center justify-center font-mono transition-transform select-none',
      this.activeSelected === item.id ? 'z-30 scale-115' : 'z-20 hover:scale-105',
    )
  }

  markerBorder(item: HexState): string {
    return this.activeSelected === item.id ? '2px solid white' : '1px solid rgba(255,255,255,0.2)'
  }

  markerShadow(item: HexState): string {
    return this.activeSelected === item.id ? `0 0 14px ${this.getColor(this.data[item.id])}` : 'none'
  }

  roundedValue(item: HexState): number {
    return Math.round(this.data[item.id]?.value ?? 0)
  }

  handleSelect(item: HexState): void {
    if (!this.interactive) return
    this.internalSelected = item.id
    this.selectedChange.emit(item.id)
    this.select.emit({ id: item.id, name: item.name, datum: this.data[item.id] })
  }

  clearSelection(): void {
    this.internalSelected = undefined
    this.selectedChange.emit(undefined)
  }

  toggleProjection(): void {
    this.projectionOverride = this.currentProjection === 'globe' ? 'mercator' : 'globe'
  }
}

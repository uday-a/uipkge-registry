import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import {
  UiHexbinMapComponent,
  type HexbinDatum,
} from '../../../../../packages/registry-angular/components/charts/hexbin-map/hexbin-map.component'

const token: string = (import.meta.env['PUBLIC_MAPBOX_TOKEN'] as string | undefined) ?? ''

/** Angular demo for the hexbin-map primitive page. Mirrors demos/react/hexbin-map.tsx. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'angular-hexbin-map-demo',
  standalone: true,
  imports: [UiHexbinMapComponent],
  template: `
    @switch (story) {
      @case ('Edge Network Round-Trip Latency') {
        <div class="space-y-4">
          <div class="flex flex-wrap items-center gap-2 text-xs">
            <div
              class="border-border bg-card text-muted-foreground flex items-center gap-1.5 rounded-md border px-2.5 py-1"
            >
              <span class="inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
              <span class="text-foreground font-medium">&lt; 30ms:</span>
              Optimal
            </div>
            <div
              class="border-border bg-card text-muted-foreground flex items-center gap-1.5 rounded-md border px-2.5 py-1"
            >
              <span class="inline-block h-2 w-2 rounded-full bg-amber-500"></span>
              <span class="text-foreground font-medium">30-60ms:</span>
              Normal
            </div>
            <div
              class="border-border bg-card text-muted-foreground flex items-center gap-1.5 rounded-md border px-2.5 py-1"
            >
              <span class="inline-block h-2 w-2 rounded-full bg-red-500"></span>
              <span class="text-foreground font-medium">&gt; 60ms:</span>
              Extended
            </div>
          </div>

          <div class="border-border bg-card rounded-xl border p-4">
            <ui-hexbin-map
              [accessToken]="token"
              [selected]="selected2"
              (select)="selected2 = $event.id"
              [data]="latencyMetrics"
              [showValues]="true"
              [valueFormatter]="msFormatter"
            />
          </div>
        </div>
      }
      @case ('FiveThirtyEight-Style Square Tile Grid Cartogram') {
        <div class="space-y-4">
          <div class="border-border bg-card rounded-xl border p-4">
            <ui-hexbin-map
              [accessToken]="token"
              shape="square"
              [data]="adoptionData"
              [showValues]="true"
              [valueFormatter]="pctFormatter"
            />
          </div>
        </div>
      }
      @case ('World Regions Hex Cartogram') {
        <div class="space-y-4">
          <div class="border-border bg-card rounded-xl border p-4">
            <ui-hexbin-map [accessToken]="token" preset="world-regions" [showValues]="false" />
          </div>
        </div>
      }
      @default {
        <div class="space-y-4">
          <div class="flex flex-wrap items-center gap-2 text-xs">
            <div
              class="border-border bg-card text-muted-foreground flex items-center gap-1.5 rounded-md border px-2.5 py-1"
            >
              <span class="inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
              <span class="text-foreground font-medium">Selected State:</span>
              <span>{{ selected1 || 'None (Click a hex)' }}</span>
            </div>
            <div
              class="border-border bg-card text-muted-foreground flex items-center gap-1.5 rounded-md border px-2.5 py-1"
            >
              <span class="text-foreground font-medium">National Average:</span>
              74.8%
            </div>
            <div
              class="border-border bg-card text-muted-foreground flex items-center gap-1.5 rounded-md border px-2.5 py-1"
            >
              <span class="text-foreground font-medium">Top Tier:</span>
              VA (96.0%), DC (98.4%)
            </div>
          </div>

          <div class="border-border bg-card rounded-xl border p-4">
            <ui-hexbin-map
              [accessToken]="token"
              [selected]="selected1"
              (select)="selected1 = $event.id"
              [data]="adoptionData"
              [valueFormatter]="pctFormatter"
            />
          </div>
        </div>
      }
    }
  `,
})
export class AngularHexbinMapDemoComponent {
  @Input() story = 'Cloud Adoption by US State'

  readonly token = token
  selected1 = 'CA'
  selected2 = ''

  readonly pctFormatter = (v: number) => `${v}%`
  readonly msFormatter = (v: number) => `${v}ms`

  readonly adoptionData: Record<string, HexbinDatum> = {
    CA: { value: 94.2, status: 'leader', description: 'Silicon Valley & coastal clusters driving 94% penetration.' },
    WA: { value: 89.5, status: 'leader', description: 'Cloud infrastructure enterprise deployments.' },
    OR: { value: 76.4, status: 'active', description: 'Silicon Forest data center expansion.' },
    NY: { value: 92.1, status: 'leader', description: 'Fintech and high-frequency trading gateways.' },
    TX: { value: 88.0, status: 'leader', description: 'Austin & Dallas tech corridors.' },
    FL: { value: 81.3, status: 'active', description: 'Miami tech and healthcare SaaS hubs.' },
    IL: { value: 78.9, status: 'active', description: 'Chicago financial exchanges and logistics.' },
    CO: { value: 84.6, status: 'leader', description: 'Denver aerospace and satellite network hubs.' },
    MA: { value: 91.4, status: 'leader', description: 'Biotech and AI research institutions.' },
    VA: { value: 96.0, status: 'leader', description: 'Northern Virginia data center alley (largest global hub).' },
    NC: { value: 79.2, status: 'active', description: 'Research Triangle Park tech hub.' },
    GA: { value: 82.5, status: 'active', description: 'Atlanta fintech and payment corridor.' },
    OH: { value: 68.3, status: 'growing', description: 'Midwest manufacturing cloud automation.' },
    PA: { value: 74.1, status: 'active', description: 'Pittsburgh robotics and Philly health tech.' },
    MI: { value: 71.0, status: 'active', description: 'Automotive IoT and EV fleet software.' },
    AZ: { value: 80.2, status: 'active', description: 'Phoenix semiconductor fab expansion.' },
    UT: { value: 86.8, status: 'leader', description: 'Silicon Slopes SaaS cluster.' },
    MN: { value: 75.4, status: 'active', description: 'Twin Cities medtech enterprises.' },
    MD: { value: 87.3, status: 'leader', description: 'Cybersecurity and defense corridor.' },
    NJ: { value: 83.1, status: 'active', description: 'Pharmaceutical bioinformatics nodes.' },
    WI: { value: 64.2, status: 'growing' },
    MO: { value: 62.8, status: 'growing' },
    TN: { value: 69.4, status: 'growing' },
    IN: { value: 61.5, status: 'growing' },
    CT: { value: 79.0, status: 'active' },
    SC: { value: 66.8, status: 'growing' },
    AL: { value: 58.2, status: 'developing' },
    LA: { value: 54.1, status: 'developing' },
    KY: { value: 59.3, status: 'developing' },
    OK: { value: 56.4, status: 'developing' },
    IA: { value: 63.1, status: 'growing' },
    AR: { value: 52.8, status: 'developing' },
    NV: { value: 73.5, status: 'active' },
    KS: { value: 60.1, status: 'growing' },
    MS: { value: 48.9, status: 'developing' },
    NE: { value: 62.0, status: 'growing' },
    NM: { value: 65.4, status: 'growing' },
    ID: { value: 67.2, status: 'growing' },
    WV: { value: 46.2, status: 'developing' },
    HI: { value: 68.9, status: 'growing' },
    NH: { value: 77.3, status: 'active' },
    ME: { value: 63.5, status: 'growing' },
    RI: { value: 75.0, status: 'active' },
    MT: { value: 55.6, status: 'developing' },
    DE: { value: 82.0, status: 'active' },
    SD: { value: 57.1, status: 'developing' },
    ND: { value: 53.4, status: 'developing' },
    AK: { value: 51.0, status: 'developing' },
    VT: { value: 70.8, status: 'active' },
    WY: { value: 49.8, status: 'developing' },
    DC: { value: 98.4, status: 'leader', description: 'Federal cybersecurity and civic tech.' },
  }

  readonly latencyMetrics: Record<string, HexbinDatum> = {
    CA: { value: 18, status: 'optimal', color: '#10b981', description: 'Edge POP in SFO/LAX.' },
    WA: { value: 22, status: 'optimal', color: '#10b981' },
    OR: { value: 24, status: 'optimal', color: '#10b981' },
    NV: { value: 26, status: 'optimal', color: '#10b981' },
    AZ: { value: 25, status: 'optimal', color: '#10b981' },
    UT: { value: 28, status: 'optimal', color: '#10b981' },
    CO: { value: 31, status: 'optimal', color: '#10b981' },
    TX: { value: 21, status: 'optimal', color: '#10b981' },
    IL: { value: 19, status: 'optimal', color: '#10b981' },
    VA: { value: 12, status: 'optimal', color: '#10b981' },
    NY: { value: 14, status: 'optimal', color: '#10b981' },
    MA: { value: 16, status: 'optimal', color: '#10b981' },
    FL: { value: 23, status: 'optimal', color: '#10b981' },
    GA: { value: 20, status: 'optimal', color: '#10b981' },
    NC: { value: 21, status: 'optimal', color: '#10b981' },
    DC: { value: 11, status: 'optimal', color: '#10b981' },
    PA: { value: 17, status: 'optimal', color: '#10b981' },
    OH: { value: 22, status: 'optimal', color: '#10b981' },
    MI: { value: 24, status: 'optimal', color: '#10b981' },
    MN: { value: 28, status: 'optimal', color: '#10b981' },
    MO: { value: 32, status: 'normal', color: '#34d399' },
    TN: { value: 26, status: 'optimal', color: '#10b981' },
    IN: { value: 25, status: 'optimal', color: '#10b981' },
    WI: { value: 29, status: 'optimal', color: '#10b981' },
    MD: { value: 15, status: 'optimal', color: '#10b981' },
    NJ: { value: 14, status: 'optimal', color: '#10b981' },
    CT: { value: 17, status: 'optimal', color: '#10b981' },
    RI: { value: 18, status: 'optimal', color: '#10b981' },
    DE: { value: 15, status: 'optimal', color: '#10b981' },
    AL: { value: 34, status: 'normal', color: '#34d399' },
    SC: { value: 28, status: 'optimal', color: '#10b981' },
    KY: { value: 30, status: 'normal', color: '#34d399' },
    LA: { value: 36, status: 'normal', color: '#34d399' },
    OK: { value: 35, status: 'normal', color: '#34d399' },
    KS: { value: 38, status: 'normal', color: '#34d399' },
    IA: { value: 36, status: 'normal', color: '#34d399' },
    AR: { value: 39, status: 'normal', color: '#34d399' },
    MS: { value: 41, status: 'normal', color: '#34d399' },
    NE: { value: 42, status: 'normal', color: '#34d399' },
    NM: { value: 44, status: 'normal', color: '#34d399' },
    ID: { value: 45, status: 'normal', color: '#34d399' },
    SD: { value: 49, status: 'normal', color: '#34d399' },
    ND: { value: 52, status: 'elevated', color: '#f59e0b' },
    MT: { value: 55, status: 'elevated', color: '#f59e0b', description: 'Long backhaul to Salt Lake City.' },
    WY: { value: 54, status: 'elevated', color: '#f59e0b' },
    WV: { value: 35, status: 'normal', color: '#34d399' },
    ME: { value: 38, status: 'normal', color: '#34d399' },
    NH: { value: 26, status: 'optimal', color: '#10b981' },
    VT: { value: 32, status: 'normal', color: '#34d399' },
    AK: { value: 74, status: 'warning', color: '#ef4444', description: 'Trans-Pacific subsea fiber hops.' },
    HI: { value: 68, status: 'warning', color: '#ef4444', description: 'Oceanic link via Oahu landing station.' },
  }
}

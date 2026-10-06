import { Component, Input } from '@angular/core'
import { UiChoroplethMapChartComponent } from '../../../../../packages/registry-angular/components/charts/choropleth-map-chart/choropleth-map-chart.component'
import { WORLD_GEOJSON } from '../../lib/world-geo'
import { US_GEOJSON } from '../../lib/us-geo'
import { EU_GEOJSON } from '../../lib/eu-geo'
import { INDIA_GEOJSON } from '../../lib/india-geo'
import { US_DEMOGRAPHICS } from '../../lib/us-demographics'

const EXCLUDED = new Set(['AK', 'HI', 'PR'])

const token: string = (import.meta.env['PUBLIC_MAPBOX_TOKEN'] as string | undefined) ?? ''

/** Angular demo for the choropleth-map-chart page. Mirrors demos/react/choropleth-map-chart.tsx story by story. */
@Component({
  selector: 'angular-choropleth-map-chart-demo',
  standalone: true,
  imports: [UiChoroplethMapChartComponent],
  template: `
    @switch (story) {
      @case ('Global internet adoption') {
        <ui-choropleth-map-chart
          [accessToken]="token"
          [geoJson]="worldGeojson"
          mapName="uipkge-world"
          [data]="worldData"
          height="460"
        />
      }
      @case ('Binned classification') {
        <ui-choropleth-map-chart
          [accessToken]="token"
          [geoJson]="conusGeojson"
          mapName="uipkge-conus"
          [data]="unemployed"
          height="440"
        />
      }
      @case ('Diverging growth scale') {
        <ui-choropleth-map-chart
          [accessToken]="token"
          [geoJson]="euGeojson"
          mapName="uipkge-eu-growth"
          [data]="growthData"
          height="440"
        />
      }
      @case ('Continuous sequential scale') {
        <ui-choropleth-map-chart
          [accessToken]="token"
          [geoJson]="euGeojson"
          mapName="uipkge-eu-pop"
          [data]="euData"
          height="440"
        />
      }
      @case ('High-density regional map') {
        <ui-choropleth-map-chart
          [accessToken]="token"
          [geoJson]="indiaGeojson"
          mapName="uipkge-india"
          [data]="inData"
          height="440"
        />
      }
      @case ('Freight corridors and hubs') {
        <ui-choropleth-map-chart
          [accessToken]="token"
          [geoJson]="euGeojson"
          mapName="uipkge-eu-logistics"
          [data]="euData"
          [pins]="logisticsPins"
          [links]="logisticsLinks"
          height="440"
        />
      }
      @default {
        <ui-choropleth-map-chart
          [accessToken]="token"
          [geoJson]="worldGeojson"
          mapName="uipkge-world"
          [data]="worldData"
          height="460"
        />
      }
    }
  `,
})
export class AngularChoroplethMapChartDemoComponent {
  @Input() story = 'Global internet adoption'

  protected readonly token = token

  worldGeojson: Record<string, unknown> = WORLD_GEOJSON as unknown as Record<string, unknown>

  euGeojson: Record<string, unknown> = EU_GEOJSON as unknown as Record<string, unknown>

  indiaGeojson: Record<string, unknown> = INDIA_GEOJSON as unknown as Record<string, unknown>

  conusGeojson: Record<string, unknown> = {
    ...(US_GEOJSON as unknown as Record<string, unknown>),
    features: (US_GEOJSON as unknown as { features: { id: string }[] }).features.filter(
      (f) => !EXCLUDED.has(f.id),
    ),
  }

  worldData = [
    { id: 'United States of America', value: 92 },
    { id: 'Canada', value: 94 },
    { id: 'United Kingdom', value: 95 },
    { id: 'Germany', value: 93 },
    { id: 'France', value: 92 },
    { id: 'Spain', value: 94 },
    { id: 'Italy', value: 85 },
    { id: 'Japan', value: 93 },
    { id: 'South Korea', value: 97 },
    { id: 'Australia', value: 91 },
    { id: 'India', value: 52 },
    { id: 'China', value: 74 },
    { id: 'Brazil', value: 81 },
    { id: 'Mexico', value: 76 },
    { id: 'South Africa', value: 72 },
    { id: 'Nigeria', value: 45 },
    { id: 'Egypt', value: 71 },
    { id: 'Indonesia', value: 66 },
    { id: 'Saudi Arabia', value: 99 },
    { id: 'Turkey', value: 83 },
    { id: 'Argentina', value: 87 },
    { id: 'Poland', value: 87 },
    { id: 'Sweden', value: 96 },
    { id: 'Norway', value: 98 },
    { id: 'Netherlands', value: 96 },
  ]

  unemployed = Object.entries(US_DEMOGRAPHICS).map(([id, d]) => ({ id, value: d.unemployment }))

  euPop: [string, string, number][] = [
    ['DE', 'Germany', 83.5],
    ['FR', 'France', 68.2],
    ['GB', 'United Kingdom', 69.3],
    ['IT', 'Italy', 58.9],
    ['ES', 'Spain', 48.6],
    ['PL', 'Poland', 36.6],
    ['RO', 'Romania', 19.1],
    ['NL', 'Netherlands', 17.9],
    ['BE', 'Belgium', 11.8],
    ['CZ', 'Czechia', 10.9],
    ['SE', 'Sweden', 10.5],
    ['PT', 'Portugal', 10.4],
    ['GR', 'Greece', 10.3],
    ['HU', 'Hungary', 9.6],
    ['AT', 'Austria', 9.1],
    ['CH', 'Switzerland', 8.9],
    ['BG', 'Bulgaria', 6.4],
    ['DK', 'Denmark', 5.9],
    ['FI', 'Finland', 5.6],
    ['NO', 'Norway', 5.5],
    ['SK', 'Slovakia', 5.4],
    ['IE', 'Ireland', 5.3],
    ['HR', 'Croatia', 3.9],
    ['LT', 'Lithuania', 2.9],
    ['SI', 'Slovenia', 2.1],
    ['LV', 'Latvia', 1.9],
    ['EE', 'Estonia', 1.4],
    ['CY', 'Cyprus', 1.4],
    ['LU', 'Luxembourg', 0.7],
  ]

  euData = this.euPop.map(([id, , value]) => ({ id, value }))

  euGrowth: [string, number][] = [
    ['IE', 4.2],
    ['HR', 3.1],
    ['PL', 2.9],
    ['CY', 2.8],
    ['ES', 2.5],
    ['GR', 2.1],
    ['DK', 1.8],
    ['PT', 1.6],
    ['BE', 1.1],
    ['FR', 0.9],
    ['NL', 0.8],
    ['IT', 0.7],
    ['SE', 0.4],
    ['GB', 0.3],
    ['DE', -0.2],
    ['AT', -0.4],
    ['FI', -0.6],
    ['EE', -1.2],
  ]

  growthData = this.euGrowth.map(([id, value]) => ({ id, value }))

  inPop: [string, string, number][] = [
    ['UP', 'Uttar Pradesh', 236],
    ['MH', 'Maharashtra', 126],
    ['BR', 'Bihar', 129],
    ['WB', 'West Bengal', 99],
    ['MP', 'Madhya Pradesh', 86],
    ['RJ', 'Rajasthan', 81],
    ['TN', 'Tamil Nadu', 77],
    ['KA', 'Karnataka', 68],
    ['GJ', 'Gujarat', 64],
    ['AP', 'Andhra Pradesh', 53],
    ['OD', 'Odisha', 46],
    ['TS', 'Telangana', 38],
    ['KL', 'Kerala', 36],
    ['JH', 'Jharkhand', 39],
    ['AS', 'Assam', 36],
    ['PB', 'Punjab', 30],
    ['CT', 'Chhattisgarh', 30],
    ['HR', 'Haryana', 30],
    ['DL', 'Delhi', 33],
    ['JK', 'Jammu and Kashmir', 13],
    ['LA', 'Ladakh', 0.3],
    ['UT', 'Uttarakhand', 12],
    ['HP', 'Himachal Pradesh', 7.5],
    ['TR', 'Tripura', 4.1],
    ['ML', 'Meghalaya', 3.4],
    ['MN', 'Manipur', 3.1],
    ['NL', 'Nagaland', 2.3],
    ['GA', 'Goa', 1.6],
    ['AR', 'Arunachal Pradesh', 1.7],
    ['MZ', 'Mizoram', 1.2],
    ['SK', 'Sikkim', 0.7],
    ['AN', 'Andaman and Nicobar Islands', 0.4],
    ['CH', 'Chandigarh', 1.2],
    ['DN', 'Dadra and Nagar Haveli and Daman and Diu', 0.6],
    ['LD', 'Lakshadweep', 0.1],
    ['PY', 'Puducherry', 1.7],
  ]

  inData = this.inPop.map(([id, , value]) => ({ id, value }))

  logisticsPins: { name: string; coord: [number, number]; color?: string }[] = [
    { name: 'Frankfurt Air Cargo', coord: [8.6821, 50.1109], color: '#3b82f6' },
    { name: 'Heathrow Logistics', coord: [-0.4543, 51.47], color: '#10b981' },
    { name: 'Paris CDG Terminal', coord: [2.55, 49.0097], color: '#10b981' },
    { name: 'Milan Malpensa', coord: [8.723, 45.63], color: '#f59e0b' },
  ]

  logisticsLinks: { from: [number, number]; to: [number, number]; label?: string }[] = [
    { from: [8.6821, 50.1109], to: [-0.4543, 51.47], label: 'FRA → LHR' },
    { from: [8.6821, 50.1109], to: [2.55, 49.0097], label: 'FRA → CDG' },
    { from: [2.55, 49.0097], to: [8.723, 45.63], label: 'CDG → MXP' },
  ]
}

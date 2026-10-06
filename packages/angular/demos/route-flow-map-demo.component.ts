import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { UiRouteFlowMapComponent } from '../../../../../packages/registry-angular/components/charts/route-flow-map/route-flow-map.component'

// Angular accepts the full React/Vue hub/route telemetry shapes; the ECharts
// overview encodes geometry + per-route/per-hub colors + selection, while the
// globe-only behaviour (projection, graticule, labels) stays on React/Vue.
const aviationHubs = [
  { id: 'JFK', name: 'John F. Kennedy Intl', lat: 40.6413, lng: -73.7781 },
  { id: 'LHR', name: 'London Heathrow', lat: 51.47, lng: -0.4543 },
  { id: 'FRA', name: 'Frankfurt Main', lat: 50.0379, lng: 8.5622 },
  { id: 'HND', name: 'Tokyo Haneda', lat: 35.5494, lng: 139.7798 },
  { id: 'SIN', name: 'Singapore Changi', lat: 1.3644, lng: 103.9915 },
  { id: 'DXB', name: 'Dubai International', lat: 25.2532, lng: 55.3657 },
  { id: 'SFO', name: 'San Francisco Intl', lat: 37.6213, lng: -122.379 },
  { id: 'SYD', name: 'Sydney Kingsford Smith', lat: -33.9399, lng: 151.1753 },
]

const scheduledFlights = [
  { id: 'BA-178', from: 'JFK', to: 'LHR' },
  { id: 'LH-400', from: 'FRA', to: 'JFK' },
  { id: 'JL-006', from: 'HND', to: 'JFK' },
  { id: 'SQ-322', from: 'SIN', to: 'LHR' },
  { id: 'EK-201', from: 'DXB', to: 'JFK' },
  { id: 'UA-869', from: 'SFO', to: 'HND' },
  { id: 'QF-001', from: 'SYD', to: 'SIN' },
]

const cargoRoutes = [
  { id: 'FDX-012', from: 'SFO', to: 'JFK' },
  { id: 'DHL-881', from: 'FRA', to: 'DXB' },
  { id: 'UPS-204', from: 'SIN', to: 'HND' },
]

const maritimeHubs = [
  { id: 'SHA', name: 'Port of Shanghai', lat: 31.2304, lng: 121.4737 },
  { id: 'SIN', name: 'Port of Singapore', lat: 1.2838, lng: 103.8591 },
  { id: 'RTM', name: 'Port of Rotterdam', lat: 51.9244, lng: 4.4777 },
  { id: 'LAX', name: 'Port of Los Angeles', lat: 33.7432, lng: -118.2673 },
  { id: 'DXB', name: 'Jebel Ali Port', lat: 25.0118, lng: 55.0611 },
]

const maritimeRoutes = [
  { id: 'MSC-910', from: 'SHA', to: 'LAX' },
  { id: 'MAERSK-44', from: 'SIN', to: 'RTM' },
  { id: 'CMA-201', from: 'DXB', to: 'SIN' },
]

/** Angular demo for the route-flow-map page. Mirrors demos/react/route-flow-map.tsx 1:1. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'angular-route-flow-map-demo',
  standalone: true,
  imports: [UiRouteFlowMapComponent],
  template: `
    @switch (story) {
      @case ('Express Air Cargo Freight Trunks') {
        <ui-route-flow-map [hubs]="aviationHubs" [routes]="cargoRoutes" />
      }
      @case ('Global Maritime Container Shipping Lanes') {
        <ui-route-flow-map [hubs]="maritimeHubs" [routes]="maritimeRoutes" />
      }
      @default {
        <ui-route-flow-map [hubs]="aviationHubs" [routes]="scheduledFlights" />
      }
    }
  `,
})
export class AngularRouteFlowMapDemoComponent {
  protected readonly aviationHubs = aviationHubs
  protected readonly scheduledFlights = scheduledFlights
  protected readonly cargoRoutes = cargoRoutes
  protected readonly maritimeHubs = maritimeHubs
  protected readonly maritimeRoutes = maritimeRoutes
  @Input() story = 'Global Long-Haul Flight Operations'
}

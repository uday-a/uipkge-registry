import { Component, Input } from '@angular/core'
import { UiBubbleMapComponent } from '../../../../../packages/registry-angular/components/charts/bubble-map/bubble-map.component'

/** Angular demo for the bubble-map page. Mirrors demos/react/bubble-map.tsx story by story. */
@Component({
  selector: 'angular-bubble-map-demo',
  standalone: true,
  imports: [UiBubbleMapComponent],
  template: `
    @switch (story) {
      @case ('Global Compute Clusters') {
        <ui-bubble-map [bubbles]="cloudBubbles" [minRadius]="6" [maxRadius]="26" />
      }
      @case ('Cyber Incident Threat Radar') {
        <ui-bubble-map [bubbles]="threatBubbles" [minRadius]="7" [maxRadius]="24" />
      }
      @default {
        <ui-bubble-map [bubbles]="cloudBubbles" [minRadius]="6" [maxRadius]="26" />
      }
    }
  `,
})
export class AngularBubbleMapDemoComponent {
  @Input() story = 'Global Compute Clusters'

  cloudBubbles = [
    { id: 'us-west-sfo', name: 'San Francisco (us-west-1)', lat: 37.77, lng: -122.41, value: 84200 },
    { id: 'us-east-iad', name: 'Northern Virginia (us-east-1)', lat: 38.9, lng: -77.03, value: 148500 },
    { id: 'eu-west-lhr', name: 'London (eu-west-2)', lat: 51.5, lng: -0.12, value: 92400 },
    { id: 'eu-central-fra', name: 'Frankfurt (eu-central-1)', lat: 50.11, lng: 8.68, value: 112000 },
    { id: 'ap-northeast-hnd', name: 'Tokyo (ap-northeast-1)', lat: 35.67, lng: 139.65, value: 78900 },
    { id: 'ap-southeast-sin', name: 'Singapore (ap-southeast-1)', lat: 1.35, lng: 103.81, value: 65400 },
    { id: 'sa-east-gru', name: 'São Paulo (sa-east-1)', lat: -23.55, lng: -46.63, value: 32100 },
    { id: 'ap-southeast-syd', name: 'Sydney (ap-southeast-2)', lat: -33.86, lng: 151.2, value: 41800 },
  ]

  threatBubbles = [
    { id: 'th-1', name: 'Kyiv / Eastern Europe', lat: 50.45, lng: 30.52, value: 9400 },
    { id: 'th-2', name: 'Taipei Metro Core', lat: 25.03, lng: 121.56, value: 6200 },
    { id: 'th-3', name: 'São Paulo Datacenter', lat: -23.55, lng: -46.63, value: 3800 },
    { id: 'th-4', name: 'Amsterdam IX', lat: 52.36, lng: 4.9, value: 12500 },
    { id: 'th-5', name: 'New York Financial Gateway', lat: 40.71, lng: -74.0, value: 2100 },
  ]
}

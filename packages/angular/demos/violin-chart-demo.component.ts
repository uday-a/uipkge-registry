import { Component } from '@angular/core'
import { UiViolinChartComponent } from '../../../../../packages/registry-angular/components/charts/violin-chart/violin-chart.component'

// Customs clearance hours per AWB batch, by gateway.
const gateways = [
  { group: 'SIN', values: [9.8, 11.2, 10.4, 12.1, 11.6, 10.9, 13.2, 11.0, 12.6, 10.2, 11.8, 12.0] },
  { group: 'HKG', values: [12.4, 14.1, 13.0, 15.2, 13.8, 12.9, 16.1, 13.5, 14.6, 26.5, 13.2, 14.0] },
  { group: 'FRA', values: [15.1, 17.4, 16.0, 18.2, 16.8, 15.9, 19.1, 17.0, 16.4, 18.0, 17.2, 16.6] },
]

/** Angular demo for the violin-chart page. Mirrors demos/react/violin-chart.tsx 1:1. */
@Component({
  selector: 'angular-violin-chart-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiViolinChartComponent],
  template: `<ui-violin-chart [groups]="gateways" height="360" />`,
})
export class AngularViolinChartDemoComponent {
  protected readonly gateways = gateways
}

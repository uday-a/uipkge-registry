import { Component, Input } from '@angular/core'
import { UiAlluvialChartComponent } from '../../../../../packages/registry-angular/components/charts/alluvial-chart/alluvial-chart.component'

/** Angular demo for the alluvial-chart page. Mirrors demos/react/alluvial-chart.tsx 1:1. */
@Component({
  selector: 'angular-alluvial-chart-demo',
  standalone: true,
  imports: [UiAlluvialChartComponent],
  template: `
    @switch (story) {
      @default {
        <ui-alluvial-chart [links]="funnel" height="440" />
      }
    }
  `,
})
export class AngularAlluvialChartDemoComponent {
  @Input() story = 'Default'

  funnel = [
    { source: 'Inquiry', target: 'Quote', value: 1200 },
    { source: 'Quote', target: 'Booking', value: 860 },
    { source: 'Quote', target: 'Lost', value: 340 },
    { source: 'Booking', target: 'Flown', value: 790 },
    { source: 'Booking', target: 'Rolled', value: 70 },
    { source: 'Flown', target: 'Invoiced', value: 775 },
    { source: 'Flown', target: 'Claim', value: 15 },
  ]
}

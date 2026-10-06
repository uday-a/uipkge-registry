import { Component, Input } from '@angular/core'
import { UiBeeswarmChartComponent } from '../../../../../packages/registry-angular/components/charts/beeswarm-chart/beeswarm-chart.component'

/** Angular demo for the beeswarm-chart page. Mirrors demos/react/beeswarm-chart.tsx 1:1. */
@Component({
  selector: 'angular-beeswarm-chart-demo',
  standalone: true,
  imports: [UiBeeswarmChartComponent],
  template: `
    @switch (story) {
      @default {
        <ui-beeswarm-chart [data]="scores" valueField="value" groupField="group" height="300" />
      }
    }
  `,
})
export class AngularBeeswarmChartDemoComponent {
  @Input() story = 'Default'

  scores = [
    { group: 'Eng', value: 82 },
    { group: 'Eng', value: 88 },
    { group: 'Eng', value: 74 },
    { group: 'Eng', value: 91 },
    { group: 'Eng', value: 79 },
    { group: 'Design', value: 76 },
    { group: 'Design', value: 84 },
    { group: 'Design', value: 69 },
    { group: 'Design', value: 81 },
    { group: 'Sales', value: 64 },
    { group: 'Sales', value: 71 },
    { group: 'Sales', value: 58 },
    { group: 'Sales', value: 77 },
    { group: 'Sales', value: 66 },
  ]
}

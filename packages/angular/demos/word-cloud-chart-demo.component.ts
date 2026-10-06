import { Component } from '@angular/core'
import { UiWordCloudChartComponent } from '../../../../../packages/registry-angular/components/charts/word-cloud-chart/word-cloud-chart.component'

const topics = [
  { name: 'dashboards', value: 96 },
  { name: 'echarts', value: 82 },
  { name: 'tokens', value: 74 },
  { name: 'registry', value: 68 },
  { name: 'vue', value: 61 },
  { name: 'react', value: 58 },
  { name: 'a11y', value: 44 },
  { name: 'dark-mode', value: 39 },
  { name: 'sparklines', value: 28 },
  { name: 'funnels', value: 22 },
]

/** Angular demo for the word-cloud-chart page. Mirrors demos/react/word-cloud-chart.tsx 1:1. */
@Component({
  selector: 'angular-word-cloud-chart-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiWordCloudChartComponent],
  template: `<ui-word-cloud-chart [data]="topics" height="280" />`,
})
export class AngularWordCloudChartDemoComponent {
  protected readonly topics = topics
}

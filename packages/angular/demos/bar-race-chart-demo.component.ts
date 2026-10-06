import { Component, Input } from '@angular/core'
import { UiBarRaceChartComponent } from '../../../../../packages/registry-angular/components/charts/bar-race-chart/bar-race-chart.component'

/** Angular demo for the bar-race-chart page. Mirrors demos/react/bar-race-chart.tsx 1:1. */
@Component({
  selector: 'angular-bar-race-chart-demo',
  standalone: true,
  imports: [UiBarRaceChartComponent],
  template: `
    @switch (story) {
      @default {
        <ui-bar-race-chart [frames]="frames" height="360" />
      }
    }
  `,
})
export class AngularBarRaceChartDemoComponent {
  @Input() story = 'Default'

  frames: { label: string; values: { category: string; value: number }[] }[] = [
    {
      label: '2022',
      values: [
        { category: 'Aurora', value: 42 },
        { category: 'Boreal', value: 38 },
        { category: 'Cirrus', value: 31 },
        { category: 'Drift', value: 24 },
      ],
    },
    {
      label: '2023',
      values: [
        { category: 'Aurora', value: 48 },
        { category: 'Boreal', value: 45 },
        { category: 'Cirrus', value: 39 },
        { category: 'Drift', value: 30 },
      ],
    },
    {
      label: '2024',
      values: [
        { category: 'Boreal', value: 58 },
        { category: 'Aurora', value: 55 },
        { category: 'Drift', value: 44 },
        { category: 'Cirrus', value: 41 },
      ],
    },
    {
      label: '2025',
      values: [
        { category: 'Boreal', value: 66 },
        { category: 'Drift', value: 57 },
        { category: 'Aurora', value: 54 },
        { category: 'Cirrus', value: 43 },
      ],
    },
  ]
}

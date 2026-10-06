import { Component, Input } from '@angular/core'
import { UiBoxplotChartComponent } from '../../../../../packages/registry-angular/components/charts/boxplot-chart/boxplot-chart.component'

/** Angular demo for the boxplot-chart page. Mirrors demos/react/boxplot-chart.tsx story by story. */
@Component({
  selector: 'angular-boxplot-chart-demo',
  standalone: true,
  imports: [UiBoxplotChartComponent],
  template: `
    @switch (story) {
      @case ('Vertical box plot') {
        <ui-boxplot-chart [data]="latencies" height="340" />
      }
      @case ('Horizontal') {
        <ui-boxplot-chart [data]="latencies" [horizontal]="true" height="320" />
      }
      @case ('A/B/C cohort scores') {
        <ui-boxplot-chart [data]="scores" height="320" />
      }
      @case ('Build times by tier (long-tail risk)') {
        <ui-boxplot-chart [data]="buildTimes" [horizontal]="true" height="340" />
      }
      @case ('Compact / no gridlines') {
        <ui-boxplot-chart [data]="latencies" [option]="noGridOption" height="180" />
      }
      @default {
        <ui-boxplot-chart [data]="latencies" height="340" />
      }
    }
  `,
})
export class AngularBoxplotChartDemoComponent {
  @Input() story = 'Vertical box plot'

  latencies: { category: string; values: [number, number, number, number, number] }[] = [
    { category: 'US-W', values: [120, 145, 165, 180, 215] },
    { category: 'US-E', values: [115, 138, 152, 170, 220] },
    { category: 'EU', values: [130, 152, 172, 200, 260] },
    { category: 'APAC', values: [110, 128, 142, 158, 195] },
    { category: 'SA', values: [140, 168, 185, 210, 280] },
  ]

  scores: { category: string; values: [number, number, number, number, number] }[] = [
    { category: 'Group A', values: [42, 56, 68, 78, 92] },
    { category: 'Group B', values: [48, 60, 71, 80, 94] },
    { category: 'Group C', values: [52, 65, 74, 84, 96] },
  ]

  buildTimes: { category: string; values: [number, number, number, number, number] }[] = [
    { category: 'Small', values: [12, 18, 24, 32, 48] },
    { category: 'Medium', values: [28, 42, 58, 78, 110] },
    { category: 'Large', values: [55, 95, 140, 220, 380] },
    { category: 'XL', values: [110, 180, 260, 380, 620] },
  ]

  noGridOption: Record<string, unknown> = {
    yAxis: { splitLine: { show: false } },
    grid: { left: 8, right: 8, top: 8, bottom: 24, containLabel: true },
  }
}

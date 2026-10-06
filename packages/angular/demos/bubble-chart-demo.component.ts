import { Component, Input } from '@angular/core'
import { UiBubbleChartComponent } from '../../../../../packages/registry-angular/components/charts/bubble-chart/bubble-chart.component'

/** Angular demo for the bubble-chart page. Mirrors demos/react/bubble-chart.tsx story by story. */
@Component({
  selector: 'angular-bubble-chart-demo',
  standalone: true,
  imports: [UiBubbleChartComponent],
  template: `
    @switch (story) {
      @case ('Deal landscape') {
        <ui-bubble-chart [data]="markets" categoryField="c" height="320" />
      }
      @case ('Soft opacity') {
        <ui-bubble-chart [data]="markets" categoryField="c" [opacity]="0.4" height="320" />
      }
      @case ('Size range') {
        <ui-bubble-chart [data]="markets" categoryField="c" [minSize]="4" [maxSize]="64" height="320" />
      }
      @default {
        <ui-bubble-chart [data]="markets" categoryField="c" height="320" />
      }
    }
  `,
})
export class AngularBubbleChartDemoComponent {
  @Input() story = 'Deal landscape'

  markets = [
    { x: 4.2, y: 68, size: 120, c: 'SMB' },
    { x: 6.8, y: 74, size: 320, c: 'SMB' },
    { x: 3.1, y: 52, size: 80, c: 'Enterprise' },
    { x: 8.4, y: 88, size: 540, c: 'Enterprise' },
    { x: 5.5, y: 61, size: 200, c: 'Mid-market' },
    { x: 7.2, y: 79, size: 410, c: 'Mid-market' },
  ]
}

import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { UiStackedBarChartComponent } from '../../../../../packages/registry-angular/components/charts/stacked-bar-chart/stacked-bar-chart.component'

const mix = [
  { q: 'Q1', organic: 240, paid: 180, referral: 120 },
  { q: 'Q2', organic: 310, paid: 220, referral: 150 },
  { q: 'Q3', organic: 380, paid: 280, referral: 170 },
  { q: 'Q4', organic: 450, paid: 340, referral: 210 },
]

/** Angular demo for the stacked-bar-chart page. Mirrors demos/react/stacked-bar-chart.tsx 1:1. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'angular-stacked-bar-chart-demo',
  standalone: true,
  imports: [UiStackedBarChartComponent],
  template: `
    @switch (story) {
      @case ('100% share') {
        <ui-stacked-bar-chart [data]="mix" xField="q" [yField]="yFields" [percent]="true" height="320" />
      }
      @default {
        <ui-stacked-bar-chart [data]="mix" xField="q" [yField]="yFields" height="320" />
      }
    }
  `,
})
export class AngularStackedBarChartDemoComponent {
  @Input() story = 'Channel mix'
  protected readonly mix = mix
  protected readonly yFields = ['organic', 'paid', 'referral']
}

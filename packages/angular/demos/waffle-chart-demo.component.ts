import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { UiWaffleChartComponent } from '../../../../../packages/registry-angular/components/charts/waffle-chart/waffle-chart.component'

const share = [
  { name: 'Organic', value: 46 },
  { name: 'Paid', value: 28 },
  { name: 'Referral', value: 16 },
  { name: 'Other', value: 10 },
]
const survey = [
  { name: 'Yes', value: 72 },
  { name: 'No', value: 28 },
]

/** Angular demo for the waffle-chart page. Mirrors demos/react/waffle-chart.tsx 1:1. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'angular-waffle-chart-demo',
  standalone: true,
  imports: [UiWaffleChartComponent],
  template: `
    @switch (story) {
      @case ('Survey result') {
        <ui-waffle-chart [data]="survey" [showLegend]="false" height="220" />
      }
      @default {
        <ui-waffle-chart [data]="share" height="260" />
      }
    }
  `,
})
export class AngularWaffleChartDemoComponent {
  @Input() story = 'Traffic share'
  protected readonly share = share
  protected readonly survey = survey
}

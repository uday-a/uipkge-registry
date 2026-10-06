import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { UiPopulationPyramidChartComponent } from '../../../../../packages/registry-angular/components/charts/population-pyramid-chart/population-pyramid-chart.component'

const users = [
  { band: '18–24', left: 12, right: 14 },
  { band: '25–34', left: 24, right: 26 },
  { band: '35–44', left: 19, right: 21 },
  { band: '45–54', left: 14, right: 15 },
  { band: '55+', left: 8, right: 10 },
]

const cohorts = users.slice(0, 3)
const cohortNames: [string, string] = ['Control', 'Variant']

/** Angular demo for the population-pyramid-chart page. Mirrors demos/react/population-pyramid-chart.tsx 1:1. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'angular-population-pyramid-chart-demo',
  standalone: true,
  imports: [UiPopulationPyramidChartComponent],
  template: `
    @switch (story) {
      @case ('Custom cohorts') {
        <ui-population-pyramid-chart [data]="cohorts" [names]="cohortNames" [height]="240" />
      }
      @default {
        <ui-population-pyramid-chart [data]="users" [height]="320" />
      }
    }
  `,
})
export class AngularPopulationPyramidChartDemoComponent {
  protected readonly users = users
  protected readonly cohorts = cohorts
  protected readonly cohortNames = cohortNames
  @Input() story = 'User age split'
}

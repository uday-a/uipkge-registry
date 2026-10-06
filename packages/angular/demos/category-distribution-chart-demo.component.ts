import { Component, Input } from '@angular/core'
import { UiCategoryDistributionChartComponent } from '../../../../../packages/registry-angular/components/charts/category-distribution-chart/category-distribution-chart.component'

/** Angular demo for the category-distribution-chart page. Mirrors demos/react/category-distribution-chart.tsx 1:1. */
@Component({
  selector: 'angular-category-distribution-chart-demo',
  standalone: true,
  imports: [UiCategoryDistributionChartComponent],
  template: `
    @switch (story) {
      @default {
        <ui-category-distribution-chart
          primaryValue="10,000"
          primaryLabel="Total spend"
          [trend]="{ value: '8.2%', direction: 'up' }"
          [categories]="budgetItems"
          height="240"
        />
      }
    }
  `,
})
export class AngularCategoryDistributionChartDemoComponent {
  @Input() story = 'Budget split'

  budgetItems = [
    { label: 'Marketing', percentage: 40, value: 4000 },
    { label: 'Sales', percentage: 25, value: 2500 },
    { label: 'Development', percentage: 20, value: 2000 },
    { label: 'Support', percentage: 15, value: 1500 },
  ]
}

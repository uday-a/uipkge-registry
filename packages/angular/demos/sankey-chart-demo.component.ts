import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { UiSankeyChartComponent } from '../../../../../packages/registry-angular/components/charts/sankey-chart/sankey-chart.component'

type FlowLink = { source: string; target: string; value: number }

// Air cargo weekly tonnage: origin gateways to destination ramps.
const laneFlows: FlowLink[] = [
  { source: 'PVG', target: 'LAX', value: 520 },
  { source: 'ICN', target: 'ORD', value: 410 },
  { source: 'NRT', target: 'DFW', value: 350 },
  { source: 'FRA', target: 'JFK', value: 360 },
  { source: 'SIN', target: 'HKG', value: 380 },
  { source: 'HKG', target: 'ANC', value: 290 },
  { source: 'DXB', target: 'SIN', value: 280 },
  { source: 'SIN', target: 'ICN', value: 190 },
]
const acquisition: FlowLink[] = [
  { source: 'Organic', target: 'Landing', value: 480 },
  { source: 'Organic', target: 'Blog', value: 220 },
  { source: 'Paid', target: 'Landing', value: 360 },
  { source: 'Paid', target: 'Pricing', value: 140 },
  { source: 'Referral', target: 'Pricing', value: 180 },
  { source: 'Referral', target: 'Landing', value: 60 },
  { source: 'Landing', target: 'Sign-up', value: 420 },
  { source: 'Landing', target: 'Bounce', value: 480 },
  { source: 'Pricing', target: 'Sign-up', value: 240 },
  { source: 'Pricing', target: 'Bounce', value: 80 },
  { source: 'Blog', target: 'Sign-up', value: 90 },
  { source: 'Blog', target: 'Bounce', value: 130 },
]
const energy: FlowLink[] = [
  { source: 'Coal', target: 'Electricity', value: 380 },
  { source: 'Gas', target: 'Electricity', value: 220 },
  { source: 'Solar', target: 'Electricity', value: 60 },
  { source: 'Wind', target: 'Electricity', value: 80 },
  { source: 'Electricity', target: 'Residential', value: 280 },
  { source: 'Electricity', target: 'Industrial', value: 320 },
  { source: 'Electricity', target: 'Commercial', value: 140 },
]
const budget: FlowLink[] = [
  { source: 'Revenue', target: 'Engineering', value: 4200 },
  { source: 'Revenue', target: 'Sales', value: 2800 },
  { source: 'Revenue', target: 'Marketing', value: 1800 },
  { source: 'Revenue', target: 'Ops', value: 1200 },
  { source: 'Engineering', target: 'Salaries', value: 3000 },
  { source: 'Engineering', target: 'Infra', value: 900 },
  { source: 'Engineering', target: 'Tools', value: 300 },
  { source: 'Sales', target: 'Salaries', value: 2200 },
  { source: 'Sales', target: 'Commission', value: 600 },
]

/** Angular demo for the sankey-chart page. Mirrors demos/react/sankey-chart.tsx 1:1. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'angular-sankey-chart-demo',
  standalone: true,
  imports: [UiSankeyChartComponent],
  template: `
    @switch (story) {
      @case ('Energy mix') {
        <ui-sankey-chart [links]="energy" height="340" />
      }
      @case ('Budget allocation') {
        <ui-sankey-chart [links]="budget" height="380" />
      }
      @case ('Straight ribbons') {
        <ui-sankey-chart [links]="acquisition" [option]="straightOption" height="380" />
      }
      @case ('Compact flow') {
        <ui-sankey-chart [links]="energy" height="200" />
      }
      @case ('Lane flows') {
        <ui-sankey-chart [links]="laneFlows" height="380" />
      }
      @default {
        <ui-sankey-chart [links]="acquisition" height="380" />
      }
    }
  `,
})
export class AngularSankeyChartDemoComponent {
  @Input() story = 'Acquisition funnel'
  protected readonly laneFlows = laneFlows
  protected readonly acquisition = acquisition
  protected readonly energy = energy
  protected readonly budget = budget
  protected readonly straightOption = {
    series: [{ lineStyle: { color: 'gradient', curveness: 0 } }],
  }
}

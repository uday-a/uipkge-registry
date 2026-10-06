import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { UiSunburstChartComponent } from '../../../../../packages/registry-angular/components/charts/sunburst-chart/sunburst-chart.component'

const revenue = [
  {
    name: 'Revenue',
    children: [
      {
        name: 'Subscription',
        value: 64,
        children: [
          { name: 'Pro', value: 38 },
          { name: 'Team', value: 18 },
          { name: 'Enterprise', value: 8 },
        ],
      },
      {
        name: 'Usage',
        value: 22,
        children: [
          { name: 'API', value: 14 },
          { name: 'Storage', value: 8 },
        ],
      },
      {
        name: 'Services',
        value: 14,
        children: [
          { name: 'Onboarding', value: 9 },
          { name: 'Training', value: 5 },
        ],
      },
    ],
  },
]
const orgChart = [
  {
    name: 'Company',
    children: [
      {
        name: 'Engineering',
        children: [
          { name: 'Backend', value: 22 },
          { name: 'Frontend', value: 18 },
          { name: 'Mobile', value: 8 },
          { name: 'Infra', value: 8 },
        ],
      },
      {
        name: 'GTM',
        children: [
          { name: 'Sales', value: 16 },
          { name: 'Marketing', value: 10 },
          { name: 'CS', value: 8 },
        ],
      },
      { name: 'Ops', value: 12 },
    ],
  },
]
// Air cargo network: region, then airport, sized by weekly tonnage.
const cargoNetwork = [
  {
    name: 'Air cargo',
    children: [
      {
        name: 'Transpacific',
        children: [
          { name: 'PVG', value: 520 },
          { name: 'ICN', value: 410 },
          { name: 'NRT', value: 350 },
        ],
      },
      {
        name: 'Intra-Asia',
        children: [
          { name: 'SIN', value: 570 },
          { name: 'HKG', value: 290 },
        ],
      },
      {
        name: 'Europe & ME',
        children: [
          { name: 'FRA', value: 360 },
          { name: 'DXB', value: 280 },
        ],
      },
    ],
  },
]

/** Angular demo for the sunburst-chart page. Mirrors demos/react/sunburst-chart.tsx 1:1. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'angular-sunburst-chart-demo',
  standalone: true,
  imports: [UiSunburstChartComponent],
  template: `
    @switch (story) {
      @case ('Org chart') {
        <ui-sunburst-chart [data]="orgChart" height="380" />
      }
      @case ('Tangential labels') {
        <ui-sunburst-chart [data]="revenue" [option]="tangentialOption" height="400" />
      }
      @case ('Horizontal labels') {
        <ui-sunburst-chart [data]="revenue" [option]="horizontalLabelsOption" height="400" />
      }
      @case ('Solid (pie-style)') {
        <ui-sunburst-chart [data]="revenue" [radius]="solidRadius" height="320" />
      }
      @case ('Cargo network') {
        <ui-sunburst-chart [data]="cargoNetwork" height="380" />
      }
      @default {
        <ui-sunburst-chart [data]="revenue" height="400" />
      }
    }
  `,
})
export class AngularSunburstChartDemoComponent {
  @Input() story = 'Revenue breakdown'
  protected readonly revenue = revenue
  protected readonly orgChart = orgChart
  protected readonly cargoNetwork = cargoNetwork
  // Polar / tangential label layout for the small inner rings.
  protected readonly tangentialOption = {
    series: [
      {
        label: { rotate: 'tangential' },
        levels: [
          {},
          { r0: '12%', r: '40%', label: { rotate: 'tangential' } },
          { r0: '40%', r: '70%', label: { align: 'right' } },
          { r0: '70%', r: '90%', label: { position: 'outside' } },
        ],
      },
    ],
  }
  // Drop rotation entirely — labels read left-to-right on every ring.
  protected readonly horizontalLabelsOption = {
    series: [{ label: { rotate: 0, fontSize: 10 } }],
  }
  // Radius starting at 0 closes the centre hole.
  protected readonly solidRadius: [string, string] = ['0%', '90%']
}

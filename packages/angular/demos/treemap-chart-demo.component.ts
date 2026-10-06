import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { UiTreemapChartComponent } from '../../../../../packages/registry-angular/components/charts/treemap-chart/treemap-chart.component'

const teams = [
  { name: 'Backend', value: 22 },
  { name: 'Frontend', value: 18 },
  { name: 'Inside sales', value: 14 },
  { name: 'Field sales', value: 12 },
  { name: 'Customer success', value: 10 },
  { name: 'Marketing', value: 8 },
  { name: 'Support', value: 8 },
  { name: 'Mobile', value: 8 },
  { name: 'Infra', value: 8 },
  { name: 'Sales ops', value: 6 },
]
// Air cargo: weekly tonnage by lane.
const laneTonnage = [
  { name: 'PVG–LAX', value: 520 },
  { name: 'ICN–ORD', value: 410 },
  { name: 'SIN–HKG', value: 380 },
  { name: 'FRA–JFK', value: 360 },
  { name: 'NRT–DFW', value: 350 },
  { name: 'HKG–ANC', value: 290 },
  { name: 'DXB–SIN', value: 280 },
  { name: 'SIN–ICN', value: 190 },
]
const nested = [
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
    name: 'Sales',
    children: [
      { name: 'Inside', value: 14 },
      { name: 'Field', value: 12 },
      { name: 'Ops', value: 6 },
    ],
  },
  {
    name: 'Customer',
    children: [
      { name: 'Success', value: 10 },
      { name: 'Support', value: 8 },
    ],
  },
  {
    name: 'Marketing',
    children: [
      { name: 'Demand gen', value: 5 },
      { name: 'Content', value: 3 },
    ],
  },
]

/** Angular demo for the treemap-chart page. Mirrors demos/react/treemap-chart.tsx 1:1. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'angular-treemap-chart-demo',
  standalone: true,
  imports: [UiTreemapChartComponent],
  template: `
    @switch (story) {
      @case ('Nested') {
        <ui-treemap-chart [data]="nested" height="380" />
      }
      @case ('Color by value') {
        <ui-treemap-chart [data]="teams" [option]="colorByValueOption" height="360" />
      }
      @case ('With breadcrumb') {
        <ui-treemap-chart [data]="nested" [showBreadcrumb]="true" [option]="drillOption" height="380" />
      }
      @case ('Compact') {
        <ui-treemap-chart [data]="teams" height="200" />
      }
      @case ('Lane tonnage') {
        <ui-treemap-chart [data]="laneTonnage" height="320" />
      }
      @default {
        <ui-treemap-chart [data]="teams" height="360" />
      }
    }
  `,
})
export class AngularTreemapChartDemoComponent {
  @Input() story = 'Basic treemap'
  protected readonly teams = teams
  protected readonly laneTonnage = laneTonnage
  protected readonly nested = nested
  // Colour-by-value: paint tiles by absolute value (warmer = higher).
  protected readonly colorByValueOption = {
    visualMap: {
      show: false,
      type: 'continuous',
      min: 0,
      max: 25,
      inRange: { color: ['#fef3c7', '#f59e0b', '#9a3412'] },
    },
    series: [{ colorMappingBy: 'value' }],
  }
  protected readonly drillOption = {
    series: [{ roam: 'move', nodeClick: 'zoomToNode' }],
  }
}

import { Component, Input } from '@angular/core'
import { UiBarChartComponent } from '../../../../../packages/registry-angular/components/charts/bar-chart/bar-chart.component'

/** Angular demo for the bar-chart page. Mirrors demos/react/bar-chart.tsx story by story. */
@Component({
  selector: 'angular-bar-chart-demo',
  standalone: true,
  imports: [UiBarChartComponent],
  template: `
    @switch (story) {
      @case ('Vertical bars') {
        <ui-bar-chart [data]="sales" xField="category" yField="value" height="280" />
      }
      @case ('Horizontal bars') {
        <ui-bar-chart
          [data]="sales"
          xField="category"
          yField="value"
          [option]="horizontalOption"
          height="280"
        />
      }
      @case ('Grouped') {
        <ui-bar-chart
          [data]="grouped"
          xField="quarter"
          [yField]="['north', 'south', 'east', 'west']"
          height="320"
        />
      }
      @case ('Stacked') {
        <ui-bar-chart
          [data]="grouped"
          xField="quarter"
          [yField]="['north', 'south', 'east', 'west']"
          [option]="stackedOption"
          height="320"
        />
      }
      @case ('Negative values') {
        <ui-bar-chart
          [data]="cashflow"
          xField="week"
          yField="net"
          [option]="negativeOption"
          height="280"
        />
      }
      @case ('Value labels') {
        <ui-bar-chart
          [data]="sales"
          xField="category"
          yField="value"
          [valueLabels]="true"
          height="300"
        />
      }
      @case ('Stacked prop') {
        <ui-bar-chart
          [data]="grouped"
          xField="quarter"
          [yField]="['north', 'south', 'east', 'west']"
          [stacked]="true"
          height="320"
        />
      }
      @case ('Carrier tonnage, MTD shading') {
        <ui-bar-chart
          [data]="carrierWeeks"
          xField="week"
          [yField]="['sq', 'cx', 'lh']"
          [stacked]="true"
          [option]="mtdOption"
          height="320"
        />
      }
      @default {
        <ui-bar-chart [data]="sales" xField="category" yField="value" height="280" />
      }
    }
  `,
})
export class AngularBarChartDemoComponent {
  @Input() story = 'Vertical bars'

  sales = [
    { category: 'Electronics', value: 350 },
    { category: 'Clothing', value: 280 },
    { category: 'Home', value: 210 },
    { category: 'Sports', value: 160 },
    { category: 'Books', value: 90 },
  ]

  grouped = [
    { quarter: 'Q1', north: 240, south: 180, east: 210, west: 150 },
    { quarter: 'Q2', north: 310, south: 220, east: 260, west: 190 },
    { quarter: 'Q3', north: 380, south: 280, east: 290, west: 230 },
    { quarter: 'Q4', north: 450, south: 340, east: 350, west: 280 },
  ]

  cashflow = [
    { week: 'W1', net: 1200 },
    { week: 'W2', net: -420 },
    { week: 'W3', net: 980 },
    { week: 'W4', net: -180 },
    { week: 'W5', net: 1540 },
    { week: 'W6', net: -680 },
  ]

  carrierWeeks = [
    { week: 'W20', sq: 820, cx: 640, lh: 410 },
    { week: 'W21', sq: 880, cx: 610, lh: 430 },
    { week: 'W22', sq: 790, cx: 660, lh: 390 },
    { week: 'W23', sq: 910, cx: 700, lh: 450 },
    { week: 'W24', sq: 860, cx: 680, lh: 470 },
    { week: 'W25', sq: 930, cx: 720, lh: 460 },
  ]

  mtdOption: Record<string, unknown> = {
    series: [
      {
        markArea: {
          silent: true,
          itemStyle: { color: 'rgba(148, 163, 184, 0.12)' },
          label: { color: '#64748b', fontSize: 10, position: 'insideTop' },
          data: [[{ name: 'MTD', xAxis: 'W25' }, { xAxis: 'W25' }]],
        },
      },
    ],
  }

  horizontalOption: Record<string, unknown> = {
    xAxis: { type: 'value' },
    yAxis: { type: 'category', data: this.sales.map((s) => s.category) },
  }

  stackedOption: Record<string, unknown> = {
    series: [{ stack: 'r' }, { stack: 'r' }, { stack: 'r' }, { stack: 'r' }],
  }

  negativeOption: Record<string, unknown> = {
    series: [
      {
        itemStyle: {
          color: (params: { value: number }) => (params.value >= 0 ? '#14b8a6' : '#f97316'),
        },
      },
    ],
  }
}

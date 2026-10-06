import { Component, Input } from '@angular/core'
import { UiAreaChartComponent } from '../../../../../packages/registry-angular/components/charts/area-chart/area-chart.component'

/** Angular demo for the area-chart page. Mirrors demos/react/area-chart.tsx story by story. */
@Component({
  selector: 'angular-area-chart-demo',
  standalone: true,
  imports: [UiAreaChartComponent],
  template: `
    @switch (story) {
      @case ('Basic area') {
        <ui-area-chart [data]="monthlyRevenue" xField="month" yField="revenue" height="280" />
      }
      @case ('Multi-series') {
        <ui-area-chart
          [data]="multiSeries"
          xField="month"
          [yField]="['desktop', 'mobile', 'tablet']"
          height="300"
        />
      }
      @case ('Stacked') {
        <ui-area-chart
          [data]="multiSeries"
          xField="month"
          [yField]="['desktop', 'mobile', 'tablet']"
          [option]="stackedOption"
          height="300"
        />
      }
      @case ('Gradient fill') {
        <ui-area-chart
          [data]="monthlyRevenue"
          xField="month"
          yField="revenue"
          [option]="gradientOption"
          height="280"
        />
      }
      @case ('Stepped') {
        <ui-area-chart
          [data]="monthlyRevenue"
          xField="month"
          yField="revenue"
          [option]="steppedOption"
          height="280"
        />
      }
      @case ('Linear multi') {
        <ui-area-chart
          [data]="multiSeries"
          xField="month"
          [yField]="['desktop', 'mobile', 'tablet']"
          curve="linear"
          height="300"
        />
      }
      @case ('Markers on') {
        <ui-area-chart
          [data]="monthlyRevenue"
          xField="month"
          yField="revenue"
          [markers]="true"
          height="280"
        />
      }
      @case ('Stacked prop') {
        <ui-area-chart
          [data]="multiSeries"
          xField="month"
          [yField]="['desktop', 'mobile', 'tablet']"
          [stacked]="true"
          height="300"
        />
      }
      @default {
        <ui-area-chart [data]="monthlyRevenue" xField="month" yField="revenue" height="280" />
      }
    }
  `,
})
export class AngularAreaChartDemoComponent {
  @Input() story = 'Basic area'

  monthlyRevenue = [
    { month: 'Jan', revenue: 4200 },
    { month: 'Feb', revenue: 5100 },
    { month: 'Mar', revenue: 4800 },
    { month: 'Apr', revenue: 6200 },
    { month: 'May', revenue: 5800 },
    { month: 'Jun', revenue: 7100 },
    { month: 'Jul', revenue: 7600 },
    { month: 'Aug', revenue: 8200 },
  ]

  multiSeries = [
    { month: 'Jan', desktop: 4200, mobile: 2400, tablet: 1100 },
    { month: 'Feb', desktop: 5100, mobile: 3200, tablet: 1300 },
    { month: 'Mar', desktop: 4800, mobile: 3800, tablet: 1500 },
    { month: 'Apr', desktop: 6200, mobile: 4400, tablet: 1700 },
    { month: 'May', desktop: 5800, mobile: 4800, tablet: 1900 },
    { month: 'Jun', desktop: 7100, mobile: 5600, tablet: 2200 },
  ]

  stackedOption: Record<string, unknown> = {
    series: [
      { stack: 'total', areaStyle: { opacity: 0.7 } },
      { stack: 'total', areaStyle: { opacity: 0.7 } },
      { stack: 'total', areaStyle: { opacity: 0.7 } },
    ],
  }

  gradientOption: Record<string, unknown> = {
    series: [
      {
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(245, 158, 11, 0.6)' },
              { offset: 1, color: 'rgba(245, 158, 11, 0)' },
            ],
          },
        },
      },
    ],
  }

  steppedOption: Record<string, unknown> = {
    series: [{ smooth: false, step: 'end', areaStyle: { opacity: 0.4 } }],
  }
}

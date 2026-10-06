import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { UiLineChartComponent } from '../../../../../packages/registry-angular/components/charts/line-chart/line-chart.component'

/** Angular demo for the line-chart primitive page. Mirrors demos/react/line-chart.tsx. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'angular-line-chart-demo',
  standalone: true,
  imports: [UiLineChartComponent],
  template: `
    @switch (story) {
      @case ('Multi-series') {
        <ui-line-chart [data]="traffic" xField="day" [yField]="['sessions', 'signups']" [height]="300" />
      }
      @case ('Smooth, no markers') {
        <ui-line-chart
          [data]="traffic"
          xField="day"
          [yField]="['sessions', 'signups']"
          [option]="smoothOption"
          [height]="300"
        />
      }
      @case ('Solid + dashed') {
        <ui-line-chart
          [data]="traffic"
          xField="day"
          [yField]="['sessions', 'signups']"
          [option]="dashedOption"
          [height]="300"
        />
      }
      @case ('Stepped') {
        <ui-line-chart [data]="traffic" xField="day" yField="sessions" [option]="steppedOption" [height]="280" />
      }
      @case ('Peak marker + target line') {
        <ui-line-chart [data]="traffic" xField="day" yField="sessions" [option]="markersOption" [height]="280" />
      }
      @case ('Linear curves') {
        <ui-line-chart [data]="traffic" xField="day" [yField]="['sessions', 'signups']" curve="linear" [height]="300" />
      }
      @case ('Step start') {
        <ui-line-chart [data]="traffic" xField="day" yField="sessions" curve="stepStart" [height]="280" />
      }
      @case ('Stacked lines') {
        <ui-line-chart
          [data]="traffic"
          xField="day"
          [yField]="['sessions', 'signups']"
          [stacked]="true"
          [height]="300"
        />
      }
      @case ('Dashed forecast') {
        <ui-line-chart
          [data]="traffic"
          xField="day"
          yField="sessions"
          [dashed]="true"
          [markers]="false"
          [height]="280"
        />
      }
      @case ('Forecast vs flown, peak shading') {
        <ui-line-chart
          [data]="cargoDemand"
          xField="m"
          [yField]="['flown', 'forecast']"
          [option]="peakOption"
          [height]="320"
        />
      }
      @case ('Lunar New Year window') {
        <ui-line-chart [data]="spotRates" xField="m" yField="tpeb" [option]="cnyOption" [height]="300" />
      }
      @case ('Capacity change points') {
        <ui-line-chart [data]="spotRates" xField="m" yField="fewb" [option]="changeOption" [height]="300" />
      }
      @default {
        <ui-line-chart [data]="traffic" xField="day" yField="sessions" [height]="280" />
      }
    }
  `,
})
export class AngularLineChartDemoComponent {
  @Input() story = 'Basic line'

  readonly traffic = [
    { day: 'Mon', sessions: 2400, signups: 240 },
    { day: 'Tue', sessions: 2900, signups: 310 },
    { day: 'Wed', sessions: 2700, signups: 280 },
    { day: 'Thu', sessions: 3400, signups: 380 },
    { day: 'Fri', sessions: 3800, signups: 450 },
    { day: 'Sat', sessions: 2100, signups: 180 },
    { day: 'Sun', sessions: 1900, signups: 160 },
  ]

  readonly smoothOption = {
    series: [
      { smooth: true, symbol: 'none' },
      { smooth: true, symbol: 'none' },
    ],
  }

  readonly dashedOption = {
    series: [
      { lineStyle: { width: 2, type: 'solid' as const }, symbol: 'circle', symbolSize: 6 },
      { lineStyle: { width: 2, type: 'dashed' as const }, symbol: 'none' },
    ],
  }

  readonly steppedOption = {
    series: [{ smooth: false, step: 'middle' as const, symbol: 'circle', symbolSize: 5 }],
  }

  readonly cargoDemand = [
    { m: 'Jan', flown: 18200, forecast: 17800 },
    { m: 'Feb', flown: 16400, forecast: 17200 },
    { m: 'Mar', flown: 19800, forecast: 19100 },
    { m: 'Apr', flown: 20500, forecast: 20300 },
    { m: 'May', flown: 21300, forecast: 21000 },
    { m: 'Jun', flown: 22100, forecast: 22400 },
    { m: 'Jul', flown: 21800, forecast: 23100 },
    { m: 'Aug', flown: 23600, forecast: 24000 },
    { m: 'Sep', flown: 26400, forecast: 25800 },
    { m: 'Oct', flown: 28900, forecast: 27600 },
    { m: 'Nov', flown: 30100, forecast: 29400 },
    { m: 'Dec', flown: 27600, forecast: 28200 },
  ]

  readonly peakOption = {
    series: [
      {
        markArea: {
          silent: true,
          itemStyle: { color: 'rgba(245, 158, 11, 0.08)' },
          label: { color: '#b45309', fontSize: 10, position: 'insideTop' as const },
          data: [[{ name: 'Peak Sep–Dec', xAxis: 'Sep' }, { xAxis: 'Dec' }]],
        },
      },
      {},
    ],
  }

  readonly spotRates = [
    { m: 'Jan', tpeb: 4.1, fewb: 3.8 },
    { m: 'Feb', tpeb: 5.9, fewb: 5.2 },
    { m: 'Mar', tpeb: 4.4, fewb: 4.0 },
    { m: 'Apr', tpeb: 4.0, fewb: 3.7 },
    { m: 'May', tpeb: 4.3, fewb: 3.9 },
    { m: 'Jun', tpeb: 4.7, fewb: 4.2 },
  ]

  readonly cnyOption = {
    series: [
      {
        markLine: {
          silent: true,
          symbol: 'none',
          lineStyle: { type: 'dashed' as const, color: '#dc2626' },
          label: { formatter: 'CNY Feb 17', color: '#dc2626', fontSize: 10, position: 'insideEndTop' as const },
          data: [{ xAxis: 'Feb' }],
        },
      },
    ],
  }

  readonly changeOption = {
    series: [
      {
        markPoint: {
          symbol: 'diamond',
          symbolSize: 16,
          itemStyle: { color: '#14b8a6' },
          label: { color: '#fff', fontSize: 9, formatter: '{b}' },
          data: [
            { name: 'B747', coord: ['Apr', 3.7] },
            { name: '+1 rot', coord: ['Jun', 4.2] },
          ],
        },
      },
    ],
  }

  readonly markersOption = {
    series: [
      {
        markPoint: {
          symbol: 'pin',
          symbolSize: 36,
          label: { color: '#fff', fontSize: 10 },
          data: [{ type: 'max', name: 'Peak' }],
        },
        markLine: {
          silent: true,
          symbol: 'none',
          lineStyle: { type: 'dashed' as const, color: '#94a3b8' },
          label: { formatter: 'Target', position: 'insideEndTop' as const },
          data: [{ yAxis: 3200 }],
        },
      },
    ],
  }
}

import { Component, Input } from '@angular/core'
import { UiCandlestickChartComponent } from '../../../../../packages/registry-angular/components/charts/candlestick-chart/candlestick-chart.component'

/** Angular demo for the candlestick-chart page. Mirrors demos/react/candlestick-chart.tsx story by story. */
@Component({
  selector: 'angular-candlestick-chart-demo',
  standalone: true,
  imports: [UiCandlestickChartComponent],
  template: `
    @switch (story) {
      @case ('Daily OHLC') {
        <ui-candlestick-chart [data]="recent" height="340" />
      }
      @case ('With data-zoom') {
        <ui-candlestick-chart [data]="month" [zoom]="true" height="360" />
      }
      @case ('Bearish session') {
        <ui-candlestick-chart [data]="bearish" height="320" />
      }
      @case ('Weekly candles') {
        <ui-candlestick-chart [data]="weekly" height="320" />
      }
      @case ('Sparkline-style') {
        <ui-candlestick-chart [data]="recent" [option]="minimalOption" height="120" />
      }
      @default {
        <ui-candlestick-chart [data]="recent" height="340" />
      }
    }
  `,
})
export class AngularCandlestickChartDemoComponent {
  @Input() story = 'Daily OHLC'

  recent = [
    { date: '2026-03-01', open: 145, close: 148, low: 142, high: 150 },
    { date: '2026-03-02', open: 148, close: 144, low: 142, high: 149 },
    { date: '2026-03-03', open: 144, close: 151, low: 143, high: 152 },
    { date: '2026-03-04', open: 151, close: 155, low: 150, high: 157 },
    { date: '2026-03-05', open: 155, close: 153, low: 150, high: 156 },
    { date: '2026-03-08', open: 153, close: 158, low: 152, high: 160 },
    { date: '2026-03-09', open: 158, close: 162, low: 156, high: 163 },
    { date: '2026-03-10', open: 162, close: 159, low: 156, high: 163 },
    { date: '2026-03-11', open: 159, close: 164, low: 158, high: 166 },
    { date: '2026-03-12', open: 164, close: 167, low: 162, high: 169 },
  ]

  month = Array.from({ length: 30 }, (_, i) => {
    const base = 140 + Math.sin(i * 0.4) * 14 + i * 0.5
    const open = +base.toFixed(1)
    const close = +(base + Math.sin(i * 0.7) * 4).toFixed(1)
    const low = Math.min(open, close) - 2 - Math.random() * 2
    const high = Math.max(open, close) + 2 + Math.random() * 2
    const d = new Date('2026-03-01T00:00:00Z')
    d.setUTCDate(d.getUTCDate() + i)
    return { date: d.toISOString().slice(0, 10), open, close, low: +low.toFixed(1), high: +high.toFixed(1) }
  })

  bearish = [
    { date: '2026-04-01', open: 184, close: 178, low: 176, high: 186 },
    { date: '2026-04-02', open: 178, close: 174, low: 172, high: 180 },
    { date: '2026-04-03', open: 174, close: 168, low: 165, high: 175 },
    { date: '2026-04-06', open: 168, close: 170, low: 166, high: 172 },
    { date: '2026-04-07', open: 170, close: 162, low: 160, high: 171 },
    { date: '2026-04-08', open: 162, close: 158, low: 154, high: 163 },
    { date: '2026-04-09', open: 158, close: 161, low: 156, high: 163 },
    { date: '2026-04-10', open: 161, close: 154, low: 152, high: 162 },
    { date: '2026-04-13', open: 154, close: 150, low: 147, high: 156 },
    { date: '2026-04-14', open: 150, close: 152, low: 148, high: 154 },
  ]

  weekly = Array.from({ length: 13 }, (_, i) => {
    const base = 120 + i * 3 + Math.sin(i * 0.8) * 6
    const open = +base.toFixed(1)
    const close = +(base + Math.sin(i * 1.1) * 4 + (i % 3 === 0 ? -3 : 2)).toFixed(1)
    const low = +(Math.min(open, close) - 3 - Math.random() * 2).toFixed(1)
    const high = +(Math.max(open, close) + 3 + Math.random() * 2).toFixed(1)
    const d = new Date('2026-01-05T00:00:00Z')
    d.setUTCDate(d.getUTCDate() + i * 7)
    return { date: d.toISOString().slice(0, 10), open, close, low, high }
  })

  minimalOption: Record<string, unknown> = {
    yAxis: { splitLine: { show: false } },
    grid: { left: 4, right: 4, top: 8, bottom: 8, containLabel: false },
    xAxis: { axisLabel: { show: false } },
  }
}

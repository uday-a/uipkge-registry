<script setup lang="ts">
import { CandlestickChart } from '@/components/ui/charts'
// Two weeks of daily OHLC. Real series would come from an API; this is
// hand-crafted to read as a bullish-then-volatile session.
const recent = [
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

// 30-day series for the data-zoom story.
const month = Array.from({ length: 30 }, (_, i) => {
  const base = 140 + Math.sin(i * 0.4) * 14 + i * 0.5
  const open = +base.toFixed(1)
  const close = +(base + Math.sin(i * 0.7) * 4).toFixed(1)
  const low = Math.min(open, close) - 2 - Math.random() * 2
  const high = Math.max(open, close) + 2 + Math.random() * 2
  const d = new Date('2026-03-01T00:00:00Z')
  d.setUTCDate(d.getUTCDate() + i)
  return { date: d.toISOString().slice(0, 10), open, close, low: +low.toFixed(1), high: +high.toFixed(1) }
})

// Two-week bearish stretch — opens high, closes lower, choppy floor.
const bearish = [
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

// One candle per week for a quarter — aggregated daily OHLC.
const weekly = Array.from({ length: 13 }, (_, i) => {
  const base = 120 + i * 3 + Math.sin(i * 0.8) * 6
  const open = +base.toFixed(1)
  const close = +(base + Math.sin(i * 1.1) * 4 + (i % 3 === 0 ? -3 : 2)).toFixed(1)
  const low = +(Math.min(open, close) - 3 - Math.random() * 2).toFixed(1)
  const high = +(Math.max(open, close) + 3 + Math.random() * 2).toFixed(1)
  const d = new Date('2026-01-05T00:00:00Z')
  d.setUTCDate(d.getUTCDate() + i * 7)
  return { date: d.toISOString().slice(0, 10), open, close, low, high }
})

const minimalOption = {
  yAxis: { splitLine: { show: false } },
  grid: { left: 4, right: 4, top: 8, bottom: 8, containLabel: false },
  xAxis: { axisLabel: { show: false } },
}
</script>

<template>
  <Story
    title="Daily OHLC"
    description="Standard four-value candle: open / close / low / high. Teal renders bullish (close >= open); orange renders bearish."
  >
    <CandlestickChart :data="recent" height="340" />
  </Story>

  <Story
    title="With data-zoom"
    description="Toggle the slider to scrub through longer time-series. Inside-zoom is on too, so mouse-wheel zoom works inside the plot area."
  >
    <CandlestickChart :data="month" :zoom="true" height="360" />
  </Story>

  <Story
    title="Bearish session"
    description="Same shape, different colour balance. When close &lt; open dominates, the canvas tilts toward the bearish hue — a fast visual cue for drawdown periods."
  >
    <CandlestickChart :data="bearish" height="320" />
  </Story>

  <Story
    title="Weekly candles"
    description="One candle per ISO week across a quarter. Aggregating daily into weekly OHLC smooths intra-week noise and lets longer trends emerge."
  >
    <CandlestickChart :data="weekly" height="320" />
  </Story>

  <Story
    title="Sparkline-style"
    description="Drop the gridlines and axis labels for inline placement next to a KPI. Strips it down to pure shape — works when the price scale is contextual."
  >
    <CandlestickChart :data="recent" :option="minimalOption" height="120" />
  </Story>
</template>

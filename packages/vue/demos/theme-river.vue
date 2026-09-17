<script setup lang="ts">
import { ThemeRiver } from '@/components/ui/charts'
// 12 days x 4 topics. ECharts expects [time, value, series] tuples.
const days = Array.from({ length: 12 }, (_, i) => {
  const d = new Date('2026-04-01T00:00:00Z')
  d.setUTCDate(d.getUTCDate() + i)
  return d.toISOString().slice(0, 10)
})

const topics = ['Frontend', 'Backend', 'Mobile', 'DevOps']
const weights = {
  Frontend: [12, 16, 22, 25, 28, 30, 26, 24, 28, 32, 36, 40],
  Backend: [8, 10, 12, 14, 14, 18, 22, 26, 24, 22, 20, 24],
  Mobile: [4, 6, 7, 9, 12, 14, 16, 18, 22, 26, 28, 30],
  DevOps: [2, 3, 4, 6, 8, 10, 12, 14, 12, 10, 8, 6],
} as Record<string, number[]>

const topicData: [string, number, string][] = []
for (const t of topics) {
  for (let i = 0; i < days.length; i++) {
    topicData.push([days[i]!, weights[t]![i]!, t])
  }
}

// 8-week channel acquisition.
const weeks = Array.from({ length: 8 }, (_, i) => {
  const d = new Date('2026-01-06T00:00:00Z')
  d.setUTCDate(d.getUTCDate() + i * 7)
  return d.toISOString().slice(0, 10)
})
const channels = ['Search', 'Social', 'Direct', 'Referral'] as const
const acquisitions: Record<(typeof channels)[number], number[]> = {
  Search: [120, 180, 240, 320, 380, 360, 420, 500],
  Social: [60, 80, 110, 140, 220, 280, 320, 360],
  Direct: [200, 210, 220, 230, 240, 250, 260, 280],
  Referral: [30, 40, 60, 75, 90, 110, 130, 160],
}
const channelData: [string, number, string][] = []
for (const c of channels) {
  for (let i = 0; i < weeks.length; i++) {
    channelData.push([weeks[i]!, acquisitions[c]![i]!, c])
  }
}

// Sentiment streams across a release week.
const releaseDays = Array.from({ length: 7 }, (_, i) => {
  const d = new Date('2026-03-10T00:00:00Z')
  d.setUTCDate(d.getUTCDate() + i)
  return d.toISOString().slice(0, 10)
})
const sentimentSeries = {
  Positive: [40, 52, 68, 72, 80, 64, 58],
  Neutral: [22, 18, 16, 12, 14, 18, 22],
  Negative: [8, 14, 12, 8, 6, 12, 16],
} as const
const sentimentData: [string, number, string][] = []
for (const s of Object.keys(sentimentSeries) as Array<keyof typeof sentimentSeries>) {
  for (let i = 0; i < releaseDays.length; i++) {
    sentimentData.push([releaseDays[i]!, sentimentSeries[s][i]!, s])
  }
}

const noLegendOption = {
  legend: { show: false },
}
</script>

<template>
  <Story
    title="Topic volume over time"
    description="Stacked streams centred on a baseline. Vertical thickness shows volume for each topic at every tick."
  >
    <ThemeRiver :data="topicData" height="340" />
  </Story>

  <Story
    title="Channel acquisition over weeks"
    description="Weekly buckets render the same way; ECharts spaces the ticks by the time axis. Useful for marketing breakdowns where total volume tells one story and share tells another."
  >
    <ThemeRiver :data="channelData" height="320" />
  </Story>

  <Story
    title="Release-week sentiment"
    description="Three streams (Positive / Neutral / Negative) across a tight 7-day window. Tight ranges make the relative widths read as percentages even though the y-axis is absolute."
  >
    <ThemeRiver :data="sentimentData" height="280" />
  </Story>

  <Story
    title="No legend"
    description="When the surrounding copy already names the streams, drop the legend with option.legend.show=false to reclaim the bottom margin."
  >
    <ThemeRiver :data="sentimentData" :option="noLegendOption" height="260" />
  </Story>

  <Story
    title="Compact"
    description="A shorter height for aside placement. Theme-river degrades gracefully — stream proportions stay readable down to ~160px."
  >
    <ThemeRiver :data="topicData" height="180" />
  </Story>
</template>

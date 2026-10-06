import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { UiThemeRiverComponent } from '../../../../../packages/registry-angular/components/charts/theme-river/theme-river.component'

type RiverTuple = [string, number, string]

function buildTuples(days: string[], weights: Record<string, number[]>, series: string[]): RiverTuple[] {
  const out: RiverTuple[] = []
  for (const s of series) {
    for (let i = 0; i < days.length; i++) {
      out.push([days[i]!, weights[s]![i]!, s])
    }
  }
  return out
}

function dateRange(start: string, count: number, stepDays: number): string[] {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(start)
    d.setUTCDate(d.getUTCDate() + i * stepDays)
    return d.toISOString().slice(0, 10)
  })
}

// 12 days x 4 topics. ECharts expects [time, value, series] tuples.
const topicDays = dateRange('2026-04-01T00:00:00Z', 12, 1)
const topicWeights: Record<string, number[]> = {
  Frontend: [12, 16, 22, 25, 28, 30, 26, 24, 28, 32, 36, 40],
  Backend: [8, 10, 12, 14, 14, 18, 22, 26, 24, 22, 20, 24],
  Mobile: [4, 6, 7, 9, 12, 14, 16, 18, 22, 26, 28, 30],
  DevOps: [2, 3, 4, 6, 8, 10, 12, 14, 12, 10, 8, 6],
}
const topicData = buildTuples(topicDays, topicWeights, ['Frontend', 'Backend', 'Mobile', 'DevOps'])

// 8-week channel acquisition.
const weeks = dateRange('2026-01-06T00:00:00Z', 8, 7)
const acquisitions: Record<string, number[]> = {
  Search: [120, 180, 240, 320, 380, 360, 420, 500],
  Social: [60, 80, 110, 140, 220, 280, 320, 360],
  Direct: [200, 210, 220, 230, 240, 250, 260, 280],
  Referral: [30, 40, 60, 75, 90, 110, 130, 160],
}
const channelData = buildTuples(weeks, acquisitions, ['Search', 'Social', 'Direct', 'Referral'])

// Sentiment streams across a release week.
const releaseDays = dateRange('2026-03-10T00:00:00Z', 7, 1)
const sentimentSeries: Record<string, number[]> = {
  Positive: [40, 52, 68, 72, 80, 64, 58],
  Neutral: [22, 18, 16, 12, 14, 18, 22],
  Negative: [8, 14, 12, 8, 6, 12, 16],
}
const sentimentData = buildTuples(releaseDays, sentimentSeries, ['Positive', 'Neutral', 'Negative'])

/** Angular demo for the theme-river page. Mirrors demos/react/theme-river.tsx 1:1. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'angular-theme-river-demo',
  standalone: true,
  imports: [UiThemeRiverComponent],
  template: `
    @switch (story) {
      @case ('Channel acquisition over weeks') {
        <ui-theme-river [data]="channelData" height="320" />
      }
      @case ('Release-week sentiment') {
        <ui-theme-river [data]="sentimentData" height="280" />
      }
      @case ('No legend') {
        <ui-theme-river [data]="sentimentData" [option]="noLegendOption" height="260" />
      }
      @case ('Compact') {
        <ui-theme-river [data]="topicData" height="180" />
      }
      @default {
        <ui-theme-river [data]="topicData" height="340" />
      }
    }
  `,
})
export class AngularThemeRiverDemoComponent {
  @Input() story = 'Topic volume over time'
  protected readonly topicData = topicData
  protected readonly channelData = channelData
  protected readonly sentimentData = sentimentData
  protected readonly noLegendOption = { legend: { show: false } }
}

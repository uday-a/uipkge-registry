<script setup lang="ts">
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { CustomChart as EChartsCustomChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  MarkPointComponent,
  MarkLineComponent,
  LegendComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'
import { cn } from '@/lib/utils'
import {
  chartColors,
  chartTextColor,
  chartAxisColor,
  chartSplitLineColor,
  chartTooltipBg,
  chartTooltipBorder,
  chartTooltipText,
  mergeOptionBlock,
} from '../useChartTheme'

use([
  CanvasRenderer,
  EChartsCustomChart,
  GridComponent,
  TooltipComponent,
  MarkPointComponent,
  MarkLineComponent,
  LegendComponent,
])

export interface GanttTask {
  name: string
  /** ISO date strings. */
  start: string
  end: string
  /** 0..1 fraction shaded darker as progress. */
  progress?: number
  group?: string
}

export interface GanttMilestone {
  /** Task name to pin the diamond to. */
  task: string
  /** ISO date string. */
  date: string
  label?: string
}

interface Props {
  tasks: GanttTask[]
  /** Diamond markers pinned to tasks. */
  milestones?: GanttMilestone[]
  /** ISO date for a dashed "today" line. Pass explicitly (no implicit now() so SSR stays deterministic). */
  today?: string
  height?: number | string
  option?: any
  class?: string
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  height: 320,
})

const mergedOption = computed(() => {
  const groups = [...new Set(props.tasks.map((t) => t.group ?? 'default'))]
  const colorOf = (t: GanttTask) => chartColors.value[groups.indexOf(t.group ?? 'default') % chartColors.value.length]
  const series = [
    {
      type: 'custom',
      renderItem: (params: any, api: any) => {
        const i: number = params.dataIndex
        const t = props.tasks[i]!
        const start = api.coord([api.value(0), i])
        const end = api.coord([api.value(1), i])
        const h = Math.max(8, api.size!([0, 1])[1] * 0.55)
        const p = Math.max(0, Math.min(1, t.progress ?? 1))
        return {
          type: 'group',
          children: [
            {
              type: 'rect',
              shape: { x: start[0], y: start[1] - h / 2, width: Math.max(2, end[0] - start[0]), height: h, r: 4 },
              style: { fill: colorOf(t), opacity: 0.3 },
            },
            {
              type: 'rect',
              shape: { x: start[0], y: start[1] - h / 2, width: Math.max(2, (end[0] - start[0]) * p), height: h, r: 4 },
              style: { fill: colorOf(t) },
            },
          ],
        }
      },
      encode: { x: [0, 1], y: 2 },
      data: props.tasks.map((t, i) => [t.start, t.end, i]),
      markPoint: props.milestones?.length
        ? {
            symbol: 'diamond',
            symbolSize: 13,
            itemStyle: { color: chartColors.value[3], borderColor: chartTooltipBg.value, borderWidth: 1.5 },
            label: {
              show: true,
              fontSize: 9,
              color: chartTextColor.value,
              formatter: '{b}',
              position: 'top',
              distance: 6,
            },
            data: props.milestones.map((m) => ({
              name: m.label ?? m.task,
              coord: [m.date, props.tasks.findIndex((t) => t.name === m.task)],
            })),
          }
        : undefined,
      markLine: props.today
        ? {
            silent: true,
            symbol: 'none',
            lineStyle: { type: 'dashed', color: chartTextColor.value, width: 1 },
            label: { formatter: 'Today', color: chartTextColor.value, fontSize: 10, position: 'insideEndTop' },
            data: [{ xAxis: props.today }],
          }
        : undefined,
    },
  ]
  const userOption: any = props.option ?? {}
  const {
    series: userSeries,
    xAxis: userXAxis,
    yAxis: userYAxis,
    grid: userGrid,
    tooltip: userTooltip,
    ...userRest
  } = userOption
  const mergedSeries = Array.isArray(userSeries) ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) })) : series
  return {
    color: chartColors.value,
    grid: mergeOptionBlock({ left: 16, right: 16, top: 24, bottom: 24, containLabel: true }, userGrid),
    tooltip: mergeOptionBlock(
      {
        trigger: 'item',
        backgroundColor: chartTooltipBg.value,
        borderColor: chartTooltipBorder.value,
        textStyle: { color: chartTooltipText.value, fontSize: 12 },
        formatter: (p: any) => {
          const t = props.tasks[p.dataIndex]
          return `${t?.name}<br/>${String(t?.start).slice(0, 10)} → ${String(t?.end).slice(0, 10)}`
        },
      },
      userTooltip,
    ),
    legend: { show: false },
    xAxis: mergeOptionBlock(
      {
        type: 'time',
        splitLine: { lineStyle: { color: chartSplitLineColor.value } },
        axisLabel: { color: chartTextColor.value, fontSize: 11 },
      },
      userXAxis,
    ),
    yAxis: mergeOptionBlock(
      {
        type: 'category',
        inverse: true,
        data: props.tasks.map((t) => t.name),
        axisLine: { lineStyle: { color: chartAxisColor.value } },
        axisLabel: { color: chartTextColor.value, fontSize: 11 },
        axisTick: { show: false },
      },
      userYAxis,
    ),
    series: mergedSeries,
    ...userRest,
  }
})
</script>

<template>
  <div
    role="img"
    tabindex="0"
    :aria-label="ariaLabel || 'Chart'"
    :style="{ height: /^\d+$/.test(String(height)) ? `${height}px` : String(height) }"
    :class="cn('focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none', props.class)"
  >
    <VChart :option="mergedOption" :autoresize="true" class="size-full" />
  </div>
</template>

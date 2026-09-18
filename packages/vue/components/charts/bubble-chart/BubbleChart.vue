<script setup lang="ts">
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { ScatterChart as EChartsScatterChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
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

use([CanvasRenderer, EChartsScatterChart, GridComponent, TooltipComponent, LegendComponent])

interface Props {
  data: Record<string, any>[]
  xField?: string
  yField?: string
  sizeField?: string
  categoryField?: string
  /** Bubble opacity. Default 0.75. */
  opacity?: number
  /** Smallest bubble diameter in px. Default 8. */
  minSize?: number
  /** Largest bubble diameter in px. Default 42. */
  maxSize?: number
  height?: number | string
  option?: any
  class?: string
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  xField: 'x',
  yField: 'y',
  sizeField: 'size',
  opacity: 0.75,
  minSize: 8,
  maxSize: 42,
  height: 320,
})

const mergedOption = computed(() => {
  const categoryField = props.categoryField
  const cats = categoryField ? [...new Set(props.data.map((d) => String(d[categoryField])))] : ['default']
  const sizes = props.data.map((d) => +d[props.sizeField] || 0)
  const maxSize = Math.max(...sizes, 1)
  const scale = (v: number) => props.minSize + Math.sqrt(v / maxSize) * (props.maxSize - props.minSize)
  const series = cats.map((cat, i) => ({
    name: String(cat),
    type: 'scatter',
    symbolSize: (val: any[]) => scale(val[2]),
    itemStyle: { color: chartColors.value[i % chartColors.value.length], opacity: props.opacity },
    data: (categoryField ? props.data.filter((d) => String(d[categoryField]) === cat) : props.data).map((d) => [
      d[props.xField],
      d[props.yField],
      +d[props.sizeField] || 0,
      d,
    ]),
  }))
  const userOption: any = props.option ?? {}
  const {
    series: userSeries,
    xAxis: userXAxis,
    yAxis: userYAxis,
    grid: userGrid,
    tooltip: userTooltip,
    legend: userLegend,
    ...userRest
  } = userOption
  const mergedSeries = Array.isArray(userSeries) ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) })) : series
  return {
    color: chartColors.value,
    grid: mergeOptionBlock(
      { left: 16, right: 16, top: 24, bottom: cats.length > 1 ? 32 : 24, containLabel: true },
      userGrid,
    ),
    tooltip: mergeOptionBlock(
      {
        trigger: 'item',
        backgroundColor: chartTooltipBg.value,
        borderColor: chartTooltipBorder.value,
        textStyle: { color: chartTooltipText.value, fontSize: 12 },
        formatter: (p: any) =>
          `${p.seriesName}<br/>${props.xField}: ${p.value[0]}<br/>${props.yField}: ${p.value[1]}<br/>${props.sizeField}: ${p.value[2]}`,
      },
      userTooltip,
    ),
    legend:
      cats.length > 1
        ? mergeOptionBlock(
            {
              bottom: 0,
              icon: 'circle',
              itemWidth: 8,
              itemHeight: 8,
              textStyle: { fontSize: 11, color: chartTextColor.value },
            },
            userLegend,
          )
        : undefined,
    xAxis: mergeOptionBlock(
      {
        type: 'value',
        scale: true,
        splitLine: { lineStyle: { color: chartSplitLineColor.value } },
        axisLabel: { color: chartTextColor.value, fontSize: 11 },
        axisLine: { lineStyle: { color: chartAxisColor.value } },
      },
      userXAxis,
    ),
    yAxis: mergeOptionBlock(
      {
        type: 'value',
        scale: true,
        splitLine: { lineStyle: { color: chartSplitLineColor.value } },
        axisLabel: { color: chartTextColor.value, fontSize: 11 },
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

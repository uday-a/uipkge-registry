<script setup lang="ts">
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { EffectScatterChart as EChartsEffectScatter } from 'echarts/charts'
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

use([CanvasRenderer, EChartsEffectScatter, GridComponent, TooltipComponent, LegendComponent])

interface Props {
  data: Record<string, any>[]
  xField?: string
  yField?: string
  categoryField?: string
  /** Ripple animation period in seconds. Default 4. */
  ripplePeriod?: number
  height?: number | string
  option?: any
  class?: string
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  xField: 'x',
  yField: 'y',
  ripplePeriod: 4,
  height: 300,
})

const mergedOption = computed(() => {
  const categories = props.categoryField ? [...new Set(props.data.map((d) => d[props.categoryField!]))] : ['default']
  const series = categories.map((cat, i) => ({
    name: String(cat),
    type: 'effectScatter',
    showEffectOn: 'render',
    rippleEffect: { brushType: 'stroke', period: props.ripplePeriod, scale: 3 },
    symbolSize: 12,
    itemStyle: {
      color: chartColors.value[i % chartColors.value.length],
      shadowBlur: 8,
      shadowColor: chartColors.value[i % chartColors.value.length],
    },
    data: (props.categoryField ? props.data.filter((d) => d[props.categoryField!] === cat) : props.data).map((d) => [
      d[props.xField!],
      d[props.yField!],
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
      { left: 16, right: 16, top: 24, bottom: categories.length > 1 ? 32 : 24, containLabel: true },
      userGrid,
    ),
    tooltip: mergeOptionBlock(
      {
        trigger: 'item',
        backgroundColor: chartTooltipBg.value,
        borderColor: chartTooltipBorder.value,
        textStyle: { color: chartTooltipText.value, fontSize: 12 },
      },
      userTooltip,
    ),
    legend:
      categories.length > 1
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

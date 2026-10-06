<script lang="ts">
  import { AreaChart } from '@svelte-registry/area-chart'

  let { story }: { story: string } = $props()

  const monthlyRevenue = [
    { month: 'Jan', revenue: 4200 },
    { month: 'Feb', revenue: 5100 },
    { month: 'Mar', revenue: 4800 },
    { month: 'Apr', revenue: 6200 },
    { month: 'May', revenue: 5800 },
    { month: 'Jun', revenue: 7100 },
    { month: 'Jul', revenue: 7600 },
    { month: 'Aug', revenue: 8200 },
  ]

  const multiSeries = [
    { month: 'Jan', desktop: 4200, mobile: 2400, tablet: 1100 },
    { month: 'Feb', desktop: 5100, mobile: 3200, tablet: 1300 },
    { month: 'Mar', desktop: 4800, mobile: 3800, tablet: 1500 },
    { month: 'Apr', desktop: 6200, mobile: 4400, tablet: 1700 },
    { month: 'May', desktop: 5800, mobile: 4800, tablet: 1900 },
    { month: 'Jun', desktop: 7100, mobile: 5600, tablet: 2200 },
  ]

  // Stacked stack option: stack key shared across series.
  const stackedOption = {
    series: [
      { stack: 'total', areaStyle: { opacity: 0.7 } },
      { stack: 'total', areaStyle: { opacity: 0.7 } },
      { stack: 'total', areaStyle: { opacity: 0.7 } },
    ],
  }

  // Gradient option: replace areaStyle with a vertical linear gradient.
  const gradientOption = {
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

  // Stepped option: replace smooth lines with right-stepped segments.
  const steppedOption = {
    series: [{ smooth: false, step: 'end' as const, areaStyle: { opacity: 0.4 } }],
  }
</script>

{#if story === 'Basic area'}
  <AreaChart data={monthlyRevenue} xField="month" yField="revenue" height="280" />
{/if}

{#if story === 'Multi-series'}
  <AreaChart data={multiSeries} xField="month" yField={['desktop', 'mobile', 'tablet']} height="300" />
{/if}

{#if story === 'Stacked'}
  <AreaChart
    data={multiSeries}
    xField="month"
    yField={['desktop', 'mobile', 'tablet']}
    option={stackedOption}
    height="300"
  />
{/if}

{#if story === 'Gradient fill'}
  <AreaChart data={monthlyRevenue} xField="month" yField="revenue" option={gradientOption} height="280" />
{/if}

{#if story === 'Stepped'}
  <AreaChart data={monthlyRevenue} xField="month" yField="revenue" option={steppedOption} height="280" />
{/if}

{#if story === 'Markers on'}
  <AreaChart data={monthlyRevenue} xField="month" yField="revenue" markers height="280" />
{/if}

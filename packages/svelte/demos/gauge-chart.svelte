<script lang="ts">
  import { GaugeChart } from '@svelte-registry/gauge-chart'

  let { story }: { story: string } = $props()

  // Custom threshold ramps for the option-prop demo. The wrapper's default
  // (`gaugeThresholds` in useChartTheme) is teal/amber/red; consumers can
  // pass any array of [stop, color] pairs.
  // Demo override ramp — chart-token-adjacent hex (same family as default shadcn charts).
  const greenRamp: [number, string][] = [
    [0.5, '#e9c46a'],
    [0.85, '#2a9d8f'],
    [1, '#264653'],
  ]

  // Progress-ring variant — replace the stoplight axisLine with a single
  // chart-1 colour, hide the pointer/ticks, and bump the progress bar so it
  // reads as a circular progress indicator instead of a meter.
  const progressRingOption = {
    series: [
      {
        progress: { show: true, width: 18, itemStyle: { color: '#f59e0b' } },
        axisLine: { lineStyle: { width: 18, color: [[1, '#f1f5f9']] as [number, string][] } },
        pointer: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        anchor: { show: false },
      },
    ],
  }

  // Multi-needle: two values sharing the same axis (e.g. current vs. target).
  const multiNeedleOption = {
    series: [
      {
        data: [
          { value: 68, name: 'Current' },
          { value: 85, name: 'Target' },
        ],
        pointer: { show: true, length: '55%', width: 4 },
      },
    ],
  }
</script>

{#if story === 'Stoplight gauge'}
  <div class="mx-auto max-w-[420px]">
    <GaugeChart value={68} unit="%" label="Quota used" height="280" />
  </div>
{/if}

{#if story === 'Custom thresholds'}
  <div class="mx-auto max-w-[420px]">
    <GaugeChart value={72} max={100} unit="km" label="Distance" thresholds={greenRamp} height="280" />
  </div>
{/if}

{#if story === 'Progress ring'}
  <div class="mx-auto max-w-[420px]">
    <GaugeChart value={42} unit="%" label="Onboarding" option={progressRingOption} height="260" />
  </div>
{/if}

{#if story === 'Multi-needle'}
  <div class="mx-auto max-w-[420px]">
    <GaugeChart value={68} unit="%" option={multiNeedleOption} height="280" />
  </div>
{/if}

{#if story === 'Compact KPI tile'}
  <div class="mx-auto grid max-w-2xl grid-cols-3 gap-3">
    <div><GaugeChart value={94} unit="%" label="Uptime" height="180" /></div>
    <div><GaugeChart value={62} unit="%" label="CPU" height="180" /></div>
    <div><GaugeChart value={38} unit="%" label="Memory" height="180" /></div>
  </div>
{/if}

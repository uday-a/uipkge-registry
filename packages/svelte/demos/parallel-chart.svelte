<script lang="ts">
  import { ParallelChart } from '@svelte-registry/parallel-chart'

  let { story }: { story: string } = $props()

  const carAxes = [
    { name: 'Price', min: 0, max: 100 },
    { name: 'MPG', min: 0, max: 60 },
    { name: 'Range', min: 0, max: 600 },
    { name: 'Acceleration', min: 0, max: 10 },
    { name: 'Cargo', min: 0, max: 100 },
  ]
  const cars = [
    { name: 'Model A', values: [42, 38, 480, 6.2, 60], group: 0 },
    { name: 'Model B', values: [38, 42, 520, 7.0, 70], group: 0 },
    { name: 'Model C', values: [55, 30, 440, 5.5, 50], group: 1 },
    { name: 'Model D', values: [62, 28, 410, 5.1, 45], group: 1 },
    { name: 'Model E', values: [72, 24, 390, 4.6, 40], group: 2 },
    { name: 'Model F', values: [80, 22, 360, 4.2, 38], group: 2 },
  ]
  const carGroups = ['Compact', 'Sedan', 'Performance']

  const hoverFocusOption = {
    series: carGroups.map(() => ({
      emphasis: { focus: 'series' as const, lineStyle: { width: 3, opacity: 1 } },
      blur: { lineStyle: { opacity: 0.12 } },
      lineStyle: { width: 1.6, opacity: 0.7 },
    })),
  }

  const smoothBoldOption = {
    series: carGroups.map(() => ({
      smooth: true,
      lineStyle: { width: 2.5, opacity: 0.85 },
    })),
  }

  // Five interview candidates scored against four signals; 0-5 scale.
  const interviewAxes = [
    { name: 'Coding', min: 0, max: 5 },
    { name: 'System design', min: 0, max: 5 },
    { name: 'Product sense', min: 0, max: 5 },
    { name: 'Communication', min: 0, max: 5 },
  ]
  const interviewCandidates = [
    { name: 'C1', values: [4.0, 3.5, 4.5, 4.0], group: 0 },
    { name: 'C2', values: [4.5, 4.5, 3.5, 3.0], group: 0 },
    { name: 'C3', values: [3.0, 4.0, 4.5, 4.5], group: 0 },
    { name: 'C4', values: [3.5, 3.0, 3.5, 4.0], group: 0 },
    { name: 'C5', values: [4.5, 4.0, 4.0, 4.5], group: 0 },
  ]
</script>

{#if story === 'Multi-axis comparison'}
  <ParallelChart axes={carAxes} data={cars} groups={carGroups} height="380" />
{/if}

{#if story === 'Hover to focus a group'}
  <ParallelChart axes={carAxes} data={cars} groups={carGroups} option={hoverFocusOption} height="380" />
{/if}

{#if story === 'Smooth + bold strokes'}
  <ParallelChart axes={carAxes} data={cars} groups={carGroups} option={smoothBoldOption} height="380" />
{/if}

{#if story === 'Single-group candidate scores'}
  <ParallelChart axes={interviewAxes} data={interviewCandidates} height="320" />
{/if}

{#if story === 'Compact'}
  <ParallelChart axes={carAxes} data={cars} groups={carGroups} height="220" />
{/if}

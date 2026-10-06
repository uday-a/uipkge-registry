<script lang="ts">
  import { LineChart } from '@svelte-registry/line-chart'

  let { story }: { story: string } = $props()

  const traffic = [
    { x: 'Mon', y: 120 },
    { x: 'Tue', y: 200 },
    { x: 'Wed', y: 150 },
    { x: 'Thu', y: 280 },
    { x: 'Fri', y: 220 },
    { x: 'Sat', y: 340 },
    { x: 'Sun', y: 300 },
  ]

  const channels = [
    { x: 'Jan', web: 420, mobile: 280 },
    { x: 'Feb', web: 480, mobile: 340 },
    { x: 'Mar', web: 450, mobile: 410 },
    { x: 'Apr', web: 560, mobile: 460 },
    { x: 'May', web: 620, mobile: 540 },
    { x: 'Jun', web: 590, mobile: 610 },
  ]

  const deployments = [
    { x: 'v1', y: 4 },
    { x: 'v2', y: 4 },
    { x: 'v3', y: 9 },
    { x: 'v4', y: 9 },
    { x: 'v5', y: 15 },
  ]
</script>

{#if story === 'Basic line'}
  <LineChart data={traffic} />
{/if}

{#if story === 'Multi-series'}
  <LineChart data={channels} yField={['web', 'mobile']} />
{/if}

{#if story === 'Smooth, no markers'}
  <LineChart data={traffic} markers={false} />
{/if}

{#if story === 'Stepped'}
  <LineChart data={deployments} curve="step" />
{/if}

{#if story === 'Dashed forecast'}
  <LineChart data={traffic} dashed />
{/if}

{#if story === 'Stacked lines'}
  <LineChart data={channels} yField={['web', 'mobile']} stacked />
{/if}

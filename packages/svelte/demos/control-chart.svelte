<script lang="ts">
  import { ControlChart } from '@svelte-registry/control-chart'

  let { story }: { story: string } = $props()

  const builds = [
    { x: 'Mon', value: 4.2 },
    { x: 'Tue', value: 3.8 },
    { x: 'Wed', value: 4.5 },
    { x: 'Thu', value: 6.9 },
    { x: 'Fri', value: 4.1 },
    { x: 'Sat', value: 3.6 },
    { x: 'Sun', value: 4.4 },
  ]

  const specs = [
    { x: 'P1', value: 10.1 },
    { x: 'P2', value: 9.8 },
    { x: 'P3', value: 10.4 },
    { x: 'P4', value: 11.2 },
    { x: 'P5', value: 9.9 },
    { x: 'P6', value: 10.0 },
    { x: 'P7', value: 8.7 },
  ]

  const clearance = [
    { x: '06:00', value: 42 },
    { x: '08:00', value: 38 },
    { x: '10:00', value: 51 },
    { x: '12:00', value: 47 },
    { x: '14:00', value: 63 },
    { x: '16:00', value: 44 },
    { x: '18:00', value: 39 },
  ]
</script>

{#if story === 'Build times'}
  <ControlChart data={builds} class="max-w-2xl" />
{/if}

{#if story === 'Fixed spec limits'}
  <ControlChart data={specs} mean={10} ucl={11} lcl={9} class="max-w-2xl" />
{/if}

{#if story === 'Clearance hours'}
  <ControlChart data={clearance} class="max-w-2xl" />
{/if}

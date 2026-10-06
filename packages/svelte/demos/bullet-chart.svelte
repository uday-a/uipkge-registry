<script lang="ts">
  import { BulletChart } from '@svelte-registry/bullet-chart'

  let { story }: { story: string } = $props()

  const kpis = [
    { label: 'Revenue', actual: 82, target: 90, ranges: [50, 75, 100] as [number, number, number] },
    { label: 'NPS', actual: 64, target: 70, ranges: [40, 60, 100] as [number, number, number] },
    { label: 'Uptime', actual: 99.2, target: 99.9, ranges: [95, 99, 100] as [number, number, number] },
    { label: 'CSAT', actual: 88, target: 85, ranges: [60, 80, 100] as [number, number, number] },
  ]

  const single = [{ label: 'Quota', actual: 68, target: 80, ranges: [40, 65, 100] as [number, number, number] }]
</script>

{#if story === 'KPI vs target'}
  <BulletChart data={kpis} height="300" />
{/if}

{#if story === 'Single bullet'}
  <BulletChart data={single} height="140" />
{/if}

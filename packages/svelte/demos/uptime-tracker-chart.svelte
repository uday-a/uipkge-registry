<script lang="ts">
  import { UptimeTrackerChart, type StatusDay } from '@svelte-registry/uptime-tracker-chart'

  let { story }: { story: string } = $props()

  function seeded(i: number) {
    const x = Math.sin(i * 9301 + 49297) * 233280
    return x - Math.floor(x)
  }

  const anchor = new Date('2026-09-05T00:00:00Z')
  function build(outages: Record<number, 'degraded' | 'down'>): StatusDay[] {
    return Array.from({ length: 90 }, (_, i) => {
      const d = new Date(anchor)
      d.setUTCDate(anchor.getUTCDate() - (89 - i))
      return { date: d.toISOString().slice(0, 10), status: outages[i] ?? (seeded(i) > 0.97 ? 'unknown' : 'up') }
    })
  }

  const healthy = build({})
  const incident = build({ 62: 'degraded', 63: 'degraded', 64: 'down', 81: 'degraded' })
</script>

{#if story === 'Healthy quarter'}
  <UptimeTrackerChart days={healthy} />
{/if}

{#if story === 'With incidents'}
  <UptimeTrackerChart days={incident} />
{/if}

{#if story === 'Compact'}
  <UptimeTrackerChart days={incident.slice(60)} showLegend={false} height={36} />
{/if}

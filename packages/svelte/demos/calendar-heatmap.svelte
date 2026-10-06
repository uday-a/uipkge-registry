<script lang="ts">
  import { CalendarHeatmap } from '@svelte-registry/calendar-heatmap'

  let { story }: { story: string } = $props()

  // Deterministic data so SSR and client render the same strings.
  function seeded(i: number) {
    const x = Math.sin(i * 9301 + 49297) * 233280
    return x - Math.floor(x)
  }

  const anchor = new Date('2026-05-15T00:00:00Z')

  // Freighter rotations per day over the last quarter — scheduled MX
  // groundings read as blank cells (the operating-days pattern).
  const opsAnchor = new Date('2026-09-05T00:00:00Z')
  const mxDays = new Set([11, 42, 43, 70])
  const opsData: [string, number][] = Array.from({ length: 90 }, (_, i) => {
    const d = new Date(opsAnchor)
    d.setUTCDate(opsAnchor.getUTCDate() - (89 - i))
    const v = mxDays.has(i) ? 0 : 1 + Math.floor(seeded(i + 500) * 2)
    return [d.toISOString().slice(0, 10), v]
  })
  const opsRange: [string, string] = [
    new Date(opsAnchor.getTime() - 89 * 86400_000).toISOString().slice(0, 10),
    opsAnchor.toISOString().slice(0, 10),
  ]

  const yearData: [string, number][] = Array.from({ length: 365 }, (_, i) => {
    const d = new Date(anchor)
    d.setUTCDate(anchor.getUTCDate() - i)
    const iso = d.toISOString().slice(0, 10)
    const dow = d.getUTCDay()
    return [iso, Math.max(0, Math.round((dow === 0 || dow === 6 ? 0 : 3) + (seeded(i) - 0.3) * 6))]
  })
  const yearRange: [string, string] = [
    new Date(anchor.getTime() - 364 * 86400_000).toISOString().slice(0, 10),
    anchor.toISOString().slice(0, 10),
  ]

  const quarterData = yearData.filter(([iso]) => iso >= '2026-03-01' && iso <= '2026-05-15')
  const quarterRange: [string, string] = ['2026-03-01', '2026-05-15']

  // One-month focus — tightens to a single sprint or release window.
  const monthData = yearData.filter(([iso]) => iso >= '2026-05-01' && iso <= '2026-05-31')
  const monthRange: [string, string] = ['2026-05-01', '2026-05-31']
</script>

{#if story === 'Yearly contribution grid'}
  <CalendarHeatmap data={yearData} range={yearRange} height="200" />
{/if}

{#if story === 'Quarter view'}
  <CalendarHeatmap data={quarterData} range={quarterRange} height="160" />
{/if}

{#if story === 'Teal palette'}
  <CalendarHeatmap data={yearData} range={yearRange} colorRange={['#ccfbf1', '#0f766e']} height="200" />
{/if}

{#if story === 'Blue palette'}
  <CalendarHeatmap data={yearData} range={yearRange} colorRange={['#dbeafe', '#1d4ed8']} height="200" />
{/if}

{#if story === 'Single month'}
  <CalendarHeatmap data={monthData} range={monthRange} height="160" />
{/if}

{#if story === 'Freighter operating days'}
  <CalendarHeatmap data={opsData} range={opsRange} colorRange={['#dcfce7', '#15803d']} height="200" />
{/if}

<script lang="ts">
  import { GanttChart } from '@svelte-registry/gantt-chart'

  let { story }: { story: string } = $props()

  const launch = [
    { name: 'Design', start: '2026-09-01', end: '2026-09-18', progress: 1, group: 'Product' },
    { name: 'API build', start: '2026-09-10', end: '2026-10-09', progress: 0.65, group: 'Eng' },
    { name: 'Mobile app', start: '2026-09-22', end: '2026-10-23', progress: 0.3, group: 'Eng' },
    { name: 'QA & launch', start: '2026-10-12', end: '2026-10-30', progress: 0.1, group: 'Product' },
  ]
</script>

{#if story === 'Launch plan'}
  <GanttChart tasks={launch} height="300" />
{/if}

{#if story === 'Machine schedule'}
  <GanttChart
    tasks={[
      { name: 'Press A', start: '2026-09-05', end: '2026-09-09', progress: 1, group: 'Line 1' },
      { name: 'Press B', start: '2026-09-07', end: '2026-09-14', progress: 0.5, group: 'Line 2' },
    ]}
    height="200"
  />
{/if}

{#if story === 'Milestones'}
  <GanttChart
    tasks={launch}
    milestones={[
      { task: 'API build', date: '2026-09-30', label: 'Beta' },
      { task: 'QA & launch', date: '2026-10-30', label: 'GA' },
    ]}
    height="320"
  />
{/if}

{#if story === 'Today line'}
  <GanttChart tasks={launch} today="2026-09-25" height="300" />
{/if}

{#if story === 'Peak charter program'}
  <GanttChart
    tasks={[
      {
        name: 'PVG–LAX extra rotation',
        start: '2026-09-08',
        end: '2026-12-20',
        progress: 0.4,
        group: 'Transpacific',
      },
      { name: 'ICN–ORD upgrade', start: '2026-10-01', end: '2026-12-15', progress: 0.15, group: 'Transpacific' },
      { name: 'DXB–SIN charter', start: '2026-09-15', end: '2026-11-30', progress: 0.55, group: 'Intra-Asia' },
    ]}
    milestones={[{ task: 'PVG–LAX extra rotation', date: '2026-10-20', label: 'Rate gate' }]}
    today="2026-10-05"
    height="280"
  />
{/if}

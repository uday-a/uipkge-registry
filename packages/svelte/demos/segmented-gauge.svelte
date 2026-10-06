<script lang="ts">
  import { SegmentedGauge } from '@svelte-registry/segmented-gauge'

  let { story }: { story: string } = $props()
</script>

{#if story === 'Browser share'}
  <SegmentedGauge
    segments={[{ value: 62, label: 'Chrome' }, { value: 18, label: 'Safari' }, { value: 12, label: 'Edge' }, { value: 8, label: 'Other' }]}
  >
    {#snippet center()}
      <span class="text-2xl font-bold">62%</span>
      <span class="text-muted-foreground text-xs">Chrome</span>
    {/snippet}
  </SegmentedGauge>
{/if}

{#if story === 'Sentiment tri-band'}
  <SegmentedGauge
    segments={[
      { value: 55, label: 'Positive', color: 'var(--chart-2)' },
      { value: 30, label: 'Neutral', color: 'var(--chart-4)' },
      { value: 15, label: 'Negative', color: 'var(--destructive)' },
    ]}
  />
{/if}

{#if story === 'Wider stroke, no track'}
  <SegmentedGauge
    stroke={26}
    showTrack={false}
    segments={[{ value: 40 }, { value: 35 }, { value: 25 }]}
  />
{/if}

{#if story === 'Compact'}
  <SegmentedGauge height={140} stroke={14} segments={[{ value: 70 }, { value: 30 }]} />
{/if}

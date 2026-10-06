<script lang="ts">
  import { LiquidFillChart } from '@svelte-registry/liquid-fill-chart'

  let { story }: { story: string } = $props()
</script>

{#if story === 'Quota used'}
  <LiquidFillChart value={68} class="max-w-xs" />
{/if}

{#if story === 'Full'}
  <div class="flex flex-wrap items-end gap-6">
    <LiquidFillChart value={12} height={160} />
    <LiquidFillChart value={55} height={160} />
    <LiquidFillChart value={100} height={160} />
  </div>
{/if}

{#if story === 'Custom colour'}
  <div class="flex flex-wrap items-end gap-6">
    <LiquidFillChart value={74} height={180} color="var(--chart-2)" />
    <LiquidFillChart value={38} height={180} color="#f59e0b" unit=" GB" />
  </div>
{/if}

{#if story === 'No label'}
  <LiquidFillChart value={45} height={180} showLabel={false} />
{/if}

<script lang="ts">
  import { Knob } from '@svelte-registry/knob'

  let { story }: { story: string } = $props()

  let volume = $state(40)
  let rating = $state(7)
  let brightness = $state(65)
  let temp = $state(22)
</script>

{#if story === 'Default'}
  <div class="flex items-center gap-6">
    <Knob bind:value={volume} ariaLabel="Volume" />
    <p class="text-sm">Volume: <span class="font-medium tabular-nums">{volume}</span></p>
  </div>
{/if}

{#if story === 'Custom range and step'}
  <div class="flex items-center gap-6">
    <Knob bind:value={rating} min={0} max={10} step={1} ariaLabel="Rating" />
    <p class="text-sm">Rating: <span class="font-medium tabular-nums">{rating} / 10</span></p>
  </div>
{/if}

{#if story === 'Sized'}
  <div class="flex items-end gap-6">
    <Knob bind:value={volume} size={64} showValue={false} ariaLabel="Volume small" />
    <Knob bind:value={volume} size={100} ariaLabel="Volume" />
    <Knob bind:value={volume} size={140} strokeWidth={10} ariaLabel="Volume large" />
  </div>
{/if}

{#if story === 'Custom colors'}
  <div class="flex items-center gap-6">
    <Knob
      bind:value={brightness}
      valueColor="var(--warning)"
      rangeColor="var(--muted)"
      ariaLabel="Brightness"
    />
    <Knob bind:value={brightness} valueColor="#10b981" rangeColor="#1f2937" ariaLabel="Brightness alt" />
  </div>
{/if}

{#if story === 'Custom value template'}
  <Knob bind:value={temp} min={-10} max={40} ariaLabel="Temperature">
    {#snippet valueSnippet({ value }: { value: number })}
      {value}°C
    {/snippet}
  </Knob>
{/if}

{#if story === 'Disabled & readonly'}
  <div class="flex items-center gap-6">
    <Knob value={30} disabled ariaLabel="Disabled knob" />
    <Knob value={70} readonly ariaLabel="Readonly knob" />
  </div>
{/if}

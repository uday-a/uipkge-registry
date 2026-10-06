<script lang="ts">
  import { Rating } from '@svelte-registry/rating'

  let { story }: { story: string } = $props()

  let value = $state(3.5)
  let sized = $state(4)
  let variantValue = $state(4.5)
  let tenScale = $state(7)
  let reviewScore = $state(4)
  let lockedRating = $state(3)
  let clearableRating = $state(2)
  let valued = $state(3.5)
  let tooltipped = $state(3)
  let integerOnly = $state(4)
</script>

{#if story === 'Default'}
  <div class="space-y-3">
    <Rating bind:value max={5} halfIncrements />
    <p class="text-muted-foreground text-xs">
      Value: <code class="text-foreground">{value}</code>
    </p>
  </div>
{/if}

{#if story === 'Sizes'}
  <div class="space-y-2">
    <Rating bind:value={sized} size="x-small" />
    <Rating bind:value={sized} size="small" />
    <Rating bind:value={sized} size="medium" />
    <Rating bind:value={sized} size="large" />
    <Rating bind:value={sized} size="x-large" />
  </div>
{/if}

{#if story === 'Variants'}
  <div class="space-y-3">
    <Rating bind:value={variantValue} variant="outlined" halfIncrements />
    <Rating bind:value={variantValue} variant="filled" halfIncrements />
    <Rating bind:value={variantValue} variant="soft" halfIncrements />
  </div>
{/if}

{#if story === 'Custom max'}
  <div class="space-y-3">
    <Rating bind:value={tenScale} max={10} size="small" />
    <p class="text-muted-foreground text-xs">{tenScale} / 10</p>
  </div>
{/if}

{#if story === 'Read-only'}
  <div class="flex items-center gap-2">
    <Rating value={4.5} max={5} halfIncrements readonly />
    <span class="text-muted-foreground text-xs">(4.5 from 1,284 reviews)</span>
  </div>
{/if}

{#if story === 'Disabled'}
  <Rating bind:value={lockedRating} max={5} disabled />
{/if}

{#if story === 'Clearable'}
  <div class="space-y-2">
    <Rating bind:value={clearableRating} max={5} clearable />
    <p class="text-muted-foreground text-xs">
      Click the active star to clear. Value: <code class="text-foreground">{clearableRating}</code>
    </p>
  </div>
{/if}

{#if story === 'Show value'}
  <Rating bind:value={valued} max={5} halfIncrements showValue />
{/if}

{#if story === 'With tooltips'}
  <Rating bind:value={tooltipped} max={5} tooltips={['Terrible', 'Poor', 'Average', 'Good', 'Excellent']} />
{/if}

{#if story === 'Integer-only'}
  <Rating bind:value={integerOnly} max={5} />
{/if}

{#if story === 'Hover effect'}
  <Rating bind:value={reviewScore} max={5} hover />
{/if}

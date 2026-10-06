<script lang="ts">
  import { ImageCompare } from '@svelte-registry/image-compare'
  import { GripHorizontal } from '@lucide/svelte'

  let { story }: { story: string } = $props()

  let pos = $state(50)

  // Photo editing: original vs color-graded (warm graded retouch)
  const photoBefore =
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80&sat=-60&con=-20'
  const photoAfter =
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80&sat=40&con=20'

  // Architecture / Cityscape: raw monochrome vs full color
  const uiBefore = 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&h=600&fit=crop&q=80&sat=-80'
  const uiAfter = 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&h=600&fit=crop&q=80'
</script>

{#if story === 'Photo edit before / after'}
  <ImageCompare
    beforeSrc={photoBefore}
    afterSrc={photoAfter}
    beforeLabel="Original"
    afterLabel="Edited"
    class="h-72 w-full max-w-2xl"
  />
{/if}

{#if story === 'UI redesign'}
  <ImageCompare
    beforeSrc={uiBefore}
    afterSrc={uiAfter}
    beforeLabel="v1.0"
    afterLabel="v2.0"
    class="h-72 w-full max-w-2xl"
  />
{/if}

{#if story === 'Controlled slider'}
  <div class="flex max-w-2xl flex-col gap-3">
    <ImageCompare bind:value={pos} beforeSrc={photoBefore} afterSrc={photoAfter} class="h-72 w-full" />
    <div class="flex items-center gap-3 text-sm">
      <span class="text-muted-foreground w-16 tabular-nums">{pos.toFixed(0)}%</span>
      <input bind:value={pos} type="range" min="0" max="100" class="flex-1" />
    </div>
  </div>
{/if}

{#if story === 'Orientation & labels'}
  <div class="grid max-w-2xl gap-4 sm:grid-cols-2">
    <ImageCompare
      beforeSrc={photoBefore}
      afterSrc={photoAfter}
      orientation="vertical"
      class="h-72 w-full"
    />
    <ImageCompare
      beforeSrc={uiBefore}
      afterSrc={uiAfter}
      showLabels={false}
      class="h-72 w-full"
    />
  </div>
{/if}

{#if story === 'Custom handle'}
  <ImageCompare beforeSrc={photoBefore} afterSrc={photoAfter} class="h-72 w-full max-w-2xl">
    {#snippet handle()}
      <GripHorizontal class="text-foreground size-4" />
    {/snippet}
  </ImageCompare>
{/if}

{#if story === 'Disabled'}
  <ImageCompare beforeSrc={photoBefore} afterSrc={photoAfter} disabled class="h-72 w-full max-w-2xl" />
{/if}

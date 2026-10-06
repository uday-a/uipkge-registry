<script lang="ts">
  import { AspectRatio } from '@svelte-registry/aspect-ratio'
  import { Play } from '@lucide/svelte'

  let { story }: { story: string } = $props()
</script>

{#if story === 'Common ratios'}
  <div class="grid gap-3 sm:grid-cols-3">
    <div>
      <AspectRatio ratio={16 / 9} class="bg-muted grid place-items-center rounded-md">
        <span class="text-muted-foreground font-mono text-xs">16 : 9</span>
      </AspectRatio>
    </div>
    <div>
      <AspectRatio ratio={4 / 3} class="bg-muted grid place-items-center rounded-md">
        <span class="text-muted-foreground font-mono text-xs">4 : 3</span>
      </AspectRatio>
    </div>
    <div>
      <AspectRatio ratio={1} class="bg-muted grid place-items-center rounded-md">
        <span class="text-muted-foreground font-mono text-xs">1 : 1</span>
      </AspectRatio>
    </div>
  </div>
{/if}

{#if story === 'Portrait'}
  <div class="grid max-w-md gap-3 sm:grid-cols-2">
    <AspectRatio ratio={3 / 4} class="bg-muted grid place-items-center rounded-md">
      <span class="text-muted-foreground font-mono text-xs">3 : 4</span>
    </AspectRatio>
    <AspectRatio ratio={9 / 16} class="bg-muted grid place-items-center rounded-md">
      <span class="text-muted-foreground font-mono text-xs">9 : 16</span>
    </AspectRatio>
  </div>
{/if}

{#if story === 'Ultrawide'}
  <div class="space-y-3">
    <AspectRatio ratio={21 / 9} class="bg-muted grid place-items-center rounded-md">
      <span class="text-muted-foreground font-mono text-xs">21 : 9</span>
    </AspectRatio>
    <AspectRatio ratio={32 / 9} class="bg-muted grid place-items-center rounded-md">
      <span class="text-muted-foreground font-mono text-xs">32 : 9</span>
    </AspectRatio>
  </div>
{/if}

{#if story === 'With image fill'}
  <div class="max-w-md">
    <AspectRatio ratio={16 / 9} class="bg-muted overflow-hidden rounded-md">
      <img
        src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=800&dpr=2&q=80"
        alt="Drew beach at sunset"
        class="size-full object-cover"
      />
    </AspectRatio>
  </div>
{/if}

{#if story === 'Video placeholder'}
  <div class="max-w-md">
    <AspectRatio ratio={16 / 9} class="bg-muted/50 grid place-items-center rounded-md border border-dashed">
      <div class="text-muted-foreground flex flex-col items-center gap-2">
        <Play class="size-8" aria-hidden="true" />
        <span class="text-xs">Video player (16:9)</span>
      </div>
    </AspectRatio>
  </div>
{/if}

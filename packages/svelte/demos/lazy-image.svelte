<script lang="ts">
  import { Img } from '@svelte-registry/lazy-image'
  import { ImageOff } from '@lucide/svelte'

  let { story }: { story: string } = $props()

  const photo = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'
  const portrait = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80'
</script>

{#if story === 'Default'}
  <Img src={photo} alt="Mountain landscape" aspectRatio="16 / 9" class="max-w-md rounded-lg" />
{/if}

{#if story === 'Aspect ratios'}
  <div class="flex flex-wrap items-end gap-4">
    <Img src={photo} alt="Wide" aspectRatio="16 / 9" class="w-64 rounded-lg" />
    <Img src={photo} alt="Square" aspectRatio="1 / 1" class="w-40 rounded-lg" />
    <Img src={portrait} alt="Portrait" aspectRatio="3 / 4" class="w-32 rounded-lg" />
  </div>
{/if}

{#if story === 'Cover vs contain'}
  <div class="flex flex-wrap gap-4">
    <div class="space-y-1">
      <Img src={portrait} alt="Cover" width={160} height={160} cover class="rounded-lg" />
      <p class="text-muted-foreground text-xs">cover (fills, crops)</p>
    </div>
    <div class="space-y-1">
      <Img src={portrait} alt="Contain" width={160} height={160} cover={false} class="rounded-lg" />
      <p class="text-muted-foreground text-xs">contain (fits, letterboxes)</p>
    </div>
  </div>
{/if}

{#if story === 'Error fallback (snippet + URL)'}
  <div class="flex flex-wrap gap-4">
    <div class="space-y-1">
      <Img src="https://invalid.example/broken.jpg" alt="Broken" width={200} height={140} class="rounded-lg">
        {#snippet fallbackSnippet()}
          <div class="text-muted-foreground flex size-full flex-col items-center justify-center gap-1">
            <ImageOff class="size-6" />
            <span class="text-xs">Custom fallback</span>
          </div>
        {/snippet}
      </Img>
      <p class="text-muted-foreground text-xs">snippet fallback</p>
    </div>
    <div class="space-y-1">
      <Img
        src="https://invalid.example/broken.jpg"
        alt="Broken with URL fallback"
        fallback={portrait}
        width={200}
        height={140}
        class="rounded-lg"
      />
      <p class="text-muted-foreground text-xs">URL fallback</p>
    </div>
  </div>
{/if}

{#if story === 'Eager'}
  <Img src={photo} alt="Above the fold" eager width={320} height={180} class="rounded-lg" />
{/if}

<script lang="ts">
  import { Video } from '@svelte-registry/video'

  let { story }: { story: string } = $props()

  const sampleMp4 = '/media/flower.mp4'
  const samplePoster = '/media/flower.jpg'
</script>

{#if story === 'Feature player'}
  <Video src={sampleMp4} poster={samplePoster} class="max-w-2xl" />
{/if}

{#if story === 'Autoplay (muted)'}
  <Video src={sampleMp4} poster={samplePoster} autoplay={true} muted={true} loop={true} class="max-w-2xl" />
{/if}

{#if story === 'Native controls'}
  <Video src={sampleMp4} poster={samplePoster} nativeControls={true} class="max-w-2xl" />
{/if}

{#if story === 'Aspect ratio variants'}
  <div class="grid max-w-2xl gap-4 sm:grid-cols-2">
    <div class="space-y-1.5">
      <p class="text-muted-foreground text-xs">4/3 — classic TV</p>
      <Video src={sampleMp4} poster={samplePoster} aspectRatio="4/3" />
    </div>
    <div class="space-y-1.5">
      <p class="text-muted-foreground text-xs">1/1 — square</p>
      <Video src={sampleMp4} poster={samplePoster} aspectRatio="1/1" />
    </div>
    <div class="space-y-1.5">
      <p class="text-muted-foreground text-xs">9/16 — portrait</p>
      <Video src={sampleMp4} poster={samplePoster} aspectRatio="9/16" class="max-w-xs" />
    </div>
    <div class="space-y-1.5">
      <p class="text-muted-foreground text-xs">16/9 — widescreen</p>
      <Video src={sampleMp4} poster={samplePoster} aspectRatio="16/9" />
    </div>
  </div>
{/if}

{#if story === 'Without poster'}
  <Video src={sampleMp4} class="max-w-2xl" />
{/if}

{#if story === 'Custom playback rate'}
  <Video src={sampleMp4} poster={samplePoster} playbackRate={1.5} class="max-w-2xl" />
{/if}

{#if story === 'In a content card'}
  <div class="bg-card max-w-2xl rounded-lg border">
    <div class="space-y-1.5 p-6 pb-0">
      <h3 class="text-lg font-semibold">Lesson 3 — Composition basics</h3>
      <p class="text-muted-foreground text-sm">5 min · 1.5× speed recommended</p>
    </div>
    <div class="p-6">
      <Video src={sampleMp4} poster={samplePoster} playbackRate={1.5} />
    </div>
  </div>
{/if}

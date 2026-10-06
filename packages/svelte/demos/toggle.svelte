<script lang="ts">
  import { Toggle } from '@svelte-registry/toggle'
  import { Bold, Italic, Star, Underline } from '@lucide/svelte'

  let { story }: { story: string } = $props()

  let pinned = $state(false)
  let starred = $state(true)
</script>

{#if story === 'Default'}
  <div class="flex gap-2">
    <Toggle aria-label="Bold"><Bold class="size-4" /></Toggle>
    <Toggle aria-label="Italic"><Italic class="size-4" /></Toggle>
    <Toggle aria-label="Underline"><Underline class="size-4" /></Toggle>
  </div>
{/if}

{#if story === 'Variants'}
  <div class="flex gap-2">
    <Toggle variant="default" aria-label="Bold default"><Bold class="size-4" /></Toggle>
    <Toggle variant="outline" aria-label="Bold outline"><Bold class="size-4" /></Toggle>
  </div>
{/if}

{#if story === 'Sizes'}
  <div class="flex items-center gap-2">
    <Toggle size="sm" aria-label="Bold sm"><Bold class="size-4" /></Toggle>
    <Toggle size="default" aria-label="Bold default"><Bold class="size-4" /></Toggle>
    <Toggle size="lg" aria-label="Bold lg"><Bold class="size-4" /></Toggle>
  </div>
{/if}

{#if story === 'With label'}
  <div class="flex gap-2">
    <Toggle variant="outline" aria-label="Star this">
      <Star class="size-4" />
      <span>Star</span>
    </Toggle>
  </div>
{/if}

{#if story === 'Controlled'}
  <div class="flex items-center gap-3">
    <Toggle bind:pressed={pinned} variant="outline" aria-label="Pin">
      <Star class="size-4" />
      <span>{pinned ? 'Pinned' : 'Pin'}</span>
    </Toggle>
    <span class="text-muted-foreground text-xs">Pressed: <code class="text-foreground">{pinned}</code></span>
  </div>
{/if}

{#if story === 'Disabled'}
  <div class="flex gap-2">
    <Toggle disabled aria-label="Off disabled"><Bold class="size-4" /></Toggle>
    <Toggle pressed={starred} disabled variant="outline" aria-label="On disabled">
      <Star class="size-4" />
    </Toggle>
  </div>
{/if}

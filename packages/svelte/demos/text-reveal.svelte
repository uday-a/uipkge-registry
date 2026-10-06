<script lang="ts">
  import { TextReveal } from '@svelte-registry/text-reveal'

  let { story }: { story: string } = $props()
</script>

{#if story === 'Default'}
  <TextReveal text="Interfaces that feel instant." class="text-2xl font-bold" />
{/if}

{#if story === 'Character mode'}
  <TextReveal text="Staggered by character." mode="chars" stagger={18} class="text-2xl font-bold" />
{/if}

{#if story === 'No blur'}
  <TextReveal text="Rise and fade, no blur." blur={false} class="text-2xl font-bold" />
{/if}

{#if story === 'Slow cinematic'}
  <TextReveal text="Slow and cinematic." stagger={120} duration={900} class="text-2xl font-bold" />
{/if}

{#if story === 'Paragraph'}
  <TextReveal
    text="Every word fades in, rises and un-blurs with a per-index delay when the block enters the viewport."
    as="p"
    class="max-w-md text-base"
  />
{/if}

{#if story === 'Replayable'}
  <TextReveal text="Scroll away and back to replay." once={false} class="text-2xl font-bold" />
{/if}

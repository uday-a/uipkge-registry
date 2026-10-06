<script lang="ts">
  import { Marquee } from '@svelte-registry/marquee'

  let { story }: { story: string } = $props()

  const words = ['Vue', 'React', 'Astro', 'Tailwind', 'Reka UI', 'Vite']
</script>

{#if story === 'Horizontal (default)'}
  <Marquee class="bg-muted/40 rounded-md py-3">
    {#each words as t (t)}
      <span class="px-2 text-sm font-medium">{t}</span>
    {/each}
  </Marquee>
{/if}

{#if story === 'Direction right'}
  <Marquee direction="right" class="bg-muted/40 rounded-md py-3">
    {#each words as t (t)}
      <span class="px-2 text-sm font-medium">{t}</span>
    {/each}
  </Marquee>
{/if}

{#if story === 'Speed'}
  <Marquee speed={8} class="bg-muted/40 rounded-md py-3">
    {#each Array.from({ length: 6 }, (_, i) => i) as i (i)}
      <span class="px-2 text-sm font-medium">Fast</span>
    {/each}
  </Marquee>
{/if}

{#if story === 'Pause on hover'}
  <Marquee pauseOnHover class="bg-muted/40 rounded-md py-3">
    {#each words as t (t)}
      <span class="px-2 text-sm font-medium">{t}</span>
    {/each}
  </Marquee>
{/if}

{#if story === 'Vertical'}
  <Marquee orientation="vertical" class="bg-muted/40 h-48 rounded-md py-3">
    {#each words as t (t)}
      <span class="px-2 py-1 text-sm font-medium">{t}</span>
    {/each}
  </Marquee>
{/if}

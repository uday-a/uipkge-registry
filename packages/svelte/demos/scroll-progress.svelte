<script lang="ts">
  import { ScrollProgress } from '@svelte-registry/scroll-progress'

  let { story }: { story: string } = $props()

  let containerEl: HTMLElement | null = $state(null)
</script>

{#if story === 'Default'}
  <div class="relative overflow-hidden rounded-lg border">
    <ScrollProgress position="absolute" container={containerEl} />
    <div bind:this={containerEl} class="h-40 overflow-y-auto p-4">
      {#each Array.from({ length: 20 }, (_, i) => i + 1) as i (i)}
        <p class="text-muted-foreground py-1 text-sm">Scroll to move the bar — row {i}</p>
      {/each}
    </div>
  </div>
{/if}

{#if story === 'Thick editorial'}
  <div class="relative overflow-hidden rounded-lg border">
    <ScrollProgress position="absolute" height={6} container={containerEl} />
    <div bind:this={containerEl} class="h-40 overflow-y-auto p-4">
      {#each Array.from({ length: 20 }, (_, i) => i + 1) as i (i)}
        <p class="text-muted-foreground py-1 text-sm">Chunky 6px bar — row {i}</p>
      {/each}
    </div>
  </div>
{/if}

{#if story === 'Brand gradient'}
  <div class="relative overflow-hidden rounded-lg border">
    <ScrollProgress position="absolute" height={4} color="linear-gradient(90deg, var(--chart-1), var(--chart-2))" container={containerEl} />
    <div bind:this={containerEl} class="h-40 overflow-y-auto p-4">
      {#each Array.from({ length: 20 }, (_, i) => i + 1) as i (i)}
        <p class="text-muted-foreground py-1 text-sm">Any CSS background works — row {i}</p>
      {/each}
    </div>
  </div>
{/if}

{#if story === 'Smooth off'}
  <div class="relative overflow-hidden rounded-lg border">
    <ScrollProgress position="absolute" smooth={false} color="var(--destructive)" container={containerEl} />
    <div bind:this={containerEl} class="h-40 overflow-y-auto p-4">
      {#each Array.from({ length: 20 }, (_, i) => i + 1) as i (i)}
        <p class="text-muted-foreground py-1 text-sm">No lerp smoothing — row {i}</p>
      {/each}
    </div>
  </div>
{/if}

{#if story === 'Contained mode'}
  <div class="relative overflow-hidden rounded-lg border">
    <ScrollProgress position="absolute" container={containerEl} color="var(--chart-3)" />
    <div bind:this={containerEl} class="h-40 overflow-y-auto p-4">
      {#each Array.from({ length: 20 }, (_, i) => i + 1) as i (i)}
        <p class="text-muted-foreground py-1 text-sm">Measured against this box — row {i}</p>
      {/each}
    </div>
  </div>
{/if}

<script lang="ts">
  import { ScrollArea, ScrollBar } from '@svelte-registry/scroll-area'

  let { story }: { story: string } = $props()

  const tags = Array.from({ length: 32 }, (_, i) => `Item ${i + 1}`)
</script>

{#if story === 'Default'}
  <ScrollArea class="h-48 w-72 rounded-md border p-4">
    <h4 class="mb-2 text-sm font-semibold">Changelog</h4>
    {#each tags.slice(0, 12) as tag (tag)}
      <p class="text-muted-foreground py-1 text-sm">{tag} — custom scrollbar, same on every OS.</p>
    {/each}
  </ScrollArea>
{/if}

{#if story === 'Horizontal scroll'}
  <ScrollArea class="w-full max-w-md rounded-md border p-4">
    <div class="flex w-max gap-2">
      {#each tags as tag (tag)}
        <span class="bg-muted rounded-md px-3 py-1.5 text-xs whitespace-nowrap">{tag}</span>
      {/each}
    </div>
    <ScrollBar orientation="horizontal" />
  </ScrollArea>
{/if}

{#if story === 'Both axes'}
  <ScrollArea class="h-48 w-full max-w-md rounded-md border p-4">
    <div class="w-max">
      {#each tags.slice(0, 16) as tag (tag)}
        <p class="text-muted-foreground w-160 py-1 text-sm">
          {tag} — a very wide row that overflows horizontally while the list overflows vertically.
        </p>
      {/each}
    </div>
    <ScrollBar orientation="horizontal" />
  </ScrollArea>
{/if}

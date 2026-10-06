<script lang="ts">
  import { Button } from '@svelte-registry/button'
  import { Kbd } from '@svelte-registry/kbd'

  let { story }: { story: string } = $props()
</script>

{#if story === 'Default'}
  <p class="text-sm">Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to open the command palette.</p>
{/if}

{#if story === 'Single key'}
  <div class="flex flex-wrap items-center gap-2 text-sm">
    <Kbd>↑</Kbd>
    <Kbd>↓</Kbd>
    <Kbd>←</Kbd>
    <Kbd>→</Kbd>
    <Kbd>Esc</Kbd>
    <Kbd>Enter</Kbd>
  </div>
{/if}

{#if story === 'Modifier combos'}
  <p class="text-sm">Save with <Kbd>⌘</Kbd> <Kbd>S</Kbd> or <Kbd>Ctrl</Kbd> <Kbd>S</Kbd> on Windows.</p>
{/if}

{#if story === 'In a button row'}
  <div class="flex items-center gap-2">
    <Button variant="outline" size="sm">
      Search
      <Kbd class="ml-2">⌘K</Kbd>
    </Button>
    <Button variant="ghost" size="sm">
      New
      <Kbd class="ml-2">N</Kbd>
    </Button>
  </div>
{/if}

{#if story === 'Long label'}
  <Kbd>Shift</Kbd>
{/if}

<script lang="ts">
  import { Chip, ChipGroup } from '@svelte-registry/chip'
  import { Hash } from '@lucide/svelte'

  let { story }: { story: string } = $props()

  const initialTags = ['design', 'engineering', 'product', 'marketing']
  let tags = $state([...initialTags])

  function removeTag(tag: string) {
    tags = tags.filter((t) => t !== tag)
  }
</script>

{#if story === 'Variants'}
  <div class="flex flex-wrap gap-2">
    <Chip>Default</Chip>
    <Chip variant="filled">Filled</Chip>
    <Chip variant="outlined">Outlined</Chip>
    <Chip variant="elevated">Elevated</Chip>
    <Chip variant="success">Success</Chip>
    <Chip variant="warning">Warning</Chip>
    <Chip variant="destructive">Destructive</Chip>
  </div>
{/if}

{#if story === 'Sizes'}
  <div class="flex flex-wrap items-center gap-2">
    <Chip size="sm">Small</Chip>
    <Chip>Default</Chip>
    <Chip size="lg">Large</Chip>
  </div>
{/if}

{#if story === 'With leading icon'}
  <div class="flex flex-wrap gap-2">
    <Chip><Hash class="size-3" /> design</Chip>
    <Chip><Hash class="size-3" /> engineering</Chip>
    <Chip><Hash class="size-3" /> product</Chip>
  </div>
{/if}

{#if story === 'Closable'}
  <div class="flex flex-wrap gap-2">
    <Chip closable>tag-one</Chip>
    <Chip closable variant="elevated">tag-two</Chip>
    <Chip closable variant="outlined">tag-three</Chip>
  </div>
{/if}

{#if story === 'ChipGroup with reactive removal'}
  <div class="space-y-3">
    <ChipGroup>
      {#each tags as tag (tag)}
        <Chip variant="elevated" closable onclose={() => removeTag(tag)}>#{tag}</Chip>
      {/each}
    </ChipGroup>
    {#if tags.length === 0}
      <button class="text-muted-foreground text-xs underline" onclick={() => (tags = [...initialTags])}>
        Reset chips
      </button>
    {/if}
  </div>
{/if}

{#if story === 'Status filters'}
  <ChipGroup>
    <Chip variant="success">2 passing</Chip>
    <Chip variant="warning">3 pending</Chip>
    <Chip variant="destructive">1 failed</Chip>
  </ChipGroup>
{/if}

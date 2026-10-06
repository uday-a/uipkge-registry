<script lang="ts">
  import { Button } from '@svelte-registry/button'
  import { VirtualList } from '@svelte-registry/virtual-list'

  let { story }: { story: string } = $props()

  const fixed = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    name: `Row ${i + 1}`,
  }))

  const dynamic = Array.from({ length: 5000 }, (_, i) => {
    const size = 32 + (i % 7) * 12
    return { id: i, name: `Row ${i + 1} (h=${size})`, size }
  })

  const horizontal = Array.from({ length: 2000 }, (_, i) => ({ id: i, name: `Col ${i + 1}` }))

  let listRef: { scrollToIndex: (i: number, opts?: { align?: 'start' | 'center' | 'end' }) => void } | undefined =
    $state(undefined)

  function jumpTo(i: number) {
    listRef?.scrollToIndex(i, { align: 'center' })
  }
</script>

{#if story === 'Fixed size, 10k rows'}
  <VirtualList items={fixed} itemSize={40} height={400} class="rounded-md border">
    {#snippet children({ item })}
      <div class="flex h-10 items-center border-b px-4 text-sm">{item.name}</div>
    {/snippet}
  </VirtualList>
{/if}

{#if story === 'Dynamic size'}
  <VirtualList items={dynamic} itemSize={(item) => item.size} height={400} class="rounded-md border">
    {#snippet children({ item })}
      <div class="flex items-center border-b px-4 text-sm" style:height={item.size + 'px'}>
        {item.name}
      </div>
    {/snippet}
  </VirtualList>
{/if}

{#if story === 'Imperative scrollToIndex'}
  <div class="space-y-2">
    <div class="flex gap-2">
      <Button size="sm" onclick={() => jumpTo(0)}>Top</Button>
      <Button size="sm" onclick={() => jumpTo(2500)}>2500</Button>
      <Button size="sm" onclick={() => jumpTo(7500)}>7500</Button>
      <Button size="sm" onclick={() => jumpTo(9999)}>End</Button>
    </div>
    <VirtualList bind:this={listRef} items={fixed} itemSize={32} height={320} class="rounded-md border">
      {#snippet children({ item, index })}
        <div class="flex h-8 items-center border-b px-4 text-xs">
          <span class="text-muted-foreground w-12">{index}</span>
          {item.name}
        </div>
      {/snippet}
    </VirtualList>
  </div>
{/if}

{#if story === 'Horizontal'}
  <VirtualList items={horizontal} itemSize={80} height={120} direction="horizontal" class="rounded-md border">
    {#snippet children({ item })}
      <div class="flex h-full w-20 items-center justify-center border-r text-xs">
        {item.name}
      </div>
    {/snippet}
  </VirtualList>
{/if}

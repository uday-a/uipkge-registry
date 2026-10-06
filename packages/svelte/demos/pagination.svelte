<script lang="ts">
  import {
    Pagination,
    PaginationEllipsis,
    PaginationFirst,
    PaginationLast,
    PaginationList,
    PaginationListItem,
    PaginationNext,
    PaginationPrev,
  } from '@svelte-registry/pagination'

  let { story }: { story: string } = $props()

  let page = $state(3)

  const itemClass =
    'inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium hover:bg-accent'
  const activeItemClass =
    'inline-flex h-9 w-9 items-center justify-center rounded-md border border-primary bg-primary text-sm font-medium text-primary-foreground'
  const navClass = 'inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-accent'
  const ellipsisClass = 'inline-flex h-9 w-9 items-center justify-center text-sm text-muted-foreground'
</script>

{#if story === 'Default'}
  <Pagination itemsPerPage={10} total={100} siblingCount={1} showEdges defaultPage={3}>
    {#snippet children({ page: current })}
      <PaginationList class="flex items-center gap-1">
        {#snippet children({ items })}
          <PaginationFirst class={navClass} />
          <PaginationPrev class={navClass} />
          {#each items as item, index (index)}
            {#if item.type === 'page' && item.value !== undefined}
              <PaginationListItem value={item.value} class={item.value === current ? activeItemClass : itemClass}>
                {item.value}
              </PaginationListItem>
            {:else}
              <PaginationEllipsis class={ellipsisClass}>…</PaginationEllipsis>
            {/if}
          {/each}
          <PaginationNext class={navClass} />
          <PaginationLast class={navClass} />
        {/snippet}
      </PaginationList>
    {/snippet}
  </Pagination>
{/if}

{#if story === 'Compact (no siblings)'}
  <Pagination itemsPerPage={10} total={200} siblingCount={0} showEdges defaultPage={10}>
    {#snippet children({ page: current })}
      <PaginationList class="flex items-center gap-1">
        {#snippet children({ items })}
          <PaginationPrev class={navClass} />
          {#each items as item, index (index)}
            {#if item.type === 'page' && item.value !== undefined}
              <PaginationListItem value={item.value} class={item.value === current ? activeItemClass : itemClass}>
                {item.value}
              </PaginationListItem>
            {:else}
              <PaginationEllipsis class={ellipsisClass}>…</PaginationEllipsis>
            {/if}
          {/each}
          <PaginationNext class={navClass} />
        {/snippet}
      </PaginationList>
    {/snippet}
  </Pagination>
{/if}

{#if story === 'Without first/last edges'}
  <Pagination itemsPerPage={10} total={100} siblingCount={1} defaultPage={5}>
    {#snippet children({ page: current })}
      <PaginationList class="flex items-center gap-1">
        {#snippet children({ items })}
          <PaginationPrev class={navClass} />
          {#each items as item, index (index)}
            {#if item.type === 'page' && item.value !== undefined}
              <PaginationListItem value={item.value} class={item.value === current ? activeItemClass : itemClass}>
                {item.value}
              </PaginationListItem>
            {:else}
              <PaginationEllipsis class={ellipsisClass}>…</PaginationEllipsis>
            {/if}
          {/each}
          <PaginationNext class={navClass} />
        {/snippet}
      </PaginationList>
    {/snippet}
  </Pagination>
{/if}

{#if story === 'With edges (boundary 1)'}
  <Pagination itemsPerPage={10} total={500} siblingCount={1} showEdges defaultPage={25}>
    {#snippet children({ page: current })}
      <PaginationList class="flex flex-wrap items-center gap-1">
        {#snippet children({ items })}
          <PaginationPrev class={navClass} />
          {#each items as item, index (index)}
            {#if item.type === 'page' && item.value !== undefined}
              <PaginationListItem value={item.value} class={item.value === current ? activeItemClass : itemClass}>
                {item.value}
              </PaginationListItem>
            {:else}
              <PaginationEllipsis class={ellipsisClass}>…</PaginationEllipsis>
            {/if}
          {/each}
          <PaginationNext class={navClass} />
        {/snippet}
      </PaginationList>
    {/snippet}
  </Pagination>
{/if}

{#if story === 'Many pages with v-model'}
  <div class="space-y-3">
    <Pagination bind:page itemsPerPage={10} total={1000} siblingCount={1} showEdges>
      {#snippet children({ page: current })}
        <PaginationList class="flex flex-wrap items-center gap-1">
          {#snippet children({ items })}
            <PaginationFirst class={navClass} />
            <PaginationPrev class={navClass} />
            {#each items as item, index (index)}
              {#if item.type === 'page' && item.value !== undefined}
                <PaginationListItem value={item.value} class={item.value === current ? activeItemClass : itemClass}>
                  {item.value}
                </PaginationListItem>
              {:else}
                <PaginationEllipsis class={ellipsisClass}>…</PaginationEllipsis>
              {/if}
            {/each}
            <PaginationNext class={navClass} />
            <PaginationLast class={navClass} />
          {/snippet}
        </PaginationList>
      {/snippet}
    </Pagination>
    <p class="text-xs text-muted-foreground">Page {page} of 100</p>
  </div>
{/if}

{#if story === 'Disabled'}
  <Pagination itemsPerPage={10} total={100} siblingCount={1} showEdges defaultPage={3} disabled>
    {#snippet children({ page: current })}
      <PaginationList class="flex items-center gap-1 opacity-50">
        {#snippet children({ items })}
          <PaginationFirst class={navClass} />
          <PaginationPrev class={navClass} />
          {#each items as item, index (index)}
            {#if item.type === 'page' && item.value !== undefined}
              <PaginationListItem value={item.value} class={item.value === current ? activeItemClass : itemClass}>
                {item.value}
              </PaginationListItem>
            {:else}
              <PaginationEllipsis class={ellipsisClass}>…</PaginationEllipsis>
            {/if}
          {/each}
          <PaginationNext class={navClass} />
          <PaginationLast class={navClass} />
        {/snippet}
      </PaginationList>
    {/snippet}
  </Pagination>
{/if}

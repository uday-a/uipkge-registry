<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { OrgNode } from './types'

  export interface OrgChartNodeProps {
    node: OrgNode
    depth: number
    isRoot?: boolean
    direction?: 'top-down' | 'left-right'
    showConnectors?: boolean
    isExpanded: (node: OrgNode) => boolean
    toggle: (node: OrgNode) => void
    onnodeclick?: (node: OrgNode) => void
    /** Extra content rendered inside each node card. */
    nodeSnippet?: Snippet<[{ node: OrgNode }]>
    children?: Snippet
  }
</script>

<script lang="ts">
  import { ChevronDown, ChevronRight } from '@lucide/svelte'
  import { cn } from '$lib/utils'
  // Self-import for recursive rendering (`svelte:self` is deprecated).
  import OrgChartNode from './OrgChartNode.svelte'

  let {
    node,
    depth,
    isRoot = false,
    direction = 'top-down',
    showConnectors = true,
    isExpanded,
    toggle,
    onnodeclick,
    nodeSnippet,
    children,
  }: OrgChartNodeProps = $props()

  const open = $derived(isExpanded(node))
  const hasChildren = $derived(!!node.children?.length)
  const isHorizontal = $derived(direction === 'left-right')
  const childCount = $derived(node.children?.length ?? 0)
  const isOnlyChild = $derived(childCount <= 1)

  function onClick() {
    onnodeclick?.(node)
  }

  function onToggle(e: Event) {
    e.stopPropagation()
    if (hasChildren) toggle(node)
  }

  function onCardKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick()
    }
  }

  function initials(name: string): string {
    return name
      .split(' ')
      .map((p) => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }
</script>

{#snippet card()}
  <div
    role="button"
    tabindex="0"
    aria-label={node.title ? `${node.name}, ${node.title}` : node.name}
    class={cn(
      'bg-card hover:bg-accent/50 border-border group focus-visible:ring-ring relative flex w-52 cursor-pointer flex-col rounded-lg border p-3 shadow-xs transition-colors focus-visible:ring-2 focus-visible:outline-none',
      isRoot ? 'ring-primary/20 ring-2' : '',
    )}
    onclick={onClick}
    onkeydown={onCardKeydown}
  >
    <div class="flex items-center gap-2.5">
      {#if node.avatar}
        <img src={node.avatar} alt={node.name} class="border-border size-10 shrink-0 rounded-full border object-cover" />
      {:else}
        <div
          class="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
          aria-hidden="true"
        >
          {initials(node.name)}
        </div>
      {/if}
      <div class="min-w-0 flex-1">
        <p class="truncate text-sm font-semibold">{node.name}</p>
        {#if node.title}
          <p class="text-muted-foreground truncate text-xs">{node.title}</p>
        {/if}
      </div>
      {#if hasChildren}
        <button
          type="button"
          class="text-muted-foreground hover:text-foreground hover:bg-accent inline-flex size-5 shrink-0 items-center justify-center rounded"
          aria-expanded={open}
          aria-label={open ? 'Collapse' : 'Expand'}
          onclick={onToggle}
        >
          {#if open}
            <ChevronDown class="size-3.5" aria-hidden="true" />
          {:else}
            <ChevronRight class="size-3.5" aria-hidden="true" />
          {/if}
        </button>
      {/if}
    </div>
    {#if nodeSnippet}
      {@render nodeSnippet({ node })}
    {:else}
      {@render children?.()}
    {/if}
  </div>
{/snippet}

{#if !isHorizontal}
  <!-- ══ Top-down (vertical) layout ══ -->
  <div class="org-v" data-root={isRoot ? '' : undefined}>
    <!-- Node card -->
    <div class="org-v-card">
      {@render card()}
    </div>

    <!-- Children -->
    {#if hasChildren && open}
      <div class="org-v-children">
        <!-- Vertical line from parent to horizontal sibling bar -->
        {#if showConnectors}
          <div class="org-v-line-down"></div>
        {/if}
        <div class="org-v-children-row" data-single={isOnlyChild ? '' : undefined}>
          <!-- Horizontal bar connecting siblings (only for 2+ children) -->
          {#if showConnectors && !isOnlyChild}
            <div class="org-v-line-across"></div>
          {/if}
          {#each node.children ?? [] as child (child.id)}
            <OrgChartNode
              node={child}
              depth={depth + 1}
              isRoot={false}
              {direction}
              {showConnectors}
              {isExpanded}
              {toggle}
              {onnodeclick}
              {nodeSnippet}
            />
          {/each}
        </div>
      </div>
    {/if}
  </div>
{:else}
  <!-- ══ Left-right (horizontal) layout ══ -->
  <div class="org-h" data-root={isRoot ? '' : undefined}>
    <div class="flex items-start">
      <!-- Node card -->
      <div class="org-h-card">
        {@render card()}
      </div>

      <!-- Children -->
      {#if hasChildren && open}
        {#if showConnectors}
          <div class="org-h-line-right"></div>
        {/if}
        <div class="org-h-children">
          {#each node.children ?? [] as child (child.id)}
            <OrgChartNode
              node={child}
              depth={depth + 1}
              isRoot={false}
              {direction}
              {showConnectors}
              {isExpanded}
              {toggle}
              {onnodeclick}
              {nodeSnippet}
            />
          {/each}
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  /* ══ Vertical (top-down) layout ══ */
  .org-v {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* Vertical line from horizontal bar up to each child card */
  .org-v:not([data-root]) .org-v-card {
    position: relative;
    padding-top: 20px;
  }
  .org-v:not([data-root]) .org-v-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    width: 1px;
    height: 20px;
    background: var(--color-border, hsl(var(--border)));
  }

  .org-v-children {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* Vertical line from parent down to the sibling bar */
  .org-v-line-down {
    width: 1px;
    height: 20px;
    background: var(--color-border, hsl(var(--border)));
  }

  .org-v-children-row {
    display: flex;
    flex-direction: row;
    gap: 24px;
    position: relative;
    padding-top: 20px;
  }

  /* Horizontal bar: spans from the center of the first child to the center
     of the last child. We use a full-width bar with the first/last child
     vertical lines connecting to it. The bar itself is positioned using
     the half-width of the first and last cards (w-52 = 208px, half = 104px). */
  .org-v-line-across {
    position: absolute;
    top: 0;
    left: 104px; /* half of w-52 (208px) — center of first child */
    right: 104px; /* half of w-52 — center of last child */
    height: 1px;
    background: var(--color-border, hsl(var(--border)));
  }

  /* When single child, no horizontal bar needed — just the vertical line */
  .org-v-children-row[data-single] .org-v-line-across {
    display: none;
  }

  /* ══ Horizontal (left-right) layout ══ */
  .org-h {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  /* Horizontal line from parent to children column */
  .org-h-line-right {
    width: 20px;
    height: 1px;
    background: var(--color-border, hsl(var(--border)));
    margin-top: 40px;
    flex-shrink: 0;
  }

  .org-h-children {
    display: flex;
    flex-direction: column;
    gap: 12px;
    position: relative;
  }

  /* Vertical line connecting siblings in horizontal mode */
  .org-h-children::before {
    content: '';
    position: absolute;
    left: 0;
    top: 40px;
    bottom: 40px;
    width: 1px;
    background: var(--color-border, hsl(var(--border)));
  }

  /* Horizontal line from vertical bar to each child */
  .org-h:not([data-root]) .org-h-card {
    position: relative;
    padding-left: 20px;
  }
  .org-h:not([data-root]) .org-h-card::before {
    content: '';
    position: absolute;
    top: 40px;
    left: 0;
    width: 20px;
    height: 1px;
    background: var(--color-border, hsl(var(--border)));
  }
</style>

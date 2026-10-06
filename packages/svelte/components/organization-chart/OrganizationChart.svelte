<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import type { OrgNode } from './types'

  /** Imperative handle — grab it with `bind:this` (React `OrganizationChartHandle` parity). */
  export interface OrganizationChartHandle {
    expandAll: () => void
    collapseAll: () => void
    zoomIn: () => void
    zoomOut: () => void
    resetZoom: () => void
  }

  // `ontoggle` is omitted: the native ToggleEventHandler collides with the
  // (node, expanded) toggle callback.
  export interface OrganizationChartProps extends Omit<HTMLAttributes<HTMLDivElement>, 'ontoggle'> {
    data: OrgNode
    direction?: 'top-down' | 'left-right'
    defaultExpanded?: boolean
    showConnectors?: boolean
    zoomable?: boolean
    onnodeclick?: (node: OrgNode) => void
    ontoggle?: (node: OrgNode, expanded: boolean) => void
    /** Extra content rendered inside each node card. */
    nodeSnippet?: Snippet<[{ node: OrgNode }]>
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { organizationChartVariants } from './organization-chart.variants'
  import OrgChartNode from './OrgChartNode.svelte'

  let {
    class: className,
    data,
    direction = 'top-down',
    defaultExpanded = true,
    showConnectors = true,
    zoomable = false,
    onnodeclick,
    ontoggle,
    nodeSnippet,
    children,
    ref = $bindable(null),
    ...restProps
  }: OrganizationChartProps = $props()

  let expanded = $state<Set<string>>(new Set())

  function collectIds(node: OrgNode, acc: string[] = []): string[] {
    acc.push(node.id)
    if (node.children) for (const c of node.children) collectIds(c, acc)
    return acc
  }

  function defaultExpand() {
    if (defaultExpanded) {
      expanded = new Set(collectIds(data))
    } else {
      expanded = new Set([data.id])
    }
  }

  // Mirror the Vue immediate watcher on [data, defaultExpanded].
  $effect(() => {
    data
    defaultExpanded
    defaultExpand()
  })

  function toggleNode(node: OrgNode) {
    const next = new Set(expanded)
    if (next.has(node.id)) next.delete(node.id)
    else next.add(node.id)
    expanded = next
    ontoggle?.(node, next.has(node.id))
  }

  function isExpanded(node: OrgNode): boolean {
    return expanded.has(node.id)
  }

  export function expandAll() {
    expanded = new Set(collectIds(data))
  }

  export function collapseAll() {
    expanded = new Set([data.id])
  }

  let zoom = $state(1)
  export function zoomIn() {
    zoom = Math.min(2, zoom + 0.1)
  }
  export function zoomOut() {
    zoom = Math.max(0.5, zoom - 0.1)
  }
  export function resetZoom() {
    zoom = 1
  }
</script>

<div
  bind:this={ref}
  data-uipkge=""
  data-slot="organization-chart"
  data-direction={direction}
  class={cn(organizationChartVariants(), className)}
  {...restProps}
>
  {#if zoomable}
    <div class="border-border flex items-center gap-2 border-b px-3 py-2">
      <button
        type="button"
        class="text-muted-foreground hover:text-foreground hover:bg-accent inline-flex size-7 items-center justify-center rounded-md text-sm"
        aria-label="Zoom out"
        onclick={zoomOut}
      >
        −
      </button>
      <span class="text-muted-foreground w-12 text-center text-xs tabular-nums">{Math.round(zoom * 100)}%</span>
      <button
        type="button"
        class="text-muted-foreground hover:text-foreground hover:bg-accent inline-flex size-7 items-center justify-center rounded-md text-sm"
        aria-label="Zoom in"
        onclick={zoomIn}
      >
        +
      </button>
      <button
        type="button"
        class="text-muted-foreground hover:text-foreground hover:bg-accent ml-1 rounded-md px-2 py-1 text-xs"
        aria-label="Reset zoom"
        onclick={resetZoom}
      >
        Reset
      </button>
      <div class="ml-auto flex gap-1">
        <button
          type="button"
          class="text-muted-foreground hover:text-foreground hover:bg-accent rounded-md px-2 py-1 text-xs"
          aria-label="Expand all"
          onclick={expandAll}
        >
          Expand all
        </button>
        <button
          type="button"
          class="text-muted-foreground hover:text-foreground hover:bg-accent rounded-md px-2 py-1 text-xs"
          aria-label="Collapse all"
          onclick={collapseAll}
        >
          Collapse all
        </button>
      </div>
    </div>
  {/if}
  <div class="overflow-auto p-4">
    <div style:transform="scale({zoom})" style:transform-origin="top center" class="transition-transform duration-200">
      <OrgChartNode
        node={data}
        depth={0}
        isRoot={true}
        {direction}
        {showConnectors}
        {isExpanded}
        toggle={toggleNode}
        {onnodeclick}
        nodeSnippet={nodeSnippet ?? children}
      />
    </div>
  </div>
</div>

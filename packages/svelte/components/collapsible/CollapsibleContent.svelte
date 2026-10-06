<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface CollapsibleContentProps extends HTMLAttributes<HTMLDivElement> {
    /** Keep the content mounted (hidden) when closed instead of unmounting it. */
    forceMount?: boolean
    children?: Snippet
  }
</script>

<script lang="ts">
  import { getContext } from 'svelte'
  import type { CollapsibleContext } from './Collapsible.svelte'

  let { forceMount = false, children, ...restProps }: CollapsibleContentProps = $props()

  const ctx = getContext<CollapsibleContext | null>('collapsibleContext')
  const isOpen = $derived(ctx?.isOpen ?? false)
</script>

{#if forceMount || isOpen}
  <div
    data-uipkge
    data-slot="collapsible-content"
    id={ctx?.contentId}
    data-state={isOpen ? 'open' : 'closed'}
    hidden={!isOpen || undefined}
    {...restProps}
  >
    {@render children?.()}
  </div>
{/if}

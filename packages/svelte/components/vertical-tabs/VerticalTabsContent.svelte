<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface VerticalTabsContentProps extends HTMLAttributes<HTMLDivElement> {
    children?: Snippet
    value: string
    forceMount?: boolean
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { getVerticalTabsContext, sanitizeId } from './VerticalTabs.svelte'

  let { children, value, forceMount = false, class: className, ...restProps }: VerticalTabsContentProps = $props()

  const ctx = getVerticalTabsContext('VerticalTabsContent')

  const active = $derived(ctx.getValue() === value)
  const triggerId = $derived(`${ctx.rootId}-trigger-${sanitizeId(value)}`)
  const contentId = $derived(`${ctx.rootId}-content-${sanitizeId(value)}`)
</script>

{#if forceMount || active}
  <div
    data-uipkge
    data-slot="vertical-tabs-content"
    data-state={active ? 'active' : 'inactive'}
    id={contentId}
    role="tabpanel"
    aria-labelledby={triggerId}
    tabindex="0"
    hidden={forceMount && !active ? true : undefined}
    class={cn(
      'ring-offset-background focus-visible:ring-ring/50 flex-1 focus-visible:ring-2 focus-visible:outline-none',
      className,
    )}
    {...restProps}
  >
    {@render children?.()}
  </div>
{/if}

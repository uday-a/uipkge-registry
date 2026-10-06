<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface SidebarGroupLabelProps extends HTMLAttributes<HTMLDivElement> {
    /** Render your own element — spread `props` onto it. */
    child?: Snippet<[{ props: Record<string, unknown> }]>
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, child, children, ref = $bindable(null), ...restProps }: SidebarGroupLabelProps = $props()

  const mergedProps = $derived({
    'data-uipkge': '',
    'data-slot': 'sidebar-group-label',
    'data-sidebar': 'group-label',
    class: cn(
      'text-sidebar-foreground/70 ring-sidebar-ring mt-2 mb-1 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
      'group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0',
      className,
    ),
    ...restProps,
  })
</script>

{#if child}
  {@render child({ props: mergedProps })}
{:else}
  <div bind:this={ref} {...mergedProps}>{@render children?.()}</div>
{/if}

<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAnchorAttributes } from 'svelte/elements'

  export interface BreadcrumbLinkProps extends HTMLAnchorAttributes {
    /** Render your own element with the link's props and styles instead of
     *  emitting an <a> — the Svelte counterpart of React's `asChild`. */
    child?: Snippet<[{ props: Record<string, unknown> }]>
    /** The rendered <a>, via `bind:ref`. Stays null in `child` mode. */
    ref?: HTMLAnchorElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, child, children, ref = $bindable(null), ...restProps }: BreadcrumbLinkProps = $props()

  const mergedProps = $derived({
    'data-uipkge': '',
    'data-slot': 'breadcrumb-link',
    class: cn(
      'hover:text-foreground focus-visible:outline-ring rounded-sm underline-offset-4 transition-colors duration-200 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2',
      className,
    ),
    ...restProps,
  })
</script>

{#if child}
  {@render child({ props: mergedProps })}
{:else}
  <a bind:this={ref} {...mergedProps}>{@render children?.()}</a>
{/if}

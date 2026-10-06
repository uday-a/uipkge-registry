<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import type { BadgeVariants } from './badge.variants'

  export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariants['variant']
    /** Allow the label to wrap onto multiple lines instead of clipping. */
    wrap?: BadgeVariants['wrap']
    /** Render your own element with the badge's props and styles instead of
     *  emitting a <span> — the Svelte counterpart of React's `asChild`. */
    child?: Snippet<[{ props: Record<string, unknown> }]>
    /** The rendered <span>, via `bind:ref`. Stays null in `child` mode — use
     *  `bind:this` on your own element there. */
    ref?: HTMLSpanElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { badgeVariants } from './badge.variants'

  let {
    class: className,
    variant,
    wrap,
    child,
    children,
    ref = $bindable(null),
    ...restProps
  }: BadgeProps = $props()

  const mergedProps = $derived({
    'data-uipkge': '',
    'data-slot': 'badge',
    class: cn(badgeVariants({ variant, wrap }), className),
    ...restProps,
  })
</script>

{#if child}
  {@render child({ props: mergedProps })}
{:else}
  <span bind:this={ref} {...mergedProps}>{@render children?.()}</span>
{/if}

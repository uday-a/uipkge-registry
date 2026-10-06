<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface ListItemProps extends HTMLAttributes<HTMLElement> {
    as?: 'li' | 'div' | 'a'
    active?: boolean
    disabled?: boolean
    /** Destination when `as="a"`. Also marks the item interactive, like an `onclick` handler. */
    href?: string
    children?: Snippet
    ref?: HTMLElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let {
    class: className,
    as = 'li',
    active = false,
    disabled = false,
    href,
    onclick,
    children,
    ref = $bindable(null),
    ...restProps
  }: ListItemProps = $props()

  // Only show pointer/hover affordances when the item is actually interactive.
  const isInteractive = $derived(!disabled && (as === 'a' || href != null || onclick != null))

  const itemClass = $derived(
    cn(
      'rounded-md px-2 py-1.5 text-sm transition-colors duration-200 select-none focus-visible:outline-none',
      'has-[>[data-slot=list-item-content]]:flex has-[>[data-slot=list-item-content]]:items-center has-[>[data-slot=list-item-content]]:gap-3',
      !disabled && isInteractive && 'hover:bg-accent focus-visible:bg-accent cursor-pointer',
      active && 'bg-accent text-accent-foreground',
      disabled && 'pointer-events-none cursor-not-allowed opacity-50',
      className,
    ),
  )

  const sharedAttrs = $derived({
    'data-uipkge': '',
    'data-slot': 'list-item',
    'data-active': active ? '' : undefined,
    'data-disabled': disabled ? '' : undefined,
    'aria-disabled': disabled ? ('true' as const) : undefined,
    'aria-current': active ? ('true' as const) : undefined,
    tabindex: disabled ? -1 : undefined,
    class: itemClass,
    onclick,
  })
</script>

{#if as === 'a'}
  <a bind:this={ref} href={disabled ? undefined : href} {...sharedAttrs} {...restProps}>
    {@render children?.()}
  </a>
{:else if as === 'div'}
  <div bind:this={ref} {...sharedAttrs} {...restProps}>
    {@render children?.()}
  </div>
{:else}
  <li bind:this={ref} {...sharedAttrs} {...restProps}>
    {@render children?.()}
  </li>
{/if}

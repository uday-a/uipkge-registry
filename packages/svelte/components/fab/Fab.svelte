<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import type { FabVariants } from './fab.variants'

  export interface FabProps extends HTMLButtonAttributes {
    /** Label text — renders an extended FAB. Use children for an icon. */
    label?: string
    variant?: FabVariants['variant']
    size?: FabVariants['size']
    position?: FabVariants['position']
    /** Use absolute instead of fixed positioning (for contained FABs). */
    absolute?: boolean
    /** Accessible label. Defaults to the label prop or 'Floating action'. */
    ariaLabel?: string
    /** Render your own element with the FAB's props and styles instead of
     *  emitting a <button> — the Svelte counterpart of React's `asChild`. */
    child?: Snippet<[{ props: Record<string, unknown> }]>
    /** The rendered <button>, via `bind:ref`. Stays null in `child` mode. */
    ref?: HTMLButtonElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { fabVariants } from './fab.variants'

  let {
    class: className,
    variant = 'default',
    size = 'default',
    position = 'bottom-right',
    absolute = false,
    label,
    disabled,
    ariaLabel,
    child,
    children,
    ref = $bindable(null),
    ...restProps
  }: FabProps = $props()

  const resolvedSize = $derived(label ? 'extended' : size)

  const mergedProps = $derived({
    'data-uipkge': '',
    'data-slot': 'fab',
    'data-variant': variant,
    'data-size': resolvedSize,
    'data-position': position,
    disabled,
    'aria-label': ariaLabel || label || 'Floating action',
    class: cn(
      fabVariants({ variant, size: resolvedSize, position }),
      absolute && position !== 'inline' && 'absolute',
      className,
    ),
    ...restProps,
  })
</script>

{#if child}
  {@render child({ props: mergedProps })}
{:else}
  <!-- Capture-phase guard mirrors the Vue twin's disabled click guard. -->
  <button
    bind:this={ref}
    type="button"
    onclickcapture={(e) => {
      if (disabled) {
        e.preventDefault()
        e.stopPropagation()
      }
    }}
    {...mergedProps}
  >
    {@render children?.()}
    {#if label}<span class="pr-1">{label}</span>{/if}
  </button>
{/if}

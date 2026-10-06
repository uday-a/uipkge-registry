<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  export interface SidebarMenuButtonChildProps extends HTMLButtonAttributes {
    variant?: 'default' | 'outline'
    size?: 'default' | 'sm' | 'lg'
    isActive?: boolean
    /** Render your own element — spread `props` onto it. */
    child?: Snippet<[{ props: Record<string, unknown> }]>
    ref?: HTMLElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { sidebarMenuButtonVariants } from './sidebar.variants'

  let {
    class: className,
    variant = 'default',
    size = 'default',
    isActive,
    child,
    children,
    ref = $bindable(null),
    ...restProps
  }: SidebarMenuButtonChildProps = $props()

  const mergedProps = $derived({
    'data-uipkge': '',
    'data-slot': 'sidebar-menu-button',
    'data-sidebar': 'menu-button',
    'data-size': size,
    'data-active': isActive,
    class: cn(sidebarMenuButtonVariants({ variant, size }), className),
    ...restProps,
  })
</script>

{#if child}
  {@render child({ props: mergedProps })}
{:else}
  <button bind:this={ref as HTMLButtonElement | null} type="button" {...mergedProps}>
    {@render children?.()}
  </button>
{/if}

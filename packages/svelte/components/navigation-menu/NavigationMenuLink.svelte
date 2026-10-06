<script lang="ts" module>
  import type { HTMLAnchorAttributes } from 'svelte/elements'

  export interface NavigationMenuLinkProps extends HTMLAnchorAttributes {
    active?: boolean
    ref?: HTMLAnchorElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { getNavigationMenuRootContext } from './NavigationMenuContext'

  let {
    class: className,
    active = false,
    children,
    ref = $bindable(null),
    onclick,
    ...restProps
  }: NavigationMenuLinkProps = $props()

  const root = getNavigationMenuRootContext()
</script>

<a
  bind:this={ref}
  data-uipkge=""
  data-slot="navigation-menu-link"
  data-active={active ? '' : undefined}
  aria-current={active ? 'page' : undefined}
  class={cn(
    "data-active:focus:bg-accent data-active:hover:bg-accent data-active:bg-accent/50 data-active:text-accent-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 [&_svg:not([class*='text-'])]:text-muted-foreground flex flex-col gap-1 rounded-sm p-2 text-sm transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1 [&_svg:not([class*='size-'])]:size-4",
    className,
  )}
  onclick={(e) => {
    onclick?.(e)
    // Following a link dismisses the menu.
    root?.setValue(undefined)
  }}
  {...restProps}
>
  {@render children?.()}
</a>

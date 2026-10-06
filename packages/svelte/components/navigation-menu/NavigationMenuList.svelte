<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface NavigationMenuListProps extends HTMLAttributes<HTMLUListElement> {
    ref?: HTMLUListElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: NavigationMenuListProps = $props()
</script>

<ul
  bind:this={ref}
  data-uipkge=""
  data-slot="navigation-menu-list"
  class={cn('group flex flex-1 list-none items-center justify-center gap-1', className)}
  {...restProps}
>
  {@render children?.()}
</ul>

<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface SidebarSeparatorProps extends HTMLAttributes<HTMLDivElement> {
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { Separator } from '$lib/components/ui/separator'
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: SidebarSeparatorProps = $props()
</script>

<Separator
  data-uipkge=""
  data-slot="sidebar-separator"
  data-sidebar="separator"
  bind:ref
  class={cn('bg-sidebar-border mx-2 w-auto', className)}
  {...restProps}
>
  {@render children?.()}
</Separator>

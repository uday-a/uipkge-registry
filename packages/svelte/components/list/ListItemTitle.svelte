<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface ListItemTitleProps extends HTMLAttributes<HTMLDivElement> {
    children?: Snippet
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ...restProps }: ListItemTitleProps = $props()
</script>

<div
  data-uipkge=""
  data-slot="list-item-title"
  class={cn('text-foreground truncate text-sm leading-none font-medium', className)}
  {...restProps}
>
  {@render children?.()}
</div>

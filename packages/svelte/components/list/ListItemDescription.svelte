<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface ListItemDescriptionProps extends HTMLAttributes<HTMLDivElement> {
    children?: Snippet
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ...restProps }: ListItemDescriptionProps = $props()
</script>

<div
  data-uipkge=""
  data-slot="list-item-description"
  class={cn('text-muted-foreground line-clamp-1 text-xs', className)}
  {...restProps}
>
  {@render children?.()}
</div>

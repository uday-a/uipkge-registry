<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface ListItemActionsProps extends HTMLAttributes<HTMLDivElement> {
    children?: Snippet
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ...restProps }: ListItemActionsProps = $props()
</script>

<div
  data-uipkge=""
  data-slot="list-item-actions"
  class={cn('text-muted-foreground flex shrink-0 items-center gap-1.5 self-center', className)}
  {...restProps}
>
  {@render children?.()}
</div>

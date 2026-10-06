<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface ListItemContentProps extends HTMLAttributes<HTMLDivElement> {
    children?: Snippet
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ...restProps }: ListItemContentProps = $props()
</script>

<div
  data-uipkge=""
  data-slot="list-item-content"
  class={cn('flex min-w-0 flex-1 flex-col gap-0.5 self-center', className)}
  {...restProps}
>
  {@render children?.()}
</div>

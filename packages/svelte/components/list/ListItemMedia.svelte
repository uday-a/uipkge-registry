<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface ListItemMediaProps extends HTMLAttributes<HTMLDivElement> {
    children?: Snippet
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ...restProps }: ListItemMediaProps = $props()
</script>

<div
  data-uipkge=""
  data-slot="list-item-media"
  class={cn('flex shrink-0 items-center justify-center self-center', className)}
  {...restProps}
>
  {@render children?.()}
</div>

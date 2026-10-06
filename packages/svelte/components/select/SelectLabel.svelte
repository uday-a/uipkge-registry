<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface SelectLabelProps extends HTMLAttributes<HTMLDivElement> {
    children?: Snippet
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ...restProps }: SelectLabelProps = $props()
</script>

<div data-uipkge data-slot="select-label" class={cn('text-muted-foreground px-2 py-2 text-xs', className)} {...restProps}>
  {@render children?.()}
</div>

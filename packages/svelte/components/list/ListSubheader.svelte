<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface ListSubheaderProps extends HTMLAttributes<HTMLLIElement> {
    inset?: boolean
    children?: Snippet
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, inset = false, children, ...restProps }: ListSubheaderProps = $props()
</script>

<li
  data-uipkge=""
  data-slot="list-subheader"
  class={cn(
    'text-muted-foreground px-2 py-1.5 text-xs font-semibold tracking-wide uppercase',
    inset && 'pl-8',
    className,
  )}
  {...restProps}
>
  {@render children?.()}
</li>

<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface InputGroupAddonProps extends HTMLAttributes<HTMLDivElement> {
    align?: 'inline' | 'block'
    children?: Snippet
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let {
    class: className,
    align = 'inline',
    children,
    ref = $bindable(null),
    ...restProps
  }: InputGroupAddonProps = $props()
</script>

<div
  bind:this={ref}
  data-uipkge=""
  data-slot="input-group-addon"
  data-align={align}
  class={cn(
    'text-muted-foreground flex shrink-0 items-center justify-center px-3 text-sm select-none',
    'border-input first:rounded-l-[calc(var(--radius)-1px)] last:rounded-r-[calc(var(--radius)-1px)]',
    'border-r first:border-l-0 last:border-r-0',
    className,
  )}
  {...restProps}
>
  {@render children?.()}
</div>

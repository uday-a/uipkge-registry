<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface RangeCalendarHeaderProps extends HTMLAttributes<HTMLDivElement> {
    children?: Snippet
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: RangeCalendarHeaderProps = $props()
</script>

<div
  bind:this={ref}
  data-uipkge=""
  data-slot="range-calendar-header"
  class={cn('relative flex w-full items-center justify-center pt-1', className)}
  {...restProps}
>
  {@render children?.()}
</div>

<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface CalendarHeaderProps extends HTMLAttributes<HTMLDivElement> {
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: CalendarHeaderProps = $props()
</script>

<div
  bind:this={ref}
  data-uipkge
  data-slot="calendar-header"
  class={cn('relative flex w-full items-center justify-center px-8 pt-1', className)}
  {...restProps}
>
  {@render children?.()}
</div>

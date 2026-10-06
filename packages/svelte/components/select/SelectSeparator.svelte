<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface SelectSeparatorProps extends HTMLAttributes<HTMLDivElement> {}
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, ...restProps }: SelectSeparatorProps = $props()
</script>

<div
  data-uipkge
  data-slot="select-separator"
  role="separator"
  aria-orientation="horizontal"
  class={cn('bg-border pointer-events-none -mx-1 my-1 h-px', className)}
  {...restProps}
></div>

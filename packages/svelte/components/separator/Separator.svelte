<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
    orientation?: 'horizontal' | 'vertical'
    /** Presentational only: hides from assistive tech. Set false for a semantic landmark. */
    decorative?: boolean
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, orientation = 'horizontal', decorative = true, ref = $bindable(null), ...restProps }: SeparatorProps = $props()
</script>

<div
  bind:this={ref}
  data-uipkge=""
  data-slot="separator"
  data-orientation={orientation}
  role={decorative ? undefined : 'separator'}
  aria-orientation={decorative ? undefined : orientation}
  aria-hidden={decorative ? 'true' : undefined}
  class={cn(
    'bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
    className,
  )}
  {...restProps}
></div>

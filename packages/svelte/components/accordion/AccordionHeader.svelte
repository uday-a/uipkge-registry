<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface AccordionHeaderProps extends HTMLAttributes<HTMLElement> {
    ref?: HTMLElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: AccordionHeaderProps = $props()
</script>

<h3 bind:this={ref} data-uipkge="" data-slot="accordion-header" class={cn('flex', className)} {...restProps}>
  {@render children?.()}
</h3>

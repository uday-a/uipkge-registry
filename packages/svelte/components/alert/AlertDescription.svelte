<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface AlertDescriptionProps extends HTMLAttributes<HTMLDivElement> {
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: AlertDescriptionProps = $props()
</script>

<div
  bind:this={ref}
  data-uipkge=""
  data-slot="alert-description"
  class={cn('text-muted-foreground text-sm leading-relaxed [&_p]:leading-relaxed', className)}
  {...restProps}
>
  {@render children?.()}
</div>

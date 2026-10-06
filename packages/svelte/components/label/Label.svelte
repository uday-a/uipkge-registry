<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLLabelAttributes } from 'svelte/elements'

  export interface LabelProps extends HTMLLabelAttributes {
    children?: Snippet
    ref?: HTMLLabelElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: LabelProps = $props()
</script>

<label
  bind:this={ref}
  data-uipkge=""
  data-slot="label"
  class={cn(
    'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
    className,
  )}
  {...restProps}
>
  {@render children?.()}
</label>

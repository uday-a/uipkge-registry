<script lang="ts" module>
  import type { HTMLOptionAttributes } from 'svelte/elements'

  export interface NativeSelectOptionProps extends HTMLOptionAttributes {
    ref?: HTMLOptionElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: NativeSelectOptionProps = $props()
</script>

<option
  bind:this={ref}
  data-slot="native-select-option"
  class={cn('bg-popover text-popover-foreground', className)}
  {...restProps}
>
  {@render children?.()}
</option>

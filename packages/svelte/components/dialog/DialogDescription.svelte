<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface DialogDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
    ref?: HTMLParagraphElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { getDialogContextOrNull } from './context'

  let { class: className, children, ref = $bindable(null), ...restProps }: DialogDescriptionProps = $props()

  const ctx = getDialogContextOrNull()
</script>

<p
  bind:this={ref}
  data-uipkge
  data-slot="dialog-description"
  id={ctx?.descriptionId}
  class={cn('text-muted-foreground text-sm', className)}
  {...restProps}
>
  {@render children?.()}
</p>

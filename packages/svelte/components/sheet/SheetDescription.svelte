<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface SheetDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
    ref?: HTMLParagraphElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { getSheetContext, nextSheetId } from './context'

  let { class: className, id, children, ref = $bindable(null), ...restProps }: SheetDescriptionProps = $props()

  const ctx = getSheetContext()
  const descriptionId = $derived(id ?? nextSheetId('sheet-description'))
  $effect(() => {
    ctx?.setDescriptionId(descriptionId)
    return () => ctx?.setDescriptionId(undefined)
  })
</script>

<p
  bind:this={ref}
  id={descriptionId}
  data-uipkge=""
  data-slot="sheet-description"
  class={cn('text-muted-foreground text-sm', className)}
  {...restProps}
>
  {@render children?.()}
</p>

<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface SheetTitleProps extends HTMLAttributes<HTMLHeadingElement> {
    ref?: HTMLHeadingElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { getSheetContext, nextSheetId } from './context'

  let { class: className, id, children, ref = $bindable(null), ...restProps }: SheetTitleProps = $props()

  const ctx = getSheetContext()
  const titleId = $derived(id ?? nextSheetId('sheet-title'))
  $effect(() => {
    ctx?.setTitleId(titleId)
    return () => ctx?.setTitleId(undefined)
  })
</script>

<h2
  bind:this={ref}
  id={titleId}
  data-uipkge=""
  data-slot="sheet-title"
  class={cn('text-foreground font-semibold', className)}
  {...restProps}
>
  {@render children?.()}
</h2>

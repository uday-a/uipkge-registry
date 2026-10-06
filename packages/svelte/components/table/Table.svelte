<script lang="ts" module>
  import type { HTMLTableAttributes } from 'svelte/elements'

  export interface TableProps extends HTMLTableAttributes {
    /**
     * Extra classes for the scroll container div (e.g. `min-h-0 flex-1` inside a
     * flex column). A sticky TableHeader pins to THIS div -- an outer overflow
     * wrapper around <Table> breaks stickiness, so size the scroller here.
     */
    containerClass?: string
    density?: 'compact' | 'cozy' | 'comfortable'
    ref?: HTMLTableElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, containerClass, density, children, ref = $bindable(null), ...restProps }: TableProps = $props()

  const densityClass = $derived.by(() => {
    if (density === 'compact') return '[&_td]:py-1.5 [&_td]:text-xs [&_th]:h-8 [&_th]:text-xs'
    if (density === 'comfortable') return '[&_td]:py-3 [&_th]:h-12'
    // cozy is the TableCell/TableHead baseline (py-2 / h-10) -- no override.
    return ''
  })
</script>

<div data-uipkge="" data-slot="table-container" class={cn('relative w-full overflow-auto', containerClass)}>
  <table bind:this={ref} data-uipkge="" data-slot="table" class={cn('w-full caption-bottom text-sm', densityClass, className)} {...restProps}>
    {@render children?.()}
  </table>
</div>

<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface CommandListProps extends HTMLAttributes<HTMLDivElement> {
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { getCommandContext } from './context'

  let { class: className, children, ref = $bindable(null), ...restProps }: CommandListProps = $props()

  const ctx = getCommandContext()

  $effect(() => {
    ctx.setListElement(ref)
    return () => ctx.setListElement(null)
  })
</script>

<div
  bind:this={ref}
  data-uipkge
  data-slot="command-list"
  role="listbox"
  id={ctx.listId}
  aria-label="Commands"
  class={cn('max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto', className)}
  {...restProps}
>
  <div role="presentation">
    {@render children?.()}
  </div>
</div>

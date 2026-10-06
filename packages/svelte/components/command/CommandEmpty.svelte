<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface CommandEmptyProps extends HTMLAttributes<HTMLDivElement> {
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { getCommandContext } from './context'

  let { class: className, children, ref = $bindable(null), ...restProps }: CommandEmptyProps = $props()

  const ctx = getCommandContext()
  const show = $derived(!!ctx.search && ctx.count === 0)
</script>

{#if show}
  <div
    bind:this={ref}
    data-uipkge
    data-slot="command-empty"
    class={cn('py-6 text-center text-sm', className)}
    {...restProps}
  >
    {@render children?.()}
  </div>
{/if}

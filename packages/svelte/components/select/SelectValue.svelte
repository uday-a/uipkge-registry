<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface SelectValueProps extends HTMLAttributes<HTMLSpanElement> {
    placeholder?: string
    children?: Snippet
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { getSelectContext } from './select-context'

  let { class: className, placeholder, children, ...restProps }: SelectValueProps = $props()

  const ctx = getSelectContext('SelectValue')
  const selected = $derived(ctx.items.find((i) => i.value === ctx.value))
</script>

<span
  data-uipkge
  data-slot="select-value"
  data-placeholder={selected ? undefined : ''}
  class={cn('pointer-events-none truncate', className)}
  {...restProps}
>
  {#if children}
    {@render children()}
  {:else if selected}
    {selected.label}
  {:else}
    {placeholder}
  {/if}
</span>

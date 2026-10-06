<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface TagsInputItemTextProps extends HTMLAttributes<HTMLSpanElement> {
    ref?: HTMLSpanElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { getTagsInputItem } from './context'

  let { class: className, children, ref = $bindable(null), ...restProps }: TagsInputItemTextProps = $props()

  // Renders the enclosing item's value when no explicit children are given
  // (mirrors reka-ui TagsInputItemText default content).
  const getItem = getTagsInputItem()
  const itemValue = $derived(getItem?.() ?? null)
</script>

<span
  bind:this={ref}
  data-uipkge=""
  data-slot="tags-input-item-text"
  class={cn('rounded bg-transparent px-2 py-0.5 text-sm', className)}
  {...restProps}
>{#if children}{@render children()}{:else}{itemValue}{/if}</span
>

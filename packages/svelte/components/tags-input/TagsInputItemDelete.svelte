<script lang="ts" module>
  import type { HTMLButtonAttributes } from 'svelte/elements'

  export interface TagsInputItemDeleteProps extends HTMLButtonAttributes {
    ref?: HTMLButtonElement | null
  }
</script>

<script lang="ts">
  import { X } from '@lucide/svelte'
  import { cn } from '$lib/utils'
  import { getTagsInputContext, getTagsInputItem } from './context'

  let { class: className, children, ref = $bindable(null), disabled, onclick, ...restProps }: TagsInputItemDeleteProps =
    $props()

  const ctx = getTagsInputContext()
  const getItem = getTagsInputItem()
  const itemValue = $derived(getItem?.() ?? null)
  const isDisabled = $derived(disabled ?? ctx?.disabled() ?? false)
</script>

<button
  bind:this={ref}
  type="button"
  data-uipkge=""
  data-slot="tags-input-item-delete"
  aria-label={itemValue ? `Remove ${itemValue}` : 'Remove tag'}
  disabled={isDisabled}
  class={cn(
    'hover:text-foreground focus-visible:ring-ring mr-1 flex rounded bg-transparent focus-visible:ring-2 focus-visible:outline-none',
    className,
  )}
  onclick={(event) => {
    onclick?.(event)
    if (!event.defaultPrevented && itemValue) ctx?.removeValue(itemValue)
  }}
  {...restProps}
>
  {#if children}{@render children()}{:else}<X class="h-4 w-4" aria-hidden="true" />{/if}
</button>

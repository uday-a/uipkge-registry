<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface SelectItemProps extends HTMLAttributes<HTMLDivElement> {
    value: string
    disabled?: boolean
    /** Display label. Defaults to the rendered text content. */
    label?: string
    children?: Snippet
    /** Replaces the default check icon shown for the selected item. */
    indicatorIcon?: Snippet
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { Check } from '@lucide/svelte'
  import { cn } from '$lib/utils'
  import { getSelectContext } from './select-context'

  let {
    class: className,
    value,
    disabled = false,
    label,
    children,
    indicatorIcon,
    ref = $bindable(null),
    ...restProps
  }: SelectItemProps = $props()

  const ctx = getSelectContext('SelectItem')
  const isSelected = $derived(ctx.value === value)
  const isHighlighted = $derived(ctx.highlighted === value)

  $effect(() => {
    // Tracks value/label/disabled; the cleanup unregisters the previous value.
    const v = value
    const l = label
    const d = disabled
    if (!ref) return
    ctx.registerItem({ value: v, label: l ?? ref.textContent?.trim() ?? v, disabled: d })
    return () => ctx.unregisterItem(v)
  })

  function onClick() {
    if (disabled) return
    ctx.selectValue(value)
  }
</script>

<div
  bind:this={ref}
  data-uipkge
  data-slot="select-item"
  data-value={value}
  data-highlighted={isHighlighted ? '' : undefined}
  data-state={isSelected ? 'checked' : 'unchecked'}
  role="option"
  id={`${ctx.contentId}-item-${CSS.escape(value)}`}
  aria-selected={isSelected}
  aria-disabled={disabled || undefined}
  data-disabled={disabled ? '' : undefined}
  class={cn(
    'focus:bg-accent focus:text-accent-foreground [&_svg:not([class*=\'text-\'])]:text-muted-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2',
    className,
  )}
  onclick={onClick}
  onpointermove={() => {
    if (!disabled) ctx.setHighlighted(value)
  }}
  {...restProps}
>
  <span class="absolute right-2 flex size-3.5 items-center justify-center">
    {#if isSelected}
      {#if indicatorIcon}
        {@render indicatorIcon()}
      {:else}
        <Check class="size-4" aria-hidden="true" />
      {/if}
    {/if}
  </span>

  <span data-uipkge data-slot="select-item-text">
    {@render children?.()}
  </span>
</div>

<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface ContextMenuCheckboxItemProps extends HTMLAttributes<HTMLDivElement> {
    checked?: boolean | 'indeterminate'
    onCheckedChange?: (checked: boolean | 'indeterminate') => void
    disabled?: boolean
    /** Override the check indicator. */
    indicator?: Snippet
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { Check } from '@lucide/svelte'
  import { cn } from '$lib/utils'

  type OnClick = NonNullable<HTMLAttributes<HTMLDivElement>['onclick']>
  type OnMouseEnter = NonNullable<HTMLAttributes<HTMLDivElement>['onmouseenter']>

  let {
    class: className,
    checked = $bindable(false),
    onCheckedChange,
    disabled = false,
    indicator,
    children,
    ref = $bindable(null),
    onclick,
    onmouseenter,
    ...restProps
  }: ContextMenuCheckboxItemProps = $props()

  const handleClick: OnClick = (e) => {
    onclick?.(e)
    if (e.defaultPrevented || disabled) return
    const next = checked === true ? false : true
    checked = next
    onCheckedChange?.(next)
  }

  const handleMouseEnter: OnMouseEnter = (e) => {
    onmouseenter?.(e)
    if (!disabled) ref?.focus()
  }
</script>

<div
  bind:this={ref}
  data-uipkge
  data-slot="context-menu-checkbox-item"
  data-context-menu-item=""
  role="menuitemcheckbox"
  tabindex="-1"
  aria-checked={checked === 'indeterminate' ? 'mixed' : checked}
  data-state={checked === 'indeterminate' ? 'indeterminate' : checked ? 'checked' : 'unchecked'}
  data-disabled={disabled ? '' : undefined}
  aria-disabled={disabled || undefined}
  class={cn(
    "focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus-visible:ring-2 focus-visible:ring-inset data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    className,
  )}
  {...restProps}
  onclick={handleClick}
  onmouseenter={handleMouseEnter}
>
  <span class="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
    {#if checked === true || checked === 'indeterminate'}
      {#if indicator}
        {@render indicator()}
      {:else}
        <Check class="size-4" aria-hidden="true" />
      {/if}
    {/if}
  </span>
  {@render children?.()}
</div>

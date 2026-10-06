<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface DropdownMenuCheckboxItemProps extends HTMLAttributes<HTMLDivElement> {
    /** Controlled checked state. Use `bind:checked` for two-way binding. */
    checked?: boolean
    /** Called with the next checked value. Toggling keeps the menu open. */
    onCheckedChange?: (checked: boolean) => void
    disabled?: boolean
    /** Custom indicator icon (default: Check). */
    indicatorIcon?: Snippet
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { Check } from '@lucide/svelte'
  import { cn } from '$lib/utils'

  let {
    class: className,
    checked = $bindable(false),
    onCheckedChange,
    disabled = false,
    indicatorIcon,
    children,
    ref = $bindable(null),
    onclick,
    ...restProps
  }: DropdownMenuCheckboxItemProps = $props()

  function toggle(e: Event) {
    if (disabled) return
    const next = !checked
    checked = next
    onCheckedChange?.(next)
  }
</script>

<div
  bind:this={ref}
  role="menuitemcheckbox"
  tabindex={disabled ? undefined : -1}
  aria-checked={checked}
  aria-disabled={disabled || undefined}
  data-uipkge
  data-slot="dropdown-menu-checkbox-item"
  data-state={checked ? 'checked' : 'unchecked'}
  data-disabled={disabled ? '' : undefined}
  class={cn(
    'focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus-visible:ring-2 focus-visible:ring-inset data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4',
    className,
  )}
  onclick={(e) => {
    toggle(e)
    onclick?.(e)
  }}
  onkeydown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggle(e)
    }
  }}
  {...restProps}
>
  <span class="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
    {#if checked}
      {#if indicatorIcon}
        {@render indicatorIcon()}
      {:else}
        <Check class="size-4" aria-hidden="true" />
      {/if}
    {/if}
  </span>
  {@render children?.()}
</div>

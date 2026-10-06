<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface DropdownMenuRadioItemProps extends HTMLAttributes<HTMLDivElement> {
    value: string
    disabled?: boolean
    /** Custom indicator icon (default: filled Circle). */
    indicatorIcon?: Snippet
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { Circle } from '@lucide/svelte'
  import { cn } from '$lib/utils'
  import { getRadioContext } from './dropdown-menu-context'

  let {
    class: className,
    value,
    disabled = false,
    indicatorIcon,
    children,
    ref = $bindable(null),
    onclick,
    ...restProps
  }: DropdownMenuRadioItemProps = $props()

  const group = getRadioContext()
  const checked = $derived(group.getValue() === value)

  function select() {
    if (disabled) return
    group.setValue(value)
  }
</script>

<div
  bind:this={ref}
  role="menuitemradio"
  tabindex={disabled ? undefined : -1}
  aria-checked={checked}
  aria-disabled={disabled || undefined}
  data-uipkge
  data-slot="dropdown-menu-radio-item"
  data-state={checked ? 'checked' : 'unchecked'}
  data-disabled={disabled ? '' : undefined}
  class={cn(
    'focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus-visible:ring-2 focus-visible:ring-inset data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4',
    className,
  )}
  onclick={(e) => {
    select()
    onclick?.(e)
  }}
  onkeydown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      select()
    }
  }}
  {...restProps}
>
  <span class="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
    {#if checked}
      {#if indicatorIcon}
        {@render indicatorIcon()}
      {:else}
        <Circle class="size-2 fill-current" aria-hidden="true" />
      {/if}
    {/if}
  </span>
  {@render children?.()}
</div>

<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface MenubarRadioItemProps extends HTMLAttributes<HTMLDivElement> {
    value: string
    disabled?: boolean
    /** Indicator icon override (default: filled Circle). */
    indicatorIcon?: Snippet
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { Circle } from '@lucide/svelte'
  import { cn } from '$lib/utils'
  import { getMenubarRadioContext, getMenubarScopeContext } from './MenubarContext'

  let {
    class: className,
    value,
    disabled = false,
    indicatorIcon,
    children,
    ref = $bindable(null),
    onclick,
    onkeydown,
    ...restProps
  }: MenubarRadioItemProps = $props()

  const scope = getMenubarScopeContext()
  const radio = getMenubarRadioContext()

  let el: HTMLDivElement | null = $state(null)
  $effect(() => {
    ref = el
  })
  $effect(() => {
    if (el && scope) {
      const isDisabled = () => disabled
      return scope.registerItem(el, isDisabled)
    }
  })

  const isChecked = $derived(radio?.getValue() === value)
</script>

<div
  bind:this={el}
  role="menuitemradio"
  tabindex="-1"
  aria-checked={isChecked}
  aria-disabled={disabled || undefined}
  data-uipkge=""
  data-slot="menubar-radio-item"
  data-state={isChecked ? 'checked' : 'unchecked'}
  data-disabled={disabled ? '' : undefined}
  class={cn(
    "focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring relative flex cursor-default items-center gap-2 rounded-xs py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus-visible:ring-2 focus-visible:ring-inset data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    className,
  )}
  onclick={(e) => {
    if (disabled) return
    radio?.setValue(value)
    // Radio items select without closing the menu.
    onclick?.(e)
  }}
  onmouseenter={(e) => {
    if (!disabled) (e.currentTarget as HTMLElement).focus({ preventScroll: true })
  }}
  onkeydown={(e) => {
    const target = e.currentTarget as HTMLElement
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      scope?.moveFocus(target, 1)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      scope?.moveFocus(target, -1)
    } else if (e.key === 'Home') {
      e.preventDefault()
      scope?.moveFocus(target, 'first')
    } else if (e.key === 'End') {
      e.preventDefault()
      scope?.moveFocus(target, 'last')
    } else if (e.key === 'Enter' || e.key === ' ') {
      if (!disabled) {
        e.preventDefault()
        target.click()
      }
    }
    onkeydown?.(e)
  }}
  {...restProps}
>
  <span class="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
    {#if isChecked}
      {#if indicatorIcon}
        {@render indicatorIcon()}
      {:else}
        <Circle class="size-2 fill-current" aria-hidden="true" />
      {/if}
    {/if}
  </span>
  {@render children?.()}
</div>

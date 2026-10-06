<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface MenubarCheckboxItemProps extends HTMLAttributes<HTMLDivElement> {
    checked?: boolean | 'indeterminate'
    defaultChecked?: boolean
    disabled?: boolean
    /** Indicator icon override (default: Check). */
    indicatorIcon?: Snippet
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { Check } from '@lucide/svelte'
  import { cn } from '$lib/utils'
  import { getMenubarScopeContext } from './MenubarContext'

  let {
    class: className,
    checked = $bindable(),
    defaultChecked = false,
    disabled = false,
    indicatorIcon,
    children,
    ref = $bindable(null),
    onclick,
    onkeydown,
    ...restProps
  }: MenubarCheckboxItemProps = $props()

  const scope = getMenubarScopeContext()

  let seeded = false
  $effect.pre(() => {
    if (!seeded && checked === undefined) checked = defaultChecked
    seeded = true
  })

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

  // NOTE: named `checkState`, not `state` — a local `state` variable shadows
  // the `$state` rune (Svelte reads `$state` as a store subscription then).
  const checkState = $derived(checked === 'indeterminate' ? 'indeterminate' : checked ? 'checked' : 'unchecked')
</script>

<div
  bind:this={el}
  role="menuitemcheckbox"
  tabindex="-1"
  aria-checked={checked === 'indeterminate' ? 'mixed' : Boolean(checked)}
  aria-disabled={disabled || undefined}
  data-uipkge=""
  data-slot="menubar-checkbox-item"
  data-state={checkState}
  data-disabled={disabled ? '' : undefined}
  class={cn(
    "focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring relative flex cursor-default items-center gap-2 rounded-xs py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus-visible:ring-2 focus-visible:ring-inset data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    className,
  )}
  onclick={(e) => {
    if (disabled) return
    checked = checked === true ? false : true
    // Checkbox items toggle without closing the menu.
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
    {#if checked === 'indeterminate'}
      <span class="size-2 rounded-[1px] bg-current" aria-hidden="true"></span>
    {:else if checked}
      {#if indicatorIcon}
        {@render indicatorIcon()}
      {:else}
        <Check class="size-4" aria-hidden="true" />
      {/if}
    {/if}
  </span>
  {@render children?.()}
</div>

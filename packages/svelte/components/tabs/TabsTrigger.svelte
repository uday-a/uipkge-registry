<script lang="ts" module>
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import type { TabsOrientation } from './context'
  import type { TabsTriggerVariants } from './tabs.variants'

  export interface TabsTriggerProps extends HTMLButtonAttributes {
    value: string
    size?: TabsTriggerVariants['size']
    variant?: TabsTriggerVariants['variant']
    orientation?: TabsOrientation
    ref?: HTMLButtonElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { getTabsContext } from './context'
  import { tabsTriggerVariants } from './tabs.variants'

  let {
    class: className,
    value,
    size,
    variant,
    orientation,
    disabled = false,
    children,
    ref = $bindable(null),
    onclick,
    ...restProps
  }: TabsTriggerProps = $props()

  const ctx = getTabsContext()
  const effectiveOrientation = $derived(orientation ?? ctx?.orientation() ?? 'horizontal')
  const isActive = $derived(ctx?.current() === value)
</script>

<button
  bind:this={ref}
  type="button"
  role="tab"
  id={ctx?.triggerId(value)}
  aria-selected={isActive}
  aria-controls={ctx?.contentId(value)}
  tabindex={isActive ? 0 : -1}
  data-uipkge=""
  data-slot="tabs-trigger"
  data-state={isActive ? 'active' : 'inactive'}
  disabled={disabled}
  class={cn(
    tabsTriggerVariants({ size, variant, orientation: effectiveOrientation }),
    className,
  )}
  onclick={(event) => {
    onclick?.(event)
    if (!event.defaultPrevented && !disabled) ctx?.select(value)
  }}
  {...restProps}
>
  {@render children?.()}
</button>

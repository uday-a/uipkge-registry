<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface NavigationMenuItemProps extends HTMLAttributes<HTMLLIElement> {
    /**
     * Stable value for this item. Defaults to a generated id. Pass one when
     * controlling the open panel through the root `value` / `defaultValue`.
     */
    value?: string
    ref?: HTMLLIElement | null
  }

  let itemCounter = 0
</script>

<script lang="ts">
  import { untrack } from 'svelte'
  import { cn } from '$lib/utils'
  import { getNavigationMenuRootContext, setNavigationMenuItemContext } from './NavigationMenuContext'

  let { class: className, value: valueProp, children, ref = $bindable(null), ...restProps }: NavigationMenuItemProps =
    $props()

  const root = getNavigationMenuRootContext()
  // Computed once: ids must stay stable for the component's lifetime (aria
  // references + root tracking depend on it).
  const value = untrack(() => valueProp ?? `item-${++itemCounter}`)
  const triggerId = `navigation-menu-trigger-${value}`
  const contentId = `navigation-menu-content-${value}`

  const isOpen = $derived(root?.getValue() === value)

  let triggerEl: HTMLElement | null = $state(null)

  setNavigationMenuItemContext({
    value,
    triggerId,
    contentId,
    isOpen: () => isOpen,
    getTriggerEl: () => triggerEl,
    setTriggerEl: (el) => {
      triggerEl = el
    },
  })
</script>

<li
  bind:this={ref}
  data-uipkge=""
  data-slot="navigation-menu-item"
  data-value={value}
  data-state={isOpen ? 'open' : 'closed'}
  class={cn('relative', className)}
  {...restProps}
>
  {@render children?.()}
</li>

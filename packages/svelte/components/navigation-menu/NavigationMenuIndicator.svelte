<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface NavigationMenuIndicatorProps extends HTMLAttributes<HTMLDivElement> {
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { tick } from 'svelte'
  import { cn } from '$lib/utils'
  import { getNavigationMenuRootContext } from './NavigationMenuContext'

  let { class: className, ref = $bindable(null), ...restProps }: NavigationMenuIndicatorProps = $props()

  const root = getNavigationMenuRootContext()
  const value = $derived(root?.getValue())
  const visible = $derived(value !== undefined)

  // Measured position of the open trigger's center relative to the root
  // (reka positions this automatically; the hand-rolled twin measures).
  let left = $state(0)

  $effect(() => {
    value
    if (!visible) return
    tick().then(() => {
      const rootEl = root?.getRootEl()
      const trigger = rootEl?.querySelector<HTMLElement>('[data-slot="navigation-menu-trigger"][data-state="open"]')
      if (rootEl && trigger) {
        const rootRect = rootEl.getBoundingClientRect()
        const rect = trigger.getBoundingClientRect()
        left = rect.left - rootRect.left + rect.width / 2
      }
    })
  })
</script>

{#if visible}
  <div
    bind:this={ref}
    data-uipkge=""
    data-slot="navigation-menu-indicator"
    data-state="visible"
    class={cn(
      'data-[state=visible]:motion-safe:animate-in data-[state=hidden]:motion-safe:animate-out data-[state=hidden]:motion-safe:fade-out data-[state=visible]:motion-safe:fade-in absolute top-full z-[1] flex h-1.5 -translate-x-1/2 items-end justify-center overflow-hidden',
      className,
    )}
    style:left="{left}px"
    aria-hidden="true"
    {...restProps}
  >
    <div class="bg-border relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm shadow-md"></div>
  </div>
{/if}

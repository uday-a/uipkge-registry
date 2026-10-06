<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface DropdownMenuContentProps extends HTMLAttributes<HTMLDivElement> {
    side?: 'top' | 'right' | 'bottom' | 'left'
    align?: 'start' | 'center' | 'end'
    sideOffset?: number
    alignOffset?: number
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { focusMenuItem, getMenuContext } from './dropdown-menu-context'
  import { dropdownMenuContentVariants } from './dropdown-menu-content.variants'

  let {
    class: className,
    side = 'bottom',
    align = 'start',
    sideOffset = 4,
    alignOffset = 0,
    children,
    ref = $bindable(null),
    onkeydown,
    ...restProps
  }: DropdownMenuContentProps = $props()

  const menu = getMenuContext()
  const open = $derived(menu.isOpen())

  // Positioned `fixed` from the trigger rect (no portal needed). Hidden until
  // the first measurement so the menu never flashes at the origin.
  let style = $state('position: fixed; top: 0; left: 0; visibility: hidden;')

  function position() {
    const trigger = document.getElementById(menu.ids.trigger)
    const content = document.getElementById(menu.ids.content)
    if (!trigger || !content) return
    const t = trigger.getBoundingClientRect()
    const w = content.offsetWidth
    const h = content.offsetHeight
    let top = 0
    let left = 0
    if (side === 'bottom' || side === 'top') {
      top = side === 'bottom' ? t.bottom + sideOffset : t.top - h - sideOffset
      left =
        align === 'start'
          ? t.left + alignOffset
          : align === 'end'
            ? t.right - w - alignOffset
            : t.left + t.width / 2 - w / 2
    } else {
      left = side === 'right' ? t.right + sideOffset : t.left - w - sideOffset
      top =
        align === 'start'
          ? t.top + alignOffset
          : align === 'end'
            ? t.bottom - h - alignOffset
            : t.top + t.height / 2 - h / 2
    }
    left = Math.max(8, Math.min(left, window.innerWidth - w - 8))
    top = Math.max(8, Math.min(top, window.innerHeight - 16))
    const origin =
      side === 'bottom'
        ? `top ${align === 'start' ? 'left' : align === 'end' ? 'right' : 'center'}`
        : side === 'top'
          ? `bottom ${align === 'start' ? 'left' : align === 'end' ? 'right' : 'center'}`
          : side === 'right'
            ? 'center left'
            : 'center right'
    // The variants file intentionally keeps the twin's custom-property names
    // (see its comment); resolve them here from the measured placement.
    style =
      `position: fixed; top: ${top}px; left: ${left}px; ` +
      `--reka-dropdown-menu-content-available-height: ${Math.max(80, window.innerHeight - top - 8)}px; ` +
      `--reka-dropdown-menu-content-transform-origin: ${origin};`
  }

  $effect(() => {
    if (!open) return
    position()
    window.addEventListener('resize', position)
    // Capture phase: an ancestor scroll re-seats the menu under the trigger.
    window.addEventListener('scroll', position, true)
    return () => {
      window.removeEventListener('resize', position)
      window.removeEventListener('scroll', position, true)
    }
  })

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      focusMenuItem(menu.ids.content, 'next')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      focusMenuItem(menu.ids.content, 'prev')
    } else if (e.key === 'Home') {
      e.preventDefault()
      focusMenuItem(menu.ids.content, 'first')
    } else if (e.key === 'End') {
      e.preventDefault()
      focusMenuItem(menu.ids.content, 'last')
    }
  }
</script>

{#if open}
  <!-- outline-none replicates reka's content outline reset. -->
  <div
    bind:this={ref}
    id={menu.ids.content}
    role="menu"
    aria-orientation="vertical"
    tabindex="-1"
    data-uipkge
    data-slot="dropdown-menu-content"
    data-state="open"
    data-side={side}
    data-align={align}
    class={cn(dropdownMenuContentVariants({ side }), 'outline-none', className)}
    {style}
    onkeydown={(e) => {
      handleKeyDown(e)
      onkeydown?.(e)
    }}
    {...restProps}
  >
    {@render children?.()}
  </div>
{/if}

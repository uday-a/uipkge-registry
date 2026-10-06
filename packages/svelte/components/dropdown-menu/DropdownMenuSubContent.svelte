<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface DropdownMenuSubContentProps extends HTMLAttributes<HTMLDivElement> {
    sideOffset?: number
    alignOffset?: number
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { focusMenuItem, getSubContext } from './dropdown-menu-context'

  let {
    class: className,
    sideOffset = 8,
    alignOffset = -4,
    children,
    ref = $bindable(null),
    onkeydown,
    ...restProps
  }: DropdownMenuSubContentProps = $props()

  const sub = getSubContext()
  const subOpen = $derived(sub.isSubOpen())

  let style = $state('position: fixed; top: 0; left: 0; visibility: hidden;')

  function position() {
    const trigger = document.getElementById(sub.ids.trigger)
    const content = document.getElementById(sub.ids.content)
    if (!trigger || !content) return
    const t = trigger.getBoundingClientRect()
    const w = content.offsetWidth
    // Cascade to the right; flip left when there is no room.
    let left = t.right + sideOffset
    if (left + w > window.innerWidth - 8) left = t.left - w - sideOffset
    left = Math.max(8, left)
    const top = Math.max(8, Math.min(t.top + alignOffset, window.innerHeight - 16))
    style =
      `position: fixed; top: ${top}px; left: ${left}px; ` +
      `--reka-dropdown-menu-content-available-height: ${Math.max(80, window.innerHeight - top - 8)}px; ` +
      `--reka-dropdown-menu-content-transform-origin: center left;`
  }

  $effect(() => {
    if (!subOpen) return
    position()
    window.addEventListener('resize', position)
    window.addEventListener('scroll', position, true)
    return () => {
      window.removeEventListener('resize', position)
      window.removeEventListener('scroll', position, true)
    }
  })

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      focusMenuItem(sub.ids.content, 'next')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      focusMenuItem(sub.ids.content, 'prev')
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      sub.setSubOpen(false)
      document.getElementById(sub.ids.trigger)?.focus()
    } else if (e.key === 'Home') {
      e.preventDefault()
      focusMenuItem(sub.ids.content, 'first')
    } else if (e.key === 'End') {
      e.preventDefault()
      focusMenuItem(sub.ids.content, 'last')
    }
  }
</script>

{#if subOpen}
  <div
    bind:this={ref}
    id={sub.ids.content}
    role="menu"
    aria-orientation="vertical"
    tabindex="-1"
    data-uipkge
    data-slot="dropdown-menu-sub-content"
    data-state="open"
    data-side="right"
    class={cn(
      'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--reka-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg outline-none',
      className,
    )}
    {style}
    onkeydown={(e) => {
      handleKeyDown(e)
      onkeydown?.(e)
    }}
    onmouseenter={() => sub.setSubOpen(true)}
    onmouseleave={() => sub.scheduleClose()}
    {...restProps}
  >
    {@render children?.()}
  </div>
{/if}

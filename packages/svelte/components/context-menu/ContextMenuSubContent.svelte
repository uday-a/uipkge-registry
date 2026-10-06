<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface ContextMenuSubContentProps extends HTMLAttributes<HTMLDivElement> {
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { tick } from 'svelte'
  import { cn } from '$lib/utils'
  import { getContextMenuContext, getContextMenuSubContext, menuItemsOf } from './context'
  import { portal } from './portal'

  type OnKeyDown = NonNullable<HTMLAttributes<HTMLDivElement>['onkeydown']>

  let {
    class: className,
    children,
    ref = $bindable(null),
    onkeydown,
    ...restProps
  }: ContextMenuSubContentProps = $props()

  const ctx = getContextMenuContext()
  const sub = getContextMenuSubContext()

  let pos = $state({ x: 0, y: 0 })

  $effect(() => {
    if (!ctx.open || !sub.open || !ref) return
    const el = ref
    ctx.registerMenuElement(el)
    sub.registerContentElement(el)
    // Anchor to the trigger's right edge, then flip/clamp into the viewport.
    tick().then(() => {
      const trigger = sub.getTriggerElement()
      const rect = el.getBoundingClientRect()
      let x = pos.x || window.innerWidth / 2
      let y = pos.y || window.innerHeight / 2
      if (trigger) {
        const t = trigger.getBoundingClientRect()
        x = t.right - 4
        y = t.top - 4
        if (x + rect.width > window.innerWidth - 8) x = t.left - rect.width + 4
      }
      pos = {
        x: Math.max(8, Math.min(x, window.innerWidth - rect.width - 8)),
        y: Math.max(8, Math.min(y, window.innerHeight - rect.height - 8)),
      }
    })
    return () => {
      ctx.unregisterMenuElement(el)
      sub.registerContentElement(null)
    }
  })

  const handleKeyDown: OnKeyDown = (e) => {
    onkeydown?.(e)
    if (e.defaultPrevented || !ref) return
    if (e.key === 'Escape' || e.key === 'ArrowLeft') {
      // Close only the submenu — stop the root Escape handler from closing all.
      e.preventDefault()
      e.stopPropagation()
      sub.setOpen(false)
      sub.focusTrigger()
      return
    }
    const items = menuItemsOf(ref)
    if (!items.length) return
    const current = items.indexOf(document.activeElement as HTMLElement)
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      ;(items[current === -1 ? 0 : (current + 1) % items.length]!).focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      ;(items[current === -1 ? items.length - 1 : (current - 1 + items.length) % items.length]!).focus()
    } else if (e.key === 'Tab') {
      ctx.close()
    }
  }
</script>

{#if ctx.open && sub.open}
  <div
    bind:this={ref}
    use:portal
    data-uipkge
    data-slot="context-menu-sub-content"
    role="menu"
    tabindex="-1"
    data-state="open"
    data-side="right"
    style:position="fixed"
    style:left="{pos.x}px"
    style:top="{pos.y}px"
    class={cn(
      'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-lg',
      className,
    )}
    {...restProps}
    onkeydown={handleKeyDown}
  >
    {@render children?.()}
  </div>
{/if}

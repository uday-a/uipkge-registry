<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface ContextMenuContentProps extends HTMLAttributes<HTMLDivElement> {
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { tick } from 'svelte'
  import { cn } from '$lib/utils'
  import { getContextMenuContext, menuItemsOf } from './context'
  import { portal } from './portal'

  type OnKeyDown = NonNullable<HTMLAttributes<HTMLDivElement>['onkeydown']>

  let { class: className, children, ref = $bindable(null), onkeydown, ...restProps }: ContextMenuContentProps = $props()

  const ctx = getContextMenuContext()

  let adjusted = $state<{ x: number; y: number } | null>(null)

  $effect(() => {
    if (!ctx.open || !ref) return
    ctx.registerMenuElement(ref)
    const el = ref
    // Clamp into the viewport once measured.
    tick().then(() => {
      const rect = el.getBoundingClientRect()
      adjusted = {
        x: Math.max(8, Math.min(ctx.position.x, window.innerWidth - rect.width - 8)),
        y: Math.max(8, Math.min(ctx.position.y, window.innerHeight - rect.height - 8)),
      }
    })
    tick().then(() => el.focus({ preventScroll: true }))
    return () => {
      ctx.unregisterMenuElement(el)
      adjusted = null
    }
  })

  const x = $derived(adjusted?.x ?? ctx.position.x)
  const y = $derived(adjusted?.y ?? ctx.position.y)

  const handleKeyDown: OnKeyDown = (e) => {
    onkeydown?.(e)
    if (e.defaultPrevented || !ref) return
    const items = menuItemsOf(ref)
    if (!items.length) return
    const current = items.indexOf(document.activeElement as HTMLElement)
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      ;(items[current === -1 ? 0 : (current + 1) % items.length]!).focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      ;(items[current === -1 ? items.length - 1 : (current - 1 + items.length) % items.length]!).focus()
    } else if (e.key === 'Home') {
      e.preventDefault()
      items[0]!.focus()
    } else if (e.key === 'End') {
      e.preventDefault()
      items[items.length - 1]!.focus()
    } else if (e.key === 'Tab') {
      ctx.close()
    }
  }
</script>

{#if ctx.open}
  <div
    bind:this={ref}
    use:portal
    data-uipkge
    data-slot="context-menu-content"
    role="menu"
    tabindex="-1"
    data-state="open"
    data-side="bottom"
    style:position="fixed"
    style:left="{x}px"
    style:top="{y}px"
    class={cn(
      'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-[min(24rem,calc(100vh-1rem))] min-w-32 overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md',
      className,
    )}
    {...restProps}
    onkeydown={handleKeyDown}
  >
    {@render children?.()}
  </div>
{/if}

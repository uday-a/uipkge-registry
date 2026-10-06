<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface MenubarSubContentProps extends HTMLAttributes<HTMLDivElement> {
    alignOffset?: number
    sideOffset?: number
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { getMenubarSubContext } from './MenubarContext'

  let {
    class: className,
    alignOffset = 0,
    sideOffset = 8,
    children,
    ref = $bindable(null),
    onkeydown,
    ...restProps
  }: MenubarSubContentProps = $props()

  const sub = getMenubarSubContext()
  const isOpen = $derived(sub?.isOpen() ?? false)
</script>

{#if isOpen}
  <!-- No portal: the flyout renders inline, absolutely positioned to the
       right of its trigger (the sub wrapper is relative). -->
  <div
    bind:this={ref}
    role="menu"
    aria-orientation="vertical"
    data-uipkge=""
    data-slot="menubar-sub-content"
    data-state="open"
    class={cn(
      'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 absolute top-0 left-full z-50 min-w-[8rem] origin-top-left overflow-hidden rounded-md border p-1 shadow-lg',
      className,
    )}
    style:margin-left="{sideOffset}px"
    style:margin-top="{alignOffset}px"
    onkeydown={(e) => {
      if (e.key === 'Escape' || e.key === 'ArrowLeft') {
        e.preventDefault()
        e.stopPropagation()
        sub?.setOpen(false)
        sub?.getTriggerEl()?.focus({ preventScroll: true })
      } else if (e.key === 'Tab') {
        sub?.setOpen(false)
      }
      onkeydown?.(e)
    }}
    {...restProps}
  >
    {@render children?.()}
  </div>
{/if}

<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface MenubarContentProps extends HTMLAttributes<HTMLDivElement> {
    align?: 'start' | 'center' | 'end'
    alignOffset?: number
    sideOffset?: number
    /** When false, arrow keys stop at the first/last item instead of wrapping. */
    loop?: boolean
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { getMenubarMenuContext, getMenubarRootContext } from './MenubarContext'

  let {
    class: className,
    align = 'start',
    alignOffset = -4,
    sideOffset = 8,
    loop: _loop = true,
    children,
    ref = $bindable(null),
    onkeydown,
    ...restProps
  }: MenubarContentProps = $props()

  // Roving wrap is handled by the shared scope (always loops, like reka's
  // default); the prop is destructured for API parity and otherwise unused.

  const root = getMenubarRootContext()
  const menu = getMenubarMenuContext()

  let el: HTMLDivElement | null = $state(null)
  $effect(() => {
    ref = el
    menu?.setContentEl(el)
  })

  const isOpen = $derived(menu?.isOpen() ?? false)
</script>

{#if isOpen && menu}
  <!-- No portal: the content renders inline, absolutely positioned under its
       trigger (the menu wrapper is relative). Exit animations don't run on
       unmount — enter animations still play via data-[state=open]. -->
  <div
    bind:this={el}
    role="menu"
    id={menu.contentId}
    aria-labelledby={menu.triggerId}
    aria-orientation="vertical"
    data-uipkge=""
    data-slot="menubar-content"
    data-state="open"
    data-align={align}
    class={cn(
      'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 absolute top-full z-50 min-w-48 origin-top overflow-hidden rounded-md border p-1 shadow-md',
      align === 'start' && 'left-0',
      align === 'center' && 'left-1/2 -translate-x-1/2',
      align === 'end' && 'right-0',
      className,
    )}
    style:margin-top="{sideOffset}px"
    style:margin-left={align === 'start' || align === 'center' ? `${alignOffset}px` : undefined}
    style:margin-right={align === 'end' ? `${-alignOffset}px` : undefined}
    onkeydown={(e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        root?.setOpenMenu(null, true)
      } else if (e.key === 'Tab') {
        root?.setOpenMenu(null)
      }
      onkeydown?.(e)
    }}
    {...restProps}
  >
    {@render children?.()}
  </div>
{/if}

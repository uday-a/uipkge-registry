<script lang="ts" module>
  import type { Component } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface DockItem {
    /** Unique id for the item. */
    id: string
    /** Lucide icon component to render. */
    icon: Component
    /** Label shown in the tooltip on hover. */
    label: string
    /** Click handler. */
    handler?: () => void
    /** Whether this item is the active one. */
    active?: boolean
  }

  export interface DockProps extends HTMLAttributes<HTMLDivElement> {
    /** Dock items. */
    items: DockItem[]
    /** Base icon size in pixels. Default 48. */
    baseSize?: number
    /** Peak magnification scale as the cursor hovers directly over an item. Default 1.6. */
    magnification?: number
    /** Pixel radius within which items magnify. Default 120. */
    distance?: number
    /** Orientation. Only 'horizontal' (bottom dock) is supported. */
    orientation?: 'horizontal'
    /** Show the tooltip label on hover. Default true. */
    showTooltips?: boolean
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let {
    class: className,
    items,
    baseSize = 48,
    magnification = 1.6,
    distance = 120,
    orientation = 'horizontal',
    showTooltips = true,
    ref = $bindable(null),
    ...restProps
  }: DockProps = $props()

  let mouseX = $state<number | null>(null)
  let hoveredId = $state<string | null>(null)
  let itemEls: (HTMLElement | undefined)[] = $state([])

  function registerItem(el: HTMLElement, index: number) {
    itemEls[index] = el
    return {
      destroy() {
        itemEls[index] = undefined
      },
    }
  }

  function sizeFor(index: number): number {
    if (mouseX === null) return baseSize
    const el = itemEls[index]
    if (!el) return baseSize
    const rect = el.getBoundingClientRect()
    const center = rect.left + rect.width / 2
    const dist = Math.abs(mouseX - center)
    if (dist > distance) return baseSize
    // Cosine bell curve so magnification falls off smoothly.
    const t = 1 - dist / distance
    const scale = 1 + (magnification - 1) * t
    return baseSize * scale
  }

  const sizes = $derived(items.map((_, i) => sizeFor(i)))
</script>

<div
  bind:this={ref}
  data-uipkge
  data-slot="dock"
  data-orientation={orientation}
  class={cn(
    'border-border/60 bg-background/60 flex items-end justify-center gap-3 rounded-2xl border px-3 py-2 backdrop-blur-md',
    className,
  )}
  onmousemove={(e) => (mouseX = e.clientX)}
  onmouseleave={() => {
    mouseX = null
    hoveredId = null
  }}
  {...restProps}
>
  {#each items as item, index (item.id)}
    {@const Icon = item.icon}
    {@const size = sizes[index] ?? baseSize}
    <div
      use:registerItem={index}
      data-slot="dock-item"
      data-active={item.active ? '' : undefined}
      role="button"
      tabindex="0"
      aria-label={item.label}
      aria-current={item.active ? 'true' : undefined}
      class="group focus-visible:ring-ring/50 relative flex shrink-0 cursor-pointer items-end justify-center rounded-xl outline-none focus-visible:ring-[3px]"
      onmouseenter={() => (hoveredId = item.id)}
      onmouseleave={() => (hoveredId = null)}
      onclick={() => item.handler?.()}
      onkeydown={(e) => {
        if (e.key === 'Enter') item.handler?.()
        if (e.key === ' ') {
          e.preventDefault()
          item.handler?.()
        }
      }}
    >
      <!-- Tooltip -->
      {#if showTooltips && hoveredId === item.id}
        <span
          class="border-border bg-popover text-popover-foreground pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 rounded-md border px-2 py-1 text-xs whitespace-nowrap shadow-md"
        >
          {item.label}
        </span>
      {/if}

      <!-- Icon tile -->
      <span
        class={cn(
          'flex items-center justify-center rounded-xl border transition-[width,height] duration-100 ease-out will-change-[width,height]',
          item.active
            ? 'border-primary/40 bg-primary/10 text-primary'
            : 'border-border/50 bg-muted/40 text-foreground hover:bg-muted',
        )}
        style="width: {size}px; height: {size}px"
      >
        <Icon style="width: {size * 0.5}px; height: {size * 0.5}px" />
      </span>

      <!-- Active indicator dot -->
      {#if item.active}
        <span class="bg-primary absolute -bottom-2 size-1 rounded-full" aria-hidden="true"></span>
      {/if}
    </div>
  {/each}
</div>

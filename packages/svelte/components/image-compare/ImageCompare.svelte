<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import type { ImageCompareVariants } from './image-compare.variants'

  export interface ImageCompareProps extends HTMLAttributes<HTMLDivElement> {
    beforeSrc: string
    afterSrc: string
    beforeAlt?: string
    afterAlt?: string
    beforeLabel?: string
    afterLabel?: string
    /** Two-way bound divider position in percent (`bind:value`). */
    value?: number
    orientation?: ImageCompareVariants['orientation']
    disabled?: boolean
    showLabels?: boolean
    showHandle?: boolean
    /** Custom handle content (replaces the move icon). */
    handle?: Snippet
    /** Fires with the new position whenever the user drags or arrows the divider. */
    onValueChange?: (value: number) => void
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { MoveHorizontal, MoveVertical } from '@lucide/svelte'
  import { imageCompareVariants } from './image-compare.variants'

  let {
    class: className,
    beforeSrc,
    afterSrc,
    beforeAlt = 'Before',
    afterAlt = 'After',
    beforeLabel = 'Before',
    afterLabel = 'After',
    value = $bindable(50),
    orientation = 'horizontal',
    disabled = false,
    showLabels = true,
    showHandle = true,
    handle,
    onValueChange,
    ref = $bindable(null),
    ...restProps
  }: ImageCompareProps = $props()

  let dragging = $state(false)

  function clamp(v: number): number {
    return Math.min(100, Math.max(0, v))
  }

  function updateFromPointer(clientX: number, clientY: number) {
    const el = ref
    if (!el) return
    const rect = el.getBoundingClientRect()
    const next =
      orientation === 'horizontal'
        ? clamp(((clientX - rect.left) / rect.width) * 100)
        : clamp(((clientY - rect.top) / rect.height) * 100)
    value = next
    onValueChange?.(next)
  }

  function onPointerDown(e: PointerEvent & { currentTarget: HTMLElement }) {
    if (disabled) return
    dragging = true
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      // pointer capture can fail on synthetic / non-active pointers
    }
    updateFromPointer(e.clientX, e.clientY)
  }

  function onPointerMove(e: PointerEvent) {
    if (!dragging || disabled) return
    updateFromPointer(e.clientX, e.clientY)
  }

  function onPointerUp(e: PointerEvent & { currentTarget: HTMLElement }) {
    if (!dragging) return
    dragging = false
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      // pointer already released
    }
  }

  // Keyboard support: arrow keys move the slider by 1% (Shift = 10%)
  function onKeyDown(e: KeyboardEvent) {
    if (disabled) return
    const isH = orientation === 'horizontal'
    const step = e.shiftKey ? 10 : 1
    let next = value
    if (isH) {
      if (e.key === 'ArrowLeft') next -= step
      else if (e.key === 'ArrowRight') next += step
      else return
    } else {
      if (e.key === 'ArrowUp') next -= step
      else if (e.key === 'ArrowDown') next += step
      else return
    }
    e.preventDefault()
    value = clamp(next)
    onValueChange?.(value)
  }

  // "After" image is clipped to show only the right portion.
  // Dragging right (higher %) reveals more of "before" on the left.
  const clipStyle = $derived(
    orientation === 'horizontal' ? `clip-path: inset(0 0 0 ${value}%)` : `clip-path: inset(${value}% 0 0 0)`,
  )
  const dividerStyle = $derived(orientation === 'horizontal' ? `left: ${value}%` : `top: ${value}%`)
</script>

<div
  bind:this={ref}
  data-uipkge=""
  data-slot="image-compare"
  data-orientation={orientation}
  data-disabled={disabled ? '' : undefined}
  class={cn(imageCompareVariants({ orientation }), className)}
  style="touch-action: none"
  onpointerdown={onPointerDown}
  onpointermove={onPointerMove}
  onpointerup={onPointerUp}
  onpointercancel={onPointerUp}
  {...restProps}
>
  <!-- Before (base layer, full) -->
  <img
    src={beforeSrc}
    alt={beforeAlt}
    class="pointer-events-none absolute inset-0 size-full object-cover select-none"
    draggable="false"
  />
  {#if showLabels}
    <span
      class="bg-background/80 text-foreground absolute bottom-2 left-2 rounded px-2 py-0.5 text-xs font-medium backdrop-blur-sm"
    >
      {beforeLabel}
    </span>
  {/if}

  <!-- After (clipped overlay — visible on the right side) -->
  <div class="absolute inset-0 size-full" style={clipStyle}>
    <img
      src={afterSrc}
      alt={afterAlt}
      class="pointer-events-none absolute inset-0 size-full object-cover select-none"
      draggable="false"
    />
    {#if showLabels}
      <span
        class="bg-background/80 text-foreground absolute right-2 bottom-2 rounded px-2 py-0.5 text-xs font-medium backdrop-blur-sm"
      >
        {afterLabel}
      </span>
    {/if}
  </div>

  <!-- Divider + handle -->
  {#if !disabled}
    <div
      class="bg-border absolute z-10 {orientation === 'horizontal' ? 'top-0 h-full w-0.5' : 'left-0 h-0.5 w-full'}"
      style={dividerStyle}
    >
      {#if showHandle}
        <button
          type="button"
          role="slider"
          aria-valuenow={Math.round(value)}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label={`Image comparison slider, ${Math.round(value)} percent`}
          aria-orientation={orientation}
          tabindex="0"
          class="bg-background border-border focus-visible:ring-ring absolute top-1/2 left-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border shadow-md transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:outline-none {orientation ===
          'vertical'
            ? 'cursor-ns-resize'
            : 'cursor-ew-resize'}"
          onkeydown={onKeyDown}
          onpointerdown={(e) => {
            e.stopPropagation()
            onPointerDown(e)
          }}
          onpointermove={onPointerMove}
          onpointerup={onPointerUp}
          onpointercancel={onPointerUp}
        >
          {#if handle}
            {@render handle()}
          {:else if orientation === 'horizontal'}
            <MoveHorizontal class="text-foreground size-4" />
          {:else}
            <MoveVertical class="text-foreground size-4" />
          {/if}
        </button>
      {/if}
    </div>
  {/if}

  {#if disabled}
    <div class="bg-background/40 absolute inset-0"></div>
  {/if}
</div>

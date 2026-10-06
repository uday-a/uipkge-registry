<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface SelectContentProps extends HTMLAttributes<HTMLDivElement> {
    /** Preferred side. Flips automatically when space runs out. */
    side?: 'top' | 'bottom'
    align?: 'start' | 'center' | 'end'
    sideOffset?: number
    children?: Snippet
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { untrack } from 'svelte'
  import { cn } from '$lib/utils'
  import { getSelectContext } from './select-context'
  import SelectScrollDownButton from './SelectScrollDownButton.svelte'
  import SelectScrollUpButton from './SelectScrollUpButton.svelte'

  let {
    class: className,
    side = 'bottom',
    align = 'start',
    sideOffset = 4,
    children,
    ref = $bindable(null),
    ...restProps
  }: SelectContentProps = $props()

  const ctx = getSelectContext('SelectContent')

  let contentEl: HTMLDivElement | null = $state(null)
  let viewportEl: HTMLDivElement | null = $state(null)
  let pos = $state({ top: 0, left: 0, minWidth: 0, maxHeight: 320, placed: false })
  let resolvedSide = $state<'top' | 'bottom'>(side)

  $effect(() => {
    ref = contentEl
  })

  let mounted = $state(false)
  $effect(() => {
    mounted = true
  })

  function place() {
    const trigger = ctx.triggerEl
    if (!trigger) return
    const rect = trigger.getBoundingClientRect()
    const viewportH = window.innerHeight
    const viewportW = window.innerWidth
    const maxHeight = Math.min(320, Math.max(160, viewportH - 32))
    const below = viewportH - rect.bottom - sideOffset
    const above = rect.top - sideOffset
    // Honor `side` unless it has < 160px while the other side has more room.
    let s = side
    if (s === 'bottom' && below < 160 && above > below) s = 'top'
    if (s === 'top' && above < 160 && below > above) s = 'bottom'
    resolvedSide = s
    const height = Math.min(maxHeight, contentEl?.offsetHeight || maxHeight)
    const top = s === 'bottom' ? rect.bottom + sideOffset : Math.max(8, rect.top - sideOffset - height)
    const width = Math.max(rect.width, 128)
    let left = align === 'start' ? rect.left : align === 'end' ? rect.right - width : rect.left + (rect.width - width) / 2
    left = Math.min(Math.max(8, left), Math.max(8, viewportW - width - 8))
    pos = { top, left, minWidth: rect.width, maxHeight, placed: true }
  }

  $effect(() => {
    if (!ctx.open) {
      // Reset without tracking `pos`: reading and writing it here re-ran this
      // effect forever (effect_update_depth_exceeded on every closed Select).
      untrack(() => {
        if (pos.placed) pos = { ...pos, placed: false }
      })
      return
    }
    // Place after mount so contentEl has measurable height.
    const raf = requestAnimationFrame(() => {
      place()
      contentEl?.focus({ preventScroll: true })
    })
    const onDocPointerDown = (e: PointerEvent) => {
      const t = e.target as Node | null
      if (t && contentEl?.contains(t)) return
      if (t && ctx.triggerEl?.contains(t)) return
      ctx.setOpen(false)
    }
    const onScroll = () => place()
    const onResize = () => place()
    document.addEventListener('pointerdown', onDocPointerDown, { capture: true })
    window.addEventListener('scroll', onScroll, { capture: true, passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('pointerdown', onDocPointerDown, { capture: true })
      window.removeEventListener('scroll', onScroll, { capture: true })
      window.removeEventListener('resize', onResize)
    }
  })

  // Keep the highlighted option visible while arrowing through the list.
  $effect(() => {
    if (!ctx.open || !viewportEl) return
    const id = ctx.highlighted
    if (!id) return
    const el = viewportEl.querySelector(`[data-value="${CSS.escape(id)}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  })

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      ctx.moveHighlight(1)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      ctx.moveHighlight(-1)
    } else if (e.key === 'Home') {
      e.preventDefault()
      ctx.highlightFirst()
    } else if (e.key === 'End') {
      e.preventDefault()
      ctx.highlightLast()
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (ctx.highlighted !== undefined) ctx.selectValue(ctx.highlighted)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      ctx.setOpen(false)
      ctx.focusTrigger()
    } else if (e.key === 'Tab') {
      ctx.setOpen(false)
    }
  }

  const activeDescendant = $derived(
    ctx.highlighted ? `${ctx.contentId}-item-${CSS.escape(ctx.highlighted)}` : undefined,
  )

  // Teleport the listbox to <body> so it escapes overflow clipping and stacks
  // above page content. (Svelte 5's <svelte:body> takes no children, so the
  // portal is a plain action — Svelte keeps updating moved nodes.)
  function portal(node: HTMLElement) {
    document.body.appendChild(node)
    return {
      destroy() {
        node.remove()
      },
    }
  }

  function offDocument(node: HTMLElement) {
    document.createDocumentFragment().appendChild(node)
    return {
      destroy() {
        node.remove()
      },
    }
  }
</script>

{#if ctx.open}
  <div use:portal
      bind:this={contentEl}
      data-uipkge
      data-slot="select-content"
      data-state="open"
      data-side={resolvedSide}
      role="listbox"
      tabindex="-1"
      id={ctx.contentId}
      aria-labelledby={ctx.triggerId}
      aria-activedescendant={activeDescendant}
      aria-orientation="vertical"
      style="position: fixed; top: {pos.top}px; left: {pos.left}px; min-width: {pos.minWidth}px; max-height: {pos.maxHeight}px; {pos.placed
        ? ''
        : 'visibility: hidden;'}"
      class={cn(
        'bg-popover text-popover-foreground motion-safe:data-[state=open]:animate-in motion-safe:data-[state=closed]:animate-out motion-safe:data-[state=open]:ease-emphasized motion-safe:data-[state=open]:blur-in-2 motion-safe:data-[state=closed]:blur-out-2 motion-safe:data-[state=closed]:fade-out-0 motion-safe:data-[state=open]:fade-in-0 motion-safe:data-[state=closed]:zoom-out-95 motion-safe:data-[state=open]:zoom-in-95 motion-safe:data-[side=bottom]:slide-in-from-top-2 motion-safe:data-[side=left]:slide-in-from-right-2 motion-safe:data-[side=right]:slide-in-from-left-2 motion-safe:data-[side=top]:slide-in-from-bottom-2 z-50 min-w-32 overflow-hidden rounded-md border shadow-md motion-safe:data-[state=closed]:duration-[var(--dur-exit)] motion-safe:data-[state=open]:duration-200',
        'data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1',
        className,
      )}
      onkeydown={onKeyDown}
      {...restProps}
    >
      <SelectScrollUpButton />
      <div bind:this={viewportEl} data-slot="select-viewport" class="max-h-[inherit] overflow-x-hidden overflow-y-auto scroll-my-1 p-1">
        {@render children?.()}
      </div>
      <SelectScrollDownButton />
    </div>
{:else if mounted}
  <!-- Closed: still mount the items, off-document, so they register their
    labels and SelectValue can show the selected one (reka-ui does the same).
    Client-only, like reka-ui: SelectItem uses CSS.escape, absent in SSR. -->
  <div hidden use:offDocument>
    {@render children?.()}
  </div>
{/if}

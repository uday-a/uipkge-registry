<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'
  import type { PopoverAlign, PopoverSide } from './context'

  export interface PopoverContentProps extends HTMLAttributes<HTMLDivElement> {
    side?: PopoverSide
    align?: PopoverAlign
    sideOffset?: number
    alignOffset?: number
    onPointerDownOutside?: (e: PointerEvent) => void
    onEscapeKeyDown?: (e: KeyboardEvent) => void
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { getContext } from 'svelte'
  import { cn } from '$lib/utils'
  import { POPOVER_CONTEXT_KEY, type PopoverContextValue } from './context'

  const ctx = getContext<PopoverContextValue>(POPOVER_CONTEXT_KEY)

  let {
    class: className,
    side = 'bottom',
    align = 'center',
    sideOffset = 4,
    alignOffset = 0,
    onPointerDownOutside,
    onEscapeKeyDown,
    ref = $bindable(null),
    children,
    ...restProps
  }: PopoverContentProps = $props()

  const isOpen = $derived(ctx.isOpen())

  let contentEl = $state<HTMLDivElement | null>(null)
  // Hidden until first measured so the panel never flashes at 0,0.
  let positioned = $state(false)

  function portal(node: HTMLElement) {
    document.body.appendChild(node)
    return {
      // Svelte also detaches the node on {#if} teardown; remove() on a
      // detached node is a no-op, so double-removal is safe.
      destroy: () => node.remove(),
    }
  }

  function capture(node: HTMLDivElement) {
    contentEl = node
    return {
      destroy: () => {
        contentEl = null
      },
    }
  }

  // Origin sits on the edge facing the trigger so zoom/fade animations grow
  // out of the anchor (parity with reka's transform-origin behavior).
  const transformOrigin = $derived.by(() => {
    const along = align === 'start' ? '0%' : align === 'end' ? '100%' : '50%'
    if (side === 'bottom') return `${along} 0%`
    if (side === 'top') return `${along} 100%`
    if (side === 'right') return `0% ${along}`
    return `100% ${along}`
  })

  const VIEWPORT_MARGIN = 8

  function updatePosition() {
    const el = contentEl
    const anchor = ctx.getAnchorEl() ?? ctx.getTriggerEl()
    if (!el || !anchor) return
    const r = anchor.getBoundingClientRect()
    const w = el.offsetWidth
    const h = el.offsetHeight

    let top: number
    let left: number
    if (side === 'top') {
      top = r.top - h - sideOffset
      left = align === 'start' ? r.left + alignOffset : align === 'end' ? r.right - w - alignOffset : r.left + r.width / 2 - w / 2 + alignOffset
    } else if (side === 'bottom') {
      top = r.bottom + sideOffset
      left = align === 'start' ? r.left + alignOffset : align === 'end' ? r.right - w - alignOffset : r.left + r.width / 2 - w / 2 + alignOffset
    } else if (side === 'left') {
      left = r.left - w - sideOffset
      top = align === 'start' ? r.top + alignOffset : align === 'end' ? r.bottom - h - alignOffset : r.top + r.height / 2 - h / 2 + alignOffset
    } else {
      left = r.right + sideOffset
      top = align === 'start' ? r.top + alignOffset : align === 'end' ? r.bottom - h - alignOffset : r.top + r.height / 2 - h / 2 + alignOffset
    }

    // Clamp into the viewport (hand-rolled substitute for collision flipping).
    left = Math.min(Math.max(VIEWPORT_MARGIN, left), Math.max(VIEWPORT_MARGIN, window.innerWidth - w - VIEWPORT_MARGIN))
    top = Math.min(Math.max(VIEWPORT_MARGIN, top), Math.max(VIEWPORT_MARGIN, window.innerHeight - h - VIEWPORT_MARGIN))

    el.style.top = `${top}px`
    el.style.left = `${left}px`
    positioned = true
  }

  function onDocumentPointerDown(e: PointerEvent) {
    const el = contentEl
    const target = e.target as Node | null
    if (!el || !target) return
    if (el.contains(target)) return
    if (ctx.getTriggerEl()?.contains(target)) return
    onPointerDownOutside?.(e)
    if (e.defaultPrevented) return
    // Parity with the Vue twin: esc/manual/none ignore outside pointer.
    const mode = ctx.getCloseBehavior()
    if (mode === 'esc' || mode === 'manual' || mode === 'none') return
    ctx.setOpen(false)
  }

  function trapTab(e: KeyboardEvent) {
    const el = contentEl
    if (!el) return
    const focusables = el.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )
    if (focusables.length === 0) {
      e.preventDefault()
      return
    }
    const first = focusables[0]!
    const last = focusables[focusables.length - 1]!
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  function onDocumentKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      onEscapeKeyDown?.(e)
      if (e.defaultPrevented) return
      // Parity with the Vue twin: click-outside/manual/none suppress Escape.
      const mode = ctx.getCloseBehavior()
      if (mode === 'click-outside' || mode === 'manual' || mode === 'none') return
      ctx.setOpen(false)
      return
    }
    if (e.key === 'Tab' && ctx.isModal()) trapTab(e)
  }

  $effect(() => {
    if (!isOpen) return
    // Reads side/align/offsets (tracked) so repositioning follows prop changes.
    updatePosition()
    const raf = requestAnimationFrame(() => updatePosition())
    const onScroll = () => updatePosition()
    window.addEventListener('scroll', onScroll, { capture: true, passive: true })
    window.addEventListener('resize', onScroll)
    document.addEventListener('pointerdown', onDocumentPointerDown, true)
    document.addEventListener('keydown', onDocumentKeyDown, true)
    // Move focus into the panel on open (reka autofocus parity).
    contentEl?.focus({ preventScroll: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll, { capture: true })
      window.removeEventListener('resize', onScroll)
      document.removeEventListener('pointerdown', onDocumentPointerDown, true)
      document.removeEventListener('keydown', onDocumentKeyDown, true)
    }
  })

  // Return focus to the trigger on close (reka parity).
  let wasOpen = false
  $effect(() => {
    if (wasOpen && !isOpen) ctx.getTriggerEl()?.focus({ preventScroll: true })
    wasOpen = isOpen
  })
</script>

{#if isOpen}
  <div
    use:portal
    use:capture
    {...restProps}
    bind:this={ref}
    data-uipkge=""
    data-slot="popover-content"
    data-state="open"
    data-side={side}
    data-align={align}
    id={ctx.contentId}
    role="dialog"
    tabindex={-1}
    class={cn(
      'bg-popover text-popover-foreground motion-safe:data-[state=open]:animate-in motion-safe:data-[state=closed]:animate-out motion-safe:data-[state=open]:ease-emphasized motion-safe:data-[state=open]:blur-in-2 motion-safe:data-[state=closed]:blur-out-2 motion-safe:data-[state=closed]:fade-out-0 motion-safe:data-[state=open]:fade-in-0 motion-safe:data-[state=closed]:zoom-out-95 motion-safe:data-[state=open]:zoom-in-95 motion-safe:data-[side=bottom]:slide-in-from-top-2 motion-safe:data-[side=left]:slide-in-from-right-2 motion-safe:data-[side=right]:slide-in-from-left-2 motion-safe:data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--uipkge-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden motion-safe:data-[state=closed]:duration-[var(--dur-exit)] motion-safe:data-[state=open]:duration-200',
      className,
    )}
    style:position="fixed"
    style:top="0"
    style:left="0"
    style:visibility={positioned ? 'visible' : 'hidden'}
    style:--uipkge-popover-content-transform-origin={transformOrigin}
  >
    {@render children?.()}
  </div>
{/if}

/**
 * Anchor positioning for floating content (tooltip, popover, dropdown-menu,
 * context-menu, …) — the Lit stand-in for Radix's `popper`.
 *
 * Floating content should be a native popover (`popover="auto"|"manual"`) so
 * it renders in the top layer (no portal, no z-index fights). Its UA styles
 * centre it (`inset: 0; margin: auto`), so give it the classes
 * `fixed inset-auto m-0` and apply the returned `style` with `styleMap`.
 *
 * Returns fixed-position coordinates relative to the viewport, flipped to the
 * opposite side when there isn't room, plus the resolved side/align so the
 * element can set `data-side` / `data-align` like Radix does.
 */
export type Side = 'top' | 'right' | 'bottom' | 'left'
export type Align = 'start' | 'center' | 'end'

export interface PositionOptions {
  side?: Side
  align?: Align
  sideOffset?: number
  alignOffset?: number
  /** Keep this far from the viewport edge. */
  collisionPadding?: number
  /** Match the anchor's width (select/combobox lists). */
  matchWidth?: boolean
}

export interface PositionResult {
  style: Record<string, string>
  side: Side
  align: Align
}

const opposite: Record<Side, Side> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' }

export function computePosition(
  anchor: Element | DOMRect,
  floating: HTMLElement,
  {
    side = 'bottom',
    align = 'center',
    sideOffset = 4,
    alignOffset = 0,
    collisionPadding = 8,
    matchWidth = false,
  }: PositionOptions = {},
): PositionResult {
  const a = anchor instanceof Element ? anchor.getBoundingClientRect() : anchor
  const vw = innerWidth
  const vh = innerHeight
  // Measure at the width it will have once placed.
  if (matchWidth) floating.style.minWidth = `${a.width}px`
  // Layout size, not getBoundingClientRect(): the latter includes the entry
  // animation's transform (zoom-in-95), which skews the first placement.
  const f = { width: floating.offsetWidth, height: floating.offsetHeight }

  const room: Record<Side, number> = {
    top: a.top - sideOffset - collisionPadding,
    bottom: vh - a.bottom - sideOffset - collisionPadding,
    left: a.left - sideOffset - collisionPadding,
    right: vw - a.right - sideOffset - collisionPadding,
  }
  const need = side === 'top' || side === 'bottom' ? f.height : f.width
  let resolved = side
  if (room[side] < need && room[opposite[side]] > room[side]) resolved = opposite[side]

  let top: number
  let left: number
  if (resolved === 'top' || resolved === 'bottom') {
    top = resolved === 'bottom' ? a.bottom + sideOffset : a.top - sideOffset - f.height
    left =
      align === 'start' ? a.left + alignOffset : align === 'end' ? a.right - f.width - alignOffset : a.left + a.width / 2 - f.width / 2
    left = Math.min(Math.max(collisionPadding, left), Math.max(collisionPadding, vw - f.width - collisionPadding))
  } else {
    left = resolved === 'right' ? a.right + sideOffset : a.left - sideOffset - f.width
    top =
      align === 'start' ? a.top + alignOffset : align === 'end' ? a.bottom - f.height - alignOffset : a.top + a.height / 2 - f.height / 2
    top = Math.min(Math.max(collisionPadding, top), Math.max(collisionPadding, vh - f.height - collisionPadding))
  }

  const style: Record<string, string> = { top: `${Math.round(top)}px`, left: `${Math.round(left)}px` }
  if (matchWidth) style.minWidth = `${a.width}px`
  return { style, side: resolved, align }
}

/**
 * Re-run `update` while `floating` is open: on scroll (any ancestor), resize
 * and anchor/floating size changes. Returns a cleanup function.
 */
export function autoUpdate(anchor: Element, floating: HTMLElement, update: () => void): () => void {
  let frame = 0
  const schedule = () => {
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(update)
  }
  addEventListener('scroll', schedule, true)
  addEventListener('resize', schedule)
  const ro = new ResizeObserver(schedule)
  ro.observe(anchor)
  ro.observe(floating)
  update()
  return () => {
    cancelAnimationFrame(frame)
    removeEventListener('scroll', schedule, true)
    removeEventListener('resize', schedule)
    ro.disconnect()
  }
}

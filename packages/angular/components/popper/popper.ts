import { Directive, Input, OnChanges, OnDestroy, TemplateRef, ViewContainerRef, inject } from '@angular/core'
import type { EmbeddedViewRef } from '@angular/core'

/**
 * Floating-layer toolkit shared by the Angular overlay primitives (dropdown-menu,
 * tooltip, sheet, sidebar). The Angular counterpart of what Radix / reka-ui do
 * internally with floating-ui: placement with flip + shift, a body portal, a
 * dismissable-layer stack (Escape / outside pointer), a focus trap and a scroll
 * lock. Dependency-free on purpose so it runs on any Angular version the
 * consumer has (no @angular/cdk peer coupling).
 */

export type PopperSide = 'top' | 'right' | 'bottom' | 'left'
export type PopperAlign = 'start' | 'center' | 'end'

export interface PlaceOptions {
  side: PopperSide
  align: PopperAlign
  sideOffset: number
  alignOffset: number
  /** Minimum gap kept between the floating element and the viewport edge. */
  collisionPadding: number
  /** Flip to the opposite side / shift along the edge when it would overflow. */
  avoidCollisions: boolean
}

export interface Placement {
  x: number
  y: number
  side: PopperSide
  align: PopperAlign
  availableWidth: number
  availableHeight: number
  /** CSS transform-origin pointing back at the anchor (for zoom-in/out animations). */
  transformOrigin: string
}

interface Size {
  width: number
  height: number
}
interface Rect extends Size {
  top: number
  left: number
  right: number
  bottom: number
}

const OPPOSITE: Record<PopperSide, PopperSide> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' }

function mainAxisPosition(anchor: Rect, floating: Size, side: PopperSide, offset: number): number {
  if (side === 'top') return anchor.top - floating.height - offset
  if (side === 'bottom') return anchor.bottom + offset
  if (side === 'left') return anchor.left - floating.width - offset
  return anchor.right + offset
}

function crossAxisPosition(anchor: Rect, floating: Size, side: PopperSide, align: PopperAlign, offset: number): number {
  const vertical = side === 'top' || side === 'bottom'
  const start = vertical ? anchor.left : anchor.top
  const anchorSize = vertical ? anchor.width : anchor.height
  const size = vertical ? floating.width : floating.height
  if (align === 'start') return start + offset
  if (align === 'end') return start + anchorSize - size - offset
  return start + (anchorSize - size) / 2 + offset
}

function fitsOnSide(anchor: Rect, floating: Size, side: PopperSide, o: PlaceOptions, vw: number, vh: number): boolean {
  const pos = mainAxisPosition(anchor, floating, side, o.sideOffset)
  const pad = o.collisionPadding
  if (side === 'top') return pos >= pad
  if (side === 'bottom') return pos + floating.height <= vh - pad
  if (side === 'left') return pos >= pad
  return pos + floating.width <= vw - pad
}

/** Pure placement math (unit-testable): where the floating box goes for this anchor + viewport. */
export function computePlacement(
  anchor: Rect,
  floating: Size,
  options: PlaceOptions,
  viewport: Size = { width: window.innerWidth, height: window.innerHeight },
): Placement {
  const { width: vw, height: vh } = viewport
  let side = options.side
  if (
    options.avoidCollisions &&
    !fitsOnSide(anchor, floating, side, options, vw, vh) &&
    fitsOnSide(anchor, floating, OPPOSITE[side], options, vw, vh)
  ) {
    side = OPPOSITE[side]
  }
  const vertical = side === 'top' || side === 'bottom'
  const main = mainAxisPosition(anchor, floating, side, options.sideOffset)
  let cross = crossAxisPosition(anchor, floating, side, options.align, options.alignOffset)
  const pad = options.collisionPadding
  if (options.avoidCollisions) {
    const max = (vertical ? vw - floating.width : vh - floating.height) - pad
    cross = Math.min(Math.max(cross, pad), Math.max(pad, max))
  }
  const x = vertical ? cross : main
  const y = vertical ? main : cross
  const availableHeight =
    side === 'top'
      ? anchor.top - options.sideOffset - pad
      : side === 'bottom'
        ? vh - anchor.bottom - options.sideOffset - pad
        : vh - pad * 2
  const availableWidth =
    side === 'left'
      ? anchor.left - options.sideOffset - pad
      : side === 'right'
        ? vw - anchor.right - options.sideOffset - pad
        : vw - pad * 2
  const originX = vertical
    ? `${anchor.left + anchor.width / 2 - x}px`
    : side === 'right'
      ? '0px'
      : `${floating.width}px`
  const originY = vertical
    ? side === 'bottom'
      ? '0px'
      : `${floating.height}px`
    : `${anchor.top + anchor.height / 2 - y}px`
  return {
    x,
    y,
    side,
    align: options.align,
    availableWidth: Math.max(0, availableWidth),
    availableHeight: Math.max(0, availableHeight),
    transformOrigin: `${originX} ${originY}`,
  }
}

/**
 * Keeps `floating` (position: fixed) placed against `anchor`, re-placing on scroll,
 * resize and size changes. Writes data-side / data-align and the Radix + reka CSS
 * variables so class strings copied from either registry work unchanged.
 * Returns a stop() cleanup.
 */
export function autoPlace(
  anchor: Element,
  floating: HTMLElement,
  options: () => PlaceOptions,
  varPrefix: string,
  onPlaced?: (placement: Placement) => void,
): () => void {
  let frame = 0
  const place = () => {
    if (!floating.isConnected) return
    const a = anchor.getBoundingClientRect()
    const f = { width: floating.offsetWidth, height: floating.offsetHeight }
    const p = computePlacement(a, f, options())
    floating.style.left = `${Math.round(p.x)}px`
    floating.style.top = `${Math.round(p.y)}px`
    floating.setAttribute('data-side', p.side)
    floating.setAttribute('data-align', p.align)
    for (const lib of ['radix', 'reka']) {
      floating.style.setProperty(`--${lib}-${varPrefix}-trigger-width`, `${a.width}px`)
      floating.style.setProperty(`--${lib}-${varPrefix}-trigger-height`, `${a.height}px`)
      floating.style.setProperty(`--${lib}-${varPrefix}-content-available-height`, `${p.availableHeight}px`)
      floating.style.setProperty(`--${lib}-${varPrefix}-content-available-width`, `${p.availableWidth}px`)
      floating.style.setProperty(`--${lib}-${varPrefix}-content-transform-origin`, p.transformOrigin)
    }
    onPlaced?.(p)
  }
  // Later moves (scroll, resize, size changes) are batched to one frame.
  const update = () => {
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(place)
  }
  Object.assign(floating.style, { position: 'fixed', left: '0px', top: '0px' })
  // First placement is synchronous: a panel that waited a frame sat at (0,0), flashed there,
  // and could even catch a fast click-release (and it never moved in background tabs).
  place()
  const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null
  ro?.observe(floating)
  ro?.observe(anchor)
  window.addEventListener('scroll', update, true)
  window.addEventListener('resize', update)
  return () => {
    cancelAnimationFrame(frame)
    ro?.disconnect()
    window.removeEventListener('scroll', update, true)
    window.removeEventListener('resize', update)
  }
}

/**
 * Renders a template into a container appended to <body>. The embedded view stays in
 * the component's ViewContainerRef, so bindings, DI and change detection behave as if
 * it were rendered in place -- only the DOM lives at the end of the document.
 */
export class BodyPortal {
  private view: EmbeddedViewRef<unknown> | null = null
  private host: HTMLElement | null = null

  constructor(private readonly vcr: ViewContainerRef) {}

  get attached(): boolean {
    return this.view !== null
  }

  attach(template: TemplateRef<unknown>): HTMLElement {
    this.detach()
    this.view = this.vcr.createEmbeddedView(template)
    this.view.detectChanges()
    this.host = document.createElement('div')
    this.host.setAttribute('data-uipkge-portal', '')
    document.body.appendChild(this.host)
    for (const node of this.view.rootNodes) this.host.appendChild(node)
    return this.host
  }

  detach(): void {
    this.view?.destroy()
    this.view = null
    this.host?.remove()
    this.host = null
  }
}

export interface DismissableLayer {
  /** Elements that count as "inside" (the layer itself, its trigger, child layers). */
  contains: (target: Node) => boolean
  onEscape: (event: KeyboardEvent) => void
  onPointerDownOutside: (event: PointerEvent) => void
}

const layers: DismissableLayer[] = []
let listening = false

function onKeydown(event: KeyboardEvent): void {
  const top = layers[layers.length - 1]
  if (event.key === 'Escape' && top) {
    event.preventDefault()
    event.stopPropagation()
    top.onEscape(event)
  }
}

function onPointerDown(event: PointerEvent): void {
  const top = layers[layers.length - 1]
  if (top && event.target instanceof Node && !top.contains(event.target)) top.onPointerDownOutside(event)
}

/**
 * Registers a layer on the global stack; only the top-most layer reacts to Escape and
 * outside pointer-downs (nested submenu closes before its parent). Returns a remover.
 */
export function pushDismissableLayer(layer: DismissableLayer): () => void {
  layers.push(layer)
  if (!listening) {
    document.addEventListener('keydown', onKeydown, true)
    document.addEventListener('pointerdown', onPointerDown, true)
    listening = true
  }
  return () => {
    const i = layers.indexOf(layer)
    if (i >= 0) layers.splice(i, 1)
    if (!layers.length && listening) {
      document.removeEventListener('keydown', onKeydown, true)
      document.removeEventListener('pointerdown', onPointerDown, true)
      listening = false
    }
  }
}

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

/** Keeps Tab / Shift+Tab cycling inside `container` (modal dialogs, sheets) and pulls focus back when it escapes. Returns a remover. */
export function trapFocus(container: HTMLElement): () => void {
  const onKey = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') return
    const items = [...container.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null)
    if (!items.length) {
      event.preventDefault()
      container.focus()
      return
    }
    const first = items[0]!
    const last = items[items.length - 1]!
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }
  const trap: FocusTrap = { container, lastFocused: null }
  traps.push(trap)
  if (traps.length === 1) document.addEventListener('focusin', onTrapFocusIn, true)
  container.addEventListener('keydown', onKey)
  return () => {
    container.removeEventListener('keydown', onKey)
    const i = traps.indexOf(trap)
    if (i >= 0) traps.splice(i, 1)
    if (!traps.length) document.removeEventListener('focusin', onTrapFocusIn, true)
  }
}

interface FocusTrap {
  container: HTMLElement
  lastFocused: HTMLElement | null
}

const traps: FocusTrap[] = []

/**
 * Radix FocusScope `trapped`: focus that lands outside the top-most trap is pulled back to
 * the element last focused inside it (e.g. a dropdown that opened the dialog returning focus
 * to its trigger behind the modal). Layers portalled after the trap opened - a Select or menu
 * opened from inside the dialog - are allowed, as Radix pauses the outer scope for them.
 */
function onTrapFocusIn(event: FocusEvent): void {
  const trap = traps[traps.length - 1]
  const target = event.target
  if (!trap || !(target instanceof HTMLElement)) return
  if (trap.container.contains(target)) {
    trap.lastFocused = target
    return
  }
  const portal = target.closest('[data-uipkge-portal]')
  if (
    portal &&
    !portal.contains(trap.container) &&
    trap.container.compareDocumentPosition(portal) & Node.DOCUMENT_POSITION_FOLLOWING
  ) {
    return
  }
  const back =
    trap.lastFocused?.isConnected && trap.container.contains(trap.lastFocused)
      ? trap.lastFocused
      : (trap.container.querySelector<HTMLElement>(FOCUSABLE) ?? trap.container)
  back.focus({ preventScroll: true })
}

let scrollLocks = 0
let previousOverflow = ''

/** Locks page scroll while a modal layer is open (ref-counted). Returns an unlock. */
export function lockScroll(): () => void {
  if (scrollLocks++ === 0) {
    previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }
  let released = false
  return () => {
    if (released) return
    released = true
    if (--scrollLocks === 0) document.body.style.overflow = previousOverflow
  }
}

let pointerLocks = 0
let previousPointerEvents = ''

/**
 * Radix `disableOutsidePointerEvents`: while a modal layer is open, nothing outside it reacts
 * to the pointer (no hover, no clicks reach the page). Sets `pointer-events: none` on <body>
 * (ref-counted) and `auto` on the layer, which is portalled under <body>. Returns a restore.
 */
export function disableOutsidePointerEvents(layer: HTMLElement): () => void {
  if (pointerLocks++ === 0) {
    previousPointerEvents = document.body.style.pointerEvents
    document.body.style.pointerEvents = 'none'
  }
  layer.style.pointerEvents = 'auto'
  let released = false
  return () => {
    if (released) return
    released = true
    if (--pointerLocks === 0) document.body.style.pointerEvents = previousPointerEvents
  }
}

/**
 * Waits for the exit animation (tw-animate `data-[state=closed]:animate-out`) before
 * resolving, so closing layers fade/zoom out like Radix Presence. Falls back to a timer
 * when no animation runs (reduced motion, no animation classes).
 */
export function afterExitAnimation(el: Element | null | undefined, fallbackMs = 200): Promise<void> {
  return new Promise((resolve) => {
    if (!el || typeof getComputedStyle === 'undefined') return resolve()
    const name = getComputedStyle(el).animationName
    if (!name || name === 'none') return resolve()
    const done = () => {
      clearTimeout(timer)
      el.removeEventListener('animationend', done)
      resolve()
    }
    const timer = setTimeout(done, fallbackMs)
    el.addEventListener('animationend', done)
  })
}

let idCounter = 0
/** Stable-per-instance ids for aria-controls / aria-labelledby wiring. */
export function uniqueId(prefix: string): string {
  return `${prefix}-${++idCounter}`
}

/**
 * Core-only template outlet (`<ng-container [uiRenderTemplate]="tpl" />`): renders one
 * <ng-template> -- used to move projected content between layout branches (the sidebar's
 * desktop / mobile-sheet / static modes) with Angular core only.
 */
@Directive({ selector: '[uiRenderTemplate]', standalone: true })
export class UiRenderTemplateDirective implements OnChanges, OnDestroy {
  @Input('uiRenderTemplate') template: TemplateRef<unknown> | null = null
  private readonly vcr = inject(ViewContainerRef)

  ngOnChanges(): void {
    this.vcr.clear()
    if (this.template) this.vcr.createEmbeddedView(this.template)
  }

  ngOnDestroy(): void {
    this.vcr.clear()
  }
}

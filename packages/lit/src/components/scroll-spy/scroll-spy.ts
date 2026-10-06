import { LitElement, css, html, isServer, nothing, type TemplateResult } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'

export type ScrollSpyTurn = 'straight' | 'sharp' | 'rounded'
export type ScrollSpyVariant =
  | 'default'
  | 'line'
  | 'angle'
  | 'sharp'
  | 'rounded'
  | 'stepper'
  | 'scrollspy'
  | 'tabs'
  | 'pills'
export type ScrollSpyIndicatorMode = 'segment' | 'fill' | 'progress' | 'pill' | 'dot' | 'line'
export type ScrollSpyPosition = 'right' | 'left' | 'top' | 'bottom'
export type ScrollSpyRailPosition = 'left' | 'right'

export interface ScrollSpyItem {
  href: string
  title: string
  depth?: number
  children?: ScrollSpyItem[]
}

interface Marker {
  value: string
  depth: number
  x: number
  y: number
  top: number
  bottom: number
}

function flattenItems(rawItems: ScrollSpyItem[]): { value: string; title: string; depth: number; parentValue?: string | null }[] {
  const result: { value: string; title: string; depth: number; parentValue?: string | null }[] = []
  function walk(list: ScrollSpyItem[], depth = 1, parentVal: string | null = null) {
    for (const it of list) {
      result.push({
        value: it.href,
        depth: it.depth ?? depth,
        title: it.title,
        parentValue: parentVal,
      })
      if (it.children && it.children.length > 0) {
        walk(it.children, depth + 1, it.href)
      }
    }
  }
  walk(rawItems)
  return result
}

function resolveColor(color = 'primary') {
  if (color === 'primary') return { bg: 'bg-primary', stroke: 'stroke-primary', border: 'border-primary' }
  if (color === 'foreground') return { bg: 'bg-foreground', stroke: 'stroke-foreground', border: 'border-foreground' }
  if (color === 'destructive') return { bg: 'bg-destructive', stroke: 'stroke-destructive', border: 'border-destructive' }
  if (color === 'secondary') return { bg: 'bg-secondary', stroke: 'stroke-secondary', border: 'border-secondary' }
  return { bg: `bg-${color}`, stroke: `stroke-${color}`, border: `border-${color}` }
}

function depthX(relDepth: number, isRightRail: boolean, listWidth: number): number {
  if (!isRightRail) {
    if (relDepth <= 1) return 1
    if (relDepth === 2) return 13
    if (relDepth === 3) return 21
    return 21 + (relDepth - 3) * 8
  }
  const base = listWidth - 1
  if (relDepth <= 1) return base
  if (relDepth === 2) return base - 12
  if (relDepth === 3) return base - 20
  return base - 20 - (relDepth - 3) * 8
}

function buildCircuitPath(markers: Marker[], endIndex: number, rounded: boolean, edge: 'top' | 'bottom'): string {
  if (markers.length === 0 || endIndex < 0) return ''
  const end = Math.min(endIndex, markers.length - 1)
  const first = markers[0]!
  const parts: string[] = [`M ${first.x} ${first.top}`]

  for (let i = 0; i <= end; i++) {
    const curr = markers[i]!
    if (i === end) {
      const targetY = edge === 'top' ? curr.top : curr.bottom
      parts.push(`L ${curr.x} ${targetY}`)
      break
    }
    const next = markers[i + 1]
    if (!next) {
      parts.push(`L ${curr.x} ${curr.bottom}`)
      break
    }
    parts.push(`L ${curr.x} ${curr.bottom}`)
    if (curr.x === next.x) {
      parts.push(`L ${curr.x} ${next.top}`)
      continue
    }
    const gap = Math.max(0, next.top - curr.bottom)
    const absDx = Math.abs(next.x - curr.x)
    const transitionH = Math.min(gap, absDx)
    if (transitionH <= 1) {
      parts.push(`L ${next.x} ${next.top}`)
      continue
    }
    const y1 = curr.bottom + (gap - transitionH) / 2
    let y2 = y1 + transitionH
    if (next.top - y2 <= 0.5) y2 = next.top
    if (y1 - curr.bottom > 0.5) parts.push(`L ${curr.x} ${y1}`)
    if (rounded) {
      const midY = (y1 + y2) / 2
      parts.push(`C ${curr.x} ${midY}, ${next.x} ${midY}, ${next.x} ${y2}`)
    } else {
      parts.push(`L ${next.x} ${y2}`)
    }
    if (next.top - y2 > 0.5) parts.push(`L ${next.x} ${next.top}`)
  }
  return parts.join(' ')
}

const trueByDefault = { fromAttribute: (v: string | null) => v !== 'false', toAttribute: () => null }

/**
 * <uip-scroll-spy> — Scroll-spy component for docs rails, steppers, and TOC.
 */
export class UipScrollSpy extends LitElement {
  static styles = [tailwind, css`:host { display: block; position: relative; }`]

  static properties = {
    title: { type: String },
    items: { type: Array },
    value: { reflect: true },
    defaultValue: { attribute: 'default-value' },
    offsetTop: { type: Number, attribute: 'offset-top' },
    bounds: { type: Number },
    scrollContainer: { attribute: 'scroll-container' },
    affix: { type: Boolean },
    variant: { type: String },
    turn: { type: String },
    indicator: { type: String },
    keepScrolled: { type: Boolean, attribute: 'keep-scrolled' },
    highlightParent: { attribute: 'highlight-parent', converter: trueByDefault },
    lineWidth: { attribute: 'line-width' },
    color: { type: String },
    position: { type: String },
    railPosition: { attribute: 'rail-position' },
    activeValue: { state: true },
    scrollProgress: { state: true },
    trackPath: { state: true },
    pathLength: { state: true },
    activeStart: { state: true },
    activeEnd: { state: true },
    straightHighlight: { state: true },
  }

  title = ''
  items: ScrollSpyItem[] = []
  value = ''
  defaultValue = ''
  offsetTop = 0
  bounds = 5
  scrollContainer?: string | HTMLElement | null = null
  affix = false
  variant: ScrollSpyVariant = 'line'
  turn?: ScrollSpyTurn
  indicator: ScrollSpyIndicatorMode = 'line'
  keepScrolled = false
  highlightParent = true
  lineWidth = 'default'
  color = 'primary'
  position: ScrollSpyPosition = 'right'
  railPosition?: ScrollSpyRailPosition

  private activeValue = ''
  private scrollProgress = 0
  private trackPath = ''
  private pathLength = 0
  private activeStart = 0
  private activeEnd = 0
  private straightHighlight = { top: 0, height: 0, visible: false }

  private containerEl: HTMLElement | Window | null = null
  private scrollCleanup?: () => void

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'scroll-spy')
    this.setAttribute('role', 'navigation')
    this.setAttribute('aria-label', 'Scroll spy navigation')

    if (!this.value && this.defaultValue) {
      this.value = this.defaultValue
    } else if (!this.value && this.items.length > 0) {
      this.value = this.items[0]?.href ?? ''
    }
    this.activeValue = this.value
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.scrollCleanup?.()
  }

  protected updated(changed: Map<string, unknown>) {
    if (isServer) return

    if (changed.has('scrollContainer') || !this.containerEl) {
      this.setupContainer()
    }

    if (changed.has('items') || changed.has('value') || changed.has('turn') || changed.has('indicator')) {
      this.recompute()
    }
  }

  private setupContainer() {
    this.scrollCleanup?.()
    let c: HTMLElement | Window | null = window
    if (typeof this.scrollContainer === 'string') {
      c = document.querySelector(this.scrollContainer) as HTMLElement | null
    } else if (this.scrollContainer instanceof HTMLElement) {
      c = this.scrollContainer
    }
    this.containerEl = c ?? window

    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => this.recomputeActive())
    }

    this.containerEl.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    this.recomputeActive()

    this.scrollCleanup = () => {
      cancelAnimationFrame(raf)
      this.containerEl?.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }

  private recomputeActive() {
    const c = this.containerEl
    const flat = flattenItems(this.items)
    if (!c || flat.length === 0) return

    const isWin = c === window
    let currentScroll = 0
    let maxScroll = 1

    if (isWin) {
      currentScroll = window.scrollY
      maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
    } else {
      const el = c as HTMLElement
      currentScroll = el.scrollTop
      maxScroll = Math.max(1, el.scrollHeight - el.clientHeight)
    }

    this.scrollProgress = Math.min(1, Math.max(0, currentScroll / maxScroll))
    this.dispatchEvent(new CustomEvent('progress', { detail: { progress: this.scrollProgress } }))

    const containerTop = isWin ? 0 : (c as HTMLElement).getBoundingClientRect().top
    const threshold = containerTop + this.offsetTop + this.bounds + 40

    let candidate = ''
    for (const item of flat) {
      const sel = item.value.startsWith('#') ? item.value : `#${item.value}`
      const target = isWin ? document.querySelector(sel) : (c as HTMLElement).querySelector(sel)
      if (!target) continue
      const r = target.getBoundingClientRect()
      if (r.top <= threshold) {
        candidate = item.value
      } else if (candidate) {
        break
      }
    }

    if (!candidate && flat.length > 0) {
      candidate = flat[0]!.value
    }

    if (candidate && candidate !== this.activeValue) {
      this.activeValue = candidate
      this.value = candidate
      this.dispatchEvent(new CustomEvent('value-change', { detail: { value: candidate }, bubbles: true, composed: true }))
      this.recompute()
    }
  }

  scrollToHref(href: string) {
    this.activeValue = href
    this.value = href
    this.dispatchEvent(new CustomEvent('value-change', { detail: { value: href }, bubbles: true, composed: true }))

    const c = this.containerEl
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const behavior: ScrollBehavior = smooth ? 'smooth' : 'auto'

    if (c && c !== window) {
      const cEl = c as HTMLElement
      const target = cEl.querySelector(href) as HTMLElement | null
      if (target) {
        const cRect = cEl.getBoundingClientRect()
        const tRect = target.getBoundingClientRect()
        const top = cEl.scrollTop + (tRect.top - cRect.top) - this.offsetTop
        cEl.scrollTo({ top, behavior })
      }
    } else {
      const target = document.querySelector(href) as HTMLElement | null
      if (target) {
        const top = window.scrollY + target.getBoundingClientRect().top - this.offsetTop
        window.scrollTo({ top, behavior })
      }
    }

    this.recompute()
  }

  goToPrev() {
    const flat = flattenItems(this.items)
    const idx = flat.findIndex((i) => i.value === this.activeValue)
    if (idx > 0 && flat[idx - 1]) this.scrollToHref(flat[idx - 1]!.value)
  }

  goToNext() {
    const flat = flattenItems(this.items)
    const idx = flat.findIndex((i) => i.value === this.activeValue)
    if (idx >= 0 && idx < flat.length - 1 && flat[idx + 1]) this.scrollToHref(flat[idx + 1]!.value)
  }

  private recompute() {
    const list = this.renderRoot?.querySelector('[data-slot="scroll-spy-list"]') as HTMLElement | null
    if (!list) return
    const listRect = list.getBoundingClientRect()
    const flat = flattenItems(this.items)
    const linkEls = Array.from(this.renderRoot?.querySelectorAll('[data-slot="scroll-spy-link"]') ?? []) as HTMLElement[]

    if (linkEls.length === 0) return
    const isRightRail = this.position === 'left' && this.railPosition === 'right'
    const listWidth = listRect.width || 180

    const markers: Marker[] = []
    linkEls.forEach((el) => {
      const val = el.getAttribute('href') ?? ''
      const item = flat.find((f) => f.value === val)
      if (!item) return
      const rect = el.getBoundingClientRect()
      const top = rect.top - listRect.top
      const bottom = rect.bottom - listRect.top
      const relDepth = item.depth
      markers.push({
        value: val,
        depth: relDepth,
        x: depthX(relDepth, isRightRail, listWidth),
        y: top + rect.height / 2,
        top,
        bottom,
      })
    })

    markers.sort((a, b) => a.y - b.y)
    if (markers.length === 0) return

    const resolvedTurn = this.turn ?? (this.variant === 'angle' || this.variant === 'rounded' ? 'rounded' : 'straight')
    const activeIdx = markers.findIndex((m) => m.value === this.activeValue)

    if (resolvedTurn === 'straight') {
      if (activeIdx >= 0) {
        const active = markers[activeIdx]!
        const isFill = this.indicator === 'fill' || this.keepScrolled
        this.straightHighlight = {
          top: isFill ? markers[0]!.top : active.top,
          height: Math.max(isFill ? active.bottom - markers[0]!.top : active.bottom - active.top, 14),
          visible: true,
        }
      } else {
        this.straightHighlight = { top: 0, height: 0, visible: false }
      }
      return
    }

    // Circuit mode
    const rounded = resolvedTurn === 'rounded'
    const fullPath = buildCircuitPath(markers, markers.length - 1, rounded, 'bottom')
    this.trackPath = fullPath
    this.straightHighlight = { top: 0, height: 0, visible: false }

    const svgPath = this.renderRoot?.querySelector('path[data-measure]') as SVGPathElement | null
    let total = 100
    if (svgPath) {
      svgPath.setAttribute('d', fullPath)
      try {
        total = svgPath.getTotalLength() || 100
      } catch {
        total = 100
      }
    }
    this.pathLength = total

    if (activeIdx >= 0) {
      const isFill = this.indicator === 'fill' || this.keepScrolled
      let startLen = 0
      if (!isFill && svgPath) {
        svgPath.setAttribute('d', buildCircuitPath(markers, activeIdx, rounded, 'top'))
        try {
          startLen = svgPath.getTotalLength() || 0
        } catch {}
      }
      let endLen = total
      if (svgPath) {
        svgPath.setAttribute('d', buildCircuitPath(markers, activeIdx, rounded, 'bottom'))
        try {
          endLen = svgPath.getTotalLength() || total
        } catch {}
      }
      this.activeStart = startLen
      this.activeEnd = endLen
    }
  }

  private isItemActive(val: string) {
    return this.activeValue === val
  }

  private isItemScrolled(val: string) {
    if (!this.keepScrolled) return false
    const flat = flattenItems(this.items)
    const activeIdx = flat.findIndex((i) => i.value === this.activeValue)
    const idx = flat.findIndex((i) => i.value === val)
    return idx >= 0 && idx <= activeIdx
  }

  render() {
    const isTopOrBottom = this.position === 'top' || this.position === 'bottom'
    const colorStyles = resolveColor(this.color)

    if (this.position === 'top') {
      const isScrollSpyTabs = this.variant === 'scrollspy' || this.variant === 'tabs' || this.variant === 'pills'
      const flat = flattenItems(this.items)
      const activeIdx = Math.max(0, flat.findIndex((i) => i.value === this.activeValue))

      if (isScrollSpyTabs) {
        return html`
          <div
            data-slot="scroll-spy-top"
            class="border-border/70 bg-card/85 scrollbar-none relative sticky top-0 z-20 flex w-full items-center gap-1 overflow-x-auto rounded-xl border p-1.5 shadow-xs backdrop-blur-md"
          >
            ${flat.map((item, idx) => {
              const isCurrent = idx === activeIdx
              return html`
                <button
                  type="button"
                  data-active=${isCurrent ? 'true' : 'false'}
                  class=${cn(
                    'group relative flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150 outline-none select-none',
                    'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-1 active:scale-[0.98]',
                    isCurrent
                      ? 'bg-primary/10 text-primary font-semibold shadow-2xs'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                  )}
                  @click=${() => this.scrollToHref(item.value)}
                >
                  ${isCurrent
                    ? html`<span
                        class="bg-primary animate-in fade-in zoom-in-75 size-1.5 shrink-0 rounded-full duration-150"
                      ></span>`
                    : nothing}
                  <span class="truncate">${item.title}</span>
                </button>
              `
            })}
            <div class="bg-border/20 absolute inset-x-0 bottom-0 h-0.5 overflow-hidden rounded-b-xl">
              <div
                class="bg-primary h-full transition-[width] duration-150 ease-out"
                style=${styleMap({ width: `${Math.round(this.scrollProgress * 100)}%` })}
              ></div>
            </div>
          </div>
        `
      }

      return html`
        <div
          data-slot="scroll-spy-stepper-top"
          class="border-border/70 bg-card/85 scrollbar-none sticky top-0 z-20 flex w-full items-center gap-1.5 overflow-x-auto rounded-xl border p-2 shadow-xs backdrop-blur-md"
        >
          ${flat.map((item, idx) => {
            const isCurrent = idx === activeIdx
            const isCompleted = idx < activeIdx
            return html`
              <button
                type="button"
                data-active=${isCurrent ? 'true' : 'false'}
                class=${cn(
                  'group flex shrink-0 items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium transition-[color,background-color,transform] duration-150 outline-none select-none',
                  'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-1 active:scale-[0.98]',
                  isCurrent
                    ? 'bg-primary/10 text-foreground font-medium shadow-2xs'
                    : isCompleted
                      ? 'text-foreground/80 hover:bg-muted/50'
                      : 'text-muted-foreground hover:bg-muted/30 hover:text-foreground',
                )}
                @click=${() => this.scrollToHref(item.value)}
              >
                <span
                  class=${cn(
                    'flex size-5 shrink-0 items-center justify-center rounded-full font-mono text-[10px] transition-all duration-200',
                    isCurrent
                      ? 'bg-primary text-primary-foreground scale-105 font-semibold shadow-2xs'
                      : isCompleted
                        ? 'bg-primary/15 text-primary font-medium'
                        : 'bg-muted text-muted-foreground/70',
                  )}
                >
                  ${isCompleted
                    ? html`<svg class="size-3 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>`
                    : idx + 1}
                </span>
                <span class="max-w-[120px] truncate">${item.title}</span>
              </button>
              ${idx < flat.length - 1
                ? html`<div
                    class=${cn(
                      'bg-border/70 h-0.5 max-w-10 min-w-4 flex-1 rounded-full transition-colors duration-200',
                      isCompleted && 'bg-primary',
                    )}
                  ></div>`
                : nothing}
            `
          })}
        </div>
      `
    }

    if (this.position === 'bottom') {
      const flat = flattenItems(this.items)
      const activeIdx = Math.max(0, flat.findIndex((i) => i.value === this.activeValue))
      const activeItem = flat[activeIdx]

      return html`
        <div
          data-slot="scroll-spy-stepper-bottom"
          class="border-border/80 bg-background/95 sticky bottom-3 z-30 mx-auto flex items-center gap-2 rounded-full border px-3 py-1.5 shadow-md backdrop-blur-md select-none"
        >
          <button
            type="button"
            aria-label="Previous section"
            ?disabled=${activeIdx <= 0}
            class="text-muted-foreground hover:bg-muted/80 hover:text-foreground flex size-7 items-center justify-center rounded-full transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-25"
            @click=${() => this.goToPrev()}
          >
            <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <div class="flex items-center gap-1.5 px-1">
            ${flat.map(
              (item, idx) => html`
                <button
                  type="button"
                  aria-label=${`Jump to section ${idx + 1}`}
                  class=${cn(
                    'h-1.5 cursor-pointer rounded-full transition-all duration-200',
                    idx === activeIdx
                      ? 'bg-primary w-5'
                      : idx < activeIdx
                        ? 'bg-primary/40 hover:bg-primary/60 w-2'
                        : 'bg-muted-foreground/30 hover:bg-muted-foreground/50 w-2',
                  )}
                  @click=${() => this.scrollToHref(item.value)}
                ></button>
              `,
            )}
          </div>

          <div class="border-border/60 flex items-center gap-2 border-l pl-2">
            <span class="text-foreground max-w-[130px] truncate text-xs font-medium tracking-tight">
              ${activeItem?.title || ''}
            </span>
            <span class="bg-muted text-muted-foreground rounded-md px-1.5 py-0.5 font-mono text-[10px] tabular-nums">
              ${Math.round(this.scrollProgress * 100)}%
            </span>
          </div>

          <button
            type="button"
            aria-label="Next section"
            ?disabled=${activeIdx >= flat.length - 1}
            class="text-muted-foreground hover:bg-muted/80 hover:text-foreground flex size-7 items-center justify-center rounded-full transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-25"
            @click=${() => this.goToNext()}
          >
            <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      `
    }

    // Side position (left or right)
    const isRightRail = this.position === 'left' && this.railPosition === 'right'
    const resolvedTurn = this.turn ?? (this.variant === 'angle' || this.variant === 'rounded' ? 'rounded' : 'straight')
    const isCircuit = resolvedTurn !== 'straight'

    return html`
      <nav
        part="base"
        data-uipkge=""
        data-slot="scroll-spy"
        data-position=${this.position}
        data-variant=${this.variant}
        class="relative flex flex-col text-sm w-full"
      >
        ${this.title
          ? html`<p
              part="title"
              data-slot="scroll-spy-title"
              class=${cn(
                'text-foreground mb-3 text-sm font-semibold tracking-tight',
                isRightRail && 'pr-3 text-right',
              )}
            >
              ${this.title}
            </p>`
          : nothing}

        <ul
          part="list"
          data-slot="scroll-spy-list"
          class=${cn(
            'relative flex flex-col space-y-1 text-sm',
            !isCircuit && (isRightRail ? 'border-border border-r' : 'border-border border-l'),
          )}
        >
          <!-- Indicator layer -->
          <div
            data-slot="scroll-spy-indicator"
            aria-hidden="true"
            class="pointer-events-none absolute inset-0 overflow-visible"
          >
            ${isCircuit
              ? html`
                  <svg class="absolute inset-0 size-full overflow-visible" fill="none">
                    <path data-measure class="invisible" fill="none" />
                    <path
                      d=${this.trackPath}
                      class="stroke-border"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    ${this.trackPath && this.activeEnd > 0
                      ? html`
                          <path
                            d=${this.trackPath}
                            class=${colorStyles.stroke}
                            stroke-width="2.5"
                            stroke-linecap="butt"
                            stroke-linejoin="round"
                            style=${styleMap({
                              strokeDasharray: `${Math.max(this.activeEnd - this.activeStart, 0)} ${Math.max(this.pathLength, 1)}`,
                              strokeDashoffset: `${-this.activeStart}`,
                              transition:
                                'stroke-dashoffset 260ms cubic-bezier(0.16, 1, 0.3, 1), stroke-dasharray 260ms cubic-bezier(0.16, 1, 0.3, 1)',
                            })}
                          />
                        `
                      : nothing}
                  </svg>
                `
              : this.straightHighlight.visible
                ? html`
                    <div
                      class=${cn('absolute z-10 rounded-none', colorStyles.bg)}
                      style=${styleMap({
                        top: `${this.straightHighlight.top}px`,
                        height: `${this.straightHighlight.height}px`,
                        width: '2.5px',
                        left: isRightRail ? undefined : '-2.5px',
                        right: isRightRail ? '-2.5px' : undefined,
                        transition:
                          'top 260ms cubic-bezier(0.16, 1, 0.3, 1), height 260ms cubic-bezier(0.16, 1, 0.3, 1), opacity 200ms ease-out',
                      })}
                    ></div>
                  `
                : nothing}
          </div>

          <!-- Items list -->
          ${this.items && this.items.length > 0
            ? this.items.map((item) => this.renderItemNode(item, 1, isCircuit, isRightRail))
            : html`<slot></slot>`}
        </ul>
      </nav>
    `
  }

  private renderItemNode(item: ScrollSpyItem, depth = 1, isCircuit = false, isRightRail = false): TemplateResult {
    const isActive = this.isItemActive(item.href)
    const isScrolled = this.isItemScrolled(item.href)

    return html`
      <li data-slot="scroll-spy-item" class="relative flex flex-col">
        <a
          href=${item.href}
          data-slot="scroll-spy-link"
          aria-current=${isActive ? 'location' : nothing}
          data-active=${isActive ? 'true' : 'false'}
          data-scrolled=${isScrolled ? 'true' : 'false'}
          class=${cn(
            'group block rounded-none leading-snug no-underline transition-[color,border-color,background-color,opacity] duration-200 ease-out outline-none',
            isCircuit
              ? [
                  'py-1',
                  isRightRail
                    ? [
                        'text-right',
                        depth <= 1 && 'pr-4 pl-2 text-sm',
                        depth === 2 && 'pr-7 pl-2 text-xs',
                        depth >= 3 && 'pr-10 pl-2 text-xs',
                      ]
                    : [
                        depth <= 1 && 'pr-2 pl-4 text-sm',
                        depth === 2 && 'pr-2 pl-7 text-xs',
                        depth >= 3 && 'pr-2 pl-10 text-xs',
                      ],
                  isActive ? 'text-foreground font-medium' : isScrolled ? 'text-foreground/85' : 'text-muted-foreground hover:text-foreground',
                ]
              : isRightRail
                ? [
                    '-mr-px border-r border-transparent py-0.5 pr-3 pl-2 text-right',
                    depth <= 1 && 'text-sm',
                    depth >= 2 && 'pr-6 text-xs',
                    isActive ? 'text-foreground font-medium' : isScrolled ? 'text-foreground/85' : 'text-muted-foreground hover:text-foreground',
                  ]
                : [
                    '-ml-px border-l border-transparent py-0.5 pr-2 pl-3',
                    depth <= 1 && 'text-sm',
                    depth >= 2 && 'pl-6 text-xs',
                    isActive ? 'text-foreground font-medium' : isScrolled ? 'text-foreground/85' : 'text-muted-foreground hover:text-foreground',
                  ],
          )}
          @click=${(e: MouseEvent) => {
            e.preventDefault()
            this.scrollToHref(item.href)
          }}
        >
          ${item.title}
        </a>
        ${item.children && item.children.length > 0
          ? item.children.map((c) => this.renderItemNode(c, depth + 1, isCircuit, isRightRail))
          : nothing}
      </li>
    `
  }
}

customElements.get('uip-scroll-spy') || customElements.define('uip-scroll-spy', UipScrollSpy)

declare global {
  interface HTMLElementTagNameMap {
    'uip-scroll-spy': UipScrollSpy
  }
}

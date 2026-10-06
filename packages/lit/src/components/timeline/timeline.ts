import { LitElement, css, html, isServer, nothing } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { html as staticHtml, unsafeStatic } from 'lit/static-html.js'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { timelineMediaVariants, type TimelineMediaVariant } from './timeline.variants'

export type TimelineDirection = 'vertical' | 'horizontal'
export type TimelineAlign = 'start' | 'center'
export type TimelineSide = 'left' | 'right' | 'top' | 'bottom'
export type TimelineStatus = 'default' | 'current' | 'success' | 'warning' | 'error' | 'info' | 'muted'
export type TimelineDensity = 'compact' | 'default' | 'comfortable'

/** What <uip-timeline> pushes down to each slotted <uip-timeline-item> (React's TimelineContext). */
export interface TimelineContextValue {
  direction: TimelineDirection
  align: TimelineAlign
  side: TimelineSide
  density: TimelineDensity
  index: number
  count: number
}

/** What <uip-timeline-item> pushes down to its media / separator (React's TimelineItemContext). */
export interface TimelineItemContextValue {
  index: number
  isFirst: boolean
  isLast: boolean
  side: TimelineSide
  status: TimelineStatus
  direction: TimelineDirection
  density: TimelineDensity
}

// React's injected `timeline-current-pulse` keyframes, replayed with the Web
// Animations API (the shadow sheet takes no custom CSS). Same timing/easing;
// honours prefers-reduced-motion like React's @media rule.
const PULSE_ID = 'timeline-current-pulse'
const PULSE: Keyframe[] = [
  { boxShadow: '0 0 0 0 color-mix(in oklab, var(--primary) 45%, transparent)', easing: 'ease-in-out' },
  { boxShadow: '0 0 0 6px color-mix(in oklab, var(--primary) 0%, transparent)', offset: 0.5, easing: 'ease-in-out' },
  { boxShadow: '0 0 0 0 color-mix(in oklab, var(--primary) 45%, transparent)' },
]

function syncPulse(el: Element | null | undefined, on: boolean) {
  if (isServer || !el) return
  const running = el.getAnimations().find((a) => a.id === PULSE_ID)
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  if (on && !reduce) {
    if (running) return
    const anim = el.animate(PULSE, { duration: 1800, iterations: Infinity })
    anim.id = PULSE_ID
  } else running?.cancel()
}

/* ------------------------------------------------------------------ Timeline */

/**
 * <uip-timeline> — the registry Timeline root, one of nine composable parts:
 * <uip-timeline>, <uip-timeline-item>, <uip-timeline-media>,
 * <uip-timeline-separator>, <uip-timeline-content>, <uip-timeline-header>,
 * <uip-timeline-title>, <uip-timeline-description>, <uip-timeline-date>.
 * The parts reference nothing by id, so they are separate elements (no
 * cross-shadow ARIA).
 *
 * React's context (register/indexOf) becomes a push-down: the root hands
 * each slotted <uip-timeline-item> its index, count, direction, align, side
 * and density; each item hands its media/separator the item state.
 *
 * Properties: `direction` ('vertical' | 'horizontal'), `align`
 * ('start' | 'center'), `side` ('left' | 'right' | 'top' | 'bottom'; default
 * 'left' vertical / 'top' horizontal), `density` ('compact' | 'default' |
 * 'comfortable'). No events (React has no callbacks).
 */
export class UipTimeline extends LitElement {
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    direction: { reflect: true },
    // Not reflected: `align` is a legacy presentational attribute (browsers map
    // align="center" to text-align: center on any element).
    align: {},
    side: { reflect: true },
    density: { reflect: true },
  }

  direction: TimelineDirection = 'vertical'
  align: TimelineAlign = 'start'
  side?: TimelineSide
  density: TimelineDensity = 'default'

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'timeline')
  }

  willUpdate() {
    this.setAttribute('data-direction', this.direction)
    this.setAttribute('data-align', this.align)
  }

  private get items() {
    const slot = this.renderRoot?.querySelector('slot')
    return (slot?.assignedElements() ?? []).filter((el): el is UipTimelineItem => el instanceof UipTimelineItem)
  }

  private pushContext() {
    const items = this.items
    const side: TimelineSide = this.side ?? (this.direction === 'horizontal' ? 'top' : 'left')
    items.forEach((item, index) => {
      item.timelineContext = {
        direction: this.direction,
        align: this.align,
        side,
        density: this.density,
        index,
        count: items.length,
      }
    })
  }

  updated() {
    this.pushContext()
  }

  render() {
    return html`<div
      part="base"
      data-direction=${this.direction}
      data-align=${this.align}
      class=${cn(
        'relative',
        this.direction === 'vertical' ? 'flex flex-col' : 'flex flex-row',
        // An authored align="center" attribute centres the host's text (see
        // above); reset it so items align like React's.
        this.align === 'center' && 'text-start',
      )}
    >
      <slot @slotchange=${() => this.pushContext()}></slot>
    </div>`
  }
}

/* -------------------------------------------------------------- TimelineItem */

// React's `[&>[data-slot=…]]:` child selectors can't reach slotted children
// from the shadow tree; the same rules are written as `::slotted()` on the
// <slot>. The media/separator/content hosts are the flex/grid items here, so
// their flex-item utilities (shrink-0 self-stretch / flex-1) are applied to
// the hosts the same way. Padding/margin rules carry `!`: the host page's
// preflight (`* { padding: 0; margin: 0 }`) is in an outer tree context and
// beats any non-important ::slotted() declaration.
const slottedBase =
  '[&::slotted([data-slot=timeline-media])]:shrink-0 [&::slotted([data-slot=timeline-media])]:self-stretch [&::slotted([data-slot=timeline-separator])]:shrink-0 [&::slotted([data-slot=timeline-separator])]:self-stretch [&::slotted([data-slot=timeline-content])]:flex-1'

const verticalSpacingClasses = {
  compact: '[&::slotted([data-slot=timeline-content])]:pb-2!',
  default: '[&::slotted([data-slot=timeline-content])]:pb-6!',
  comfortable: '[&::slotted([data-slot=timeline-content])]:pb-10!',
}

const horizontalSpacingClasses = {
  compact: '[&::slotted([data-slot=timeline-content])]:pr-3!',
  default: '[&::slotted([data-slot=timeline-content])]:pr-6!',
  comfortable: '[&::slotted([data-slot=timeline-content])]:pr-10!',
}

// React's `timeline-item-enter` keyframes as tw-animate utilities: fade from 0,
// rise 6px, 320ms, cubic-bezier(0.22, 1, 0.36, 1), both, staggered delay
// (via --tw-animation-delay: `delay-[…]` resolves to transition-delay);
// motion-safe matches React's prefers-reduced-motion opt-out.
const enterClasses =
  'motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-[6px] motion-safe:duration-320 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:fill-mode-both motion-safe:[--tw-animation-delay:var(--timeline-stagger)]'

/**
 * <uip-timeline-item> — one entry. Children: <uip-timeline-media> or
 * <uip-timeline-separator>, then <uip-timeline-content>.
 *
 * Properties: `side` (overrides the timeline's side / center alternation),
 * `status` ('default' | 'current' | 'success' | 'warning' | 'error' | 'info'
 * | 'muted', inherited by the media marker). Host reflects `data-side`,
 * `data-status`, `data-last` like React. React's render-prop children
 * ({ index, isLast, side, status }) have no web-component equivalent; read
 * the host's data attributes instead.
 */
export class UipTimelineItem extends LitElement {
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    side: { reflect: true },
    status: { reflect: true },
    timelineContext: { attribute: false },
  }

  side?: TimelineSide
  status: TimelineStatus = 'default'
  /** Set by the parent <uip-timeline>; not part of the public API. */
  timelineContext?: TimelineContextValue

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'timeline-item')
  }

  private get state(): TimelineItemContextValue {
    const ctx = this.timelineContext
    const index = ctx ? ctx.index : 0
    const isLast = ctx ? index === ctx.count - 1 : false
    let side: TimelineSide
    if (this.side) side = this.side
    else if (!ctx) side = 'left'
    else if (ctx.align === 'center') {
      if (ctx.direction === 'vertical') side = index % 2 === 0 ? 'left' : 'right'
      else side = index % 2 === 0 ? 'top' : 'bottom'
    } else side = ctx.side
    return {
      index,
      isFirst: index === 0,
      isLast,
      side,
      status: this.status,
      direction: ctx?.direction ?? 'vertical',
      density: ctx?.density ?? 'default',
    }
  }

  willUpdate() {
    const s = this.state
    this.setAttribute('data-side', s.side)
    this.setAttribute('data-status', s.status)
    // React: data-last={isLast || undefined} → "true" or absent.
    if (s.isLast) this.setAttribute('data-last', 'true')
    else this.removeAttribute('data-last')
  }

  private pushContext() {
    const slot = this.renderRoot?.querySelector('slot')
    const itemContext = this.state
    for (const el of slot?.assignedElements() ?? []) {
      if (el instanceof UipTimelineMedia || el instanceof UipTimelineSeparator) el.itemContext = itemContext
    }
  }

  updated() {
    this.pushContext()
  }

  render() {
    const s = this.state
    const isCenter = this.timelineContext?.align === 'center'
    const { direction, side, isLast, density } = s
    const verticalSpacing = isLast ? '' : verticalSpacingClasses[density]
    const horizontalSpacing = isLast ? '' : horizontalSpacingClasses[density]

    const classes = cn(
      'timeline-item-enter relative',
      enterClasses,
      s.status === 'current' && 'timeline-item-current',
      !isCenter && direction === 'vertical' && cn('flex gap-4', side === 'right' && 'flex-row-reverse text-right'),
      !isCenter && direction === 'horizontal' && cn('flex flex-col gap-2', side === 'bottom' && 'flex-col-reverse'),
      isCenter && direction === 'vertical' && 'grid grid-cols-[1fr_auto_1fr] items-start gap-x-4',
      isCenter && direction === 'horizontal' && 'grid grid-rows-[1fr_auto_1fr] items-start gap-y-2',
    )

    const slotClasses = cn(
      slottedBase,
      !isCenter && direction === 'vertical' && verticalSpacing,
      !isCenter && direction === 'horizontal' && horizontalSpacing,
      isCenter &&
        direction === 'vertical' &&
        cn(
          '[&::slotted([data-slot=timeline-media])]:col-start-2 [&::slotted([data-slot=timeline-media])]:row-start-1',
          '[&::slotted([data-slot=timeline-separator])]:col-start-2 [&::slotted([data-slot=timeline-separator])]:row-start-1',
          '[&::slotted([data-slot=timeline-content])]:row-start-1',
          side === 'left' &&
            '[&::slotted([data-slot=timeline-content])]:col-start-1 [&::slotted([data-slot=timeline-content])]:text-right',
          side === 'right' && '[&::slotted([data-slot=timeline-content])]:col-start-3',
          verticalSpacing,
        ),
      isCenter &&
        direction === 'horizontal' &&
        cn(
          '[&::slotted([data-slot=timeline-media])]:col-start-1 [&::slotted([data-slot=timeline-media])]:row-start-2',
          '[&::slotted([data-slot=timeline-separator])]:col-start-1 [&::slotted([data-slot=timeline-separator])]:row-start-2',
          '[&::slotted([data-slot=timeline-content])]:col-start-1',
          side === 'top' &&
            '[&::slotted([data-slot=timeline-content])]:row-start-1 [&::slotted([data-slot=timeline-content])]:self-end',
          side === 'bottom' && '[&::slotted([data-slot=timeline-content])]:row-start-3',
          horizontalSpacing,
        ),
    )

    return html`<div
      part="base"
      class=${classes}
      style=${styleMap({ '--timeline-stagger': `${Math.min(s.index, 12) * 55}ms` })}
    >
      <slot class=${slotClasses} @slotchange=${() => this.pushContext()}></slot>
    </div>`
  }
}

/* ------------------------------------------------------------- TimelineMedia */

// React's `[&>svg]` / `[&>img]` / `[&>[data-slot=avatar]]` marker rules as
// `::slotted()` on the marker's <slot> (the icon/avatar is light DOM).
const markerSlotClasses: Record<TimelineMediaVariant, string> = {
  dot: '[&::slotted(svg)]:shrink-0',
  icon: '[&::slotted(svg)]:shrink-0 [&::slotted(svg)]:size-4',
  avatar:
    '[&::slotted(svg)]:shrink-0 [&::slotted(img)]:size-full [&::slotted(img)]:object-cover [&::slotted([data-slot=avatar])]:size-full',
  outline: '[&::slotted(svg)]:shrink-0 [&::slotted(svg)]:size-4',
}

/**
 * <uip-timeline-media> — the marker (dot / icon / avatar / outline) plus the
 * auto connector line to the next item. Slot the icon <svg>, <img> or avatar.
 *
 * Properties: `variant`, `status` (defaults to the item's), `hideConnector`
 * (`hide-connector`), `coloredConnector` (`colored-connector`), `lineStyle`
 * (`line-style`: 'solid' | 'dashed' | 'dotted').
 */
export class UipTimelineMedia extends LitElement {
  // grid: the inner React root fills the host on both axes.
  static styles = [tailwind, css`:host { display: grid; }`]

  static properties = {
    variant: { reflect: true },
    status: { reflect: true },
    hideConnector: { type: Boolean, attribute: 'hide-connector' },
    coloredConnector: { type: Boolean, attribute: 'colored-connector' },
    lineStyle: { attribute: 'line-style' },
    itemContext: { attribute: false },
  }

  variant: TimelineMediaVariant = 'dot'
  status?: TimelineStatus
  hideConnector = false
  coloredConnector = false
  lineStyle: 'solid' | 'dashed' | 'dotted' = 'solid'
  /** Set by the parent <uip-timeline-item>; not part of the public API. */
  itemContext?: TimelineItemContextValue

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'timeline-media')
  }

  willUpdate() {
    this.setAttribute('data-variant', this.variant)
  }

  updated() {
    syncPulse(this.renderRoot.querySelector('[data-slot=timeline-media-marker]'), this.itemContext?.status === 'current')
  }

  private get connectorBgClass() {
    const direction = this.itemContext?.direction ?? 'vertical'
    const effectiveStatus: TimelineStatus = this.status ?? this.itemContext?.status ?? 'default'
    if (this.lineStyle === 'dashed') {
      return direction === 'vertical'
        ? 'border-l-2 border-dashed border-border bg-transparent w-0'
        : 'border-t-2 border-dashed border-border bg-transparent h-0'
    }
    if (this.lineStyle === 'dotted') {
      return direction === 'vertical'
        ? 'border-l-2 border-dotted border-border bg-transparent w-0'
        : 'border-t-2 border-dotted border-border bg-transparent h-0'
    }
    if (!this.coloredConnector) return 'bg-border'
    return {
      default: 'bg-primary',
      current: 'bg-primary',
      success: 'bg-success',
      warning: 'bg-warning',
      error: 'bg-destructive',
      info: 'bg-info',
      muted: 'bg-muted-foreground/40',
    }[effectiveStatus]
  }

  render() {
    const item = this.itemContext
    const direction = item?.direction ?? 'vertical'
    const isLast = item?.isLast ?? true
    const effectiveStatus: TimelineStatus = this.status ?? item?.status ?? 'default'
    const showConnector = !this.hideConnector && !isLast

    return html`<div
      part="base"
      data-variant=${this.variant}
      class=${cn(
        'relative flex shrink-0 items-center',
        direction === 'vertical' ? 'flex-col self-stretch' : 'flex-row items-center self-stretch',
      )}
    >
      <div
        data-uipkge=""
        data-slot="timeline-media-marker"
        class=${cn(
          timelineMediaVariants({ variant: this.variant, status: effectiveStatus }),
          direction === 'vertical' && this.variant === 'dot' && 'mt-1',
        )}
      >
        <slot class=${markerSlotClasses[this.variant] ?? markerSlotClasses.dot}></slot>
      </div>
      ${showConnector
        ? html`<div
            data-uipkge=""
            data-slot="timeline-media-connector"
            aria-hidden="true"
            class=${cn(direction === 'vertical' ? 'my-1 w-px flex-1' : 'mx-1 h-px flex-1', this.connectorBgClass)}
          ></div>`
        : nothing}
    </div>`
  }
}

/* --------------------------------------------------------- TimelineSeparator */

/**
 * <uip-timeline-separator> — the compact filled-dot marker with a connector.
 * Slot `dot` overrides the inner dot (React's `dot` prop).
 *
 * Properties: `hideConnector` (`hide-connector`).
 */
export class UipTimelineSeparator extends LitElement {
  static styles = [tailwind, css`:host { display: grid; }`]

  static properties = {
    hideConnector: { type: Boolean, attribute: 'hide-connector' },
    itemContext: { attribute: false },
  }

  hideConnector = false
  /** Set by the parent <uip-timeline-item>; not part of the public API. */
  itemContext?: TimelineItemContextValue

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'timeline-separator')
  }

  updated() {
    syncPulse(
      this.renderRoot.querySelector('[data-slot=timeline-separator-marker]'),
      this.itemContext?.status === 'current',
    )
  }

  render() {
    const direction = this.itemContext?.direction ?? 'vertical'
    const isLast = this.itemContext?.isLast ?? true
    const showConnector = !this.hideConnector && !isLast

    return html`<div
      part="base"
      class=${cn(
        'relative flex shrink-0 items-center',
        direction === 'vertical' ? 'w-4 flex-col self-stretch' : 'h-4 flex-row items-center self-stretch',
      )}
    >
      <div
        data-slot="timeline-separator-marker"
        class="bg-primary ring-background relative z-10 flex size-4 items-center justify-center rounded-full shadow-2xs ring-4"
      >
        <slot name="dot"><div class="bg-primary-foreground size-1.5 rounded-full"></div></slot>
      </div>
      ${showConnector
        ? html`<div
            aria-hidden="true"
            data-slot="timeline-media-connector"
            class=${cn('bg-border', direction === 'vertical' ? 'my-1.5 w-0.5 flex-1' : 'mx-1.5 h-0.5 flex-1')}
          ></div>`
        : nothing}
    </div>`
  }
}

/* ----------------------------------------------------------- TimelineContent */

/**
 * <uip-timeline-content> — the entry body. React's `space-y-1` targets
 * children, which are slotted here, so it is written as `::slotted()` (with
 * `!`, see the item's slotted rules).
 */
export class UipTimelineContent extends LitElement {
  static styles = [tailwind, css`:host { display: block; }`]

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'timeline-content')
  }

  render() {
    return html`<div part="base" class="flex-1 space-y-1">
      <slot class="[&::slotted(:not(:last-child))]:mb-1!"></slot>
    </div>`
  }
}

/* ------------------------------------------------------------ TimelineHeader */

/** <uip-timeline-header> — title + trailing meta row (flex, wraps). */
export class UipTimelineHeader extends LitElement {
  static styles = [tailwind, css`:host { display: block; }`]

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'timeline-header')
  }

  render() {
    return html`<div part="base" class="flex flex-wrap items-center justify-between gap-2"><slot></slot></div>`
  }
}

/* ------------------------------------------------------------- TimelineTitle */

const titleTags = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div'])

/**
 * <uip-timeline-title> — the entry heading. Property `as` ('h1'…'h6' |
 * 'div', default 'h3') picks the inner element, like React's `as`.
 */
export class UipTimelineTitle extends LitElement {
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    as: {},
  }

  as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' = 'h3'

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'timeline-title')
  }

  render() {
    const tag = unsafeStatic(titleTags.has(this.as) ? this.as : 'h3')
    return staticHtml`<${tag} part="base" class="text-sm leading-none font-semibold tracking-tight"><slot></slot></${tag}>`
  }
}

/* ------------------------------------------------------- TimelineDescription */

/** <uip-timeline-description> — muted supporting paragraph. */
export class UipTimelineDescription extends LitElement {
  static styles = [tailwind, css`:host { display: block; }`]

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'timeline-description')
  }

  render() {
    return html`<p part="base" class="text-muted-foreground text-sm"><slot></slot></p>`
  }
}

/* -------------------------------------------------------------- TimelineDate */

/**
 * <uip-timeline-date> — muted timestamp, an inner <time>. Property
 * `dateTime` (attribute `datetime`) is forwarded to it, like React's
 * `dateTime` on <time>.
 */
export class UipTimelineDate extends LitElement {
  // display: contents so the inner <time> is laid out where React's is (a flex
  // item in <uip-timeline-header>, inline in text). An inline/block host would
  // add its own 24px line box around the text-xs <time> and grow the row by 8px.
  static styles = [tailwind, css`:host { display: contents; }`]

  static properties = {
    dateTime: { attribute: 'datetime' },
  }

  dateTime?: string

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'timeline-date')
  }

  render() {
    return html`<time part="base" datetime=${this.dateTime ?? nothing} class="text-muted-foreground text-xs"
      ><slot></slot
    ></time>`
  }
}

const define = (tag: string, cls: CustomElementConstructor) => customElements.get(tag) || customElements.define(tag, cls)
define('uip-timeline', UipTimeline)
define('uip-timeline-item', UipTimelineItem)
define('uip-timeline-media', UipTimelineMedia)
define('uip-timeline-separator', UipTimelineSeparator)
define('uip-timeline-content', UipTimelineContent)
define('uip-timeline-header', UipTimelineHeader)
define('uip-timeline-title', UipTimelineTitle)
define('uip-timeline-description', UipTimelineDescription)
define('uip-timeline-date', UipTimelineDate)

declare global {
  interface HTMLElementTagNameMap {
    'uip-timeline': UipTimeline
    'uip-timeline-item': UipTimelineItem
    'uip-timeline-media': UipTimelineMedia
    'uip-timeline-separator': UipTimelineSeparator
    'uip-timeline-content': UipTimelineContent
    'uip-timeline-header': UipTimelineHeader
    'uip-timeline-title': UipTimelineTitle
    'uip-timeline-description': UipTimelineDescription
    'uip-timeline-date': UipTimelineDate
  }
}

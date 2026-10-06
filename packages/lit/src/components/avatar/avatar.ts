import { LitElement, css, html, isServer, nothing } from 'lit'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { avatarVariants, avatarFallbackVariants, type AvatarVariants } from './avatar.variants'

type Size = 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl'
type Rounded = NonNullable<AvatarVariants['rounded']>
type Color = NonNullable<AvatarVariants['color']>
type Variant = 'default' | 'outlined' | 'soft'
export type ImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error'

/**
 * <uip-avatar> — the registry Avatar root (Radix Avatar.Root).
 *
 * Children: <uip-avatar-image> and/or <uip-avatar-fallback>. As in Radix, the
 * image only renders once it has loaded; until then (or on error) the
 * fallback renders. The parts need no id references, so they are separate
 * elements coordinated through the root.
 *
 * Class strings are React's verbatim, on the inner `part="base"` span. React's
 * `className` overrides → style the part from outside, e.g.
 * `class="[&::part(base)]:size-10 [&::part(base)]:ring-2"`.
 */
export class UipAvatar extends LitElement {
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [tailwind, css`:host { display: inline-flex; }`]

  static properties = {
    size: { reflect: true },
    rounded: { reflect: true },
    color: { reflect: true },
    variant: { reflect: true },
    tile: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    loading: { type: Boolean, reflect: true },
  }

  size?: Size
  rounded?: Rounded
  color?: Color
  variant?: Variant
  tile = false
  disabled = false
  loading = false

  /** Loading status of the child <uip-avatar-image> (Radix context). */
  imageStatus: ImageLoadingStatus = 'idle'

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'avatar')
  }

  /** Called by <uip-avatar-image>; re-renders this avatar's fallbacks. */
  setImageStatus(status: ImageLoadingStatus) {
    this.imageStatus = status
    this.querySelectorAll('uip-avatar-fallback').forEach((f) => {
      if (f.closest('uip-avatar') === this) f.requestUpdate()
    })
  }

  render() {
    return html`<span
      part="base"
      data-uipkge=""
      data-slot="avatar"
      class=${cn(
        avatarVariants({ size: this.size, rounded: this.rounded, color: this.color, variant: this.variant }),
        this.tile ? 'rounded-none' : '',
        this.disabled ? 'cursor-not-allowed opacity-50' : '',
        this.loading ? 'animate-pulse' : '',
      )}
      ><slot></slot
    ></span>`
  }
}

/**
 * <uip-avatar-image> — Radix Avatar.Image. Preloads `src`; the <img> renders
 * only once loaded.
 *
 * Events: `loading-status-change` (detail: { status: 'idle' | 'loading' |
 * 'loaded' | 'error' }) — React's `onLoadingStatusChange`.
 */
export class UipAvatarImage extends LitElement {
  // display: contents so the <img> is laid out directly inside the avatar.
  static styles = [tailwind, css`:host { display: contents; }`]

  static properties = {
    src: {},
    alt: {},
    status: { state: true },
  }

  src?: string
  alt = ''
  private status: ImageLoadingStatus = 'idle'
  private probe?: HTMLImageElement

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'avatar-image')
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.probe = undefined
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if (changed.has('src')) this.load()
  }

  private load() {
    if (isServer) return
    if (!this.src) return this.setStatus('idle')
    const img = new Image()
    this.probe = img
    const settle = (status: ImageLoadingStatus) => () => {
      if (this.probe === img) this.setStatus(status)
    }
    this.setStatus('loading')
    img.onload = settle('loaded')
    img.onerror = settle('error')
    img.src = this.src
  }

  private setStatus(status: ImageLoadingStatus) {
    if (this.status === status) return
    this.status = status
    this.closest('uip-avatar')?.setImageStatus(status)
    this.dispatchEvent(new CustomEvent('loading-status-change', { detail: { status }, bubbles: true, composed: true }))
  }

  render() {
    if (this.status !== 'loaded') return nothing
    return html`<img
      part="base"
      data-uipkge=""
      data-slot="avatar-image"
      class="aspect-square size-full object-cover"
      src=${this.src ?? nothing}
      alt=${this.alt}
    />`
  }
}

/**
 * <uip-avatar-fallback> — Radix Avatar.Fallback. Renders while the sibling
 * image is not loaded (after `delay-ms`, Radix's `delayMs`). Content: the
 * `text` attribute, else the default slot.
 */
export class UipAvatarFallback extends LitElement {
  // display: contents so the fallback span fills the avatar directly.
  static styles = [tailwind, css`:host { display: contents; }`]

  static properties = {
    size: { reflect: true },
    color: { reflect: true },
    text: {},
    delayMs: { type: Number, attribute: 'delay-ms' },
    delayed: { state: true },
  }

  size: Size = 'default'
  color: Color = 'default'
  text?: string
  delayMs?: number
  private delayed = false
  private timer?: ReturnType<typeof setTimeout>

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'avatar-fallback')
    if (!isServer && this.delayMs) {
      this.delayed = true
      this.timer = setTimeout(() => (this.delayed = false), this.delayMs)
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    clearTimeout(this.timer)
  }

  render() {
    // The server DOM shim has no tree: render the fallback (Radix does too).
    const status = isServer ? 'idle' : (this.closest('uip-avatar')?.imageStatus ?? 'idle')
    if (this.delayed || status === 'loaded') return nothing
    return html`<span
      part="base"
      data-uipkge=""
      data-slot="avatar-fallback"
      class=${avatarFallbackVariants({ size: this.size, color: this.color })}
      >${this.text ?? html`<slot></slot>`}</span
    >`
  }
}

const overflowSizeClasses: Record<Size, string> = {
  xs: 'size-4 text-xs',
  sm: 'size-6 text-xs',
  default: 'size-8 text-sm',
  lg: 'size-12 text-base',
  xl: 'size-16 text-lg',
  '2xl': 'size-20 text-xl',
}

/**
 * <uip-avatar-group> — the registry AvatarGroup (custom layout wrapper).
 *
 * Children are <uip-avatar>s. With `max`, only the first `max - 1` render
 * (manual slot assignment — the rest stay in the DOM, unrendered) plus a `+N`
 * chip. React's `overflow` render prop → an element with `slot="overflow"`
 * replaces the chip; the hidden count is `.overflowCount` and the host's
 * `data-overflow-count`.
 *
 * Overlap: React's `-space-x-2` can't reach slotted children through the
 * <slot>, so the same negative margin is applied with `::slotted(…)`.
 */
export class UipAvatarGroup extends LitElement {
  static shadowRootOptions: ShadowRootInit = { ...LitElement.shadowRootOptions, slotAssignment: 'manual' }
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    max: { type: Number },
    overlap: { type: Boolean, converter: { fromAttribute: (v: string | null) => v !== 'false' } },
    size: { reflect: true },
    total: { type: Number },
    items: { state: true },
  }

  max?: number
  overlap = true
  size: Size = 'default'
  total?: number
  private items: Element[] = []
  private observer?: MutationObserver

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'avatar-group')
    this.readItems()
    if (isServer) return
    this.observer = new MutationObserver(() => this.readItems())
    this.observer.observe(this, { childList: true })
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.observer?.disconnect()
  }

  private readItems() {
    this.items = [...this.children].filter((el) => el.slot !== 'overflow')
  }

  private get layout() {
    const count = this.total ?? this.items.length
    // When overflowing, reserve one slot for the +N chip so max includes the badge.
    const showOverflow = this.max != null && count > this.max
    const visibleLimit = showOverflow ? Math.max(this.max! - 1, 0) : this.items.length
    return { showOverflow, visibleLimit, overflowCount: showOverflow ? count - visibleLimit : 0 }
  }

  /** Number of avatars hidden behind the overflow indicator. */
  get overflowCount() {
    return this.layout.overflowCount
  }

  protected updated() {
    const { visibleLimit, overflowCount } = this.layout
    this.setAttribute('data-overflow-count', String(overflowCount))
    const root = this.renderRoot as ShadowRoot
    root.querySelector<HTMLSlotElement>('slot:not([name])')?.assign(...this.items.slice(0, visibleLimit))
    root
      .querySelector<HTMLSlotElement>('slot[name=overflow]')
      ?.assign(...[...this.children].filter((el) => el.slot === 'overflow'))
  }

  render() {
    const { showOverflow, visibleLimit, overflowCount } = this.layout
    return html`<div
      part="base"
      data-uipkge=""
      data-slot="avatar-group"
      class=${cn(
        'flex items-center',
        this.overlap ? '-space-x-2 [&::slotted(:not(:first-child))]:-ms-2' : 'gap-1',
      )}
    >
      <slot></slot>
      ${showOverflow
        ? html`<div
            class=${cn(
              'bg-muted ring-background relative flex shrink-0 overflow-hidden rounded-full ring-2',
              overflowSizeClasses[this.size],
              this.overlap && visibleLimit > 0 ? '-ms-2' : '',
            )}
          >
            <slot name="overflow"
              ><span class="flex size-full items-center justify-center font-medium">+${overflowCount}</span></slot
            >
          </div>`
        : nothing}
    </div>`
  }
}

customElements.get('uip-avatar') || customElements.define('uip-avatar', UipAvatar)
customElements.get('uip-avatar-image') || customElements.define('uip-avatar-image', UipAvatarImage)
customElements.get('uip-avatar-fallback') || customElements.define('uip-avatar-fallback', UipAvatarFallback)
customElements.get('uip-avatar-group') || customElements.define('uip-avatar-group', UipAvatarGroup)

declare global {
  interface HTMLElementTagNameMap {
    'uip-avatar': UipAvatar
    'uip-avatar-image': UipAvatarImage
    'uip-avatar-fallback': UipAvatarFallback
    'uip-avatar-group': UipAvatarGroup
  }
}

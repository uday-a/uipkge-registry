import { LitElement, css, html, nothing } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { skeletonLoaderVariants, type SkeletonLoaderVariants } from './skeleton.variants'

/*
 * Shimmer keyframes — React's `shimmerCss` verbatim (React injects it as a
 * <style> tag). A keyframe colour-mix sweep has no Tailwind utility, so this
 * is the one sanctioned exception to "no CSS beyond :host display".
 */
const shimmer = css`
  .skeleton-shimmer {
    background: linear-gradient(
      90deg,
      color-mix(in srgb, var(--muted) 100%, transparent) 0%,
      color-mix(in srgb, var(--muted) 60%, var(--foreground) 8%) 50%,
      color-mix(in srgb, var(--muted) 100%, transparent) 100%
    );
    background-size: 200% 100%;
    animation: skeleton-shimmer 1.8s linear infinite;
  }
  @keyframes skeleton-shimmer {
    from {
      background-position: 200% 0;
    }
    to {
      background-position: -200% 0;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .skeleton-shimmer {
      animation: none;
      background: var(--muted);
    }
  }
`

type SkeletonVariant = 'rectangular' | 'rounded' | 'circular' | 'text' | 'avatar' | 'image' | 'card' | 'table-row'

const skeletonVariantClasses: Record<SkeletonVariant, string> = {
  rectangular: '',
  rounded: 'rounded-md',
  circular: 'rounded-full',
  text: 'rounded h-4 w-full',
  avatar: 'rounded-full size-10',
  image: 'rounded-lg size-24',
  card: 'rounded-xl size-full min-h-[120px]',
  'table-row': 'rounded h-10 w-full',
}

/**
 * <uip-skeleton> — the registry Skeleton.
 *
 * React puts `className` on the shimmer <div>. Here consumer classes go on the
 * host (sized/rounded by the page's own Tailwind) and the inner shimmer fills
 * it (`size-full`, plus `rounded-[inherit]` for `rectangular`); variant
 * classes still sit on the inner div, as in React. `loading=false` renders the default slot instead.
 */
export class UipSkeleton extends LitElement {
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [tailwind, shimmer, css`:host { display: block; }`]

  static properties = {
    variant: { reflect: true },
    width: {},
    height: {},
    loading: { type: Boolean },
  }

  variant: SkeletonVariant = 'rectangular'
  width?: string
  height?: string
  loading = true

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'skeleton')
  }

  // Fill the host for the shape-only variants (their size comes from the
  // consumer's classes on the host); sized variants keep React's classes.
  private fill() {
    const v = this.variant ?? 'rectangular'
    if (v === 'rectangular') return 'size-full rounded-[inherit]'
    return v === 'rounded' || v === 'circular' ? 'size-full' : ''
  }

  render() {
    if (!this.loading) return html`<slot></slot>`
    const style: Record<string, string> = {}
    if (this.width) style.width = this.width
    if (this.height) style.height = this.height
    return html`<div
      part="base"
      data-slot="skeleton"
      aria-hidden="true"
      class=${cn(this.fill(), 'skeleton-shimmer', skeletonVariantClasses[this.variant ?? 'rectangular'])}
      style=${styleMap(style)}
    ></div>`
  }
}

/**
 * <uip-skeleton-group> — the registry SkeletonGroup (`space-y-2` wrapper).
 * Slotted children aren't shadow-tree children, so React's `space-y-2` is
 * expressed as `flex flex-col gap-2` (a `::slotted()` margin loses to the
 * host page's preflight margin reset).
 * React's `tag` prop has no equivalent (the host is the element).
 */
export class UipSkeletonGroup extends LitElement {
  static styles = [tailwind, css`:host { display: block; }`]

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'skeleton-group')
  }

  render() {
    return html`<div part="base" data-slot="skeleton-group" class="flex flex-col gap-2"><slot></slot></div>`
  }
}

/**
 * <uip-skeleton-text> — the registry SkeletonText: `lines` shimmer bars, with
 * `first-line-width` / `last-line-width` tweaks.
 */
export class UipSkeletonText extends LitElement {
  static styles = [tailwind, shimmer, css`:host { display: block; }`]

  static properties = {
    lines: { type: Number },
    lastLineWidth: { attribute: 'last-line-width' },
    firstLineWidth: { attribute: 'first-line-width' },
  }

  lines = 3
  lastLineWidth = '80%'
  firstLineWidth = '100%'

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'skeleton-text')
  }

  render() {
    const lineWidths = Array.from({ length: this.lines }, (_, i) => {
      if (i === 0) return this.firstLineWidth
      if (i === this.lines - 1) return this.lastLineWidth
      return '100%'
    })
    return html`<div part="base" data-slot="skeleton-text" aria-hidden="true" class="space-y-2">
      ${lineWidths.map((width) => html`<div class="skeleton-shimmer h-4 rounded" style=${styleMap({ width })}></div>`)}
    </div>`
  }
}

type LoaderVariant = NonNullable<SkeletonLoaderVariants['variant']>

/**
 * <uip-skeleton-loader> — the registry SkeletonLoader: preset placeholder
 * compositions (`variant`, `rows`). `loading=false` renders the default slot;
 * `boilerplate` adds the muted overlay when not loading, as in React.
 */
export class UipSkeletonLoader extends LitElement {
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    variant: { reflect: true },
    loading: { type: Boolean },
    rows: { type: Number },
    boilerplate: { type: Boolean },
  }

  variant: LoaderVariant = 'text'
  loading = true
  rows = 1
  boilerplate = false

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'skeleton-loader')
  }

  private body() {
    const v = (variant: LoaderVariant, extra = '') => html`<div class=${cn(skeletonLoaderVariants({ variant }), extra)}></div>`
    const rows = Array.from({ length: this.rows })
    const variant = this.variant
    if (this.rows === 1) return this.loading ? v(variant) : html`<slot></slot>`
    if (!this.loading) return html`<slot></slot>`
    switch (variant) {
      case 'article':
        return html`${v('heading', 'mb-4')}${v('text', 'mb-2')}${v('text', 'mb-2')}${v('text', 'w-3/4')}`
      case 'card':
        return html`${v('image-large', 'mb-4')}${v('heading-small', 'mb-2')}${v('text', 'mb-2')}${v('text', 'w-1/2')}`
      case 'card-avatar':
        return html`<div class="mb-4 flex items-center gap-4">
          ${v('avatar-large')}
          <div class="flex-1 space-y-2">${v('heading-small')}${v('text', 'w-1/2')}</div>
        </div>`
      case 'actions':
        return html`<div class="flex gap-2">${v('button')}${v('button')}</div>`
      case 'table':
        return rows.map(() => v('table-row', 'mb-2'))
      case 'list-item':
        return rows.map(
          () => html`<div class="mb-2 flex items-center gap-3">
            ${v('avatar-small')}
            <div class="flex-1">${v('text')}</div>
          </div>`,
        )
      case 'list-item-two-line':
        return rows.map(
          () => html`<div class="mb-2 flex items-center gap-3">
            ${v('avatar')}
            <div class="flex-1 space-y-2">${v('text')}${v('text', 'w-3/4')}</div>
          </div>`,
        )
      case 'list-item-three-line':
        return rows.map(
          () => html`<div class="mb-2 flex items-start gap-3">
            ${v('avatar')}
            <div class="flex-1 space-y-2">${v('text')}${v('text')}${v('text', 'w-2/3')}</div>
          </div>`,
        )
      default:
        return rows.map(() => v(variant, 'mb-2'))
    }
  }

  render() {
    return html`<div part="base" data-slot="skeleton-loader" class="space-y-2">
      ${this.body()}${this.boilerplate && !this.loading ? html`<div class="bg-muted/50 absolute inset-0"></div>` : nothing}
    </div>`
  }
}

customElements.get('uip-skeleton') || customElements.define('uip-skeleton', UipSkeleton)
customElements.get('uip-skeleton-group') || customElements.define('uip-skeleton-group', UipSkeletonGroup)
customElements.get('uip-skeleton-text') || customElements.define('uip-skeleton-text', UipSkeletonText)
customElements.get('uip-skeleton-loader') || customElements.define('uip-skeleton-loader', UipSkeletonLoader)

declare global {
  interface HTMLElementTagNameMap {
    'uip-skeleton': UipSkeleton
    'uip-skeleton-group': UipSkeletonGroup
    'uip-skeleton-text': UipSkeletonText
    'uip-skeleton-loader': UipSkeletonLoader
  }
}

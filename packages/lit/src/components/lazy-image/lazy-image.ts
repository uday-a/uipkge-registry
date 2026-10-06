import { LitElement, css, html, isServer, nothing } from 'lit'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'

export type ImagePlaceholder = 'skeleton' | 'none'

const trueByDefault = {
  fromAttribute: (v: string | null) => v !== 'false' && v !== null,
  toAttribute: (v: boolean) => (v ? '' : 'false'),
}

/**
 * <uip-lazy-image> — progressive image loader with skeleton placeholder and fallback.
 */
export class UipLazyImage extends LitElement {
  static styles = [
    tailwind,
    css`
      :host {
        display: block;
        overflow: hidden;
        position: relative;
      }
    `,
  ]

  static properties = {
    src: { reflect: true },
    srcSet: { attribute: 'srcset', reflect: true },
    sizes: { reflect: true },
    alt: { reflect: true },
    aspectRatio: { attribute: 'aspect-ratio', reflect: true },
    width: { reflect: true },
    height: { reflect: true },
    placeholder: { reflect: true },
    cover: { converter: trueByDefault, reflect: true },
    eager: { type: Boolean, reflect: true },
    fallback: { reflect: true },
    transition: { converter: trueByDefault, reflect: true },
    state: { state: true },
    visible: { state: true },
  }

  src = ''
  srcSet?: string
  sizes?: string
  alt = ''
  aspectRatio?: string | number
  width?: string | number
  height?: string | number
  placeholder: ImagePlaceholder = 'skeleton'
  cover = true
  eager = false
  fallback?: string
  transition = true

  private state: 'idle' | 'loading' | 'loaded' | 'error' = 'idle'
  private visible = false
  private observer?: IntersectionObserver

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'lazy-image')
    this.setupObserver()
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    if (this.observer) {
      this.observer.disconnect()
      this.observer = undefined
    }
  }

  protected updated(changedProps: Map<string, unknown>) {
    super.updated(changedProps)
    if (changedProps.has('src') || changedProps.has('eager')) {
      this.state = 'idle'
      this.setupObserver()
    }
    if (this.visible && this.state === 'idle') {
      this.state = 'loading'
    }
  }

  private setupObserver() {
    if (isServer) {
      this.visible = true
      return
    }

    if (this.eager) {
      this.visible = true
      return
    }

    this.visible = false

    if (typeof IntersectionObserver === 'undefined') {
      this.visible = true
      return
    }

    if (this.observer) {
      this.observer.disconnect()
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.visible = true
            this.observer?.disconnect()
            this.observer = undefined
            break
          }
        }
      },
      { rootMargin: '200px' },
    )
    this.observer.observe(this)
  }

  private onImgLoad(e: Event) {
    this.state = 'loaded'
    this.dispatchEvent(new CustomEvent('load', { bubbles: true, composed: true }))
  }

  private onImgError(e: Event) {
    this.state = 'error'
    this.dispatchEvent(new CustomEvent('error', { bubbles: true, composed: true }))
  }

  render() {
    const styleParts: string[] = []
    if (this.aspectRatio !== undefined) {
      const ar = typeof this.aspectRatio === 'number' ? String(this.aspectRatio) : this.aspectRatio
      styleParts.push(`aspect-ratio: ${ar};`)
    }
    if (this.width !== undefined) {
      const w = typeof this.width === 'number' ? `${this.width}px` : this.width
      styleParts.push(`width: ${w};`)
    }
    if (this.height !== undefined) {
      const h = typeof this.height === 'number' ? `${this.height}px` : this.height
      styleParts.push(`height: ${h};`)
    }
    const containerStyle = styleParts.join(' ')

    return html`
      <div
        part="base"
        data-slot="lazy-image"
        class="bg-muted relative size-full overflow-hidden"
        style=${containerStyle || nothing}
      >
        ${this.placeholder === 'skeleton' && this.state !== 'loaded' && this.state !== 'error'
          ? html`<uip-skeleton class="absolute inset-0 size-full rounded-none"></uip-skeleton>`
          : nothing}
        ${this.visible && this.state !== 'error'
          ? html`
              <img
                src=${this.src}
                srcset=${this.srcSet ?? nothing}
                sizes=${this.sizes ?? nothing}
                alt=${this.alt}
                loading=${this.eager ? 'eager' : 'lazy'}
                decoding=${this.eager ? 'sync' : 'async'}
                class=${cn(
                  'block size-full',
                  this.cover ? 'object-cover' : 'object-contain',
                  this.transition && 'transition-opacity duration-300',
                  this.state === 'loaded' ? 'opacity-100' : 'opacity-0',
                )}
                @load=${this.onImgLoad}
                @error=${this.onImgError}
              />
            `
          : nothing}
        ${this.state === 'error'
          ? html`
              <slot name="fallback">
                ${this.fallback
                  ? html`
                      <img
                        src=${this.fallback}
                        alt=${this.alt}
                        class=${cn('block size-full', this.cover ? 'object-cover' : 'object-contain')}
                      />
                    `
                  : html`
                      <div
                        role="img"
                        class="text-muted-foreground absolute inset-0 flex items-center justify-center text-xs"
                        aria-label="Image failed to load"
                      >
                        <span aria-hidden="true">Image unavailable</span>
                      </div>
                    `}
              </slot>
            `
          : nothing}
      </div>
    `
  }
}

customElements.get('uip-lazy-image') || customElements.define('uip-lazy-image', UipLazyImage)

declare global {
  interface HTMLElementTagNameMap {
    'uip-lazy-image': UipLazyImage
  }
}

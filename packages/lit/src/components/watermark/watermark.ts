import { LitElement, css, html, isServer } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'

/**
 * <uip-watermark> — the registry Watermark as a web component.
 *
 * Class strings are React's verbatim (`relative` root, `absolute inset-0
 * overflow-hidden` overlay). One structural adaptation: the host can't take
 * the `relative` class, so the positioned container is an inner `part="base"`
 * div wrapping the slot + overlay — React's `className` (borders, padding)
 * goes on the host as usual, with the overlay covering the content box.
 *
 * The overlay tiles a generated SVG data URL (text or `image`) as its
 * background, rebuilt on resize — the same tiling math as React. `interactive`
 * lets the overlay capture pointer events (preview-only views).
 *
 * Parts: `base` (the positioned container), `overlay`.
 */
export class UipWatermark extends LitElement {
  // React's root is a block <div>.
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    content: {},
    image: {},
    rotate: { type: Number },
    gap: { type: Number },
    opacity: { type: Number },
    fontSize: { type: Number, attribute: 'font-size' },
    color: {},
    fontFamily: { attribute: 'font-family' },
    fontWeight: { attribute: 'font-weight' },
    zIndex: { type: Number, attribute: 'z-index' },
    interactive: { type: Boolean, reflect: true },
    boxWidth: { state: true },
    boxHeight: { state: true },
  }

  content = ''
  image?: string
  rotate = -22
  gap = 100
  opacity = 0.08
  fontSize = 16
  color = 'currentColor'
  fontFamily = 'sans-serif'
  fontWeight: number | string = 'normal'
  zIndex = 9
  interactive = false
  private boxWidth = 0
  private boxHeight = 0
  private observer?: ResizeObserver

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'watermark')
    if (isServer || typeof ResizeObserver === 'undefined') return
    const measure = () => {
      const rect = this.getBoundingClientRect()
      this.boxWidth = rect.width
      this.boxHeight = rect.height
    }
    measure()
    this.observer = new ResizeObserver(measure)
    this.observer.observe(this)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.observer?.disconnect()
  }

  // Build a tiled SVG data URL that repeats the text/image across a tile of
  // size (gap + contentSize) — the same tiling math as React.
  private watermarkUrl() {
    if (!this.boxWidth || !this.boxHeight || isServer || typeof btoa === 'undefined') return ''
    const text = this.content || ''
    const { gap, fontSize, rotate, opacity, color, fontFamily, fontWeight, image } = this

    if (image) {
      // For images we tile the image at its natural size within the gap.
      const tile = gap + 100
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${tile}" height="${tile}" viewBox="0 0 ${tile} ${tile}">
  <image href="${image}" x="${gap / 2}" y="${gap / 2}" width="100" height="100" opacity="${opacity}" transform="rotate(${rotate} ${tile / 2} ${tile / 2})"/>
</svg>`
      return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`
    }

    if (!text) return ''

    // Estimate text width — rough heuristic, good enough for tiling.
    const textWidth = text.length * fontSize * 0.6
    const tileW = gap + textWidth
    const tileH = gap + fontSize * 1.5

    const escapedText = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${tileW}" height="${tileH}" viewBox="0 0 ${tileW} ${tileH}">
  <text x="${gap / 2}" y="${gap / 2 + fontSize}" font-size="${fontSize}" font-family="${fontFamily}" font-weight="${fontWeight}" fill="${color}" opacity="${opacity}" transform="rotate(${rotate} ${gap / 2} ${gap / 2 + fontSize / 2})">${escapedText}</text>
</svg>`
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`
  }

  render() {
    const url = this.watermarkUrl()
    return html`<div part="base" data-uipkge="" data-slot="watermark" class="relative">
      <slot></slot>
      <div
        part="overlay"
        data-uipkge=""
        data-slot="watermark-overlay"
        class="absolute inset-0 overflow-hidden"
        style=${styleMap({
          backgroundImage: url ? `url("${url}")` : 'none',
          backgroundRepeat: 'repeat',
          zIndex: String(this.zIndex),
          pointerEvents: this.interactive ? 'auto' : 'none',
        })}
        aria-hidden="true"
      ></div>
    </div>`
  }
}

customElements.get('uip-watermark') || customElements.define('uip-watermark', UipWatermark)

declare global {
  interface HTMLElementTagNameMap {
    'uip-watermark': UipWatermark
  }
}

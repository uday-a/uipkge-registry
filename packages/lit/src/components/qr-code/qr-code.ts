import { LitElement, css, html, isServer, nothing } from 'lit'
import { unsafeSVG } from 'lit/directives/unsafe-svg.js'
import { Check, Loader2, RotateCcw, ScanLine } from 'lucide'
import { cn } from '../../lib/utils'
import { icon } from '../../lib/icon'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'

export type QRCodeType = 'canvas' | 'svg'
export type QRCodeStatus = 'active' | 'expired' | 'loading' | 'scanned'
export type QRCodeErrorLevel = 'L' | 'M' | 'Q' | 'H'

/**
 * <uip-qr-code> — QR Code generator supporting Canvas and SVG rendering modes,
 * error correction levels, status overlays (active, expired, loading, scanned),
 * center logos/icons, and PNG downloads.
 */
export class UipQrCode extends LitElement {
  static styles = [
    tailwind,
    css`
      :host {
        display: inline-flex;
      }
    `,
  ]

  static properties = {
    value: { type: String },
    type: { type: String },
    size: { type: Number },
    color: { type: String },
    bgColor: { type: String, attribute: 'bg-color' },
    icon: { type: String },
    iconSize: { type: Number, attribute: 'icon-size' },
    errorLevel: { type: String, attribute: 'error-level' },
    bordered: {
      type: Boolean,
      converter: { fromAttribute: (v: string | null) => v !== null && v !== 'false' },
    },
    status: { type: String },
    marginSize: { type: Number, attribute: 'margin-size' },
    qrDataUrl: { state: true },
    qrSvg: { state: true },
  }

  value = ''
  type: QRCodeType = 'canvas'
  size = 160
  color = '#000000'
  bgColor = '#ffffff'
  icon = ''
  iconSize = 40
  errorLevel: QRCodeErrorLevel = 'M'
  bordered = true
  status: QRCodeStatus = 'active'
  marginSize = 0

  qrDataUrl = ''
  qrSvg = ''

  private isGenerating = false

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'qr-code')
    this.generateQR()
  }

  updated(changedProperties: Map<string, unknown>) {
    if (
      changedProperties.has('value') ||
      changedProperties.has('type') ||
      changedProperties.has('size') ||
      changedProperties.has('color') ||
      changedProperties.has('bgColor') ||
      changedProperties.has('errorLevel') ||
      changedProperties.has('marginSize') ||
      changedProperties.has('status')
    ) {
      this.generateQR()
    }
  }

  private async generateQR() {
    if (isServer || !this.value || this.status === 'loading' || this.isGenerating) return
    this.isGenerating = true
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const mod = await import('qrcode')
      const QRCodeLib = mod.default || mod

      const options = {
        width: this.size,
        margin: this.marginSize,
        color: { dark: this.color, light: this.bgColor },
        errorCorrectionLevel: this.errorLevel,
      }

      if (this.type === 'svg') {
        const svg = await QRCodeLib.toString(this.value, { type: 'svg', ...options })
        this.qrSvg = svg
      } else {
        const url = await QRCodeLib.toDataURL(this.value, options)
        this.qrDataUrl = url
      }
    } catch (e) {
      console.error('QR Code generation failed:', e)
    } finally {
      this.isGenerating = false
    }
  }

  private downloadQR() {
    if (!this.qrDataUrl) return
    const link = document.createElement('a')
    link.download = `qrcode-${this.value.slice(0, 20)}.png`
    link.href = this.qrDataUrl
    link.click()
  }

  private onRefreshClick() {
    this.dispatchEvent(new CustomEvent('refresh', { bubbles: true, composed: true }))
  }

  render() {
    const statusOverlay = (() => {
      switch (this.status) {
        case 'expired':
          return {
            icon: icon(RotateCcw, 'rotate-ccw', 'size-8'),
            text: 'Expired',
            canRefresh: true,
          }
        case 'scanned':
          return {
            icon: icon(Check, 'check', 'size-8'),
            text: 'Scanned',
            canRefresh: false,
          }
        case 'loading':
          return {
            icon: icon(Loader2, 'loader-2', 'size-8 animate-spin'),
            text: 'Loading...',
            canRefresh: false,
          }
        default:
          return null
      }
    })()

    return html`
      <div
        part="base"
        aria-busy=${this.status === 'loading' ? 'true' : nothing}
        class=${cn(
          'inline-flex flex-col items-center gap-2',
          this.bordered && 'bg-background rounded-lg border p-4',
        )}
      >
        <div
          class="relative inline-flex items-center justify-center overflow-hidden"
          style="width: ${this.size}px; height: ${this.size}px;"
        >
          <!-- QR Code Content -->
          ${this.type === 'svg' && this.qrSvg
            ? html`<div class="size-full [&_svg]:size-full">${unsafeSVG(this.qrSvg)}</div>`
            : this.qrDataUrl
              ? html`<img src=${this.qrDataUrl} alt="QR Code for ${this.value}" class="size-full" />`
              : nothing}

          <!-- Center Icon Overlay -->
          ${this.icon && this.status === 'active'
            ? html`
                <div class="absolute inset-0 flex items-center justify-center">
                  <div
                    class="bg-background overflow-hidden rounded-md shadow-sm"
                    style="width: ${this.iconSize}px; height: ${this.iconSize}px;"
                  >
                    <img src=${this.icon} alt="" class="size-full object-cover" />
                  </div>
                </div>
              `
            : nothing}

          <!-- Status Overlay -->
          ${statusOverlay
            ? html`
                <div
                  class="bg-background/90 absolute inset-0 flex flex-col items-center justify-center gap-2 backdrop-blur-sm"
                >
                  ${statusOverlay.icon}
                  <span class="text-foreground text-sm font-medium">${statusOverlay.text}</span>
                  ${statusOverlay.canRefresh
                    ? html`
                        <button
                          type="button"
                          class="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex items-center gap-1 rounded-md px-3 py-1 text-xs font-medium focus-visible:ring-2 focus-visible:outline-none"
                          @click=${this.onRefreshClick}
                        >
                          ${icon(ScanLine, 'scan-line', 'size-3')}
                          Refresh
                        </button>
                      `
                    : nothing}
                </div>
              `
            : nothing}
        </div>

        <!-- Download button / Extra slot -->
        <slot name="extra">
          ${this.type === 'canvas' && this.status === 'active' && this.qrDataUrl
            ? html`
                <button
                  type="button"
                  class="text-muted-foreground hover:text-foreground focus-visible:ring-ring text-xs underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:outline-none"
                  @click=${this.downloadQR}
                >
                  Download
                </button>
              `
            : nothing}
        </slot>
      </div>
    `
  }
}

customElements.get('uip-qr-code') || customElements.define('uip-qr-code', UipQrCode)

declare global {
  interface HTMLElementTagNameMap {
    'uip-qr-code': UipQrCode
  }
}

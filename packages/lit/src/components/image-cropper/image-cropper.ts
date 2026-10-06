import { LitElement, css, html, nothing } from 'lit'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'

function coverScale(vw: number, vh: number, nw: number, nh: number) {
  if (!nw || !nh) return 1
  return Math.max(vw / nw, vh / nh)
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

/**
 * <uip-image-cropper> — Interactive image cropper with pan, zoom, custom aspect ratio,
 * keyboard controls, and canvas/blob export.
 */
export class UipImageCropper extends LitElement {
  static styles = [
    tailwind,
    css`
      :host {
        display: block;
        width: 100%;
      }
    `,
  ]

  static properties = {
    src: { type: String },
    alt: { type: String },
    aspectRatio: { type: Number, attribute: 'aspect-ratio' },
    zoom: { type: Number },
    defaultZoom: { type: Number, attribute: 'default-zoom' },
    minZoom: { type: Number, attribute: 'min-zoom' },
    maxZoom: { type: Number, attribute: 'max-zoom' },
    disabled: { type: Boolean },
    showZoom: { type: Boolean, attribute: 'show-zoom' },
    rounded: { type: String },
    panX: { state: true },
    panY: { state: true },
  }

  src = ''
  alt = ''
  aspectRatio = 1
  zoom = 1
  defaultZoom = 1
  minZoom = 1
  maxZoom = 4
  disabled = false
  showZoom = false
  rounded: 'lg' | 'full' = 'lg'

  panX = 0
  panY = 0

  private naturalW = 0
  private naturalH = 0
  private dragging = false
  private lastPointer = { x: 0, y: 0 }

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'image-cropper')
    if (this.defaultZoom && !this.hasAttribute('zoom')) {
      this.zoom = this.defaultZoom
    }
  }

  setZoom(value: number) {
    const next = clamp(value, this.minZoom, this.maxZoom)
    this.zoom = next
    this.clampPan()
    this.dispatchEvent(
      new CustomEvent('zoom-change', {
        detail: { zoom: next },
        bubbles: true,
        composed: true,
      }),
    )
    this.requestUpdate()
  }

  private clampPan() {
    const viewport = this.renderRoot.querySelector('[part=viewport]') as HTMLElement | null
    if (!viewport || !this.naturalW) return
    const vw = viewport.clientWidth
    const vh = viewport.clientHeight
    const scale = coverScale(vw, vh, this.naturalW, this.naturalH) * this.zoom
    const dw = this.naturalW * scale
    const dh = this.naturalH * scale
    const maxX = Math.abs(vw - dw) / 2
    const maxY = Math.abs(vh - dh) / 2
    this.panX = clamp(this.panX, -maxX, maxX)
    this.panY = clamp(this.panY, -maxY, maxY)
  }

  getCroppedCanvas(): HTMLCanvasElement | null {
    const viewport = this.renderRoot.querySelector('[part=viewport]') as HTMLElement | null
    const img = this.renderRoot.querySelector('img') as HTMLImageElement | null
    if (!viewport || !img || !this.naturalW) return null

    const vw = viewport.clientWidth
    const vh = viewport.clientHeight
    const scale = coverScale(vw, vh, this.naturalW, this.naturalH) * this.zoom
    const dw = this.naturalW * scale
    const dh = this.naturalH * scale
    const left = (vw - dw) / 2 + this.panX
    const top = (vh - dh) / 2 + this.panY
    const sw = vw / scale
    const sh = vh / scale

    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(sw))
    canvas.height = Math.max(1, Math.round(sh))
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    ctx.drawImage(img, -left / scale, -top / scale, sw, sh, 0, 0, canvas.width, canvas.height)
    return canvas
  }

  async getCroppedBlob(type = 'image/png', quality?: number): Promise<Blob | null> {
    const canvas = this.getCroppedCanvas()
    if (!canvas) return null
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), type, quality)
    })
  }

  private onPointerDown(e: PointerEvent) {
    if (this.disabled) return
    this.dragging = true
    this.lastPointer = { x: e.clientX, y: e.clientY }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  private onPointerMove(e: PointerEvent) {
    if (!this.dragging) return
    const dx = e.clientX - this.lastPointer.x
    const dy = e.clientY - this.lastPointer.y
    this.lastPointer = { x: e.clientX, y: e.clientY }
    this.panX += dx
    this.panY += dy
    this.clampPan()
  }

  private onPointerUp(e: PointerEvent) {
    this.dragging = false
    try {
      ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
    } catch {
      /* ignore */
    }
  }

  private onWheel(e: WheelEvent) {
    if (this.disabled) return
    e.preventDefault()
    this.setZoom(this.zoom + (e.deltaY > 0 ? -0.12 : 0.12))
  }

  private onKeyDown(e: KeyboardEvent) {
    if (this.disabled) return
    const step = 8
    if (e.key === 'ArrowLeft') {
      this.panX -= step
      this.clampPan()
    } else if (e.key === 'ArrowRight') {
      this.panX += step
      this.clampPan()
    } else if (e.key === 'ArrowUp') {
      this.panY -= step
      this.clampPan()
    } else if (e.key === 'ArrowDown') {
      this.panY += step
      this.clampPan()
    } else if (e.key === '+' || e.key === '=') {
      this.setZoom(this.zoom + 0.2)
    } else if (e.key === '-' || e.key === '_') {
      this.setZoom(this.zoom - 0.2)
    }
  }

  private onImageLoad(e: Event) {
    const img = e.currentTarget as HTMLImageElement
    this.naturalW = img.naturalWidth
    this.naturalH = img.naturalHeight
    this.panX = 0
    this.panY = 0
    this.clampPan()
    this.requestUpdate()
  }

  render() {
    const viewport = this.renderRoot.querySelector('[part=viewport]') as HTMLElement | null
    let imgStyle = 'transform: translate(-50%, -50%);'
    if (viewport && this.naturalW) {
      const scale = coverScale(viewport.clientWidth, viewport.clientHeight, this.naturalW, this.naturalH) * this.zoom
      imgStyle = `width: ${this.naturalW * scale}px; height: ${this.naturalH * scale}px; transform: translate(calc(-50% + ${this.panX}px), calc(-50% + ${this.panY}px));`
    }

    return html`
      <div part="base" class="flex w-full max-w-md flex-col gap-3">
        <div
          part="viewport"
          data-slot="image-cropper-viewport"
          role="application"
          aria-label="Image crop viewport"
          tabindex="0"
          data-disabled=${this.disabled ? '' : nothing}
          class=${cn(
            'bg-muted relative w-full overflow-hidden select-none',
            this.rounded === 'full' ? 'rounded-full' : 'rounded-lg',
            this.disabled ? 'pointer-events-none opacity-60' : 'cursor-grab active:cursor-grabbing',
          )}
          style="aspect-ratio: ${this.aspectRatio};"
          @pointerdown=${this.onPointerDown}
          @pointermove=${this.onPointerMove}
          @pointerup=${this.onPointerUp}
          @wheel=${this.onWheel}
          @keydown=${this.onKeyDown}
        >
          <img
            data-slot="image-cropper-image"
            src=${this.src}
            alt=${this.alt}
            draggable="false"
            class="pointer-events-none absolute top-1/2 left-1/2 max-w-none"
            style=${imgStyle}
            @load=${this.onImageLoad}
          />
        </div>

        ${this.showZoom
          ? html`
              <label
                data-slot="image-cropper-zoom"
                class="text-muted-foreground flex items-center gap-3 text-xs"
              >
                <span class="w-10">Zoom</span>
                <input
                  type="range"
                  min=${this.minZoom}
                  max=${this.maxZoom}
                  step="0.05"
                  .value=${String(this.zoom)}
                  class="accent-primary h-1.5 w-full cursor-pointer"
                  aria-label="Zoom"
                  @input=${(e: Event) => this.setZoom(Number((e.target as HTMLInputElement).value))}
                />
                <span class="w-10 tabular-nums">${this.zoom.toFixed(1)}×</span>
              </label>
            `
          : nothing}
      </div>
    `
  }
}

customElements.get('uip-image-cropper') || customElements.define('uip-image-cropper', UipImageCropper)

declare global {
  interface HTMLElementTagNameMap {
    'uip-image-cropper': UipImageCropper
  }
}

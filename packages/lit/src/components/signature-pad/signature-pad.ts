import { LitElement, css, html, nothing } from 'lit'
import { Eraser } from 'lucide'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { icon } from '../../lib/icon'
import { signaturePadVariants } from './signature-pad.variants'

function resolveColor(input: string | undefined, cssVar: string): string {
  let candidate = (input || '').trim()
  if (!candidate) candidate = `var(${cssVar})`
  const hslWrapped = candidate.match(/^hsl\(\s*(var\(--[^)]+\))\s*\)$/i)
  if (hslWrapped) candidate = hslWrapped[1]!
  if (candidate.startsWith('var(')) {
    const name = candidate.match(/var\((--[^),]+)/)?.[1]
    if (name && typeof document !== 'undefined') {
      const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
      if (v) return v
    }
  }
  return candidate
}

const trueUnlessFalse = {
  fromAttribute: (v: string | null) => v !== 'false',
}

/**
 * <uip-signature-pad> — the registry SignaturePad as a web component.
 *
 * Form-associated: submits `name=dataURL` with its <form>.
 */
export class UipSignaturePad extends LitElement {
  static formAssociated = true
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true }
  static styles = [tailwind, css`:host { display: inline-block; vertical-align: middle; }`]

  static properties = {
    value: { reflect: true },
    width: { type: Number },
    height: { type: Number },
    penColor: { attribute: 'pen-color' },
    penThickness: { type: Number, attribute: 'pen-thickness' },
    backgroundColor: { attribute: 'background-color' },
    exportFormat: { attribute: 'export-format' },
    disabled: { type: Boolean, reflect: true },
    readOnly: { type: Boolean, attribute: 'readonly', reflect: true },
    showClearButton: { converter: trueUnlessFalse, attribute: 'show-clear-button' },
    clearLabel: { attribute: 'clear-label' },
    name: { reflect: true },
    pointCount: { state: true },
    hasInk: { state: true },
  }

  value: string | null = null
  width = 400
  height = 200
  penColor = ''
  penThickness = 2
  backgroundColor = ''
  exportFormat = 'image/png'
  disabled = false
  readOnly = false
  showClearButton = true
  clearLabel = 'Clear'
  name?: string

  pointCount = 0
  hasInk = false

  private ctx: CanvasRenderingContext2D | null = null
  private isDrawing = false
  private lastPos = { x: 0, y: 0 }
  private internals = this.attachInternals()

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'signature-pad')
  }

  firstUpdated() {
    this.setupCanvas()
  }

  updated(changed: Map<string, unknown>) {
    if (
      changed.has('width') ||
      changed.has('height') ||
      changed.has('penColor') ||
      changed.has('penThickness') ||
      changed.has('backgroundColor')
    ) {
      this.setupCanvas()
    }
  }

  private get canvas(): HTMLCanvasElement | null {
    return this.renderRoot?.querySelector('canvas')
  }

  get isEmpty(): boolean {
    return !this.hasInk
  }

  private setupCanvas() {
    const canvas = this.canvas
    if (!canvas) return
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
    canvas.width = this.width * dpr
    canvas.height = this.height * dpr
    canvas.style.width = `${this.width}px`
    canvas.style.height = `${this.height}px`
    const context = canvas.getContext('2d')
    if (!context) return
    context.scale(dpr, dpr)
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.strokeStyle = resolveColor(this.penColor, '--foreground')
    context.lineWidth = this.penThickness
    context.fillStyle = resolveColor(this.backgroundColor, '--background')
    context.fillRect(0, 0, this.width, this.height)
    this.ctx = context
    this.pointCount = 0
    this.hasInk = false
  }

  formResetCallback() {
    this.clear()
  }

  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled
  }

  clear = () => {
    const canvas = this.canvas
    const context = this.ctx
    if (!canvas || !context) return
    context.fillStyle = resolveColor(this.backgroundColor, '--background')
    context.fillRect(0, 0, this.width, this.height)
    this.pointCount = 0
    this.hasInk = false
    this.value = null
    this.internals.setFormValue(null)
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
    this.dispatchEvent(new CustomEvent('value-change', { detail: { value: null }, bubbles: true, composed: true }))
  }

  exportSignature = (): string | null => {
    const canvas = this.canvas
    if (!canvas) return null
    if (!this.hasInk) {
      this.value = null
      this.internals.setFormValue(null)
      this.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
      this.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
      this.dispatchEvent(new CustomEvent('value-change', { detail: { value: null }, bubbles: true, composed: true }))
      return null
    }
    const dataUrl = canvas.toDataURL(this.exportFormat)
    this.value = dataUrl
    this.internals.setFormValue(dataUrl)
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
    this.dispatchEvent(new CustomEvent('value-change', { detail: { value: dataUrl }, bubbles: true, composed: true }))
    return dataUrl
  }

  toDataURL = (): string | null => {
    return this.exportSignature()
  }

  private getPointerPos(e: PointerEvent) {
    const canvas = this.canvas
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    const scaleX = this.width / (rect.width || this.width)
    const scaleY = this.height / (rect.height || this.height)
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    }
  }

  private handlePointerDown = (e: PointerEvent) => {
    if (this.disabled || this.readOnly || !this.ctx) return
    e.preventDefault()
    this.isDrawing = true
    const { x, y } = this.getPointerPos(e)
    this.lastPos = { x, y }
    this.ctx.beginPath()
    this.ctx.moveTo(x, y)
    this.pointCount++
    this.hasInk = true
    this.dispatchEvent(new CustomEvent('begin', { bubbles: true, composed: true }))
    this.canvas?.setPointerCapture(e.pointerId)
  }

  private handlePointerMove = (e: PointerEvent) => {
    if (!this.isDrawing || !this.ctx) return
    e.preventDefault()
    const { x, y } = this.getPointerPos(e)
    this.ctx.beginPath()
    this.ctx.moveTo(this.lastPos.x, this.lastPos.y)
    this.ctx.lineTo(x, y)
    this.ctx.stroke()
    this.lastPos = { x, y }
    this.pointCount++
  }

  private handlePointerUp = (e: PointerEvent) => {
    if (!this.isDrawing) return
    this.isDrawing = false
    this.ctx?.closePath()
    if (this.canvas?.hasPointerCapture(e.pointerId)) {
      this.canvas.releasePointerCapture(e.pointerId)
    }
    this.exportSignature()
    this.dispatchEvent(new CustomEvent('end', { bubbles: true, composed: true }))
  }

  render() {
    const isInteractive = !this.disabled && !this.readOnly

    return html`
      <div
        part="base"
        data-uipkge=""
        data-slot="signature-pad"
        ?data-disabled=${this.disabled}
        ?data-readonly=${this.readOnly}
        class=${signaturePadVariants()}
      >
        <canvas
          part="canvas"
          class=${cn('block touch-none rounded-md', !isInteractive && 'pointer-events-none')}
          style="touch-action: none;"
          aria-label=${`Signature pad${this.disabled ? ' (disabled)' : this.readOnly ? ' (readonly)' : ''}`}
          aria-disabled=${this.disabled ? 'true' : 'false'}
          role="img"
          @pointerdown=${this.handlePointerDown}
          @pointermove=${this.handlePointerMove}
          @pointerup=${this.handlePointerUp}
          @pointercancel=${this.handlePointerUp}
          @pointerleave=${this.handlePointerUp}
        ></canvas>

        ${this.showClearButton && isInteractive
          ? html`
              <div part="footer" class="flex items-center justify-between gap-2 pt-2">
                <span class="text-muted-foreground text-xs tabular-nums">${this.pointCount} points</span>
                <button
                  type="button"
                  part="clear-button"
                  class="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex items-center gap-1 rounded-md text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                  ?disabled=${!this.hasInk}
                  @click=${this.clear}
                >
                  ${icon(Eraser, 'eraser', 'size-4')}
                  ${this.clearLabel}
                </button>
              </div>
            `
          : nothing}

        <slot name="actions"></slot>
      </div>
    `
  }
}

customElements.get('uip-signature-pad') || customElements.define('uip-signature-pad', UipSignaturePad)

declare global {
  interface HTMLElementTagNameMap {
    'uip-signature-pad': UipSignaturePad
  }
}

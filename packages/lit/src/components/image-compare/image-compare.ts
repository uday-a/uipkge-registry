import { LitElement, css, html, nothing } from 'lit'
import { MoveHorizontal, MoveVertical } from 'lucide'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { icon } from '../../lib/icon'
import { imageCompareVariants, type ImageCompareVariants } from './image-compare.variants'

type Orientation = NonNullable<ImageCompareVariants['orientation']>

function clamp(v: number): number {
  return Math.min(100, Math.max(0, v))
}

const trueByDefault = {
  fromAttribute: (v: string | null) => v !== 'false' && v !== null,
  toAttribute: (v: boolean) => (v ? '' : 'false'),
}

/**
 * <uip-image-compare> — interactive before/after image comparison slider.
 */
export class UipImageCompare extends LitElement {
  static styles = [
    tailwind,
    css`
      :host {
        display: block;
        position: relative;
        width: 100%;
      }
    `,
  ]

  static properties = {
    beforeSrc: { attribute: 'before-src', reflect: true },
    afterSrc: { attribute: 'after-src', reflect: true },
    beforeAlt: { attribute: 'before-alt', reflect: true },
    afterAlt: { attribute: 'after-alt', reflect: true },
    beforeLabel: { attribute: 'before-label', reflect: true },
    afterLabel: { attribute: 'after-label', reflect: true },
    value: { type: Number, reflect: true },
    defaultValue: { type: Number, attribute: 'default-value', reflect: true },
    orientation: { reflect: true },
    disabled: { type: Boolean, reflect: true },
    showLabels: { attribute: 'show-labels', converter: trueByDefault },
    showHandle: { attribute: 'show-handle', converter: trueByDefault },
    position: { state: true },
  }

  beforeSrc = ''
  afterSrc = ''
  beforeAlt = 'Before'
  afterAlt = 'After'
  beforeLabel = 'Before'
  afterLabel = 'After'
  value?: number
  defaultValue = 50
  orientation: Orientation = 'horizontal'
  disabled = false
  showLabels = true
  showHandle = true

  private position = 50
  private dragging = false

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'image-compare')
    this.position = this.value !== undefined ? this.value : this.defaultValue
  }

  willUpdate(changedProps: Map<string, unknown>) {
    if (changedProps.has('value') && this.value !== undefined) {
      this.position = clamp(this.value)
    }
    this.setAttribute('data-orientation', this.orientation)
    if (this.disabled) {
      this.setAttribute('data-disabled', '')
    } else {
      this.removeAttribute('data-disabled')
    }
  }

  private setPosition(next: number) {
    const clamped = clamp(next)
    this.position = clamped
    this.value = clamped
    this.dispatchEvent(new CustomEvent('value-change', { detail: { value: clamped }, bubbles: true, composed: true }))
    this.dispatchEvent(new CustomEvent('change', { detail: { value: clamped }, bubbles: true, composed: true }))
  }

  private updateFromPointer(clientX: number, clientY: number) {
    const container = this.renderRoot.querySelector<HTMLElement>('[part=base]')
    if (!container) return
    const rect = container.getBoundingClientRect()
    if (this.orientation === 'horizontal') {
      this.setPosition(((clientX - rect.left) / rect.width) * 100)
    } else {
      this.setPosition(((clientY - rect.top) / rect.height) * 100)
    }
  }

  private onPointerDown(e: PointerEvent) {
    if (this.disabled) return
    this.dragging = true
    const el = e.currentTarget as HTMLElement
    try {
      el.setPointerCapture(e.pointerId)
    } catch {
      // ignore pointer capture errors
    }
    this.updateFromPointer(e.clientX, e.clientY)
  }

  private onPointerMove(e: PointerEvent) {
    if (!this.dragging || this.disabled) return
    this.updateFromPointer(e.clientX, e.clientY)
  }

  private onPointerUp(e: PointerEvent) {
    if (!this.dragging) return
    this.dragging = false
    const el = e.currentTarget as HTMLElement
    try {
      el.releasePointerCapture(e.pointerId)
    } catch {
      // ignore
    }
  }

  private onKeyDown(e: KeyboardEvent) {
    if (this.disabled) return
    const isH = this.orientation === 'horizontal'
    const step = e.shiftKey ? 10 : 1
    let next = this.position
    if (isH) {
      if (e.key === 'ArrowLeft') next -= step
      else if (e.key === 'ArrowRight') next += step
      else return
    } else {
      if (e.key === 'ArrowUp') next -= step
      else if (e.key === 'ArrowDown') next += step
      else return
    }
    e.preventDefault()
    this.setPosition(next)
  }

  render() {
    const pct = this.position
    const orientation = this.orientation
    const clipStyle =
      orientation === 'horizontal' ? `clip-path: inset(0 0 0 ${pct}%);` : `clip-path: inset(${pct}% 0 0 0);`
    const dividerStyle = orientation === 'horizontal' ? `left: ${pct}%;` : `top: ${pct}%;`

    return html`
      <div
        part="base"
        data-slot="image-compare"
        data-orientation=${orientation}
        data-disabled=${this.disabled ? '' : nothing}
        class=${cn(imageCompareVariants({ orientation }))}
        style="touch-action: none;"
        @pointerdown=${this.onPointerDown}
        @pointermove=${this.onPointerMove}
        @pointerup=${this.onPointerUp}
        @pointercancel=${this.onPointerUp}
      >
        <!-- Before image -->
        <img
          src=${this.beforeSrc}
          alt=${this.beforeAlt}
          class="pointer-events-none absolute inset-0 size-full object-cover select-none"
          draggable="false"
        />
        ${this.showLabels
          ? html`
              <span
                class="bg-background/80 text-foreground absolute bottom-2 left-2 rounded px-2 py-0.5 text-xs font-medium backdrop-blur-sm"
              >
                ${this.beforeLabel}
              </span>
            `
          : nothing}

        <!-- After image (clipped overlay) -->
        <div class="absolute inset-0 size-full" style=${clipStyle}>
          <img
            src=${this.afterSrc}
            alt=${this.afterAlt}
            class="pointer-events-none absolute inset-0 size-full object-cover select-none"
            draggable="false"
          />
          ${this.showLabels
            ? html`
                <span
                  class="bg-background/80 text-foreground absolute right-2 bottom-2 rounded px-2 py-0.5 text-xs font-medium backdrop-blur-sm"
                >
                  ${this.afterLabel}
                </span>
              `
            : nothing}
        </div>

        <!-- Divider + handle -->
        ${!this.disabled
          ? html`
              <div
                class=${cn(
                  'bg-border absolute z-10',
                  orientation === 'horizontal' ? 'top-0 h-full w-0.5' : 'left-0 h-0.5 w-full',
                )}
                style=${dividerStyle}
              >
                ${this.showHandle
                  ? html`
                      <button
                        type="button"
                        role="slider"
                        aria-valuenow=${Math.round(pct)}
                        aria-valuemin="0"
                        aria-valuemax="100"
                        aria-label=${`Image comparison slider, ${Math.round(pct)} percent`}
                        aria-orientation=${orientation === 'vertical' ? 'vertical' : 'horizontal'}
                        tabindex="0"
                        class=${cn(
                          'bg-background border-border focus-visible:ring-ring absolute flex size-9 cursor-ew-resize items-center justify-center rounded-full border shadow-md transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:outline-none',
                          'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
                          orientation === 'vertical' && 'cursor-ns-resize',
                        )}
                        @keydown=${this.onKeyDown}
                        @pointerdown=${(e: PointerEvent) => {
                          e.stopPropagation()
                          this.onPointerDown(e)
                        }}
                      >
                        <slot name="handle">
                          ${orientation === 'horizontal'
                            ? icon(MoveHorizontal, 'move-horizontal', 'text-foreground size-4')
                            : icon(MoveVertical, 'move-vertical', 'text-foreground size-4')}
                        </slot>
                      </button>
                    `
                  : nothing}
              </div>
            `
          : nothing}

        ${this.disabled ? html`<div class="bg-background/40 absolute inset-0"></div>` : nothing}
      </div>
    `
  }
}

customElements.get('uip-image-compare') || customElements.define('uip-image-compare', UipImageCompare)

declare global {
  interface HTMLElementTagNameMap {
    'uip-image-compare': UipImageCompare
  }
}

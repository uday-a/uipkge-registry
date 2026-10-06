import { LitElement, css, html, nothing, type TemplateResult } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import type { IconNode } from 'lucide'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { icon } from '../../lib/icon'

export interface DockItem {
  id: string
  label: string
  icon?: IconNode | string
  handler?: () => void
  active?: boolean
}

const trueByDefault = { fromAttribute: (v: string | null) => v !== 'false', toAttribute: () => null }

/**
 * <uip-dock> — macOS style desktop app dock with cursor magnification.
 */
export class UipDock extends LitElement {
  static styles = [tailwind, css`:host { display: inline-block; }`]

  static properties = {
    items: { type: Array },
    baseSize: { type: Number, attribute: 'base-size' },
    magnification: { type: Number },
    distance: { type: Number },
    orientation: { type: String },
    showTooltips: { attribute: 'show-tooltips', converter: trueByDefault },
    mouseX: { state: true },
    hoveredId: { state: true },
  }

  items: DockItem[] = []
  baseSize = 48
  magnification = 1.6
  distance = 120
  orientation: 'horizontal' | 'vertical' = 'horizontal'
  showTooltips = true

  private mouseX: number | null = null
  private hoveredId: string | null = null

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'dock')
    this.setAttribute('data-orientation', this.orientation)
  }

  private onMouseMove(e: MouseEvent) {
    this.mouseX = e.clientX
  }

  private onMouseLeave() {
    this.mouseX = null
    this.hoveredId = null
  }

  private calculateSize(index: number): number {
    if (this.mouseX === null) return this.baseSize
    const itemsEls = this.renderRoot?.querySelectorAll<HTMLElement>('[data-slot="dock-item"]')
    const el = itemsEls?.[index]
    if (!el) return this.baseSize
    const rect = el.getBoundingClientRect()
    const center = rect.left + rect.width / 2
    const dist = Math.abs(this.mouseX - center)
    if (dist > this.distance) return this.baseSize
    const t = 1 - dist / this.distance
    const scale = 1 + (this.magnification - 1) * t
    return this.baseSize * scale
  }

  private handleItemClick(item: DockItem) {
    item.handler?.()
    this.dispatchEvent(new CustomEvent('item-click', { detail: { item, id: item.id }, bubbles: true, composed: true }))
    this.requestUpdate()
  }

  private renderIcon(itemIcon?: IconNode | string, size = 48): TemplateResult | typeof nothing {
    if (!itemIcon) return nothing
    const s = `${size * 0.5}px`
    if (Array.isArray(itemIcon)) {
      return html`<span class="inline-flex items-center justify-center [&_svg]:size-full" style="width: ${s}; height: ${s};">${icon(itemIcon as IconNode, 'dock-icon')}</span>`
    }
    if (typeof itemIcon === 'string') {
      return html`<span style="width: ${s}; height: ${s};" .innerHTML=${itemIcon}></span>`
    }
    return nothing
  }

  render() {
    return html`
      <div
        part="base"
        data-uipkge=""
        data-slot="dock"
        data-orientation=${this.orientation}
        class="border-border/60 bg-background/60 flex items-end justify-center gap-3 rounded-2xl border px-3 py-2 backdrop-blur-md"
        @mousemove=${this.onMouseMove}
        @mouseleave=${this.onMouseLeave}
      >
        ${this.items.map((item, index) => {
          const size = this.calculateSize(index)
          return html`
            <div
              data-slot="dock-item"
              ?data-active=${item.active}
              role="button"
              tabindex="0"
              aria-label=${item.label}
              aria-current=${item.active ? 'true' : nothing}
              class="group focus-visible:ring-ring/50 relative flex shrink-0 cursor-pointer items-end justify-center rounded-xl outline-none focus-visible:ring-[3px]"
              @mouseenter=${() => (this.hoveredId = item.id)}
              @mouseleave=${() => (this.hoveredId = null)}
              @click=${() => this.handleItemClick(item)}
              @keydown=${(e: KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  this.handleItemClick(item)
                }
              }}
            >
              ${this.showTooltips && this.hoveredId === item.id
                ? html`
                    <span
                      part="tooltip"
                      class="border-border bg-popover text-popover-foreground pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 rounded-md border px-2 py-1 text-xs whitespace-nowrap shadow-md"
                    >
                      ${item.label}
                    </span>
                  `
                : nothing}

              <span
                part="tile"
                class=${cn(
                  'flex items-center justify-center rounded-xl border transition-[width,height] duration-100 ease-out will-change-[width,height]',
                  item.active
                    ? 'border-primary/40 bg-primary/10 text-primary'
                    : 'border-border/50 bg-muted/40 text-foreground hover:bg-muted',
                )}
                style=${styleMap({ width: `${size}px`, height: `${size}px` })}
              >
                ${this.renderIcon(item.icon, size)}
              </span>

              ${item.active
                ? html`<span
                    class="bg-primary absolute -bottom-2 size-1 rounded-full"
                    aria-hidden="true"
                  ></span>`
                : nothing}
            </div>
          `
        })}
      </div>
    `
  }
}

customElements.get('uip-dock') || customElements.define('uip-dock', UipDock)

declare global {
  interface HTMLElementTagNameMap {
    'uip-dock': UipDock
  }
}

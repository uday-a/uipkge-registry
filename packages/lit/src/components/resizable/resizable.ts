import { LitElement, css, html, nothing } from 'lit'
import { GripVertical } from 'lucide'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { icon } from '../../lib/icon'

export type ResizableDirection = 'horizontal' | 'vertical'

/**
 * <uip-resizable-panel> — Individual resizable panel.
 */
export class UipResizablePanel extends LitElement {
  static styles = [tailwind, css`:host { display: block; overflow: hidden; min-width: 0; min-height: 0; }`]

  static properties = {
    defaultSize: { type: Number, attribute: 'default-size' },
    minSize: { type: Number, attribute: 'min-size' },
    maxSize: { type: Number, attribute: 'max-size' },
    size: { type: Number },
  }

  defaultSize = 50
  minSize = 0
  maxSize = 100
  size = 50

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'resizable-panel')
    if (this.defaultSize !== undefined) {
      this.size = this.defaultSize
    }
    this.applySize()
  }

  applySize() {
    this.style.flex = `${this.size} 1 0px`
  }

  setSize(newSize: number) {
    const clamped = Math.min(this.maxSize, Math.max(this.minSize, newSize))
    this.size = clamped
    this.applySize()
  }

  render() {
    return html`<slot></slot>`
  }
}

/**
 * <uip-resizable-handle> — Draggable separator handle between panels.
 */
export class UipResizableHandle extends LitElement {
  static styles = [
    tailwind,
    css`
      :host {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        touch-action: none;
        user-select: none;
        -webkit-user-select: none;
      }
      :host([data-panel-group-direction="horizontal"]) {
        cursor: col-resize;
        width: 1px;
      }
      :host([data-panel-group-direction="vertical"]) {
        cursor: row-resize;
        height: 1px;
        width: 100%;
      }
    `,
  ]

  static properties = {
    withHandle: { type: Boolean, attribute: 'with-handle' },
  }

  withHandle = false

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'resizable-handle')
    this.setAttribute('tabindex', '0')
    this.setAttribute('role', 'separator')
    this.addEventListener('pointerdown', this.onPointerDown.bind(this))
  }

  private onPointerDown(e: PointerEvent) {
    if (e.button !== 0) return
    e.preventDefault()
    const group = this.closest('uip-resizable-panel-group') as UipResizablePanelGroup | null
    if (!group) return

    const prevPanel = this.previousElementSibling as UipResizablePanel | null
    const nextPanel = this.nextElementSibling as UipResizablePanel | null
    if (!prevPanel || !nextPanel || !(prevPanel instanceof UipResizablePanel) || !(nextPanel instanceof UipResizablePanel)) {
      return
    }

    this.setPointerCapture(e.pointerId)
    const direction = group.direction
    const startX = e.clientX
    const startY = e.clientY
    const startPrevSize = prevPanel.size
    const startNextSize = nextPanel.size
    const totalSize = startPrevSize + startNextSize

    const groupRect = group.getBoundingClientRect()
    const groupPixels = direction === 'horizontal' ? groupRect.width : groupRect.height

    const onPointerMove = (moveEv: PointerEvent) => {
      const deltaPx = direction === 'horizontal' ? moveEv.clientX - startX : moveEv.clientY - startY
      const deltaPercent = (deltaPx / groupPixels) * 100

      let newPrev = startPrevSize + deltaPercent
      let newNext = startNextSize - deltaPercent

      if (newPrev < prevPanel.minSize) {
        newPrev = prevPanel.minSize
        newNext = totalSize - newPrev
      } else if (newPrev > prevPanel.maxSize) {
        newPrev = prevPanel.maxSize
        newNext = totalSize - newPrev
      }

      if (newNext < nextPanel.minSize) {
        newNext = nextPanel.minSize
        newPrev = totalSize - newNext
      } else if (newNext > nextPanel.maxSize) {
        newNext = nextPanel.maxSize
        newPrev = totalSize - newNext
      }

      prevPanel.setSize(newPrev)
      nextPanel.setSize(newNext)
    }

    const onPointerUp = (upEv: PointerEvent) => {
      try {
        this.releasePointerCapture(upEv.pointerId)
      } catch {
        // ignore
      }
      this.removeEventListener('pointermove', onPointerMove)
      this.removeEventListener('pointerup', onPointerUp)
      this.removeEventListener('pointercancel', onPointerUp)
    }

    this.addEventListener('pointermove', onPointerMove)
    this.addEventListener('pointerup', onPointerUp)
    this.addEventListener('pointercancel', onPointerUp)
  }

  render() {
    const group = this.closest('uip-resizable-panel-group') as UipResizablePanelGroup | null
    const dir = group?.direction ?? 'horizontal'
    this.setAttribute('data-panel-group-direction', dir)

    return html`
      <div
        part="handle"
        data-uipkge=""
        data-slot="resizable-handle"
        data-panel-group-direction=${dir}
        class=${cn(
          'bg-border focus-visible:ring-ring relative flex items-center justify-center focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-hidden',
          dir === 'horizontal'
            ? 'w-px h-full after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2'
            : 'h-px w-full after:absolute after:inset-x-0 after:top-1/2 after:h-1 after:-translate-y-1/2 [&>div]:rotate-90',
        )}
      >
        ${this.withHandle
          ? html`
              <div class="bg-border z-10 flex h-4 w-3 items-center justify-center rounded-xs border">
                <slot>${icon(GripVertical, 'grip-vertical', 'size-2.5')}</slot>
              </div>
            `
          : nothing}
      </div>
    `
  }
}

/**
 * <uip-resizable-panel-group> — Container for resizable panels.
 */
export class UipResizablePanelGroup extends LitElement {
  static styles = [tailwind, css`:host { display: block; width: 100%; height: 100%; }`]

  static properties = {
    direction: { type: String, reflect: true },
  }

  direction: ResizableDirection = 'horizontal'

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'resizable-panel-group')
    this.setAttribute('data-panel-group-direction', this.direction)
  }

  protected updated(changed: Map<string, unknown>) {
    if (changed.has('direction')) {
      this.setAttribute('data-panel-group-direction', this.direction)
      const handles = this.querySelectorAll('uip-resizable-handle')
      handles.forEach((h) => h.setAttribute('data-panel-group-direction', this.direction))
    }
  }

  render() {
    return html`
      <div
        part="base"
        data-uipkge=""
        data-slot="resizable-panel-group"
        data-panel-group-direction=${this.direction}
        class=${cn(
          'flex h-full w-full',
          this.direction === 'vertical' ? 'flex-col' : 'flex-row',
        )}
      >
        <slot></slot>
      </div>
    `
  }
}

customElements.get('uip-resizable-panel') || customElements.define('uip-resizable-panel', UipResizablePanel)
customElements.get('uip-resizable-handle') || customElements.define('uip-resizable-handle', UipResizableHandle)
customElements.get('uip-resizable-panel-group') || customElements.define('uip-resizable-panel-group', UipResizablePanelGroup)

declare global {
  interface HTMLElementTagNameMap {
    'uip-resizable-panel': UipResizablePanel
    'uip-resizable-handle': UipResizableHandle
    'uip-resizable-panel-group': UipResizablePanelGroup
  }
}

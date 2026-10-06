import { LitElement, css, html, type PropertyValues } from 'lit'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'

export type VirtualListDirection = 'vertical' | 'horizontal'
export type ItemSizeFn<T = any> = (item: T, index: number) => number

export interface VirtualListHandle {
  scrollToOffset: (px: number) => void
  scrollToIndex: (index: number, options?: { align?: 'start' | 'center' | 'end' }) => void
  getVisibleRange: () => [number, number]
}

/**
 * <uip-virtual-list> — Virtualized list rendering only items inside the current viewport plus overscan.
 */
export class UipVirtualList extends LitElement {
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
    items: { type: Array },
    itemSize: { attribute: 'item-size' },
    height: { type: String },
    overscan: { type: Number },
    keyField: { type: String, attribute: 'key-field' },
    direction: { type: String },
    renderItem: { attribute: false },
    scrollTopPos: { state: true },
    scrollLeftPos: { state: true },
  }

  items: any[] = []
  itemSize: number | ItemSizeFn = 40
  height: number | string = 400
  overscan = 3
  keyField = 'id'
  direction: VirtualListDirection = 'vertical'
  renderItem?: (item: any, index: number) => unknown

  private scrollTopPos = 0
  private scrollLeftPos = 0
  private lastRange: [number, number] = [0, 0]

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'virtual-list')
  }

  scrollToOffset(px: number) {
    const scroller = this.renderRoot.querySelector('[part=scroller]') as HTMLElement | null
    if (scroller) {
      if (this.direction === 'vertical') {
        scroller.scrollTop = px
      } else {
        scroller.scrollLeft = px
      }
    }
  }

  scrollToIndex(index: number, options?: { align?: 'start' | 'center' | 'end' }) {
    if (index < 0 || index >= this.items.length) return
    const scroller = this.renderRoot.querySelector('[part=scroller]') as HTMLElement | null
    if (!scroller) return

    const align = options?.align ?? 'start'
    const isVertical = this.direction === 'vertical'
    const viewportSize = isVertical ? scroller.clientHeight : scroller.clientWidth

    let offset = 0
    let size = typeof this.itemSize === 'function' ? this.itemSize(this.items[index], index) : Number(this.itemSize)
    if (typeof this.itemSize === 'function') {
      for (let i = 0; i < index; i++) {
        offset += this.itemSize(this.items[i], i)
      }
    } else {
      offset = index * Number(this.itemSize)
    }

    let targetScroll = offset
    if (align === 'center') {
      targetScroll = Math.max(0, offset - viewportSize / 2 + size / 2)
    } else if (align === 'end') {
      targetScroll = Math.max(0, offset - viewportSize + size)
    }

    if (isVertical) {
      scroller.scrollTop = targetScroll
    } else {
      scroller.scrollLeft = targetScroll
    }
  }

  getVisibleRange(): [number, number] {
    return this.lastRange
  }

  private onScroll(e: Event) {
    const el = e.currentTarget as HTMLElement
    this.scrollTopPos = el.scrollTop
    this.scrollLeftPos = el.scrollLeft
  }

  render() {
    const isVertical = this.direction === 'vertical'
    const numericHeight = typeof this.height === 'number' ? `${this.height}px` : this.height
    const scrollerStyle = isVertical
      ? `height: ${numericHeight}; overflow-y: auto;`
      : `width: ${numericHeight}; height: 100%; overflow-x: auto;`

    const count = this.items.length
    const getItemSize = (i: number) =>
      typeof this.itemSize === 'function' ? this.itemSize(this.items[i], i) : Number(this.itemSize) || 40

    // Compute offsets
    const offsets: number[] = new Array(count)
    const sizes: number[] = new Array(count)
    let totalSize = 0
    for (let i = 0; i < count; i++) {
      offsets[i] = totalSize
      const s = getItemSize(i)
      sizes[i] = s
      totalSize += s
    }

    // Determine visible slice
    const scrollPos = isVertical ? this.scrollTopPos : this.scrollLeftPos
    const viewSize = typeof this.height === 'number' ? this.height : Number.parseInt(String(this.height), 10) || 400

    let startIndex = 0
    while (startIndex < count && offsets[startIndex] + sizes[startIndex] < scrollPos) {
      startIndex++
    }
    startIndex = Math.max(0, startIndex - this.overscan)

    let endIndex = startIndex
    while (endIndex < count && offsets[endIndex] < scrollPos + viewSize) {
      endIndex++
    }
    endIndex = Math.min(count, endIndex + this.overscan)

    if (this.lastRange[0] !== startIndex || this.lastRange[1] !== endIndex) {
      this.lastRange = [startIndex, endIndex]
      this.dispatchEvent(
        new CustomEvent('range-change', {
          detail: { range: [startIndex, endIndex] },
          bubbles: true,
          composed: true,
        }),
      )
    }

    const visibleItems = []
    for (let i = startIndex; i < endIndex; i++) {
      const item = this.items[i]
      const key = item?.[this.keyField] ?? i
      const itemStart = offsets[i]
      const itemSize = sizes[i]

      const itemStyle = isVertical
        ? `position: absolute; top: 0; left: 0; width: 100%; height: ${itemSize}px; transform: translateY(${itemStart}px);`
        : `position: absolute; top: 0; left: 0; height: 100%; width: ${itemSize}px; transform: translateX(${itemStart}px);`

      visibleItems.push(html`
        <div key=${key} style=${itemStyle}>
          ${this.renderItem
            ? this.renderItem(item, i)
            : html`<div class="flex h-full items-center border-b px-4 text-sm">${item?.name ?? String(item)}</div>`}
        </div>
      `)
    }

    const innerStyle = isVertical
      ? `height: ${totalSize}px; position: relative; width: 100%;`
      : `width: ${totalSize}px; position: relative; height: 100%;`

    return html`
      <div
        part="scroller"
        class="w-full"
        style=${scrollerStyle}
        @scroll=${this.onScroll}
      >
        <div part="track" style=${innerStyle}>
          ${visibleItems}
        </div>
      </div>
    `
  }
}

customElements.get('uip-virtual-list') || customElements.define('uip-virtual-list', UipVirtualList)

declare global {
  interface HTMLElementTagNameMap {
    'uip-virtual-list': UipVirtualList
  }
}

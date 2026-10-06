import { LitElement, css, html } from 'lit'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'

type ColIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
export type GridCols = ColIndex | Partial<Record<'base' | 'sm' | 'md' | 'lg' | 'xl', ColIndex>>
export type GridGap = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16

const COLS_BASE: Record<ColIndex, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
  7: 'grid-cols-7',
  8: 'grid-cols-8',
  9: 'grid-cols-9',
  10: 'grid-cols-10',
  11: 'grid-cols-11',
  12: 'grid-cols-12',
}
const COLS_SM: Record<ColIndex, string> = {
  1: 'sm:grid-cols-1',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
  4: 'sm:grid-cols-4',
  5: 'sm:grid-cols-5',
  6: 'sm:grid-cols-6',
  7: 'sm:grid-cols-7',
  8: 'sm:grid-cols-8',
  9: 'sm:grid-cols-9',
  10: 'sm:grid-cols-10',
  11: 'sm:grid-cols-11',
  12: 'sm:grid-cols-12',
}
const COLS_MD: Record<ColIndex, string> = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
  5: 'md:grid-cols-5',
  6: 'md:grid-cols-6',
  7: 'md:grid-cols-7',
  8: 'md:grid-cols-8',
  9: 'md:grid-cols-9',
  10: 'md:grid-cols-10',
  11: 'md:grid-cols-11',
  12: 'md:grid-cols-12',
}
const COLS_LG: Record<ColIndex, string> = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
  6: 'lg:grid-cols-6',
  7: 'lg:grid-cols-7',
  8: 'lg:grid-cols-8',
  9: 'lg:grid-cols-9',
  10: 'lg:grid-cols-10',
  11: 'lg:grid-cols-11',
  12: 'lg:grid-cols-12',
}
const COLS_XL: Record<ColIndex, string> = {
  1: 'xl:grid-cols-1',
  2: 'xl:grid-cols-2',
  3: 'xl:grid-cols-3',
  4: 'xl:grid-cols-4',
  5: 'xl:grid-cols-5',
  6: 'xl:grid-cols-6',
  7: 'xl:grid-cols-7',
  8: 'xl:grid-cols-8',
  9: 'xl:grid-cols-9',
  10: 'xl:grid-cols-10',
  11: 'xl:grid-cols-11',
  12: 'xl:grid-cols-12',
}
const GAP: Record<number, string> = {
  0: 'gap-0',
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  5: 'gap-5',
  6: 'gap-6',
  8: 'gap-8',
  10: 'gap-10',
  12: 'gap-12',
  16: 'gap-16',
}

/**
 * <uip-grid> — responsive CSS grid layout container.
 */
export class UipGrid extends LitElement {
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
    cols: {},
    gap: { type: Number, reflect: true },
  }

  cols: GridCols | string = 1
  gap: GridGap = 4

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'grid')
  }

  private get colsClass(): string {
    let c = this.cols
    if (typeof c === 'string') {
      const num = Number(c)
      if (!Number.isNaN(num) && num >= 1 && num <= 12) {
        return COLS_BASE[num as ColIndex] ?? 'grid-cols-1'
      }
      try {
        c = JSON.parse(c) as GridCols
      } catch {
        return 'grid-cols-1'
      }
    }
    if (typeof c === 'number') {
      return COLS_BASE[c as ColIndex] ?? 'grid-cols-1'
    }
    if (typeof c === 'object' && c !== null) {
      return [
        c.base != null ? COLS_BASE[c.base as ColIndex] : '',
        c.sm != null ? COLS_SM[c.sm as ColIndex] : '',
        c.md != null ? COLS_MD[c.md as ColIndex] : '',
        c.lg != null ? COLS_LG[c.lg as ColIndex] : '',
        c.xl != null ? COLS_XL[c.xl as ColIndex] : '',
      ]
        .filter(Boolean)
        .join(' ')
    }
    return 'grid-cols-1'
  }

  render() {
    const gapClass = GAP[this.gap] ?? 'gap-4'
    return html`
      <div part="base" data-slot="grid" class=${cn('grid', this.colsClass, gapClass)}>
        <slot></slot>
      </div>
    `
  }
}

customElements.get('uip-grid') || customElements.define('uip-grid', UipGrid)

declare global {
  interface HTMLElementTagNameMap {
    'uip-grid': UipGrid
  }
}

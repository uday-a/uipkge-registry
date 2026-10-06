import { LitElement, css, html, isServer, nothing, type TemplateResult } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import type { IconNode } from 'lucide'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { icon } from '../../lib/icon'

export interface BottomNavItem {
  value: string
  label: string
  icon?: IconNode | string
  badge?: string | number
  to?: string
}

const trueByDefault = { fromAttribute: (v: string | null) => v !== 'false', toAttribute: () => null }

/**
 * <uip-bottom-navigation> — Bottom navigation bar with sliding pill indicator.
 */
export class UipBottomNavigation extends LitElement {
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    items: { type: Array },
    value: { reflect: true },
    defaultValue: { attribute: 'default-value' },
    activeColor: { attribute: 'active-color' },
    fixed: { type: Boolean, converter: trueByDefault },
    showIndicator: { attribute: 'show-indicator', converter: trueByDefault },
    safeArea: { attribute: 'safe-area', converter: trueByDefault },
    indicatorStyle: { state: true },
  }

  items: BottomNavItem[] = []
  value = ''
  defaultValue = ''
  activeColor = 'text-primary'
  fixed = true
  showIndicator = true
  safeArea = true

  private indicatorStyle: Record<string, string> = { opacity: '0' }
  private firstPosition = true
  private ro?: ResizeObserver

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'bottom-navigation')
    this.setAttribute('role', 'navigation')
    this.setAttribute('aria-label', 'Bottom navigation')

    if (!this.value && this.defaultValue) {
      this.value = this.defaultValue
    } else if (!this.value && this.items.length > 0) {
      this.value = this.items[0]?.value ?? ''
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.ro?.disconnect()
  }

  protected updated(changed: Map<string, unknown>) {
    if (isServer) return

    if (this.fixed) {
      this.setAttribute('data-fixed', '')
    } else {
      this.removeAttribute('data-fixed')
    }

    if (changed.has('value') || changed.has('items') || changed.has('showIndicator')) {
      if (changed.has('items') || changed.has('showIndicator')) {
        this.firstPosition = true
      }
      this.updateIndicator()
    }

    if (!this.ro && this.renderRoot) {
      const root = this.renderRoot.querySelector('nav')
      if (root) {
        this.ro = new ResizeObserver(() => this.updateIndicator())
        this.ro.observe(root)
      }
    }
  }

  private motionSafeTransition() {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return 'none'
    }
    return this.firstPosition
      ? 'none'
      : 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1), width 220ms cubic-bezier(0.22, 1, 0.36, 1), height 220ms cubic-bezier(0.22, 1, 0.36, 1)'
  }

  private updateIndicator() {
    if (!this.showIndicator || isServer) {
      this.indicatorStyle = { opacity: '0' }
      return
    }

    const root = this.renderRoot?.querySelector('nav')
    if (!root) return

    const activeItem = root.querySelector<HTMLElement>('[data-slot="bottom-navigation-item"][data-active]')
    if (!activeItem) {
      this.indicatorStyle = { opacity: '0' }
      return
    }

    const iconWrap = activeItem.querySelector<HTMLElement>('[data-slot="bottom-navigation-icon"]') ?? activeItem
    const rootRect = root.getBoundingClientRect()
    const iconRect = iconWrap.getBoundingClientRect()

    const padX = 14
    const pillH = 32
    const pillW = Math.max(iconRect.width + padX * 2, 56)
    const left = iconRect.left - rootRect.left + root.scrollLeft + (iconRect.width - pillW) / 2
    const top = iconRect.top - rootRect.top + root.scrollTop + (iconRect.height - pillH) / 2
    const transition = this.motionSafeTransition()

    this.indicatorStyle = {
      width: `${pillW}px`,
      height: `${pillH}px`,
      transform: `translate3d(${left}px, ${top}px, 0)`,
      opacity: '1',
      transition,
    }
    this.firstPosition = false
  }

  private handleSelect(item: BottomNavItem) {
    this.value = item.value
    this.dispatchEvent(new CustomEvent('value-change', { detail: { value: item.value }, bubbles: true, composed: true }))
    this.dispatchEvent(new CustomEvent('select', { detail: { item }, bubbles: true, composed: true }))
  }

  private renderIcon(itemIcon?: IconNode | string, isActive = false): TemplateResult | typeof nothing {
    if (!itemIcon) return nothing
    const iconClass = cn(
      'size-5 transition-[transform,opacity] duration-200 ease-out motion-reduce:transition-none',
      isActive ? 'scale-110' : 'scale-100',
    )
    if (Array.isArray(itemIcon)) {
      return icon(itemIcon as IconNode, 'nav-icon', iconClass)
    }
    if (typeof itemIcon === 'string') {
      return html`<span class=${iconClass} .innerHTML=${itemIcon}></span>`
    }
    return nothing
  }

  render() {
    return html`
      <nav
        part="base"
        data-uipkge=""
        data-slot="bottom-navigation"
        class=${cn(
          'border-border bg-background/95 z-50 flex items-stretch justify-around border-t backdrop-blur-sm',
          this.fixed ? 'fixed inset-x-0 bottom-0' : 'relative',
          this.safeArea && 'pb-[env(safe-area-inset-bottom)]',
        )}
      >
        ${this.showIndicator
          ? html`
              <span
                part="indicator"
                data-slot="bottom-navigation-indicator"
                aria-hidden="true"
                class="bg-primary/10 pointer-events-none absolute top-0 left-0 z-0 rounded-full will-change-transform"
                style=${styleMap(this.indicatorStyle)}
              ></span>
            `
          : nothing}

        ${this.items.map((item) => {
          const isActive = this.value === item.value
          const itemClass = cn(
            'focus-visible:ring-ring/50 relative z-10 flex min-h-12 flex-1 flex-col items-center justify-center gap-0.5 pt-2 pb-1.5 text-xs transition-colors duration-200 outline-none focus-visible:ring-[3px] motion-reduce:transition-none',
            isActive ? this.activeColor : 'text-muted-foreground hover:text-foreground',
          )

          const inner = html`
            <span data-slot="bottom-navigation-icon" class="relative flex items-center justify-center">
              ${this.renderIcon(item.icon, isActive)}
              ${item.badge !== undefined && item.badge !== ''
                ? html`
                    <span
                      class="bg-destructive text-destructive-foreground absolute -top-1.5 -right-2 flex min-w-4 items-center justify-center rounded-full px-1 text-xs leading-4 font-medium"
                    >
                      ${item.badge}
                    </span>
                  `
                : nothing}
            </span>
            <span
              class=${cn(
                'max-w-full truncate px-1 transition-[opacity,font-weight] duration-200 motion-reduce:transition-none',
                isActive ? 'font-medium' : 'font-normal',
              )}
            >
              ${item.label}
            </span>
          `

          if (item.to) {
            return html`
              <a
                href=${item.to}
                part="item"
                data-slot="bottom-navigation-item"
                ?data-active=${isActive}
                aria-current=${isActive ? 'page' : nothing}
                class=${itemClass}
                @click=${(e: MouseEvent) => {
                  this.handleSelect(item)
                }}
              >
                ${inner}
              </a>
            `
          }

          return html`
            <button
              type="button"
              part="item"
              data-slot="bottom-navigation-item"
              ?data-active=${isActive}
              aria-current=${isActive ? 'page' : nothing}
              class=${itemClass}
              @click=${() => this.handleSelect(item)}
            >
              ${inner}
            </button>
          `
        })}
      </nav>
    `
  }
}

customElements.get('uip-bottom-navigation') || customElements.define('uip-bottom-navigation', UipBottomNavigation)

declare global {
  interface HTMLElementTagNameMap {
    'uip-bottom-navigation': UipBottomNavigation
  }
}

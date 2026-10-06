import { LitElement, css, html, nothing } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'

const trueByDefault = { fromAttribute: (v: string | null) => v !== 'false', toAttribute: () => null }

/**
 * <uip-vertical-tabs> — Root container for vertical tabs layout.
 */
export class UipVerticalTabs extends LitElement {
  static styles = [tailwind, css`:host { display: block; width: 100%; }`]

  static properties = {
    value: { reflect: true },
    defaultValue: { attribute: 'default-value' },
  }

  value = ''
  defaultValue = ''

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'vertical-tabs')
    if (!this.value && this.defaultValue) {
      this.value = this.defaultValue
    }
  }

  protected firstUpdated() {
    if (!this.value) {
      const firstTrigger = this.querySelector('uip-vertical-tabs-trigger') as UipVerticalTabsTrigger | null
      if (firstTrigger && firstTrigger.value) {
        this.value = firstTrigger.value
      }
    }
    this.notifyChildren()
  }

  setValue(val: string) {
    if (this.value === val) return
    this.value = val
    this.dispatchEvent(new CustomEvent('value-change', { detail: { value: val }, bubbles: true, composed: true }))
    this.notifyChildren()
  }

  private notifyChildren() {
    const triggers = this.querySelectorAll('uip-vertical-tabs-trigger') as NodeListOf<UipVerticalTabsTrigger>
    triggers.forEach((t) => t.syncActive(this.value))

    const contents = this.querySelectorAll('uip-vertical-tabs-content') as NodeListOf<UipVerticalTabsContent>
    contents.forEach((c) => c.syncActive(this.value))

    const list = this.querySelector('uip-vertical-tabs-list') as UipVerticalTabsList | null
    list?.requestIndicatorUpdate()
  }

  render() {
    return html`
      <div part="base" class="flex w-full gap-6">
        <slot></slot>
      </div>
    `
  }
}

/**
 * <uip-vertical-tabs-list> — Left sidebar list of triggers with sliding indicator.
 */
export class UipVerticalTabsList extends LitElement {
  static styles = [tailwind, css`:host { display: block; flex-shrink: 0; }`]

  static properties = {
    animated: { converter: trueByDefault },
    indicatorStyle: { state: true },
  }

  animated = true
  private indicatorStyle: Record<string, string> = { opacity: '0' }
  private firstPosition = true

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'vertical-tabs-list')
    this.setAttribute('data-animated', this.animated ? 'true' : 'false')
    this.setAttribute('role', 'tablist')
    this.setAttribute('aria-orientation', 'vertical')
  }

  protected updated(changed: Map<string, unknown>) {
    if (changed.has('animated')) {
      this.setAttribute('data-animated', this.animated ? 'true' : 'false')
      this.updateIndicator()
    }
  }

  requestIndicatorUpdate() {
    setTimeout(() => this.updateIndicator(), 0)
  }

  private updateIndicator() {
    if (!this.animated) {
      this.indicatorStyle = { opacity: '0' }
      return
    }

    const activeTrigger = this.querySelector('uip-vertical-tabs-trigger[data-state="active"]') as HTMLElement | null
    if (!activeTrigger) {
      this.indicatorStyle = { opacity: '0' }
      return
    }

    const listRect = this.getBoundingClientRect()
    const activeRect = activeTrigger.getBoundingClientRect()
    const left = activeRect.left - listRect.left
    const top = activeRect.top - listRect.top

    this.indicatorStyle = {
      width: `${activeRect.width}px`,
      height: `${activeRect.height}px`,
      transform: `translate3d(${left}px, ${top}px, 0)`,
      opacity: '1',
      transition: this.firstPosition ? 'none' : 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1), height 220ms cubic-bezier(0.22, 1, 0.36, 1)',
    }
    this.firstPosition = false
  }

  render() {
    return html`
      <div
        part="list"
        class="group/list border-border relative flex w-56 shrink-0 flex-col gap-0.5 border-r pr-3"
      >
        ${this.animated
          ? html`
              <span
                part="indicator"
                data-slot="vertical-tabs-indicator"
                aria-hidden="true"
                class="bg-muted pointer-events-none absolute top-0 left-0 z-0 rounded-md will-change-transform"
                style=${styleMap(this.indicatorStyle)}
              >
                <span class="bg-primary absolute inset-y-1 left-0 w-0.5 rounded-full"></span>
              </span>
            `
          : nothing}
        <slot @slotchange=${() => this.requestIndicatorUpdate()}></slot>
      </div>
    `
  }
}

/**
 * <uip-vertical-tabs-section> — Category heading between tabs.
 */
export class UipVerticalTabsSection extends LitElement {
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    label: { type: String },
  }

  label = ''

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'vertical-tabs-section')
  }

  render() {
    return html`
      <div
        part="section"
        class="text-muted-foreground mt-3 mb-1 px-2 text-xs font-medium tracking-wider uppercase first:mt-0"
      >
        ${this.label}<slot></slot>
      </div>
    `
  }
}

/**
 * <uip-vertical-tabs-trigger> — Tab trigger button.
 */
export class UipVerticalTabsTrigger extends LitElement {
  static styles = [tailwind, css`:host { display: block; width: 100%; }`]

  static properties = {
    value: { reflect: true },
    disabled: { type: Boolean, reflect: true },
    active: { state: true },
  }

  value = ''
  disabled = false
  private active = false

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'vertical-tabs-trigger')
    this.setAttribute('role', 'tab')
    this.setAttribute('tabindex', this.disabled ? '-1' : '0')
    this.addEventListener('click', this.handleClick.bind(this))
  }

  syncActive(parentValue: string) {
    this.active = this.value === parentValue
    this.setAttribute('data-state', this.active ? 'active' : 'inactive')
    this.setAttribute('aria-selected', this.active ? 'true' : 'false')
  }

  private handleClick(e: MouseEvent) {
    if (this.disabled) {
      e.preventDefault()
      return
    }
    const root = this.closest('uip-vertical-tabs') as UipVerticalTabs | null
    root?.setValue(this.value)
  }

  render() {
    const list = this.closest('uip-vertical-tabs-list') as UipVerticalTabsList | null
    const isAnimated = list?.animated !== false

    return html`
      <button
        type="button"
        part="button"
        ?disabled=${this.disabled}
        data-state=${this.active ? 'active' : 'inactive'}
        class=${cn(
          'group/trigger text-muted-foreground relative z-10 flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium transition-[color,background-color] duration-150 outline-none',
          'hover:bg-muted/60 hover:text-foreground',
          'focus-visible:ring-ring/50 focus-visible:ring-2 focus-visible:outline-none',
          'disabled:pointer-events-none disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed',
          this.active && 'text-foreground font-semibold',
          !isAnimated && this.active && 'bg-muted',
          !isAnimated &&
            "before:bg-primary before:pointer-events-none before:absolute before:inset-y-1 before:left-0 before:w-0.5 before:rounded-full before:opacity-0 before:content-['']",
          !isAnimated && this.active && 'before:opacity-100',
          '[&_svg]:size-4 [&_svg]:shrink-0',
        )}
      >
        <slot></slot>
      </button>
    `
  }
}

/**
 * <uip-vertical-tabs-content> — Tab panel content.
 */
export class UipVerticalTabsContent extends LitElement {
  static styles = [tailwind, css`:host { display: block; flex: 1 1 0%; }`]

  static properties = {
    value: { reflect: true },
    active: { state: true },
  }

  value = ''
  private active = false

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'vertical-tabs-content')
    this.setAttribute('role', 'tabpanel')
  }

  syncActive(parentValue: string) {
    this.active = this.value === parentValue
    this.setAttribute('data-state', this.active ? 'active' : 'inactive')
    this.style.display = this.active ? 'block' : 'none'
  }

  render() {
    return html`
      <div
        part="content"
        class="ring-offset-background focus-visible:ring-ring/50 flex-1 focus-visible:ring-2 focus-visible:outline-none"
      >
        <slot></slot>
      </div>
    `
  }
}

customElements.get('uip-vertical-tabs') || customElements.define('uip-vertical-tabs', UipVerticalTabs)
customElements.get('uip-vertical-tabs-list') || customElements.define('uip-vertical-tabs-list', UipVerticalTabsList)
customElements.get('uip-vertical-tabs-section') || customElements.define('uip-vertical-tabs-section', UipVerticalTabsSection)
customElements.get('uip-vertical-tabs-trigger') || customElements.define('uip-vertical-tabs-trigger', UipVerticalTabsTrigger)
customElements.get('uip-vertical-tabs-content') || customElements.define('uip-vertical-tabs-content', UipVerticalTabsContent)

declare global {
  interface HTMLElementTagNameMap {
    'uip-vertical-tabs': UipVerticalTabs
    'uip-vertical-tabs-list': UipVerticalTabsList
    'uip-vertical-tabs-section': UipVerticalTabsSection
    'uip-vertical-tabs-trigger': UipVerticalTabsTrigger
    'uip-vertical-tabs-content': UipVerticalTabsContent
  }
}

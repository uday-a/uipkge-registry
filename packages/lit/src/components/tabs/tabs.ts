import { LitElement, css, html, nothing } from 'lit'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { tabsListVariants, tabsTriggerVariants } from './tabs.variants'

type Variant = 'segmented' | 'pill' | 'underline'
type Orientation = 'horizontal' | 'vertical'
type Size = 'default' | 'sm' | 'lg'

interface Tab {
  value: string
  disabled: boolean
  trigger: Element
  content?: Element
}

let uid = 0

// React's TabsContent string, through cn() like React (twMerge drops the
// overridden ring-2).
const contentClass = cn(
  'ring-offset-background focus-visible:border-ring focus-visible:ring-ring/50 motion-safe:data-[state=active]:animate-in motion-safe:data-[state=active]:fade-in-0 motion-safe:data-[state=active]:blur-in-2 motion-safe:data-[state=active]:slide-in-from-bottom-1 motion-safe:data-[state=active]:ease-emphasized flex-1 focus-visible:ring-2 focus-visible:ring-[3px] focus-visible:outline-none motion-safe:data-[state=active]:duration-200',
)

/**
 * <uip-tabs> — the registry Tabs (Tabs + TabsList + TabsTrigger + TabsContent)
 * as ONE web component.
 *
 * Each tab's aria-controls points at its panel and each panel's
 * aria-labelledby at its tab; those ids must live in one shadow root, so the
 * triggers and panels are flat light-DOM children paired by `data-value`,
 * which the element slots into its own tablist / tabpanel markup (manual slot
 * assignment):
 *
 *   <uip-tabs default-value="account">
 *     <span slot="trigger" data-value="account">Account</span>
 *     <span slot="trigger" data-value="team" data-disabled>Team</span>
 *     <div slot="content" data-value="account">…</div>
 *   </uip-tabs>
 *
 * Tabs order is trigger order; a trigger's element is laid out with
 * `display: contents` so its icon + text become the trigger's flex items
 * (React's `gap-1.5` / `[&_svg]` layout).
 *
 * Props (React names across the parts): value, default-value, orientation,
 * activation-mode ('automatic' | 'manual'), and TabsList's variant,
 * animated (default true; `animated="false"` turns the sliding indicator
 * off) and TabsTrigger's size. React's per-part `className` → style the
 * shadow parts from outside: `part="root" | "list" | "trigger" | "content"
 * | "indicator"`, e.g. `class="[&::part(list)]:w-48"`.
 *
 * Keyboard (Radix): roving tabindex on the tabs; Left/Right (Up/Down when
 * vertical) move and wrap, Home/End jump, disabled tabs are skipped; focus
 * activates in automatic mode, Enter/Space in manual mode.
 * Events: `input`, `change` and `value-change` (detail: { value }).
 */
export class UipTabs extends LitElement {
  static shadowRootOptions: ShadowRootInit = { ...LitElement.shadowRootOptions, slotAssignment: 'manual' }
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    value: { reflect: true },
    defaultValue: { attribute: 'default-value' },
    orientation: { reflect: true },
    activationMode: { attribute: 'activation-mode' },
    variant: { reflect: true },
    size: { reflect: true },
    animated: { converter: (v: string | null) => v !== 'false' },
    tabs: { state: true },
  }

  value = ''
  defaultValue?: string
  orientation: Orientation = 'horizontal'
  activationMode: 'automatic' | 'manual' = 'automatic'
  variant: Variant = 'segmented'
  size: Size = 'default'
  animated = true
  private tabs: Tab[] = []
  private firstPosition = true
  private readonly uidBase = `uip-tabs-${++uid}`
  private childObserver?: MutationObserver
  private resizeObserver?: ResizeObserver

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'tabs')
    if (!this.value && this.defaultValue) this.value = this.defaultValue
    this.readTabs()
    this.childObserver = new MutationObserver(() => this.readTabs())
    this.childObserver.observe(this, {
      childList: true,
      attributes: true,
      attributeFilter: ['slot', 'data-value', 'data-disabled'],
    })
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.updateIndicator())
      this.updateComplete.then(() => this.observeSizes())
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.childObserver?.disconnect()
    this.resizeObserver?.disconnect()
  }

  willUpdate(changed: Map<string, unknown>) {
    this.setAttribute('data-orientation', this.orientation)
    if (changed.has('variant') || changed.has('orientation') || changed.has('animated')) this.firstPosition = true
  }

  private readTabs() {
    const kids = [...this.children]
    this.tabs = kids
      .filter((k) => k.getAttribute('slot') === 'trigger')
      .map((trigger) => {
        const value = trigger.getAttribute('data-value') ?? ''
        return {
          value,
          disabled: trigger.hasAttribute('data-disabled'),
          trigger,
          content: kids.find((k) => k.getAttribute('slot') === 'content' && k.getAttribute('data-value') === value),
        }
      })
    this.updateComplete.then(() => this.observeSizes())
  }

  private get list() {
    return this.renderRoot?.querySelector<HTMLElement>('[role=tablist]')
  }

  private observeSizes() {
    const ro = this.resizeObserver
    const list = this.list
    if (!ro || !list) return
    ro.disconnect()
    ro.observe(list)
    list.querySelectorAll('[role=tab]').forEach((t) => ro.observe(t))
  }

  private motionSafeTransition() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return 'none'
    return this.firstPosition
      ? 'none'
      : 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1), width 220ms cubic-bezier(0.22, 1, 0.36, 1), height 220ms cubic-bezier(0.22, 1, 0.36, 1)'
  }

  /**
   * Same geometry as React's TabsList indicator. Written straight to the
   * indicator's style (runtime values, like React's inline style) so a
   * measurement never triggers another render.
   */
  private set indicatorStyle(style: Record<string, string | number>) {
    const el = this.renderRoot?.querySelector<HTMLElement>('[data-slot=tabs-indicator]')
    if (!el) return
    el.removeAttribute('style')
    for (const [k, v] of Object.entries(style)) el.style.setProperty(k, String(v))
  }

  private updateIndicator() {
    if (!this.animated) return
    const root = this.list
    if (!root) return
    const active = root.querySelector<HTMLElement>('[data-slot="tabs-trigger"][data-state="active"]')
    if (!active) {
      this.indicatorStyle = { opacity: 0 }
      return
    }
    const listRect = root.getBoundingClientRect()
    const activeRect = active.getBoundingClientRect()
    const left = activeRect.left - listRect.left + root.scrollLeft
    const top = activeRect.top - listRect.top + root.scrollTop
    const transition = this.motionSafeTransition()
    if (this.variant === 'underline') {
      const thickness = 2
      this.indicatorStyle =
        this.orientation === 'vertical'
          ? {
              width: `${thickness}px`,
              height: `${activeRect.height}px`,
              transform: `translate3d(${listRect.width - thickness}px, ${top}px, 0)`,
              opacity: 1,
              transition,
            }
          : {
              width: `${activeRect.width}px`,
              height: `${thickness}px`,
              transform: `translate3d(${left}px, ${listRect.height - thickness}px, 0)`,
              opacity: 1,
              transition,
            }
    } else {
      this.indicatorStyle = {
        width: `${activeRect.width}px`,
        height: `${activeRect.height}px`,
        transform: `translate3d(${left}px, ${top}px, 0)`,
        opacity: 1,
        transition,
      }
    }
    this.firstPosition = false
  }

  private select(value: string) {
    if (value === this.value) return
    this.value = value
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
    this.dispatchEvent(new CustomEvent('value-change', { detail: { value }, bubbles: true, composed: true }))
  }

  private onKeyDown(e: KeyboardEvent, i: number) {
    const vertical = this.orientation === 'vertical'
    const prev = vertical ? 'ArrowUp' : 'ArrowLeft'
    const next = vertical ? 'ArrowDown' : 'ArrowRight'
    if (this.activationMode === 'manual' && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      this.select(this.tabs[i].value)
      return
    }
    const enabled = this.tabs.map((t, j) => (t.disabled ? -1 : j)).filter((j) => j >= 0)
    const pos = enabled.indexOf(i)
    const n = enabled.length
    let to: number | undefined
    if (e.key === next) to = enabled[(pos + 1) % n]
    else if (e.key === prev) to = enabled[(pos - 1 + n) % n]
    else if (e.key === 'Home') to = enabled[0]
    else if (e.key === 'End') to = enabled[n - 1]
    if (to === undefined) return
    e.preventDefault()
    this.focusTab(to)
  }

  // Roving tabindex: the focused tab becomes the tab stop.
  private focusIndex = -1
  private focusTab(i: number) {
    this.focusIndex = i
    if (this.activationMode === 'automatic') this.select(this.tabs[i].value)
    else this.requestUpdate()
    this.updateComplete.then(() => this.renderRoot.querySelector<HTMLElement>(`#${this.uidBase}-trigger-${i}`)?.focus())
  }

  protected updated() {
    this.tabs.forEach((t, i) => {
      this.renderRoot.querySelector<HTMLSlotElement>(`slot[data-part="trigger"][data-index="${i}"]`)?.assign(t.trigger)
      if (t.content)
        this.renderRoot.querySelector<HTMLSlotElement>(`slot[data-part="content"][data-index="${i}"]`)?.assign(t.content)
    })
    this.updateIndicator()
  }

  render() {
    const o = this.orientation
    const v = this.variant
    const activeIndex = this.tabs.findIndex((t) => t.value === this.value)
    // Tab stop: the focused tab (manual mode), else the active one, else the first enabled.
    const stop =
      this.focusIndex >= 0 && this.activationMode === 'manual'
        ? this.focusIndex
        : activeIndex >= 0
          ? activeIndex
          : this.tabs.findIndex((t) => !t.disabled)
    const indicatorClass =
      v === 'pill'
        ? 'pointer-events-none absolute top-0 left-0 z-0 rounded-full bg-primary shadow-xs will-change-transform'
        : v === 'underline'
          ? 'pointer-events-none absolute top-0 left-0 z-0 bg-foreground will-change-transform'
          : 'pointer-events-none absolute top-0 left-0 z-0 rounded-sm bg-background shadow-xs will-change-transform'
    return html`<div
      part="root"
      data-orientation=${o}
      dir="ltr"
      class=${cn('flex w-full', o === 'vertical' ? 'flex-row gap-4' : 'flex-col gap-2')}
    >
      <div
        part="list"
        role="tablist"
        aria-orientation=${o}
        data-orientation=${o}
        data-slot="tabs-list"
        data-animated=${this.animated ? 'true' : 'false'}
        class=${cn('group/list relative', tabsListVariants({ variant: v, orientation: o }))}
      >
        ${this.animated
          ? html`<span
              part="indicator"
              data-slot="tabs-indicator"
              aria-hidden="true"
              class=${indicatorClass}
              style="opacity: 0"
            ></span>`
          : nothing}
        ${this.tabs.map((t, i) => {
          const active = i === activeIndex
          return html`<button
            part="trigger"
            type="button"
            role="tab"
            id=${`${this.uidBase}-trigger-${i}`}
            aria-selected=${active ? 'true' : 'false'}
            aria-controls=${`${this.uidBase}-content-${i}`}
            data-state=${active ? 'active' : 'inactive'}
            ?data-disabled=${t.disabled}
            ?disabled=${t.disabled}
            data-orientation=${o}
            data-slot="tabs-trigger"
            tabindex=${i === stop ? 0 : -1}
            class=${cn(tabsTriggerVariants({ size: this.size, variant: v, orientation: o }))}
            @mousedown=${(e: MouseEvent) => {
              // Radix activates on mousedown (left button, no ctrl).
              if (t.disabled || e.button !== 0 || e.ctrlKey) return
              this.focusIndex = i
              this.select(t.value)
            }}
            @focus=${() => {
              this.focusIndex = i
              if (this.activationMode === 'automatic' && !t.disabled) this.select(t.value)
            }}
            @keydown=${(e: KeyboardEvent) => this.onKeyDown(e, i)}
          >
            <slot data-part="trigger" data-index=${i} class="[&::slotted(*)]:contents"></slot>
          </button>`
        })}
      </div>
      ${this.tabs.map(
        // Every tab gets a panel so its aria-controls resolves (Radix always sets
        // it); a tab without content keeps an empty panel hidden, like React
        // rendering no TabsContent.
        (t, i) => html`<div
          part="content"
          role="tabpanel"
          id=${`${this.uidBase}-content-${i}`}
          aria-labelledby=${`${this.uidBase}-trigger-${i}`}
          data-state=${i === activeIndex ? 'active' : 'inactive'}
          data-orientation=${o}
          data-slot="tabs-content"
          tabindex="0"
          ?hidden=${i !== activeIndex || !t.content}
          class=${contentClass}
        >
          <slot data-part="content" data-index=${i}></slot>
        </div>`,
      )}
    </div>`
  }
}

customElements.get('uip-tabs') || customElements.define('uip-tabs', UipTabs)

declare global {
  interface HTMLElementTagNameMap {
    'uip-tabs': UipTabs
  }
}

import { LitElement, css, html, isServer, nothing, type PropertyDeclarations } from 'lit'
import { ChevronDown } from 'lucide'
import { cn } from '../../lib/utils'
import { icon } from '../../lib/icon'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { navigationMenuTriggerStyle } from './navigation-menu.variants'

export { navigationMenuTriggerStyle }

// React's class strings, verbatim (packages/registry-react/components/navigation-menu).
const rootClasses = 'group/navigation-menu relative flex max-w-max flex-1 items-center justify-center'
const listClasses = 'group flex flex-1 list-none items-center justify-center gap-1'
const itemClasses = 'relative'
const chevronClasses = 'relative top-[1px] ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180'
const contentClasses = cn(
  'data-[motion^=from-]:motion-safe:animate-in data-[motion^=to-]:motion-safe:animate-out data-[motion^=from-]:motion-safe:fade-in data-[motion^=to-]:motion-safe:fade-out data-[motion=from-end]:motion-safe:slide-in-from-right-52 data-[motion=from-start]:motion-safe:slide-in-from-left-52 data-[motion=to-end]:motion-safe:slide-out-to-right-52 data-[motion=to-start]:motion-safe:slide-out-to-left-52 top-0 left-0 w-full p-2 pr-2.5 md:absolute md:w-auto',
  'group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:data-[state=open]:motion-safe:animate-in group-data-[viewport=false]/navigation-menu:data-[state=closed]:motion-safe:animate-out group-data-[viewport=false]/navigation-menu:data-[state=closed]:motion-safe:zoom-out-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:motion-safe:zoom-in-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:motion-safe:fade-in-0 group-data-[viewport=false]/navigation-menu:data-[state=closed]:motion-safe:fade-out-0 group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-md group-data-[viewport=false]/navigation-menu:border group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:duration-200 **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none',
)
const linkClasses =
  "data-active:focus:bg-accent data-active:hover:bg-accent data-active:bg-accent/50 data-active:text-accent-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 [&_svg:not([class*='text-'])]:text-muted-foreground flex flex-col gap-1 rounded-sm p-2 text-sm transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1 [&_svg:not([class*='size-'])]:size-4"
const indicatorClasses =
  'data-[state=visible]:motion-safe:animate-in data-[state=hidden]:motion-safe:animate-out data-[state=hidden]:motion-safe:fade-out data-[state=visible]:motion-safe:fade-in top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden'
const viewportWrapperClasses = 'absolute top-full left-0 isolate z-50 flex justify-center'
const viewportClasses =
  'origin-top-center bg-popover text-popover-foreground data-[state=open]:motion-safe:animate-in data-[state=closed]:motion-safe:animate-out data-[state=closed]:motion-safe:zoom-out-95 data-[state=open]:motion-safe:zoom-in-90 relative left-[var(--radix-navigation-menu-viewport-left)] mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border shadow md:w-[var(--radix-navigation-menu-viewport-width)]'

/** Run `done` once `el`'s own animations finish (or 400ms, for hidden tabs). */
function afterAnimations(el: Element | null | undefined, done: () => void) {
  let fired = false
  const fin = () => {
    if (fired) return
    fired = true
    done()
  }
  setTimeout(fin, 400)
  requestAnimationFrame(() => {
    const anims = el?.getAnimations() ?? []
    if (anims.length) Promise.all(anims.map((a) => a.finished)).then(fin, fin)
    else fin()
  })
}

const booleanDefaultTrue = {
  fromAttribute: (v: string | null) => v !== 'false',
  toAttribute: (v: boolean) => (v ? '' : 'false'),
}

let uid = 0

/**
 * <uip-navigation-menu> — the registry NavigationMenu (Radix) as web components.
 *
 *   <uip-navigation-menu>                       ← NavigationMenu + List (+ Viewport)
 *     <uip-navigation-menu-item>                ← NavigationMenuItem
 *       <span slot="trigger">Getting started</span>   ← NavigationMenuTrigger children
 *       <ul slot="content" class="grid w-72 gap-2 p-4">…</ul>  ← NavigationMenuContent children
 *     </uip-navigation-menu-item>
 *     <uip-navigation-menu-item>
 *       <uip-navigation-menu-link href="#" trigger-style>Pricing</uip-navigation-menu-link>
 *     </uip-navigation-menu-item>
 *   </uip-navigation-menu>
 *
 * Each item renders its trigger, content and (with `viewport`, the default)
 * the viewport box in its OWN shadow root, so aria-controls/aria-labelledby
 * resolve; the viewport is absolutely positioned against this element's
 * `relative` root exactly like React's. Panel content stays light DOM (styled
 * by the page, links stay real links).
 *
 * Properties: `value` (open item's value, '' = closed), `viewport` (default
 * true; `viewport="false"` renders content under its trigger), `indicator`
 * (renders NavigationMenuIndicator), `delayDuration` (200), `skipDelayDuration` (300).
 * Events: `value-change` { value }.
 */
export class UipNavigationMenu extends LitElement {
  static styles = [tailwind, css`:host { display: contents; }`]

  static properties: PropertyDeclarations = {
    value: { reflect: true },
    viewport: { type: Boolean, converter: booleanDefaultTrue, reflect: true },
    indicator: { type: Boolean },
    delayDuration: { type: Number, attribute: 'delay-duration' },
    skipDelayDuration: { type: Number, attribute: 'skip-delay-duration' },
    accessibleLabel: { attribute: 'aria-label' },
    indicatorState: { state: true },
  }

  value = ''
  viewport = true
  indicator = false
  delayDuration = 200
  skipDelayDuration = 300
  accessibleLabel?: string
  private indicatorState: 'visible' | 'hidden' | 'gone' = 'gone'
  private openTimer?: ReturnType<typeof setTimeout>
  private closeTimer?: ReturnType<typeof setTimeout>
  private lastClosedAt = 0

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'navigation-menu')
  }

  get items() {
    if (isServer) return []
    return [...this.children].filter((c): c is UipNavigationMenuItem => c instanceof UipNavigationMenuItem)
  }

  private itemFor(value: string) {
    return this.items.find((i) => i.itemValue === value)
  }

  // --- open state -------------------------------------------------------------
  setValue(value: string) {
    if (value === this.value) return
    this.value = value
    this.dispatchEvent(new CustomEvent('value-change', { detail: { value }, bubbles: true, composed: true }))
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if (changed.has('value')) {
      const prev = (changed.get('value') as string | undefined) ?? ''
      const items = this.items
      const from = items.findIndex((i) => i.itemValue === prev)
      const to = items.findIndex((i) => i.itemValue === this.value)
      if (!this.value) this.lastClosedAt = Date.now()
      items.forEach((item, i) => {
        const switching = from >= 0 && to >= 0
        if (i === to) item.setExpanded(true, switching ? (to > from ? 'from-end' : 'from-start') : undefined)
        else if (i === from) item.setExpanded(false, switching ? (to > from ? 'to-start' : 'to-end') : undefined)
      })
      if (this.value) this.indicatorState = 'visible'
      else if (this.indicatorState === 'visible') {
        this.indicatorState = 'hidden'
        this.updateComplete.then(() =>
          afterAnimations(this.renderRoot.querySelector('[data-slot=navigation-menu-indicator]'), () => {
            if (!this.value) this.indicatorState = 'gone'
          }),
        )
      }
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    removeEventListener('pointerdown', this.onOutsidePointer, true)
  }

  // Radix DismissableLayer: a pointerdown outside the menu closes it.
  private onOutsidePointer = (e: PointerEvent) => {
    if (!e.composedPath().includes(this)) this.setValue('')
  }

  protected updated(changed: Map<string, unknown>) {
    if (changed.has('value')) {
      if (this.value) addEventListener('pointerdown', this.onOutsidePointer, true)
      else removeEventListener('pointerdown', this.onOutsidePointer, true)
    }
    if (changed.has('viewport')) this.items.forEach((i) => i.requestUpdate())
    if (changed.has('value') && this.value) this.placeIndicator()
  }

  // Written straight to the element's style: it's measured after render, and a
  // reactive property set in updated() would schedule a second update.
  private placeIndicator() {
    const trigger = this.itemFor(this.value)?.triggerEl
    const nav = this.renderRoot.querySelector('nav')
    const el = this.renderRoot.querySelector<HTMLElement>('[data-slot=navigation-menu-indicator]')
    if (!trigger || !nav || !el) return
    const t = trigger.getBoundingClientRect()
    const n = nav.getBoundingClientRect()
    // Radix Indicator: absolute, left 0, width = trigger, translateX(offset).
    Object.assign(el.style, {
      position: 'absolute',
      left: '0px',
      width: `${t.width}px`,
      transform: `translateX(${t.left - n.left}px)`,
    })
  }

  // --- hover intent (Radix delayDuration / skipDelayDuration) --------------------
  onTriggerEnter(item: UipNavigationMenuItem) {
    clearTimeout(this.openTimer)
    clearTimeout(this.closeTimer)
    const skip = !!this.value || Date.now() - this.lastClosedAt < this.skipDelayDuration
    if (skip) this.setValue(item.itemValue)
    else this.openTimer = setTimeout(() => this.setValue(item.itemValue), this.delayDuration)
  }

  startClose() {
    clearTimeout(this.openTimer)
    clearTimeout(this.closeTimer)
    this.closeTimer = setTimeout(() => this.setValue(''), 150)
  }

  cancelClose() {
    clearTimeout(this.closeTimer)
  }

  toggle(item: UipNavigationMenuItem) {
    clearTimeout(this.openTimer)
    clearTimeout(this.closeTimer)
    this.setValue(this.value === item.itemValue ? '' : item.itemValue)
  }

  // --- keyboard: roving focus across the top-level triggers/links ----------------
  private onKeyDown(e: KeyboardEvent) {
    const items = this.items
    const from = items.findIndex((i) => i.isTopLevelTarget(e.composedPath()))
    if (from < 0) return
    let to = -1
    if (e.key === 'ArrowRight') to = Math.min(from + 1, items.length - 1)
    else if (e.key === 'ArrowLeft') to = Math.max(from - 1, 0)
    else if (e.key === 'Home') to = 0
    else if (e.key === 'End') to = items.length - 1
    else return
    e.preventDefault()
    items[to]?.focusTopLevel()
  }

  // Close when focus leaves the whole menu (Radix onFocusOutside).
  private onFocusOut(e: FocusEvent) {
    const next = e.relatedTarget as Node | null
    if (!next || !this.value) return
    if (this.contains(next) || this.renderRoot.contains(next)) return
    // relatedTarget is retargeted to a host when focus moves into another
    // shadow root; our items' shadow roots live under this element.
    this.setValue('')
  }

  render() {
    return html`<nav
      aria-label=${this.accessibleLabel ?? 'Main'}
      data-orientation="horizontal"
      data-viewport=${this.viewport ? 'true' : 'false'}
      class=${rootClasses}
      @keydown=${this.onKeyDown}
      @focusout=${this.onFocusOut}
    >
      <ul data-uipkge="" data-slot="navigation-menu-list" data-orientation="horizontal" class=${listClasses}>
        <slot></slot>
      </ul>
      ${this.indicator && this.indicatorState !== 'gone'
        ? html`<div
            aria-hidden="true"
            data-uipkge=""
            data-slot="navigation-menu-indicator"
            data-orientation="horizontal"
            data-state=${this.indicatorState === 'visible' ? 'visible' : 'hidden'}
            class=${indicatorClasses}
          >
            <div class="bg-border relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm shadow-md"></div>
          </div>`
        : nothing}
    </nav>`
  }
}

/**
 * <uip-navigation-menu-item> — one top-level entry. With a `trigger` slot it
 * renders NavigationMenuTrigger (button + chevron) and NavigationMenuContent
 * (the `content` slot); otherwise its default slot holds a link.
 * Property: `value` (defaults to an auto id).
 *
 * The host is the list item (`role="listitem"` as a plain attribute, so the
 * root's <ul> > <slot> > host is a valid list for AT — ElementInternals'
 * `.role` does not surface for these hosts in Chromium, verified in the
 * accessibility tree). `part="base"` is React's `<li class="relative">` box:
 * style it with `class="[&::part(base)]:…"`.
 */
export class UipNavigationMenuItem extends LitElement {
  static styles = [tailwind, css`:host { display: block; }`]

  static properties: PropertyDeclarations = {
    value: {},
    expanded: { state: true },
    mounted: { state: true },
    motion: { state: true },
    hasTrigger: { state: true },
  }

  value?: string
  private expanded = false
  private mounted = false
  private motion?: string
  private hasTrigger = false
  private readonly autoValue = `item-${++uid}`
  private readonly idBase = `uip-nav-${uid}`
  private ro?: ResizeObserver

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'navigation-menu-item')
    // The host sits in the root's <ul>; it is the list item.
    this.setAttribute('role', 'listitem')
    if (isServer) return
    const read = () => (this.hasTrigger = !!this.querySelector(':scope > [slot="trigger"]'))
    read()
    // Frameworks may render the slotted children after the host connects.
    this.childObserver = new MutationObserver(read)
    this.childObserver.observe(this, { childList: true })
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.ro?.disconnect()
    this.childObserver?.disconnect()
  }

  private childObserver?: MutationObserver

  get itemValue() {
    return this.value || this.autoValue
  }

  private get root() {
    return isServer ? null : this.closest('uip-navigation-menu')
  }

  get triggerEl() {
    return this.renderRoot?.querySelector<HTMLButtonElement>('[data-slot=navigation-menu-trigger]') ?? null
  }

  private get contentEl() {
    return this.renderRoot?.querySelector<HTMLElement>('[data-slot=navigation-menu-content]') ?? null
  }

  private get defaultSlotted() {
    const slot = this.renderRoot?.querySelector<HTMLSlotElement>('slot:not([name])')
    return (slot?.assignedElements()[0] as HTMLElement | undefined) ?? null
  }

  isTopLevelTarget(path: EventTarget[]) {
    const t = this.triggerEl ?? this.defaultSlotted
    return !!t && path.includes(t)
  }

  focusTopLevel() {
    ;(this.triggerEl ?? this.defaultSlotted)?.focus()
  }

  /** Called by the root when the open value changes. */
  setExpanded(expanded: boolean, motion?: string) {
    this.motion = motion
    if (expanded) {
      this.expanded = true
      this.mounted = true
      return
    }
    if (!this.expanded) return
    this.expanded = false
    this.updateComplete.then(() => {
      const viewport = this.renderRoot.querySelector('[data-slot=navigation-menu-viewport]')
      afterAnimations(motion ? this.contentEl : (viewport ?? this.contentEl), () => {
        if (!this.expanded) this.mounted = false
      })
    })
  }

  protected updated(changed: Map<string, unknown>) {
    if (changed.has('mounted') && !isServer) {
      this.ro?.disconnect()
      const content = this.contentEl
      if (this.mounted && content) {
        this.ro = new ResizeObserver(() => this.measure())
        this.ro.observe(content)
        this.measure()
      }
    }
  }

  // Written straight to the viewport's style: the size is measured after
  // render, and a reactive property set in updated() would schedule a second
  // update. (The viewport is only rendered while mounted, so the vars never go stale.)
  private measure() {
    const c = this.contentEl
    const viewport = this.renderRoot.querySelector<HTMLElement>('[data-slot=navigation-menu-viewport]')
    if (!c || !viewport) return
    viewport.style.setProperty('--radix-navigation-menu-viewport-width', `${c.offsetWidth}px`)
    viewport.style.setProperty('--radix-navigation-menu-viewport-height', `${c.offsetHeight}px`)
  }

  private onTriggerPointerEnter(e: PointerEvent) {
    if (e.pointerType === 'mouse') this.root?.onTriggerEnter(this)
  }

  private onPointerLeave(e: PointerEvent) {
    if (e.pointerType === 'mouse') this.root?.startClose()
  }

  private onContentPointerEnter(e: PointerEvent) {
    if (e.pointerType === 'mouse') this.root?.cancelClose()
  }

  private onTriggerKeyDown(e: KeyboardEvent) {
    if (e.key !== 'ArrowDown') return
    e.preventDefault()
    const focusFirst = () => {
      const slot = this.renderRoot.querySelector<HTMLSlotElement>('slot[name="content"]')
      const first = slot
        ?.assignedElements({ flatten: true })
        .flatMap((el) => [el, ...el.querySelectorAll('*')])
        .find((el): el is HTMLElement => el instanceof HTMLElement && el.matches('a[href], button, [tabindex]:not([tabindex="-1"]), input, select, textarea, uip-navigation-menu-link'))
      first?.focus()
    }
    const root = this.root
    if (!this.expanded) root?.toggle(this)
    // The root re-renders first (it calls setExpanded), then this item mounts the panel.
    Promise.resolve(root?.updateComplete).then(() => this.updateComplete).then(focusFirst)
  }

  private onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape' && this.expanded) {
      e.preventDefault()
      this.root?.setValue('')
      this.triggerEl?.focus()
    }
  }

  // A click on a link inside the panel closes the menu (Radix onSelect).
  private onContentClick(e: MouseEvent) {
    if (e.composedPath().some((n) => n instanceof HTMLAnchorElement)) this.root?.setValue('')
  }

  private renderContent() {
    const id = `${this.idBase}-content`
    return html`<div
      id=${id}
      aria-labelledby=${`${this.idBase}-trigger`}
      data-uipkge=""
      data-slot="navigation-menu-content"
      data-state=${this.expanded ? 'open' : 'closed'}
      data-motion=${this.motion ?? nothing}
      data-orientation="horizontal"
      class=${contentClasses}
      @pointerenter=${this.onContentPointerEnter}
      @pointerleave=${this.onPointerLeave}
      @click=${this.onContentClick}
    >
      <slot name="content"></slot>
    </div>`
  }

  render() {
    const viewport = this.root?.viewport ?? true
    const state = this.expanded ? 'open' : 'closed'
    const trigger = this.hasTrigger
      ? html`<button
          id=${`${this.idBase}-trigger`}
          type="button"
          aria-expanded=${this.expanded ? 'true' : 'false'}
          aria-controls=${`${this.idBase}-content`}
          data-uipkge=""
          data-slot="navigation-menu-trigger"
          data-state=${state}
          class=${cn(navigationMenuTriggerStyle(), 'group')}
          @pointerenter=${this.onTriggerPointerEnter}
          @pointerleave=${this.onPointerLeave}
          @click=${() => this.root?.toggle(this)}
          @keydown=${this.onTriggerKeyDown}
        >
          <slot name="trigger"></slot>${icon(ChevronDown, 'chevron-down', chevronClasses)}
        </button>`
      : nothing
    return html`<div class="group/navigation-menu contents" data-viewport=${viewport ? 'true' : 'false'} @keydown=${this.onKeyDown}>
      <div part="base" class=${itemClasses}>
        ${trigger}
        <slot @slotchange=${() => this.requestUpdate()}></slot>
        ${this.hasTrigger && !viewport && this.mounted ? this.renderContent() : nothing}
      </div>
      ${this.hasTrigger && viewport && this.mounted
        ? html`<div class=${viewportWrapperClasses}>
            <div
              data-uipkge=""
              data-slot="navigation-menu-viewport"
              data-state=${state}
              data-orientation="horizontal"
              class=${viewportClasses}
              @pointerenter=${this.onContentPointerEnter}
              @pointerleave=${this.onPointerLeave}
            >
              ${this.renderContent()}
            </div>
          </div>`
        : nothing}
    </div>`
  }
}

/**
 * <uip-navigation-menu-link> — NavigationMenuLink: an <a> with React's link
 * classes. `trigger-style` merges `navigationMenuTriggerStyle()` (what the
 * React stories pass as className for top-level links); `active` sets
 * data-active. Emits `select` (cancelable) on click.
 */
export class UipNavigationMenuLink extends LitElement {
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true }
  static styles = [tailwind, css`:host { display: contents; }`]

  static properties: PropertyDeclarations = {
    href: {},
    target: {},
    active: { type: Boolean, reflect: true },
    triggerStyle: { type: Boolean, attribute: 'trigger-style' },
  }

  href?: string
  target?: string
  active = false
  triggerStyle = false

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
  }

  private onClick(e: MouseEvent) {
    const ok = this.dispatchEvent(new CustomEvent('select', { bubbles: true, composed: true, cancelable: true }))
    if (!ok) e.preventDefault()
  }

  render() {
    return html`<a
      href=${this.href ?? nothing}
      target=${this.target ?? nothing}
      aria-current=${this.active ? 'page' : nothing}
      ?data-active=${this.active}
      data-uipkge=""
      data-slot="navigation-menu-link"
      class=${cn(linkClasses, this.triggerStyle && navigationMenuTriggerStyle())}
      @click=${this.onClick}
      ><slot></slot
    ></a>`
  }
}

customElements.get('uip-navigation-menu') || customElements.define('uip-navigation-menu', UipNavigationMenu)
customElements.get('uip-navigation-menu-item') || customElements.define('uip-navigation-menu-item', UipNavigationMenuItem)
customElements.get('uip-navigation-menu-link') || customElements.define('uip-navigation-menu-link', UipNavigationMenuLink)

declare global {
  interface HTMLElementTagNameMap {
    'uip-navigation-menu': UipNavigationMenu
    'uip-navigation-menu-item': UipNavigationMenuItem
    'uip-navigation-menu-link': UipNavigationMenuLink
  }
}

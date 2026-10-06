import { LitElement, css, html, type TemplateResult } from 'lit'
import { MenuBase, setAttr, type MenuClasses, type Placement } from '../dropdown-menu/menu-core'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'

// React's class strings, verbatim (packages/registry-react/components/menubar).
const classes: MenuClasses = {
  content:
    'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[12rem] origin-(--radix-menubar-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-md',
  subContent:
    'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-menubar-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg',
  item: "focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/40 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus-visible:ring-2 focus-visible:ring-inset data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  checkboxItem:
    "focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring relative flex cursor-default items-center gap-2 rounded-xs py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus-visible:ring-2 focus-visible:ring-inset data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  radioItem:
    "focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring relative flex cursor-default items-center gap-2 rounded-xs py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus-visible:ring-2 focus-visible:ring-inset data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  label: 'px-2 py-1.5 text-sm font-medium data-[inset]:pl-8',
  separator: 'bg-border -mx-1 my-1 h-px',
  shortcut: 'text-muted-foreground ml-auto text-xs tracking-widest',
  subTrigger:
    'focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none focus-visible:ring-2 focus-visible:ring-inset data-[inset]:pl-8',
  subChevron: 'ml-auto size-4',
  originVar: '--radix-menubar-content-transform-origin',
  availableHeightVar: '--radix-menubar-content-available-height',
}

const triggerClass =
  'focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex items-center rounded-sm px-2 py-1 text-sm font-medium outline-hidden select-none cursor-default'

/**
 * <uip-menubar-menu> — A single menu item inside a Menubar.
 */
export class UipMenubarMenu extends MenuBase {
  protected readonly menuPrefix = 'menubar' as const
  protected readonly C = classes
  protected readonly defaults: Placement = { side: 'bottom', align: 'start', sideOffset: 8, alignOffset: -4 }

  get trigger(): HTMLElement | null {
    const slot = this.renderRoot?.querySelector<HTMLSlotElement>('slot[name="trigger"]')
    const slotted = slot?.assignedElements()[0] as HTMLElement | undefined
    return slotted ?? null
  }

  protected isTriggerEvent(path: EventTarget[]) {
    const t = this.trigger
    return !!t && path.includes(t)
  }

  protected focusTrigger() {
    this.trigger?.focus()
  }

  protected menuLabel() {
    const t = this.trigger
    return t?.getAttribute('aria-label') || t?.textContent?.trim() || undefined
  }

  protected onOpenStateRendered() {
    const t = this.trigger
    if (!t) return
    setAttr(t, 'data-uipkge', '')
    setAttr(t, 'data-slot', 'menubar-trigger')
    setAttr(t, 'role', 'menuitem')
    setAttr(t, 'aria-haspopup', 'menu')
    setAttr(t, 'aria-expanded', this.open ? 'true' : 'false')
    setAttr(t, 'data-state', this.open ? 'open' : 'closed')
    if (!t.classList.contains('menubar-trigger-styled')) {
      t.className = cn(triggerClass, t.className)
      t.classList.add('menubar-trigger-styled')
    }
  }

  private disabledTrigger() {
    const t = this.trigger
    return !t || (t.hasAttribute('disabled') && t.getAttribute('disabled') !== 'false')
  }

  openFrom(focus: 'first' | 'last' | 'content') {
    this.anchor = this.trigger
    this.focusOnOpen = focus
    this.setOpen(true)
  }

  closeMenu(returnFocus = false) {
    this.closeAll(returnFocus)
  }

  private onTriggerPointerDown(e: PointerEvent) {
    if (this.disabledTrigger() || e.button !== 0 || e.ctrlKey) return
    if (this.open) this.closeAll(false)
    else {
      e.preventDefault()
      this.openFrom('content')
    }
  }

  private onTriggerKeyDown(e: KeyboardEvent) {
    if (this.disabledTrigger()) return
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault()
      if (this.open) this.closeAll(true)
      else this.openFrom('first')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (this.open) this.closeAll(true)
      else this.openFrom('last')
    }
  }

  private onTriggerPointerEnter() {
    const menubar = this.closest('uip-menubar') as UipMenubar | null
    if (menubar && menubar.hasAnyOpenMenu() && !this.open) {
      menubar.closeAllMenus()
      this.openFrom('content')
    }
  }

  protected renderTrigger(): TemplateResult {
    return html`<slot
      name="trigger"
      @slotchange=${() => this.onOpenStateRendered()}
      @pointerdown=${this.onTriggerPointerDown}
      @keydown=${this.onTriggerKeyDown}
      @pointerenter=${this.onTriggerPointerEnter}
    ></slot>`
  }
}

/**
 * <uip-menubar-trigger> — Optional wrapper for menubar menu trigger.
 */
export class UipMenubarTrigger extends LitElement {
  static styles = [tailwind, css`:host { display: inline-flex; }`]
  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('slot', 'trigger')
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'menubar-trigger')
    this.setAttribute('tabindex', '0')
  }
  render() {
    return html`<slot></slot>`
  }
}

/**
 * <uip-menubar> — The container for menubar menus.
 */
export class UipMenubar extends LitElement {
  static styles = [tailwind, css`:host { display: inline-flex; }`]

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'menubar')
    this.setAttribute('role', 'menubar')
    this.setAttribute('aria-orientation', 'horizontal')
    this.addEventListener('keydown', this.onKeyDown.bind(this))
  }

  hasAnyOpenMenu(): boolean {
    const menus = Array.from(this.querySelectorAll('uip-menubar-menu')) as UipMenubarMenu[]
    return menus.some((m) => m.open)
  }

  closeAllMenus() {
    const menus = Array.from(this.querySelectorAll('uip-menubar-menu')) as UipMenubarMenu[]
    menus.forEach((m) => m.closeMenu(false))
  }

  private onKeyDown(e: KeyboardEvent) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      const menus = Array.from(this.querySelectorAll('uip-menubar-menu')) as UipMenubarMenu[]
      if (menus.length === 0) return
      const triggers = menus.map((m) => m.trigger).filter(Boolean) as HTMLElement[]
      const activeIdx = triggers.findIndex((t) => t === document.activeElement || t.contains(document.activeElement))
      if (activeIdx === -1) return

      e.preventDefault()
      const nextIdx =
        e.key === 'ArrowRight'
          ? (activeIdx + 1) % triggers.length
          : (activeIdx - 1 + triggers.length) % triggers.length
      const nextTrigger = triggers[nextIdx]
      nextTrigger?.focus()

      if (this.hasAnyOpenMenu()) {
        this.closeAllMenus()
        menus[nextIdx]?.openFrom('first')
      }
    }
  }

  render() {
    return html`
      <div
        part="base"
        data-uipkge=""
        data-slot="menubar"
        class="bg-background flex h-9 items-center gap-1 rounded-md border p-1 shadow-xs"
      >
        <slot></slot>
      </div>
    `
  }
}

customElements.get('uip-menubar-trigger') || customElements.define('uip-menubar-trigger', UipMenubarTrigger)
customElements.get('uip-menubar-menu') || customElements.define('uip-menubar-menu', UipMenubarMenu)
customElements.get('uip-menubar') || customElements.define('uip-menubar', UipMenubar)

declare global {
  interface HTMLElementTagNameMap {
    'uip-menubar': UipMenubar
    'uip-menubar-menu': UipMenubarMenu
    'uip-menubar-trigger': UipMenubarTrigger
  }
}

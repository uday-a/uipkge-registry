import { html } from 'lit'
import { MenuBase, setAttr, type MenuClasses, type Placement } from './menu-core'

// React's class strings, verbatim (packages/registry-react/components/dropdown-menu).
const classes: MenuClasses = {
  content:
    'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md',
  subContent:
    'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg',
  item: "focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus-visible:ring-2 focus-visible:ring-inset data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  checkboxItem:
    "focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus-visible:ring-2 focus-visible:ring-inset data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  radioItem:
    "focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus-visible:ring-2 focus-visible:ring-inset data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  label: 'px-2 py-1.5 text-sm font-medium data-[inset]:pl-8',
  separator: 'bg-border -mx-1 my-1 h-px',
  shortcut: 'text-muted-foreground ml-auto text-xs tracking-widest',
  subTrigger:
    "focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring data-[state=open]:bg-accent data-[state=open]:text-accent-foreground data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus-visible:ring-2 focus-visible:ring-inset data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  subChevron: 'ml-auto size-4',
  originVar: '--radix-dropdown-menu-content-transform-origin',
  availableHeightVar: '--radix-dropdown-menu-content-available-height',
}

/**
 * <uip-dropdown-menu> — the registry DropdownMenu as ONE web component.
 *
 * The trigger is any element in `slot="trigger"` (React's `asChild`); the menu
 * is declared with light-DOM data tags that the element re-renders, with
 * React's classes and Radix's roles/data attributes, inside its shadow root:
 *
 *   <uip-dropdown-menu class="[&::part(content)]:w-56 [&::part(sub-content)]:w-44">
 *     <uip-button slot="trigger" variant="outline">Open menu</uip-button>
 *     <uip-dropdown-menu-content align="end">
 *       <uip-dropdown-menu-label>My account</uip-dropdown-menu-label>
 *       <uip-dropdown-menu-separator></uip-dropdown-menu-separator>
 *       <uip-dropdown-menu-item><svg …></svg> Profile
 *         <uip-dropdown-menu-shortcut>⌘P</uip-dropdown-menu-shortcut></uip-dropdown-menu-item>
 *       <uip-dropdown-menu-checkbox-item checked>Status bar</uip-dropdown-menu-checkbox-item>
 *       <uip-dropdown-menu-radio-group value="center">
 *         <uip-dropdown-menu-radio-item value="top">Top</uip-dropdown-menu-radio-item>
 *       </uip-dropdown-menu-radio-group>
 *       <uip-dropdown-menu-sub>
 *         <uip-dropdown-menu-sub-trigger>Invite</uip-dropdown-menu-sub-trigger>
 *         <uip-dropdown-menu-sub-content>…items…</uip-dropdown-menu-sub-content>
 *       </uip-dropdown-menu-sub>
 *     </uip-dropdown-menu-content>
 *   </uip-dropdown-menu>
 *
 * Content: `side` (bottom), `align` (center), `side-offset` (4), `align-offset`.
 * Items: `disabled`, `inset`, `variant="destructive"`, `text-value` (typeahead).
 * Styling (React's `className`): parts `content`, `sub-content`, `item`
 * (+ `checkbox-item` / `radio-item` / `sub-trigger`), `label`, `separator`,
 * `shortcut`, reached from the host with `[&::part(content)]:w-56`. A `class`
 * on a data tag is ignored; a `part="name"` on one adds that part name to its
 * row (`[&::part(name)]:text-destructive`).
 *
 * Property/attribute: `open` (boolean, reflected).
 * Events: `open-change` { open } on the host; `select` (cancelable),
 * `checked-change` { checked } and `value-change` { value } on the data tags
 * (they bubble). The trigger gets `aria-haspopup`, `aria-expanded`,
 * `data-state`, `data-uipkge` and `data-slot="dropdown-menu-trigger"`.
 */
export class UipDropdownMenu extends MenuBase {
  protected readonly menuPrefix = 'dropdown-menu' as const
  protected readonly C = classes
  protected readonly defaults: Placement = { side: 'bottom', align: 'center', sideOffset: 4, alignOffset: 0 }

  private get trigger() {
    const slot = this.renderRoot?.querySelector<HTMLSlotElement>('slot[name="trigger"]')
    return (slot?.assignedElements()[0] as HTMLElement | undefined) ?? null
  }

  private disabledTrigger() {
    const t = this.trigger
    return !t || (t.hasAttribute('disabled') && t.getAttribute('disabled') !== 'false')
  }

  private openFrom(focus: 'first' | 'last' | 'content') {
    this.anchor = this.trigger
    this.focusOnOpen = focus
    this.setOpen(true)
  }

  private onTriggerPointerDown(e: PointerEvent) {
    if (this.disabledTrigger() || e.button !== 0 || e.ctrlKey) return
    if (this.open) this.closeAll(false)
    else {
      // Keep focus from landing on the trigger; the menu takes it.
      e.preventDefault()
      this.openFrom('content')
    }
  }

  private onTriggerKeyDown(e: KeyboardEvent) {
    if (this.disabledTrigger()) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (this.open) this.closeAll(true)
      else this.openFrom('first')
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      this.openFrom(e.key === 'ArrowDown' ? 'first' : 'last')
    }
  }

  protected defaultAnchor() {
    return this.trigger
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
    setAttr(t, 'data-slot', 'dropdown-menu-trigger')
    setAttr(t, 'aria-haspopup', 'menu')
    setAttr(t, 'aria-expanded', this.open ? 'true' : 'false')
    setAttr(t, 'data-state', this.open ? 'open' : 'closed')
  }

  protected renderTrigger() {
    return html`<slot
      name="trigger"
      @slotchange=${() => this.onOpenStateRendered()}
      @pointerdown=${this.onTriggerPointerDown}
      @keydown=${this.onTriggerKeyDown}
    ></slot>`
  }
}

customElements.get('uip-dropdown-menu') || customElements.define('uip-dropdown-menu', UipDropdownMenu)

declare global {
  interface HTMLElementTagNameMap {
    'uip-dropdown-menu': UipDropdownMenu
  }
}

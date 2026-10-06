import { html, type PropertyDeclarations } from 'lit'
import { MenuBase, setAttr, type MenuClasses, type Placement } from '../dropdown-menu/menu-core'

// React's class strings, verbatim (packages/registry-react/components/context-menu).
const classes: MenuClasses = {
  content:
    'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-context-menu-content-available-height) min-w-[8rem] overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md',
  subContent:
    'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-context-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg',
  item: "focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/40 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus-visible:ring-2 focus-visible:ring-inset data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  checkboxItem:
    "focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus-visible:ring-2 focus-visible:ring-inset data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  radioItem:
    "focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus-visible:ring-2 focus-visible:ring-inset data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  label: 'text-foreground px-2 py-1.5 text-sm font-medium data-[inset]:pl-8',
  separator: 'bg-border -mx-1 my-1 h-px',
  shortcut: 'text-muted-foreground ml-auto text-xs tracking-widest',
  subTrigger:
    "focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus-visible:ring-2 focus-visible:ring-inset data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  subChevron: 'ml-auto',
  originVar: '--radix-context-menu-content-transform-origin',
  availableHeightVar: '--radix-context-menu-content-available-height',
}

/**
 * <uip-context-menu> — the registry ContextMenu as ONE web component.
 *
 * The right-click target is the element in `slot="trigger"` (it keeps its own
 * page classes, like React's ContextMenuTrigger className). The menu is
 * declared with the same data tags as <uip-dropdown-menu>, prefixed
 * `uip-context-menu-` (content, item, checkbox-item, radio-group, radio-item,
 * label, separator, group, shortcut, sub/sub-trigger/sub-content), and opens
 * at the pointer on `contextmenu` (right click, Shift+F10 / the menu key, or a
 * 700ms touch long-press), flipping/shifting to stay in the viewport.
 *
 *   <uip-context-menu class="[&::part(content)]:w-48">
 *     <div slot="trigger" class="…">Right-click here</div>
 *     <uip-context-menu-content>
 *       <uip-context-menu-item>Back</uip-context-menu-item>
 *     </uip-context-menu-content>
 *   </uip-context-menu>
 *
 * Events: `open-change` { open } on the host; `select` (cancelable),
 * `checked-change` { checked } and `value-change` { value } on the data tags.
 * Styling: same parts as <uip-dropdown-menu> (`content`, `sub-content`,
 * `item`, `label`, `separator`, `shortcut`, plus a data tag's own `part`),
 * reached from the host: `class="[&::part(content)]:w-48"`.
 * The trigger gets `data-state`, `data-uipkge` and
 * `data-slot="context-menu-trigger"`.
 * Like Radix's ContextMenu, there is no `open` prop (state is internal).
 */
export class UipContextMenu extends MenuBase {
  static properties: PropertyDeclarations = { open: { state: true } }

  protected readonly menuPrefix = 'context-menu' as const
  protected readonly C = classes
  protected readonly defaults: Placement = { side: 'right', align: 'start', sideOffset: 2, alignOffset: 0 }
  private longPress?: ReturnType<typeof setTimeout>

  private get trigger() {
    const slot = this.renderRoot?.querySelector<HTMLSlotElement>('slot[name="trigger"]')
    return (slot?.assignedElements()[0] as HTMLElement | undefined) ?? null
  }

  private openAt(x: number, y: number) {
    this.anchor = new DOMRect(x, y, 0, 0)
    this.focusOnOpen = 'content'
    if (this.open) this.reposition()
    else this.setOpen(true)
  }

  private onContextMenu(e: MouseEvent) {
    e.preventDefault()
    // Keyboard-invoked (Shift+F10 / menu key) events carry no pointer position.
    if (e.clientX === 0 && e.clientY === 0 && this.trigger) {
      const r = this.trigger.getBoundingClientRect()
      this.openAt(r.left, r.top)
    } else this.openAt(e.clientX, e.clientY)
  }

  private onPointerDown(e: PointerEvent) {
    if (e.pointerType === 'mouse') return
    clearTimeout(this.longPress)
    this.longPress = setTimeout(() => this.openAt(e.clientX, e.clientY), 700)
  }

  private cancelLongPress() {
    clearTimeout(this.longPress)
  }

  protected isTriggerEvent(path: EventTarget[], e: Event) {
    // A right-click on the trigger re-opens at the new point instead of closing.
    const t = this.trigger
    return !!t && path.includes(t) && (e as PointerEvent).button === 2
  }

  protected onOpenStateRendered() {
    const t = this.trigger
    if (!t) return
    setAttr(t, 'data-uipkge', '')
    setAttr(t, 'data-slot', 'context-menu-trigger')
    setAttr(t, 'data-state', this.open ? 'open' : 'closed')
  }

  protected renderTrigger() {
    return html`<slot
      name="trigger"
      @slotchange=${() => this.onOpenStateRendered()}
      @contextmenu=${this.onContextMenu}
      @pointerdown=${this.onPointerDown}
      @pointermove=${this.cancelLongPress}
      @pointerup=${this.cancelLongPress}
      @pointercancel=${this.cancelLongPress}
    ></slot>`
  }
}

customElements.get('uip-context-menu') || customElements.define('uip-context-menu', UipContextMenu)

declare global {
  interface HTMLElementTagNameMap {
    'uip-context-menu': UipContextMenu
  }
}

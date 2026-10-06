import { LitElement, css, html, isServer, nothing, type PropertyDeclarations, type TemplateResult } from 'lit'
import { Check, ChevronRight, Circle } from 'lucide'
import { cn } from '../../lib/utils'
import { icon } from '../../lib/icon'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { autoUpdate, computePosition, type Align, type Side } from '../../lib/position'

/**
 * Shared engine for <uip-dropdown-menu> and <uip-context-menu>.
 *
 * The menu tree is declared as light-DOM DATA tags (never rendered — the host
 * has no default slot) and re-rendered inside ONE shadow root, so every
 * aria-controls / id reference and every roving-focus target lives in the same
 * tree, and the registry's `[&_svg]` / `focus:` class strings work verbatim on
 * real descendants. Item content (text, <svg> icons) is cloned from the data
 * tags; `*-shortcut` tags become the registry's shortcut <span>.
 *
 * Tags (prefix = `uip-dropdown-menu-` or `uip-context-menu-`):
 *   content (side/align/side-offset/align-offset), item (disabled, inset,
 *   variant), checkbox-item (checked, disabled), radio-group (value),
 *   radio-item (value, disabled), label (inset), separator, group, shortcut,
 *   sub > sub-trigger (inset, disabled) + sub-content.
 *
 * Styling (React's `className` on the parts): a `class` on a data tag is NOT
 * used — the rendered parts live in the shadow root, where only utilities the
 * shadow sheet happens to contain would apply. Style them with `::part` from
 * the host instead, which the page's own Tailwind compiles:
 *   `content` (root menu), `sub-content`, `item` (every row; checkbox / radio
 *   rows and sub-triggers also carry `checkbox-item` / `radio-item` /
 *   `sub-trigger`), `label`, `separator`, `shortcut`.
 *   e.g. `<uip-dropdown-menu class="[&::part(content)]:w-56">`.
 * A `part` attribute on a data tag adds those names to its rendered part, to
 * style a single row: `<uip-dropdown-menu-item part="logout">` +
 * `class="[&::part(logout)]:text-destructive"` on the host.
 *
 * Events are dispatched ON THE DATA TAG and bubble to the host:
 *   `select` (cancelable — preventDefault keeps the menu open),
 *   `checked-change` { checked } (cancelable — preventDefault = controlled),
 *   `value-change` { value } on the radio-group (cancelable).
 * The host emits `open-change` { open }.
 */

export interface MenuClasses {
  content: string
  subContent: string
  item: string
  checkboxItem: string
  radioItem: string
  label: string
  separator: string
  shortcut: string
  subTrigger: string
  subChevron: string
  originVar: string
  availableHeightVar: string
}

export interface Placement {
  side: Side
  align: Align
  sideOffset: number
  alignOffset: number
}

export type Anchor = Element | DOMRect

let uid = 0
const ids = new WeakMap<Element, string>()
const idFor = (el: Element) => {
  let id = ids.get(el)
  if (!id) ids.set(el, (id = `uip-menu-${++uid}`))
  return id
}

/** setAttribute only when the value changes (avoids needless mutation records). */
export const setAttr = (el: Element, name: string, value: string) => {
  if (el.getAttribute(name) !== value) el.setAttribute(name, value)
}

/** Boolean data attribute; `="false"` (Vue binds false as a string) is off. */
const flag = (el: Element, name: string) => el.hasAttribute(name) && el.getAttribute(name) !== 'false'
const num = (el: Element | null | undefined, name: string, fallback: number) => {
  const v = el?.getAttribute(name)
  return v == null || v === '' || isNaN(+v) ? fallback : +v
}

const origins: Record<Side, Record<Align, string>> = {
  bottom: { start: 'left top', center: 'center top', end: 'right top' },
  top: { start: 'left bottom', center: 'center bottom', end: 'right bottom' },
  right: { start: 'left top', center: 'left center', end: 'left bottom' },
  left: { start: 'right top', center: 'right center', end: 'right bottom' },
}

/** Run `done` once the element's own animations finish (or 400ms, for hidden tabs). */
function afterAnimations(el: Element, done: () => void) {
  let fired = false
  const fin = () => {
    if (fired) return
    fired = true
    done()
  }
  setTimeout(fin, 400)
  requestAnimationFrame(() => {
    const anims = el.getAnimations()
    if (anims.length) Promise.all(anims.map((a) => a.finished)).then(fin, fin)
    else fin()
  })
}

export abstract class MenuBase extends LitElement {
  // The host renders no box of its own (Radix Root renders nothing): the
  // slotted trigger lays out as if it were the host's parent's child.
  static styles = [tailwind, css`:host { display: contents; }`]

  static properties: PropertyDeclarations = {
    open: { type: Boolean, reflect: true },
    openSubs: { state: true },
    menuState: { state: true },
    version: { state: true },
  }

  open = false
  private openSubs: Element[] = []
  private menuState: 'open' | 'closed' = 'closed'
  private version = 0

  protected abstract readonly menuPrefix: 'dropdown-menu' | 'context-menu' | 'menubar'
  protected abstract readonly C: MenuClasses
  protected abstract readonly defaults: Placement

  /** Where the root menu is anchored (trigger element or a pointer rect). */
  protected anchor: Anchor | null = null
  /** How the next open should move focus: first/last item or the menu itself. */
  protected focusOnOpen: 'first' | 'last' | 'content' = 'content'
  /** Return focus to the trigger when this close completes. */
  protected returnFocus = false

  private clones = new Map<Element, unknown[]>()
  private cleanups = new Map<HTMLElement, () => void>()
  private observer?: MutationObserver
  private typeahead = ''
  private typeaheadTimer?: ReturnType<typeof setTimeout>
  private subOpenTimer?: ReturnType<typeof setTimeout>
  private subCloseTimer?: ReturnType<typeof setTimeout>

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', this.menuPrefix)
    if (isServer) return
    // Frameworks render the data tags after the host connects and may change
    // them (checked/value) later: re-read on any change.
    this.observer = new MutationObserver((records) => {
      // Ignore the host's own attributes (open, data-theme) and the ones this
      // element mirrors onto the trigger — only the data tags matter.
      const relevant = records.some(
        (r) => r.type !== 'attributes' || (r.target !== this && !(r.target as Element).hasAttribute?.('slot')),
      )
      if (!relevant) return
      this.clones.clear()
      this.version++
    })
    this.observer.observe(this, { childList: true, subtree: true, characterData: true, attributes: true })
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.observer?.disconnect()
    this.teardown()
  }

  // --- data tags ---------------------------------------------------------------
  protected kind(el: Element) {
    const p = `uip-${this.menuPrefix}-`
    return el.localName.startsWith(p) ? el.localName.slice(p.length) : ''
  }

  protected get contentData() {
    // The server DOM shim has no light-DOM children; the menu renders client-side.
    if (isServer) return null
    return [...this.children].find((c) => this.kind(c) === 'content') ?? null
  }

  private childTags(el: Element) {
    return [...el.children].filter((c) => this.kind(c))
  }

  /** Cloned item content: text + icons; shortcut tags become the registry span. */
  private contentOf(el: Element): unknown[] {
    let out = this.clones.get(el)
    if (out) return out
    out = []
    for (const n of el.childNodes) {
      if (n.nodeType === Node.ELEMENT_NODE) {
        const k = this.kind(n as Element)
        if (k === 'shortcut') {
          out.push(
            html`<span part=${this.parts('shortcut', n as Element)} data-uipkge="" data-slot=${`${this.menuPrefix}-shortcut`} class=${this.C.shortcut}
              >${n.textContent}</span
            >`,
          )
          continue
        }
        if (k) continue
      }
      out.push(n.cloneNode(true))
    }
    this.clones.set(el, out)
    return out
  }

  private textOf(el: Element) {
    let t = ''
    for (const n of el.childNodes) {
      if (n.nodeType === Node.TEXT_NODE) t += n.textContent
      else if (n.nodeType === Node.ELEMENT_NODE && !this.kind(n as Element)) t += n.textContent
    }
    return t.trim()
  }

  // --- open / close ------------------------------------------------------------
  protected setOpen(open: boolean) {
    if (this.open === open) return
    this.open = open
    this.dispatchEvent(new CustomEvent('open-change', { detail: { open }, bubbles: true, composed: true }))
  }

  private get rootMenu() {
    return this.renderRoot?.querySelector<HTMLElement>('[data-menu-root]') ?? null
  }

  private menuFor(sub: Element) {
    return this.renderRoot.querySelector<HTMLElement>(`[id="${idFor(sub)}"]`)
  }

  protected willUpdate(changed: Map<string, unknown>) {
    // Derived render state belongs here: setting it in updated() would schedule
    // a second update (Lit's "change-in-update" warning) on every open/close.
    if (changed.has('open')) {
      this.menuState = this.open ? 'open' : 'closed'
      if (!this.open) this.openSubs = []
    }
  }

  protected updated(changed: Map<string, unknown>) {
    const root = this.rootMenu
    if (!root) return
    if (changed.has('open')) {
      if (this.open) this.show(root)
      else if (changed.get('open') === true) this.hide(root)
    }
    if (changed.has('openSubs') || changed.has('version')) this.syncSubs()
    this.onOpenStateRendered()
  }

  /** Hook for subclasses (mirror data-state on the trigger). */
  protected onOpenStateRendered() {}

  /** Anchor used when `open` is set without a user gesture. */
  protected defaultAnchor(): Anchor | null {
    return null
  }

  private show(root: HTMLElement) {
    this.anchor ??= this.defaultAnchor()
    if (!root.matches(':popover-open')) root.showPopover()
    this.trackRoot(root)
    addEventListener('pointerdown', this.onOutsidePointer, true)
    this.updateComplete.then(() => {
      if (this.focusOnOpen === 'content') root.focus({ preventScroll: true })
      else this.focusItem(root, this.focusOnOpen === 'first' ? 0 : -1)
    })
  }

  /** Re-anchor an open menu (context menu re-opened at a new point). */
  protected reposition() {
    const root = this.rootMenu
    if (!root || !this.open) return
    this.openSubs = []
    this.trackRoot(root)
    root.focus({ preventScroll: true })
  }

  private trackRoot(root: HTMLElement) {
    this.track(root, () => this.anchor, () => {
      const d = this.contentData
      return {
        side: (d?.getAttribute('side') as Side) || this.defaults.side,
        align: (d?.getAttribute('align') as Align) || this.defaults.align,
        sideOffset: num(d, 'side-offset', this.defaults.sideOffset),
        alignOffset: num(d, 'align-offset', this.defaults.alignOffset),
      }
    })
  }

  private hide(root: HTMLElement) {
    removeEventListener('pointerdown', this.onOutsidePointer, true)
    const focusTrigger = this.returnFocus
    this.returnFocus = false
    if (focusTrigger) this.focusTrigger()
    this.updateComplete.then(() =>
      afterAnimations(root, () => {
        if (this.open) return
        this.untrack(root)
        if (root.matches(':popover-open')) root.hidePopover()
      }),
    )
  }

  protected focusTrigger() {}

  private teardown() {
    removeEventListener('pointerdown', this.onOutsidePointer, true)
    this.cleanups.forEach((c) => c())
    this.cleanups.clear()
  }

  /** Close everything (item selected, Escape, outside click). */
  protected closeAll(returnFocus: boolean) {
    this.returnFocus = returnFocus
    this.setOpen(false)
  }

  private onOutsidePointer = (e: PointerEvent) => {
    const path = e.composedPath()
    if (path.some((n) => n instanceof HTMLElement && n.hasAttribute('data-menu') && this.renderRoot.contains(n))) return
    if (this.isTriggerEvent(path, e)) return
    this.closeAll(false)
  }

  /** Subclass: pointerdown on the trigger is handled by the trigger itself. */
  protected isTriggerEvent(_path: EventTarget[], _e: Event) {
    return false
  }

  // --- positioning -----------------------------------------------------------------
  private track(el: HTMLElement, anchor: () => Anchor | null, placement: () => Placement) {
    this.untrack(el)
    const a = anchor()
    if (!a) return
    // computePosition measures the layout size (offsetWidth/Height), so the
    // enter animation's zoom-in-95 transform doesn't skew placement.
    const update = () => {
      const cur = anchor()
      if (!cur) return
      const p = placement()
      const { style, side, align } = computePosition(cur, el, { ...p, collisionPadding: 8 })
      el.style.top = style.top
      el.style.left = style.left
      el.setAttribute('data-side', side)
      el.setAttribute('data-align', align)
      el.style.setProperty(this.C.originVar, origins[side][align])
      const r = cur instanceof Element ? cur.getBoundingClientRect() : cur
      const avail =
        side === 'bottom' ? innerHeight - r.bottom - p.sideOffset - 8 : side === 'top' ? r.top - p.sideOffset - 8 : innerHeight - 16
      el.style.setProperty(this.C.availableHeightVar, `${Math.max(0, Math.floor(avail))}px`)
    }
    const stop = a instanceof Element ? autoUpdate(a, el, update) : (update(), () => {})
    this.cleanups.set(el, stop)
  }

  private untrack(el: HTMLElement) {
    this.cleanups.get(el)?.()
    this.cleanups.delete(el)
  }

  // --- submenus ------------------------------------------------------------------
  private syncSubs() {
    this.renderRoot.querySelectorAll<HTMLElement>('[data-sub-menu]').forEach((menu) => {
      const sub = this.openSubs.find((s) => idFor(s) === menu.id)
      if (sub && this.open) {
        if (!menu.matches(':popover-open')) {
          menu.showPopover()
          const trigger = this.renderRoot.querySelector(`[aria-controls="${menu.id}"]`)
          this.track(menu, () => trigger, () => ({ side: 'right', align: 'start', sideOffset: 0, alignOffset: 0 }))
        }
      } else if (menu.matches(':popover-open')) {
        this.untrack(menu)
        menu.hidePopover()
      }
    })
  }

  private openSub(sub: Element, focusFirst: boolean) {
    clearTimeout(this.subCloseTimer)
    const depth = this.depthOf(sub)
    if (this.openSubs[depth] !== sub) this.openSubs = [...this.openSubs.slice(0, depth), sub]
    if (focusFirst)
      this.updateComplete.then(() => {
        const m = this.menuFor(sub)
        if (m) this.focusItem(m, 0)
      })
  }

  /** Close submenus opened at `depth` and deeper. */
  private closeSubsFrom(depth: number) {
    if (this.openSubs.length > depth) this.openSubs = this.openSubs.slice(0, depth)
  }

  /** Nesting level of the menu a data tag's rendered item lives in (root = 0). */
  private depthOf(el: Element) {
    let d = 0
    for (let p = el.parentElement; p && p !== this; p = p.parentElement) if (this.kind(p) === 'sub-content') d++
    return d
  }

  // --- focus / keyboard --------------------------------------------------------------
  /** Enabled items that belong directly to `menu` (not to its submenus). */
  private itemsOf(menu: HTMLElement) {
    return [...menu.querySelectorAll<HTMLElement>('[data-menu-item]')].filter(
      (i) => i.closest('[data-menu]') === menu && !i.hasAttribute('data-disabled'),
    )
  }

  private focusItem(menu: HTMLElement, index: number) {
    const items = this.itemsOf(menu)
    const item = items.at(index)
    item?.focus({ preventScroll: false })
  }

  private onMenuKeyDown(e: KeyboardEvent) {
    const menu = e.currentTarget as HTMLElement
    const target = e.target as HTMLElement
    if (target.closest('[data-menu]') !== menu) return
    const items = this.itemsOf(menu)
    const i = items.indexOf(target)
    const depth = +(menu.dataset.depth ?? 0)
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        this.closeSubsFrom(depth)
        items[i < 0 ? 0 : Math.min(i + 1, items.length - 1)]?.focus()
        return
      case 'ArrowUp':
        e.preventDefault()
        this.closeSubsFrom(depth)
        items[i < 0 ? items.length - 1 : Math.max(i - 1, 0)]?.focus()
        return
      case 'Home':
      case 'PageUp':
        e.preventDefault()
        items[0]?.focus()
        return
      case 'End':
      case 'PageDown':
        e.preventDefault()
        items.at(-1)?.focus()
        return
      case 'ArrowRight':
        if (target.hasAttribute('data-sub-trigger')) {
          e.preventDefault()
          this.activateSubTrigger(target)
        }
        return
      case 'ArrowLeft':
        if (depth > 0) {
          e.preventDefault()
          this.closeSubsFrom(depth - 1)
          this.renderRoot.querySelector<HTMLElement>(`[aria-controls="${menu.id}"]`)?.focus()
        }
        return
      case 'Enter':
      case ' ':
        if (i < 0) return
        e.preventDefault()
        if (e.key === ' ' && this.typeahead) {
          this.onTypeahead(' ', items)
          return
        }
        target.click()
        return
      case 'Escape':
        e.preventDefault()
        e.stopPropagation()
        this.closeAll(true)
        return
      case 'Tab':
        // Radix keeps focus inside an open menu.
        e.preventDefault()
        return
      default:
        if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) this.onTypeahead(e.key, items, i)
    }
  }

  private onTypeahead(ch: string, items: HTMLElement[], current = -1) {
    clearTimeout(this.typeaheadTimer)
    this.typeahead += ch.toLowerCase()
    this.typeaheadTimer = setTimeout(() => (this.typeahead = ''), 1000)
    const search = this.typeahead
    // Repeating one character cycles through the items starting with it.
    const cycling = search.length > 1 && [...search].every((c) => c === search[0])
    const q = cycling ? search[0] : search
    const text = (el: HTMLElement) => (el.dataset.text ?? '').toLowerCase()
    const start = cycling || q.length === 1 ? current + 1 : Math.max(current, 0)
    const ordered = [...items.slice(start), ...items.slice(0, start)]
    ordered.find((el) => text(el).startsWith(q))?.focus()
  }

  // --- pointer ---------------------------------------------------------------------
  private onItemPointerMove(e: PointerEvent, depth: number, sub?: Element) {
    if (e.pointerType !== 'mouse') return
    const item = e.currentTarget as HTMLElement
    if (item.hasAttribute('data-disabled')) return
    if (this.renderRoot instanceof ShadowRoot && this.renderRoot.activeElement !== item) item.focus({ preventScroll: true })
    clearTimeout(this.subOpenTimer)
    if (sub) {
      clearTimeout(this.subCloseTimer)
      if (this.openSubs[depth] !== sub) this.subOpenTimer = setTimeout(() => this.openSub(sub, false), 100)
    } else if (this.openSubs.length > depth) {
      // Grace period so a diagonal move towards the submenu doesn't close it.
      clearTimeout(this.subCloseTimer)
      this.subCloseTimer = setTimeout(() => this.closeSubsFrom(depth), 250)
    }
  }

  private onItemPointerLeave(e: PointerEvent) {
    if (e.pointerType !== 'mouse') return
    clearTimeout(this.subOpenTimer)
    const item = e.currentTarget as HTMLElement
    const menu = item.closest<HTMLElement>('[data-menu]')
    if (this.renderRoot instanceof ShadowRoot && this.renderRoot.activeElement === item) menu?.focus({ preventScroll: true })
  }

  private onSubMenuPointerEnter() {
    clearTimeout(this.subCloseTimer)
  }

  // --- activation --------------------------------------------------------------------
  private fire(el: Element, type: string, detail?: unknown) {
    return el.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true, cancelable: true }))
  }

  private activateItem(el: Element) {
    if (flag(el, 'disabled')) return
    if (this.fire(el, 'select')) this.closeAll(true)
  }

  private activateCheckbox(el: Element) {
    if (flag(el, 'disabled')) return
    const checked = !flag(el, 'checked')
    if (this.fire(el, 'checked-change', { checked })) el.toggleAttribute('checked', checked)
    if (this.fire(el, 'select')) this.closeAll(true)
  }

  private activateRadio(el: Element) {
    if (flag(el, 'disabled')) return
    const group = el.parentElement
    const value = el.getAttribute('value') ?? ''
    if (group && this.kind(group) === 'radio-group' && group.getAttribute('value') !== value) {
      if (this.fire(group, 'value-change', { value })) group.setAttribute('value', value)
    }
    if (this.fire(el, 'select')) this.closeAll(true)
  }

  private activateSubTrigger(item: HTMLElement) {
    const sub = this.subsById.get(item.getAttribute('aria-controls') ?? '')
    if (sub && !item.hasAttribute('data-disabled')) this.openSub(sub, true)
  }

  private subsById = new Map<string, Element>()

  // --- render ------------------------------------------------------------------------
  private renderChildren(parent: Element, depth: number): TemplateResult[] {
    return this.childTags(parent).map((el) => this.renderNode(el, depth))
  }

  private itemAttrs(el: Element) {
    return { disabled: flag(el, 'disabled'), text: el.getAttribute('text-value') ?? this.textOf(el) }
  }

  private renderNode(el: Element, depth: number): TemplateResult {
    const p = this.menuPrefix
    const C = this.C
    const move = (e: PointerEvent) => this.onItemPointerMove(e, depth)
    const leave = (e: PointerEvent) => this.onItemPointerLeave(e)
    switch (this.kind(el)) {
      case 'item': {
        const { disabled, text } = this.itemAttrs(el)
        return html`<div
          role="menuitem"
          tabindex="-1"
          data-menu-item
          data-uipkge=""
          data-slot=${`${p}-item`}
          data-orientation="vertical"
          data-variant=${el.getAttribute('variant') || 'default'}
          ?data-inset=${flag(el, 'inset')}
          ?data-disabled=${disabled}
          aria-disabled=${disabled ? 'true' : nothing}
          data-text=${text}
          part=${this.parts('item', el)}
          class=${C.item}
          @click=${() => this.activateItem(el)}
          @pointermove=${move}
          @pointerleave=${leave}
          @focus=${this.onItemFocus}
          @blur=${this.onItemBlur}
        >${this.contentOf(el)}</div>`
      }
      case 'checkbox-item': {
        const { disabled, text } = this.itemAttrs(el)
        const checked = flag(el, 'checked')
        const state = checked ? 'checked' : 'unchecked'
        return html`<div
          role="menuitemcheckbox"
          tabindex="-1"
          aria-checked=${checked ? 'true' : 'false'}
          data-menu-item
          data-uipkge=""
          data-slot=${`${p}-checkbox-item`}
          data-orientation="vertical"
          data-state=${state}
          ?data-disabled=${disabled}
          aria-disabled=${disabled ? 'true' : nothing}
          data-text=${text}
          part=${this.parts('item checkbox-item', el)}
          class=${C.checkboxItem}
          @click=${() => this.activateCheckbox(el)}
          @pointermove=${move}
          @pointerleave=${leave}
          @focus=${this.onItemFocus}
          @blur=${this.onItemBlur}
        >
          <span class="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center"
            >${checked ? html`<span data-state=${state}>${icon(Check, 'check', 'size-4')}</span>` : nothing}</span
          >${this.contentOf(el)}
        </div>`
      }
      case 'radio-group':
        return html`<div role="group" data-uipkge="" data-slot=${`${p}-radio-group`}>
          ${this.renderChildren(el, depth)}
        </div>`
      case 'radio-item': {
        const { disabled, text } = this.itemAttrs(el)
        const group = el.parentElement
        const checked = !!group && group.getAttribute('value') === (el.getAttribute('value') ?? '')
        const state = checked ? 'checked' : 'unchecked'
        return html`<div
          role="menuitemradio"
          tabindex="-1"
          aria-checked=${checked ? 'true' : 'false'}
          data-menu-item
          data-uipkge=""
          data-slot=${`${p}-radio-item`}
          data-orientation="vertical"
          data-state=${state}
          ?data-disabled=${disabled}
          aria-disabled=${disabled ? 'true' : nothing}
          data-text=${text}
          part=${this.parts('item radio-item', el)}
          class=${C.radioItem}
          @click=${() => this.activateRadio(el)}
          @pointermove=${move}
          @pointerleave=${leave}
          @focus=${this.onItemFocus}
          @blur=${this.onItemBlur}
        >
          <span class="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center"
            >${checked ? html`<span data-state=${state}>${icon(Circle, 'circle', 'size-2 fill-current')}</span>` : nothing}</span
          >${this.contentOf(el)}
        </div>`
      }
      case 'label':
        return html`<div
          part=${this.parts('label', el)}
          data-uipkge=""
          data-slot=${`${p}-label`}
          ?data-inset=${flag(el, 'inset')}
          class=${C.label}
        >
          ${this.contentOf(el)}
        </div>`
      case 'separator':
        return html`<div
          role="separator"
          aria-orientation="horizontal"
          data-uipkge=""
          data-slot=${`${p}-separator`}
          part=${this.parts('separator', el)}
          class=${C.separator}
        ></div>`
      case 'group':
        return html`<div role="group" data-uipkge="" data-slot=${`${p}-group`}>
          ${this.renderChildren(el, depth)}
        </div>`
      case 'sub':
        return this.renderSub(el, depth)
      default:
        return html``
    }
  }

  private renderSub(sub: Element, depth: number) {
    const p = this.menuPrefix
    const C = this.C
    const trigger = [...sub.children].find((c) => this.kind(c) === 'sub-trigger')
    const content = [...sub.children].find((c) => this.kind(c) === 'sub-content')
    if (!trigger || !content) return html``
    const id = idFor(sub)
    this.subsById.set(id, sub)
    const open = this.openSubs[depth] === sub
    const state = open ? 'open' : 'closed'
    const { disabled, text } = this.itemAttrs(trigger)
    return html`<div
        role="menuitem"
        tabindex="-1"
        aria-haspopup="menu"
        aria-expanded=${open ? 'true' : 'false'}
        aria-controls=${id}
        data-menu-item
        data-sub-trigger
        data-uipkge=""
        data-slot=${`${p}-sub-trigger`}
        data-orientation="vertical"
        data-state=${state}
        ?data-inset=${flag(trigger, 'inset')}
        ?data-disabled=${disabled}
        aria-disabled=${disabled ? 'true' : nothing}
        data-text=${text}
        part=${this.parts('item sub-trigger', trigger)}
        class=${C.subTrigger}
        @click=${(e: Event) => this.activateSubTrigger(e.currentTarget as HTMLElement)}
        @pointermove=${(e: PointerEvent) => this.onItemPointerMove(e, depth, sub)}
        @pointerleave=${(e: PointerEvent) => this.onItemPointerLeave(e)}
        @focus=${this.onItemFocus}
        @blur=${this.onItemBlur}
      >
        ${this.contentOf(trigger)}${icon(ChevronRight, 'chevron-right', C.subChevron)}
      </div>
      <div
        id=${id}
        role="menu"
        aria-orientation="vertical"
        tabindex="-1"
        popover="manual"
        data-menu
        data-sub-menu
        data-depth=${depth + 1}
        data-uipkge=""
        data-slot=${`${p}-sub-content`}
        data-orientation="vertical"
        data-state=${state}
        aria-label=${text || nothing}
        part=${this.parts('sub-content', content)}
        class=${cn(C.subContent, 'fixed inset-auto m-0 outline-none')}
        @keydown=${this.onMenuKeyDown}
        @pointerenter=${this.onSubMenuPointerEnter}
        @contextmenu=${(e: Event) => e.preventDefault()}
      >
        ${this.renderChildren(content, depth + 1)}
      </div>`
  }

  /** Built-in part names plus any the data tag's own `part` attribute adds. */
  private parts(base: string, el: Element) {
    const extra = el.getAttribute('part')?.trim()
    return extra ? `${base} ${extra}` : base
  }

  private onItemFocus = (e: FocusEvent) => (e.currentTarget as HTMLElement).setAttribute('data-highlighted', '')
  private onItemBlur = (e: FocusEvent) => (e.currentTarget as HTMLElement).removeAttribute('data-highlighted')

  /** Slot(s) for the trigger — subclass specific. */
  protected abstract renderTrigger(): TemplateResult

  /** Accessible name for the root menu. */
  protected menuLabel(): string | undefined {
    return undefined
  }

  render() {
    const p = this.menuPrefix
    const data = this.contentData
    void this.version
    const label = isServer ? undefined : this.menuLabel()
    return html`
      ${this.renderTrigger()}
      <div
        role="menu"
        aria-orientation="vertical"
        tabindex="-1"
        popover="manual"
        data-menu
        data-menu-root
        data-depth="0"
        data-uipkge=""
        data-slot=${`${p}-content`}
        data-orientation="vertical"
        data-state=${this.menuState}
        aria-label=${label || nothing}
        part=${data ? this.parts('content', data) : 'content'}
        class=${cn(this.C.content, 'fixed inset-auto m-0 outline-none')}
        @keydown=${this.onMenuKeyDown}
        @contextmenu=${(e: Event) => e.preventDefault()}
      >
        ${data ? this.renderChildren(data, 0) : nothing}
      </div>
    `
  }
}

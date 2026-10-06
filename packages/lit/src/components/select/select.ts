import { LitElement, css, html, nothing, type TemplateResult } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { Check, ChevronDown, ChevronUp, Loader } from 'lucide'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { icon } from '../../lib/icon'
import { computePosition, type Side } from '../../lib/position'

interface Opt {
  value: string
  label: string
  disabled: boolean
  part?: string
}

/** Render rows, in document order: groups (with their label) hold item indexes. */
type Row =
  | { kind: 'item'; index: number }
  | { kind: 'separator'; part?: string }
  | { kind: 'group'; label: string; part?: string; items: number[] }

export type SelectSize = 'sm' | 'default' | 'lg'
export type SelectState = 'default' | 'error' | 'success'

// React's SelectTrigger maps, verbatim.
const triggerSizeClasses: Record<SelectSize, string> = {
  sm: 'h-8 text-sm px-2.5 py-1.5',
  default: 'h-9 text-sm px-3 py-2',
  lg: 'h-11 text-base px-4 py-2.5',
}

const triggerStateClasses: Record<SelectState, string> = {
  default: 'border-input dark:hover:bg-input/50',
  error:
    'border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
  success: 'border-success focus-visible:border-success',
}

// React's SelectItem string; `focus:` → `data-[highlighted]:` because focus
// stays on the trigger (aria-activedescendant) instead of moving to the item.
const itemClasses =
  "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2"

// Radix scrolls the viewport by one item every 50ms while the pointer is on a
// scroll button.
const AUTO_SCROLL_MS = 50

let uid = 0

/**
 * <uip-select> — the registry Select (Select + SelectTrigger + SelectValue +
 * SelectContent + SelectGroup/Label/Item/Separator + scroll buttons) as ONE
 * web component.
 *
 *   <uip-select placeholder="Choose a country" class="w-56">
 *     <optgroup label="Europe">
 *       <option value="france">France</option>
 *       <option value="spain" disabled>Spain</option>
 *     </optgroup>
 *     <hr />
 *     <option value="japan">Japan</option>
 *   </uip-select>
 *
 * Children are data, read but not rendered: `<option>` → SelectItem
 * (`disabled` → disabled item), `<optgroup label>` → SelectGroup + SelectLabel,
 * `<hr>` → SelectSeparator. The trigger (role=combobox) and the listbox live
 * in the same shadow root, so aria-controls / aria-activedescendant /
 * aria-labelledby resolve — they would NOT across a shadow boundary, which is
 * why this isn't split into Radix-style parts. Focus stays on the trigger
 * (activedescendant pattern); the listbox is a native popover (top layer,
 * light dismiss) positioned under the trigger (flipped above when there's no
 * room). When the list overflows, scroll up/down buttons appear (Radix
 * behaviour: hover to auto-scroll).
 *
 * Keyboard: ArrowUp/Down/Enter/Space open; in the list ArrowUp/Down, Home/End,
 * typeahead, Enter/Space select, Escape/Tab close. Typeahead on the closed
 * trigger selects the matching option (like Radix).
 *
 * Trigger props (React's SelectTrigger): `size` (sm | default | lg), `state`
 * (default | error | success → data-state-value), `loading` (spinner, busy,
 * disabled). `aria-invalid` is forwarded to the trigger.
 *
 * Parts (style from the host with `class="[&::part(content)]:max-h-56"`):
 * `trigger`, `value`, `icon`, `content`, `viewport`, `scroll-up-button`,
 * `scroll-down-button`, `group`, `label`, `item`, `separator`. A `part`
 * attribute on an <option>, <optgroup> or <hr> is added to that row's parts.
 *
 * Form-associated: submits `name=value` with its <form>, supports `required`,
 * resets with the form. Emits `input` and `change` (value on `.value`) and
 * `open-change` (detail: { open }).
 *
 * Controlled open (React's `open` / `onOpenChange`): `open` reflects whether
 * the list is shown, `show()` / `hide()` open and close it. Setting `open`
 * directly also works (popover syncs in `updated()`); user interactions
 * (click, keys, light-dismiss) update `open` and emit `open-change`.
 */
export class UipSelect extends LitElement {
  static formAssociated = true
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true }
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [tailwind, css`:host { display: inline-block; }`]

  static properties = {
    value: {},
    placeholder: {},
    name: { reflect: true },
    size: { reflect: true },
    state: { reflect: true },
    loading: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    required: { type: Boolean, reflect: true },
    accessibleLabel: { attribute: 'aria-label' },
    ariaInvalidAttr: { attribute: 'aria-invalid' },
    options: { state: true },
    rows: { state: true },
    open: { type: Boolean, reflect: true },
    active: { state: true },
    pos: { state: true },
    side: { state: true },
    canScrollUp: { state: true },
    canScrollDown: { state: true },
  }

  value = ''
  placeholder = 'Select…'
  name?: string
  size: SelectSize = 'default'
  state: SelectState = 'default'
  loading = false
  disabled = false
  required = false
  accessibleLabel?: string
  ariaInvalidAttr?: string
  open = false
  private options: Opt[] = []
  private rows: Row[] = []
  private active = -1
  private pos: Record<string, string> = {}
  private side: Side = 'bottom'
  private canScrollUp = false
  private canScrollDown = false
  private defaultValue = ''
  private typeahead = ''
  // Popover light-dismiss closes the list on pointerdown outside it — which
  // includes the trigger — so remember the state before that click toggles.
  private openAtPointerDown = false
  private typeaheadTimer?: ReturnType<typeof setTimeout>
  private autoScrollTimer?: ReturnType<typeof setInterval>
  private readonly uidBase = `uip-select-${++uid}`
  private internals = this.attachInternals()
  private childObserver?: MutationObserver

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'select')
    this.readOptions()
    this.defaultValue = this.value
    // Frameworks render <option> children after the host connects, and may
    // change them later — keep the list in sync.
    this.childObserver = new MutationObserver(() => this.readOptions())
    this.childObserver.observe(this, { childList: true, subtree: true, characterData: true, attributes: true })
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.childObserver?.disconnect()
    this.stopAutoScroll()
    this.removeViewportListeners()
  }

  private readOptions() {
    const options: Opt[] = []
    const rows: Row[] = []
    const toOpt = (o: HTMLOptionElement, groupDisabled = false): number => {
      options.push({
        value: o.value,
        label: o.textContent?.trim() ?? '',
        disabled: o.disabled || groupDisabled,
        part: o.getAttribute('part') ?? undefined,
      })
      return options.length - 1
    }
    for (const el of this.children) {
      if (el instanceof HTMLOptionElement) rows.push({ kind: 'item', index: toOpt(el) })
      else if (el instanceof HTMLOptGroupElement)
        rows.push({
          kind: 'group',
          label: el.label,
          part: el.getAttribute('part') ?? undefined,
          items: [...el.querySelectorAll('option')].map((o) => toOpt(o, el.disabled)),
        })
      else if (el instanceof HTMLHRElement) rows.push({ kind: 'separator', part: el.getAttribute('part') ?? undefined })
    }
    this.options = options
    this.rows = rows
  }

  private get isDisabled() {
    return this.disabled || this.loading
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if (changed.has('value') || changed.has('required')) {
      this.internals.setFormValue(this.value || null)
      if (this.required && !this.value) {
        this.internals.setValidity({ valueMissing: true }, 'Please select an option.', this.trigger ?? undefined)
      } else {
        this.internals.setValidity({})
      }
    }
  }

  // --- form callbacks -------------------------------------------------------
  formResetCallback() {
    this.value = this.defaultValue
  }
  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled
  }

  // --- open / close ----------------------------------------------------------
  private get trigger() {
    return this.renderRoot?.querySelector<HTMLButtonElement>('[role=combobox]')
  }
  private get content() {
    return this.renderRoot?.querySelector<HTMLElement>('[data-slot=select-content]')
  }
  private get viewport() {
    return this.renderRoot?.querySelector<HTMLElement>('[role=listbox]')
  }

  /** Open the list (public controlled-open API; also `open = true`). */
  show() {
    this.setOpen(true)
  }

  /** Close the list (public controlled-open API; also `open = false`). */
  hide() {
    this.setOpen(false)
  }

  private setOpen(open: boolean) {
    if (this.open === open) return
    if (open && this.isDisabled) return
    if (open) {
      const selected = this.options.findIndex((o) => o.value === this.value)
      this.active = selected >= 0 ? selected : this.nextEnabled(-1, 1)
    }
    this.open = open
    this.dispatchEvent(new CustomEvent('open-change', { detail: { open }, bubbles: true, composed: true }))
  }

  private openList() {
    this.show()
  }

  private closeList() {
    this.hide()
  }

  private removeViewportListeners() {
    removeEventListener('resize', this.onViewportChange)
    removeEventListener('scroll', this.onViewportChange, true)
  }

  private onViewportChange = (e: Event) => {
    if (e.type === 'scroll' && this.content?.contains(e.composedPath()[0] as Node)) return
    this.closeList()
  }

  // Popover light dismiss (outside click / Escape) closes it natively.
  private onToggle(e: ToggleEvent) {
    if (e.newState === 'closed' && this.open) this.setOpen(false)
  }

  /**
   * Radix `popper`: below the trigger (flipped above when there isn't room),
   * trigger width as the minimum, height capped at the room on that side
   * (`--radix-select-content-available-height`).
   */
  private place() {
    const t = this.trigger
    const c = this.content
    if (!t || !c) return
    const r = t.getBoundingClientRect()
    const gap = 4
    const padding = 8
    const vars = {
      '--radix-select-trigger-width': `${r.width}px`,
      '--radix-select-trigger-height': `${r.height}px`,
    }
    const below = innerHeight - r.bottom - gap - padding
    const above = r.top - gap - padding
    // Measure the natural (uncapped) height, then flip above if it doesn't fit below.
    for (const [k, v] of Object.entries(vars)) c.style.setProperty(k, v)
    c.style.setProperty('--radix-select-content-available-height', 'none')
    const natural = c.offsetHeight
    const side: Side = natural > below && above > below ? 'top' : 'bottom'
    const { style } = computePosition(t, c, { side, align: 'start', sideOffset: gap, collisionPadding: padding, matchWidth: true })
    this.side = side
    this.pos = {
      ...vars,
      ...style,
      '--radix-select-content-available-height': `${side === 'bottom' ? below : above}px`,
    }
    if (side === 'top') {
      // Anchor the bottom edge so a height capped after measuring still hugs the trigger.
      delete this.pos.top
      this.pos.bottom = `${innerHeight - r.top + gap}px`
    }
    this.updateComplete.then(() => this.updateScrollButtons())
  }

  // --- scroll buttons (Radix SelectScrollUp/DownButton) -----------------------
  private updateScrollButtons() {
    const vp = this.viewport
    if (!vp) return
    this.canScrollUp = vp.scrollTop > 0
    this.canScrollDown = Math.ceil(vp.scrollTop) < vp.scrollHeight - vp.clientHeight
  }

  private startAutoScroll(dir: 1 | -1) {
    if (this.autoScrollTimer) return
    this.autoScrollTimer = setInterval(() => {
      const vp = this.viewport
      if (!vp) return
      const item = this.renderRoot.querySelector<HTMLElement>('[role=option]')
      vp.scrollTop += dir * (item?.offsetHeight ?? 32)
      this.updateScrollButtons()
    }, AUTO_SCROLL_MS)
  }

  private stopAutoScroll() {
    clearInterval(this.autoScrollTimer)
    this.autoScrollTimer = undefined
  }

  // --- selection -------------------------------------------------------------
  private select(i: number) {
    const opt = this.options[i]
    if (!opt || opt.disabled) return
    const changed = opt.value !== this.value
    this.value = opt.value
    this.closeList()
    this.trigger?.focus()
    if (changed) {
      this.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
      this.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
    }
  }

  private nextEnabled(from: number, dir: 1 | -1) {
    const n = this.options.length
    for (let i = from + dir; i >= 0 && i < n; i += dir) if (!this.options[i].disabled) return i
    return from
  }

  private scrollActiveIntoView() {
    const reveal = () => {
      this.renderRoot.querySelector(`#${this.uidBase}-opt-${this.active}`)?.scrollIntoView({ block: 'nearest' })
      // Radix: the first/last enabled item scrolls the viewport fully, so the
      // matching scroll button goes away.
      const vp = this.viewport
      if (vp && this.active === this.nextEnabled(-1, 1)) vp.scrollTop = 0
      if (vp && this.active === this.nextEnabled(this.options.length, -1)) vp.scrollTop = vp.scrollHeight
      this.updateScrollButtons()
    }
    // A scroll button appearing/disappearing resizes the viewport, so reveal
    // the item again once they have rendered.
    this.updateComplete.then(reveal).then(() => this.updateComplete).then(reveal)
  }

  private onTriggerClick() {
    const wasOpen = this.openAtPointerDown || this.open
    this.openAtPointerDown = false
    if (wasOpen) this.hide()
    else this.show()
  }

  private onKeyDown(e: KeyboardEvent) {
    if (this.isDisabled) return
    const k = e.key
    if (!this.open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(k)) {
        e.preventDefault()
        this.openList()
      } else if (k.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const i = this.findTypeahead(k)
        if (i >= 0) this.select(i)
      }
      return
    }
    switch (k) {
      case 'ArrowDown':
        e.preventDefault()
        this.active = this.nextEnabled(this.active, 1)
        break
      case 'ArrowUp':
        e.preventDefault()
        this.active = this.nextEnabled(this.active, -1)
        break
      case 'Home':
        e.preventDefault()
        this.active = this.nextEnabled(-1, 1)
        break
      case 'End':
        e.preventDefault()
        this.active = this.nextEnabled(this.options.length, -1)
        break
      case 'Enter':
        e.preventDefault()
        this.select(this.active)
        return
      case ' ':
        e.preventDefault()
        // Space continues a typeahead search ("south k…") like Radix.
        if (this.typeahead) this.onTypeahead(k)
        else this.select(this.active)
        return
      case 'Escape':
        e.preventDefault()
        this.hide()
        return
      case 'Tab':
        this.hide()
        return
      default:
        if (k.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) this.onTypeahead(k)
        return
    }
    this.scrollActiveIntoView()
  }

  private findTypeahead(ch: string) {
    clearTimeout(this.typeaheadTimer)
    this.typeahead += ch.toLowerCase()
    this.typeaheadTimer = setTimeout(() => (this.typeahead = ''), 1000)
    return this.options.findIndex((o) => !o.disabled && o.label.toLowerCase().startsWith(this.typeahead))
  }

  private onTypeahead(ch: string) {
    const i = this.findTypeahead(ch)
    if (i >= 0) {
      this.active = i
      this.scrollActiveIntoView()
    }
  }

  protected updated(changed: Map<string, unknown>) {
    // icon() takes no extra attributes; expose the trigger's chevron/spinner as a part.
    this.trigger?.querySelector(':scope > svg')?.setAttribute('part', 'icon')
    // Disabling while open closes the list.
    if ((changed.has('disabled') || changed.has('loading')) && this.isDisabled && this.open) {
      this.setOpen(false)
      return
    }
    if (!changed.has('open')) return
    // Sync the popover with `open` — this covers direct `open = true/false`
    // sets as well as show()/hide(); setOpen() already dispatched the event.
    if (this.open) {
      // Direct `open = true` skips setOpen()'s active-item init.
      if (this.active < 0 || this.active >= this.options.length) {
        const selected = this.options.findIndex((o) => o.value === this.value)
        this.active = selected >= 0 ? selected : this.nextEnabled(-1, 1)
      }
      if (this.isDisabled) {
        this.open = false
        return
      }
      this.content?.showPopover()
      this.place()
      addEventListener('resize', this.onViewportChange)
      addEventListener('scroll', this.onViewportChange, true)
      this.scrollActiveIntoView()
    } else {
      this.stopAutoScroll()
      this.removeViewportListeners()
      if (this.content?.matches(':popover-open')) this.content.hidePopover()
    }
  }

  // --- render ----------------------------------------------------------------
  private renderItem(i: number) {
    const o = this.options[i]
    const selected = o.value === this.value
    return html`<div
      id=${`${this.uidBase}-opt-${i}`}
      part=${cn('item', o.part)}
      role="option"
      aria-selected=${selected ? 'true' : 'false'}
      aria-disabled=${o.disabled ? 'true' : nothing}
      data-uipkge=""
      data-slot="select-item"
      data-state=${selected ? 'checked' : 'unchecked'}
      ?data-highlighted=${i === this.active}
      ?data-disabled=${o.disabled}
      class=${itemClasses}
      @pointermove=${() => !o.disabled && this.active !== i && (this.active = i)}
      @click=${() => this.select(i)}
    >
      <span class="absolute right-2 flex size-3.5 items-center justify-center">
        ${selected ? icon(Check, 'check', 'size-4') : nothing}
      </span>
      <span>${o.label}</span>
    </div>`
  }

  private renderRow(row: Row, r: number): TemplateResult {
    if (row.kind === 'item') return this.renderItem(row.index)
    if (row.kind === 'separator')
      return html`<div
        part=${cn('separator', row.part)}
        aria-hidden="true"
        data-uipkge=""
        data-slot="select-separator"
        class="bg-border pointer-events-none -mx-1 my-1 h-px"
      ></div>`
    const labelId = `${this.uidBase}-label-${r}`
    return html`<div part=${cn('group', row.part)} role="group" aria-labelledby=${labelId}>
      <div id=${labelId} part="label" data-uipkge="" data-slot="select-label" class="text-muted-foreground px-2 py-1.5 text-xs">
        ${row.label}
      </div>
      ${row.items.map((i) => this.renderItem(i))}
    </div>`
  }

  private renderScrollButton(dir: 1 | -1) {
    const up = dir === -1
    return html`<div
      part=${up ? 'scroll-up-button' : 'scroll-down-button'}
      aria-hidden="true"
      data-uipkge=""
      data-slot=${up ? 'select-scroll-up-button' : 'select-scroll-down-button'}
      class="flex cursor-default items-center justify-center py-1"
      @pointerdown=${() => this.startAutoScroll(dir)}
      @pointermove=${() => this.startAutoScroll(dir)}
      @pointerleave=${() => this.stopAutoScroll()}
    >
      ${up ? icon(ChevronUp, 'chevron-up', 'size-4') : icon(ChevronDown, 'chevron-down', 'size-4')}
    </div>`
  }

  render() {
    const selected = this.options.find((o) => o.value === this.value)
    const listId = `${this.uidBase}-listbox`
    const open = this.open ? 'open' : 'closed'
    return html`
      <button
        part="trigger"
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded=${this.open ? 'true' : 'false'}
        aria-controls=${listId}
        aria-activedescendant=${this.open && this.active >= 0 ? `${this.uidBase}-opt-${this.active}` : nothing}
        aria-label=${this.accessibleLabel ?? nothing}
        aria-required=${this.required ? 'true' : nothing}
        aria-invalid=${this.ariaInvalidAttr ?? nothing}
        aria-busy=${this.loading ? 'true' : 'false'}
        ?disabled=${this.isDisabled}
        data-uipkge=""
        data-slot="select-trigger"
        data-size=${this.size}
        data-state-value=${this.state}
        data-state=${open}
        ?data-disabled=${this.isDisabled}
        ?data-placeholder=${!selected}
        class=${cn(
          "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex w-full items-center justify-between gap-2 rounded-md border bg-transparent text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
          triggerSizeClasses[this.size] ?? triggerSizeClasses.default,
          triggerStateClasses[this.state] ?? triggerStateClasses.default,
        )}
        @pointerdown=${() => (this.openAtPointerDown = this.open)}
        @click=${this.onTriggerClick}
        @keydown=${this.onKeyDown}
      >
        <span part="value" data-slot="select-value" class="truncate">${selected?.label ?? this.placeholder}</span>
        ${this.loading
          ? icon(Loader, 'loader', 'size-4 animate-spin opacity-50')
          : icon(ChevronDown, 'chevron-down', 'size-4 opacity-50')}
      </button>
      <div
        part="content"
        popover="auto"
        data-uipkge=""
        data-slot="select-content"
        data-state=${open}
        data-side=${this.side}
        data-align="start"
        style=${styleMap(this.pos)}
        class="bg-popover text-popover-foreground motion-safe:data-[state=open]:animate-in motion-safe:data-[state=closed]:animate-out motion-safe:data-[state=open]:ease-emphasized motion-safe:data-[state=open]:blur-in-2 motion-safe:data-[state=closed]:blur-out-2 motion-safe:data-[state=closed]:fade-out-0 motion-safe:data-[state=open]:fade-in-0 motion-safe:data-[state=closed]:zoom-out-95 motion-safe:data-[state=open]:zoom-in-95 motion-safe:data-[side=bottom]:slide-in-from-top-2 motion-safe:data-[side=left]:slide-in-from-right-2 motion-safe:data-[side=right]:slide-in-from-left-2 motion-safe:data-[side=top]:slide-in-from-bottom-2 fixed inset-auto m-0 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-x-hidden overflow-y-auto rounded-md border shadow-md motion-safe:data-[state=closed]:duration-[var(--dur-exit)] motion-safe:data-[state=open]:duration-200 [&:popover-open]:flex flex-col"
        @toggle=${this.onToggle}
        @mousedown=${(e: MouseEvent) => e.preventDefault()}
      >
        ${this.canScrollUp ? this.renderScrollButton(-1) : nothing}
        <div
          part="viewport"
          id=${listId}
          role="listbox"
          tabindex="-1"
          aria-label=${this.accessibleLabel ?? nothing}
          data-slot="select-viewport"
          class="relative min-h-0 flex-1 overflow-x-hidden overflow-y-auto p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
          @scroll=${() => this.updateScrollButtons()}
        >
          ${this.rows.map((row, r) => this.renderRow(row, r))}
        </div>
        ${this.canScrollDown ? this.renderScrollButton(1) : nothing}
      </div>
    `
  }
}

customElements.get('uip-select') || customElements.define('uip-select', UipSelect)

declare global {
  interface HTMLElementTagNameMap {
    'uip-select': UipSelect
  }
}

import { LitElement, css, html, nothing } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { Check, ChevronDown, Loader2, X } from 'lucide'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { icon } from '../../lib/icon'
import { computePosition } from '../../lib/position'

export interface AdvanceSelectFieldNames {
  label?: string
  value?: string
  group?: string
  disabled?: string
}

function readKey<T>(option: T, key: string, fallback?: unknown): unknown {
  if (option == null || typeof option !== 'object') return fallback
  const v = (option as Record<string, unknown>)[key]
  return v === undefined ? fallback : v
}

const sizeClasses = {
  sm: 'h-8 text-xs px-2.5 py-1',
  default: 'h-9 text-sm px-3 py-1.5',
  lg: 'h-11 text-base px-4 py-2',
}

const variantClasses = {
  outlined:
    'border-input bg-transparent shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
  filled:
    'border-transparent bg-muted/50 shadow-none focus-visible:bg-muted focus-visible:ring-ring/50 focus-visible:ring-[3px]',
  borderless:
    'border-transparent bg-transparent shadow-none focus-visible:bg-muted/30 focus-visible:ring-ring/50 focus-visible:ring-[3px]',
}

const statusClasses = {
  default: '',
  error:
    'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 aria-invalid:border-destructive',
  warning: 'border-warning focus-visible:border-warning focus-visible:ring-warning/20',
}

const jsonConverter = {
  fromAttribute: (v: string | null) => {
    if (!v) return undefined
    try {
      return JSON.parse(v)
    } catch {
      return v
    }
  },
  toAttribute: (v: unknown) => (v ? (typeof v === 'string' ? v : JSON.stringify(v)) : null),
}

const stringListConverter = {
  fromAttribute: (v: string | null): string[] => {
    if (!v) return []
    try {
      const parsed = JSON.parse(v)
      if (Array.isArray(parsed)) return parsed
    } catch {}
    return v.split(',').map((s) => s.trim()).filter(Boolean)
  },
  toAttribute: (v: string[] | undefined): string | null => (v ? JSON.stringify(v) : null),
}

const trueUnlessFalse = {
  fromAttribute: (v: string | null) => v !== 'false',
}

/**
 * <uip-advance-select> — the registry AdvanceSelect as a web component.
 *
 * Form-associated: submits selected value(s) with its <form>.
 */
export class UipAdvanceSelect extends LitElement {
  static formAssociated = true
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true }
  static styles = [tailwind, css`:host { display: block; width: 100%; }`]

  static properties = {
    value: { converter: jsonConverter },
    defaultValue: { attribute: 'default-value', converter: jsonConverter },
    options: { converter: jsonConverter },
    mode: { reflect: true },
    fieldNames: { attribute: 'field-names', converter: jsonConverter },
    size: { reflect: true },
    variant: { reflect: true },
    status: { reflect: true },
    placeholder: {},
    showSearch: { type: Boolean, attribute: 'show-search' },
    searchValue: { attribute: 'search-value' },
    autoClearSearchValue: { converter: trueUnlessFalse, attribute: 'auto-clear-search-value' },
    maxCount: { type: Number, attribute: 'max-count' },
    maxTagCount: { type: Number, attribute: 'max-tag-count' },
    maxTagTextLength: { type: Number, attribute: 'max-tag-text-length' },
    maxTagPlaceholder: { attribute: 'max-tag-placeholder' },
    tokenSeparators: { attribute: 'token-separators', converter: stringListConverter },
    hideSelected: { type: Boolean, attribute: 'hide-selected' },
    allowCreate: { type: Boolean, attribute: 'allow-create' },
    disabled: { type: Boolean, reflect: true },
    loading: { type: Boolean, reflect: true },
    allowClear: { converter: trueUnlessFalse, attribute: 'allow-clear' },
    open: { type: Boolean, reflect: true },
    defaultOpen: { type: Boolean, attribute: 'default-open' },
    defaultActiveFirstOption: { converter: trueUnlessFalse, attribute: 'default-active-first-option' },
    notFoundContent: { attribute: 'not-found-content' },
    loadingText: { attribute: 'loading-text' },
    listHeight: { type: Number, attribute: 'list-height' },
    virtual: { converter: trueUnlessFalse },
    name: { reflect: true },
    accessibleLabel: { attribute: 'aria-label' },
    query: { state: true },
    pos: { state: true },
  }

  value: unknown = undefined
  defaultValue: unknown = undefined
  options: any[] = []
  mode: 'single' | 'multiple' | 'tags' = 'single'
  fieldNames: AdvanceSelectFieldNames = {}
  size: 'sm' | 'default' | 'lg' = 'default'
  variant: 'outlined' | 'filled' | 'borderless' = 'outlined'
  status: 'default' | 'error' | 'warning' = 'default'
  placeholder = 'Select...'
  showSearch = false
  searchValue?: string
  autoClearSearchValue = true
  maxCount?: number
  maxTagCount?: number
  maxTagTextLength?: number
  maxTagPlaceholder?: string
  tokenSeparators: string[] = []
  hideSelected = false
  allowCreate = false
  disabled = false
  loading = false
  allowClear = true
  open = false
  defaultOpen = false
  defaultActiveFirstOption = true
  notFoundContent = 'No results.'
  loadingText = 'Loading...'
  listHeight = 300
  virtual = true
  name?: string
  accessibleLabel?: string

  private query = ''
  private pos: Record<string, string> = {}
  private initialValue: unknown = undefined
  private internals = this.attachInternals()

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'advance-select')
    if (this.defaultValue !== undefined && this.getAttribute('value') === null) {
      this.value = this.defaultValue
    }
    this.initialValue = this.value
    if (this.defaultOpen) {
      this.open = true
    }
    document.addEventListener('pointerdown', this.onDocumentPointerDown)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    document.removeEventListener('pointerdown', this.onDocumentPointerDown)
  }

  private onDocumentPointerDown = (e: PointerEvent) => {
    if (!this.open) return
    const path = e.composedPath()
    if (!path.includes(this)) {
      this.setOpen(false)
    }
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if (changed.has('value') || changed.has('name')) {
      if (!this.name || this.value == null) {
        this.internals.setFormValue(null)
      } else if (Array.isArray(this.value)) {
        const fd = new FormData()
        this.value.forEach((v) => fd.append(`${this.name}[]`, String(v)))
        this.internals.setFormValue(fd)
      } else {
        this.internals.setFormValue(String(this.value))
      }
    }
    if (changed.has('searchValue') && this.searchValue !== undefined) {
      this.query = this.searchValue
    }
  }

  formResetCallback() {
    this.commitValue(this.initialValue)
  }

  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled
  }

  private setOpen(v: boolean) {
    if (this.disabled || this.loading) return
    if (this.open === v) return
    this.open = v
    if (v) {
      this.place()
    } else if (this.autoClearSearchValue) {
      this.query = ''
    }
    this.dispatchEvent(new CustomEvent('open-change', { detail: { open: v }, bubbles: true, composed: true }))
  }

  private place() {
    this.updateComplete.then(() => {
      const t = this.trigger
      const p = this.popoverEl
      if (!t || !p) return
      const { style } = computePosition(t, p, { side: 'bottom', align: 'start', sideOffset: 4, matchWidth: true })
      this.pos = style
    })
  }

  private get trigger(): HTMLElement | null {
    return this.renderRoot?.querySelector('[role=combobox]')
  }

  private get popoverEl(): HTMLElement | null {
    return this.renderRoot?.querySelector('[data-slot=advance-select-popover]')
  }

  private get valueKey(): string {
    return this.fieldNames?.value ?? 'value'
  }
  private get labelKey(): string {
    return this.fieldNames?.label ?? 'label'
  }
  private get groupKey(): string {
    return this.fieldNames?.group ?? 'group'
  }
  private get disabledKey(): string {
    return this.fieldNames?.disabled ?? 'disabled'
  }

  private getValue(o: any): unknown {
    return readKey(o, this.valueKey, o)
  }
  private getLabel(o: any): string {
    return String(readKey(o, this.labelKey, ''))
  }
  private getGroup(o: any): string | undefined {
    const g = readKey(o, this.groupKey)
    return g == null ? undefined : String(g)
  }
  private isDisabledOption(o: any): boolean {
    return Boolean(readKey(o, this.disabledKey, false))
  }

  private get isMultiple(): boolean {
    return this.mode === 'multiple' || this.mode === 'tags'
  }

  private get selectedValues(): unknown[] {
    if (this.value == null) return []
    if (this.isMultiple) {
      return Array.isArray(this.value) ? this.value : []
    }
    return [this.value]
  }

  private get selectedSet(): Set<unknown> {
    return new Set(this.selectedValues)
  }

  private get selectedOptions(): any[] {
    return this.selectedValues.map((v) => {
      const found = this.options.find((o) => this.getValue(o) === v)
      if (found) return found
      return { [this.labelKey]: String(v), [this.valueKey]: v }
    })
  }

  private commitValue(next: unknown, opt?: any) {
    this.value = next
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
    this.dispatchEvent(
      new CustomEvent('value-change', {
        detail: { value: next, option: opt },
        bubbles: true,
        composed: true,
      }),
    )
  }

  private matchesFilter(o: any, q: string): boolean {
    const label = this.getLabel(o).toLowerCase()
    const search = q.toLowerCase()
    return label.includes(search)
  }

  private get filteredOptions(): any[] {
    let result = this.options ?? []
    const q = this.query.trim()
    if (q) {
      result = result.filter((o) => this.matchesFilter(o, q))
    }
    if (this.hideSelected && this.isMultiple) {
      const set = this.selectedSet
      result = result.filter((o) => !set.has(this.getValue(o)))
    }
    return result
  }

  private get grouped(): Array<{ heading?: string; items: any[] }> {
    const groups = new Map<string, any[]>()
    for (const opt of this.filteredOptions) {
      const key = this.getGroup(opt) ?? ''
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key)!.push(opt)
    }
    return Array.from(groups, ([heading, items]) => ({ heading: heading || undefined, items }))
  }

  private get atMax(): boolean {
    if (typeof this.maxCount !== 'number') return false
    const count = Array.isArray(this.value) ? this.value.length : this.value ? 1 : 0
    return count >= this.maxCount
  }

  private displayLabel(o: any): string {
    let label = this.getLabel(o)
    if (this.maxTagTextLength && label.length > this.maxTagTextLength) {
      label = label.slice(0, this.maxTagTextLength) + '...'
    }
    return label
  }

  private selectOption(opt: any) {
    if (this.isDisabledOption(opt)) return
    const v = this.getValue(opt)

    if (!this.isMultiple) {
      this.commitValue(v, opt)
      this.dispatchEvent(new CustomEvent('select', { detail: { value: v, option: opt }, bubbles: true, composed: true }))
      this.setOpen(false)
      if (this.autoClearSearchValue) this.setSearch('')
      return
    }

    const current = Array.isArray(this.value) ? [...this.value] : []
    const set = this.selectedSet
    if (set.has(v)) {
      const next = current.filter((x) => x !== v)
      this.commitValue(next, opt)
      this.dispatchEvent(new CustomEvent('deselect', { detail: { value: v, option: opt }, bubbles: true, composed: true }))
    } else {
      if (this.atMax) return
      const next = [...current, v]
      this.commitValue(next, opt)
      this.dispatchEvent(new CustomEvent('select', { detail: { value: v, option: opt }, bubbles: true, composed: true }))
    }

    if (this.autoClearSearchValue) this.setSearch('')
  }

  private removeTag(v: unknown, e: Event) {
    e.stopPropagation()
    if (this.disabled) return
    const current = Array.isArray(this.value) ? [...this.value] : []
    const next = current.filter((x) => x !== v)
    const opt = this.options.find((o) => this.getValue(o) === v)
    this.commitValue(next, opt)
    if (opt) {
      this.dispatchEvent(new CustomEvent('deselect', { detail: { value: v, option: opt }, bubbles: true, composed: true }))
    }
  }

  private clearAll(e?: Event) {
    e?.stopPropagation()
    if (this.disabled) return
    this.dispatchEvent(new CustomEvent('clear', { bubbles: true, composed: true }))
    if (this.isMultiple) {
      this.commitValue([])
    } else {
      this.commitValue(null)
    }
    this.setSearch('')
  }

  private setSearch(q: string) {
    this.query = q
    this.dispatchEvent(new CustomEvent('search-change', { detail: { searchValue: q }, bubbles: true, composed: true }))
  }

  private createTag() {
    if (!this.allowCreate && this.mode !== 'tags') return
    const q = this.query.trim()
    if (!q) return
    const exists = this.options.some((o) => this.getLabel(o) === q || String(this.getValue(o)) === q)
    if (exists) return

    const newOption = { [this.labelKey]: q, [this.valueKey]: q }

    if (!this.isMultiple) {
      this.commitValue(q, newOption)
      this.dispatchEvent(new CustomEvent('select', { detail: { value: q, option: newOption }, bubbles: true, composed: true }))
      this.setOpen(false)
      this.setSearch('')
      return
    }

    if (this.atMax) return
    const current = Array.isArray(this.value) ? [...this.value] : []
    const next = [...current, q]
    this.commitValue(next, newOption)
    this.dispatchEvent(new CustomEvent('select', { detail: { value: q, option: newOption }, bubbles: true, composed: true }))
    this.setSearch('')
  }

  private handleInputKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && this.query.trim() && this.mode === 'tags') {
      e.preventDefault()
      this.createTag()
    }
    if (this.tokenSeparators.length && this.mode === 'tags') {
      if (this.tokenSeparators.includes(e.key)) {
        e.preventDefault()
        this.createTag()
      }
    }
  }

  render() {
    const isMultiple = this.isMultiple
    const selectedOpts = this.selectedOptions
    const selectedSet = this.selectedSet
    const atMax = this.atMax

    const visibleTags =
      typeof this.maxTagCount === 'number' ? selectedOpts.slice(0, this.maxTagCount) : selectedOpts
    const hiddenTagCount =
      typeof this.maxTagCount === 'number' ? Math.max(0, selectedOpts.length - this.maxTagCount) : 0

    const isEmpty = isMultiple
      ? !Array.isArray(this.value) || this.value.length === 0
      : this.value == null || this.value === ''

    const showClear = this.allowClear && !isEmpty && !this.disabled && !this.loading
    const showSearchInput = this.showSearch || this.mode === 'tags'

    const triggerClasses = cn(
      'flex w-full items-center justify-between gap-2 rounded-md border text-sm transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 text-foreground',
      sizeClasses[this.size] ?? sizeClasses.default,
      variantClasses[this.variant] ?? variantClasses.outlined,
      statusClasses[this.status] ?? statusClasses.default,
    )

    const filtered = this.filteredOptions
    const grouped = this.grouped

    return html`
      <div part="base" class="relative w-full">
        <button
          part="trigger"
          type="button"
          role="combobox"
          aria-expanded=${this.open ? 'true' : 'false'}
          aria-invalid=${this.status === 'error' ? 'true' : nothing}
          aria-label=${this.accessibleLabel ?? nothing}
          ?disabled=${this.disabled || this.loading}
          data-slot="advance-select"
          class=${triggerClasses}
          @click=${() => this.setOpen(!this.open)}
        >
          <slot name="prefix"></slot>

          ${isMultiple
            ? html`
                <div
                  class="flex flex-1 flex-nowrap items-center gap-1 overflow-x-auto [scrollbar-width:none]"
                >
                  ${selectedOpts.length
                    ? html`
                        ${visibleTags.map(
                          (opt) => html`
                            <span
                              class="bg-muted text-foreground inline-flex h-6 items-center gap-1 rounded px-2 text-xs font-normal"
                            >
                              <span class="truncate">${this.displayLabel(opt)}</span>
                              ${!this.disabled
                                ? html`
                                    <span
                                      role="button"
                                      tabindex="0"
                                      class="hover:bg-muted-foreground/20 inline-flex items-center justify-center rounded-full p-0.5 transition-colors cursor-pointer"
                                      aria-label=${`Remove ${this.getLabel(opt)}`}
                                      @click=${(e: Event) => this.removeTag(this.getValue(opt), e)}
                                    >
                                      ${icon(X, 'x', 'size-3')}
                                    </span>
                                  `
                                : nothing}
                            </span>
                          `,
                        )}
                        ${hiddenTagCount > 0
                          ? html`
                              <span
                                class="bg-muted text-foreground inline-flex h-6 items-center rounded px-2 text-xs font-normal"
                              >
                                ${this.maxTagPlaceholder ?? `+${hiddenTagCount}`}
                              </span>
                            `
                          : nothing}
                      `
                    : html`<span class="text-muted-foreground truncate">${this.placeholder}</span>`}
                </div>
              `
            : html`
                <span
                  class=${cn(
                    'flex-1 truncate text-left',
                    selectedOpts.length ? 'text-foreground' : 'text-muted-foreground',
                  )}
                >
                  ${selectedOpts[0] ? this.getLabel(selectedOpts[0]) : this.placeholder}
                </span>
              `}

          <span class="flex shrink-0 items-center gap-1">
            <slot name="suffix"></slot>
            ${this.loading
              ? icon(Loader2, 'loader-2', 'text-muted-foreground size-4 animate-spin')
              : showClear
                ? html`
                    <span
                      role="button"
                      tabindex="0"
                      class="text-muted-foreground hover:text-foreground inline-flex cursor-pointer items-center rounded transition-colors"
                      aria-label="Clear selection"
                      @click=${(e: Event) => this.clearAll(e)}
                    >
                      ${icon(X, 'x', 'size-4')}
                    </span>
                  `
                : html`
                    <span class=${cn('text-muted-foreground size-4 shrink-0 opacity-50 transition-transform duration-200', this.open && 'rotate-180')}>
                      ${icon(ChevronDown, 'chevron-down', 'size-4')}
                    </span>
                  `}
          </span>
        </button>

        ${this.open
          ? html`
              <div
                part="content"
                data-slot="advance-select-popover"
                style=${styleMap({ ...this.pos, maxHeight: `${this.listHeight}px` })}
                class="bg-popover text-popover-foreground fixed inset-auto m-0 z-50 overflow-hidden rounded-md border shadow-md flex flex-col"
              >
                ${showSearchInput
                  ? html`
                      <div class="border-b p-2">
                        <input
                          .value=${this.query}
                          placeholder=${this.placeholder}
                          class="border-input focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px] text-foreground placeholder:text-muted-foreground"
                          @input=${(e: Event) => this.setSearch((e.target as HTMLInputElement).value)}
                          @keydown=${this.handleInputKeydown}
                        />
                      </div>
                    `
                  : nothing}

                <div class="flex-1 overflow-y-auto p-1 max-h-64">
                  ${!this.loading && filtered.length === 0
                    ? html`<div class="text-muted-foreground py-6 text-center text-sm">${this.notFoundContent}</div>`
                    : nothing}
                  ${this.loading && filtered.length === 0
                    ? html`<div class="text-muted-foreground py-6 text-center text-sm">${this.loadingText}</div>`
                    : nothing}

                  ${grouped.map(
                    (group, gi) => html`
                      ${group.heading
                        ? html`
                            <div class="text-muted-foreground px-2 py-1.5 text-xs font-semibold">
                              ${group.heading}
                            </div>
                          `
                        : nothing}
                      ${group.items.map((opt) => {
                        const v = this.getValue(opt)
                        const isSelected = selectedSet.has(v)
                        const disabled = this.isDisabledOption(opt) || (atMax && !isSelected)
                        return html`
                          <button
                            type="button"
                            ?disabled=${disabled}
                            class=${cn(
                              'relative flex w-full cursor-pointer items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-none select-none hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground',
                              disabled && 'pointer-events-none opacity-50 cursor-not-allowed',
                            )}
                            @click=${() => this.selectOption(opt)}
                          >
                            <span class=${cn('size-4 shrink-0 flex items-center justify-center', isSelected ? 'opacity-100' : 'opacity-0')}>
                              ${icon(Check, 'check', 'size-4')}
                            </span>
                            <span class="flex-1 truncate text-left">${this.getLabel(opt)}</span>
                          </button>
                        `
                      })}
                    `,
                  )}

                  ${this.query.trim() &&
                  (this.allowCreate || this.mode === 'tags') &&
                  !this.options.some((o) => this.getLabel(o) === this.query.trim())
                    ? html`
                        <button
                          type="button"
                          class="relative flex w-full cursor-pointer items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-none select-none hover:bg-accent hover:text-accent-foreground text-left"
                          @click=${this.createTag}
                        >
                          <span class="size-4 shrink-0 opacity-0"></span>
                          <span>Create "${this.query.trim()}"</span>
                        </button>
                      `
                    : nothing}
                </div>

                ${isMultiple && selectedOpts.length > 0
                  ? html`
                      <div class="flex items-center justify-between border-t px-2 py-1.5 text-xs">
                        <span class="text-muted-foreground">${selectedOpts.length} selected</span>
                        <button
                          type="button"
                          class="text-muted-foreground hover:text-foreground cursor-pointer"
                          @click=${() => this.clearAll()}
                        >
                          Clear all
                        </button>
                      </div>
                    `
                  : nothing}
              </div>
            `
          : nothing}
      </div>
    `
  }
}

customElements.get('uip-advance-select') || customElements.define('uip-advance-select', UipAdvanceSelect)

declare global {
  interface HTMLElementTagNameMap {
    'uip-advance-select': UipAdvanceSelect
  }
}

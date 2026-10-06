import { LitElement, css, html, nothing } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { Check, ChevronDown, ChevronRight, Loader2, Search, X } from 'lucide'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { icon } from '../../lib/icon'
import { computePosition } from '../../lib/position'

export interface CascadeOption {
  value: string
  label: string
  disabled?: boolean
  children?: CascadeOption[]
  [key: string]: unknown
}

function findPathIndices(options: CascadeOption[], values: string[]): number[] {
  const indices: number[] = []
  let current = options
  for (const val of values) {
    const idx = current.findIndex((o) => o.value === val)
    if (idx === -1) return indices
    indices.push(idx)
    const next = current[idx]?.children
    if (!next?.length) break
    current = next
  }
  return indices
}

function buildPathFromIndices(options: CascadeOption[], indices: number[]): CascadeOption[] {
  const path: CascadeOption[] = []
  let current = options
  for (const idx of indices) {
    if (idx == null || !current[idx]) break
    const opt = current[idx]!
    path.push(opt)
    if (!opt.children?.length) break
    current = opt.children
  }
  return path
}

const sizeClasses = {
  sm: 'h-8 text-xs px-2.5',
  default: 'h-9 text-sm px-3',
  lg: 'h-11 text-base px-4',
}

const jsonConverter = {
  fromAttribute: (v: string | null) => {
    if (!v) return undefined
    try {
      return JSON.parse(v)
    } catch {
      return undefined
    }
  },
  toAttribute: (v: unknown) => (v ? JSON.stringify(v) : null),
}

const trueUnlessFalse = {
  fromAttribute: (v: string | null) => v !== 'false',
}

/**
 * <uip-cascade-select> — the registry CascadeSelect as a web component.
 *
 * Form-associated: submits `name[]=val` per path segment with its <form>.
 */
export class UipCascadeSelect extends LitElement {
  static formAssociated = true
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true }
  static styles = [tailwind, css`:host { display: block; width: 100%; }`]

  static properties = {
    value: { converter: jsonConverter },
    defaultValue: { attribute: 'default-value', converter: jsonConverter },
    options: { converter: jsonConverter },
    placeholder: {},
    searchable: { converter: trueUnlessFalse },
    clearable: { converter: trueUnlessFalse },
    disabled: { type: Boolean, reflect: true },
    loading: { type: Boolean, reflect: true },
    size: { reflect: true },
    separator: {},
    searchPlaceholder: { attribute: 'search-placeholder' },
    emptyText: { attribute: 'empty-text' },
    name: { reflect: true },
    accessibleLabel: { attribute: 'aria-label' },
    isOpen: { state: true },
    activePath: { state: true },
    search: { state: true },
    pos: { state: true },
  }

  value: string[] | null = null
  defaultValue: string[] | null = null
  options: CascadeOption[] = []
  placeholder = 'Select...'
  searchable = true
  clearable = true
  disabled = false
  loading = false
  size: 'sm' | 'default' | 'lg' = 'default'
  separator = ' / '
  searchPlaceholder = 'Search...'
  emptyText = 'No options.'
  name?: string
  accessibleLabel?: string

  private isOpen = false
  private activePath: number[] = []
  private search = ''
  private pos: Record<string, string> = {}
  private initialValue: string[] | null = null
  private internals = this.attachInternals()

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'cascade-select')
    if (this.defaultValue !== undefined && this.getAttribute('value') === null) {
      this.value = this.defaultValue
    }
    this.initialValue = this.value
    document.addEventListener('pointerdown', this.onDocumentPointerDown)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    document.removeEventListener('pointerdown', this.onDocumentPointerDown)
  }

  private onDocumentPointerDown = (e: PointerEvent) => {
    if (!this.isOpen) return
    const path = e.composedPath()
    if (!path.includes(this)) {
      this.close()
    }
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if (changed.has('value') || changed.has('name')) {
      if (!this.name || !this.value) {
        this.internals.setFormValue(null)
      } else {
        const fd = new FormData()
        this.value.forEach((v) => fd.append(`${this.name}[]`, v))
        this.internals.setFormValue(fd)
      }
    }
  }

  formResetCallback() {
    this.commitValue(this.initialValue, [])
    this.activePath = []
  }

  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled
  }

  private get trigger(): HTMLElement | null {
    return this.renderRoot?.querySelector('[role=combobox]')
  }

  private get popoverEl(): HTMLElement | null {
    return this.renderRoot?.querySelector('[data-slot=cascade-popover]')
  }

  private toggleOpen() {
    if (this.disabled || this.loading) return
    if (this.isOpen) this.close()
    else this.open()
  }

  private open() {
    this.isOpen = true
    if (this.value?.length) {
      this.activePath = findPathIndices(this.options, this.value)
    } else {
      this.activePath = []
    }
    this.search = ''
    this.place()
  }

  private close() {
    this.isOpen = false
    this.search = ''
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

  private commitValue(values: string[] | null, path: CascadeOption[]) {
    this.value = values
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
    this.dispatchEvent(
      new CustomEvent('value-change', {
        detail: { value: values, path },
        bubbles: true,
        composed: true,
      }),
    )
  }

  private getOptionsAtLevel(level: number): CascadeOption[] {
    let current = this.options
    for (let i = 0; i < level; i++) {
      const idx = this.activePath[i]
      if (idx == null || !current[idx]?.children?.length) return []
      current = current[idx]!.children!
    }
    return current
  }

  private selectAtLevel(level: number, index: number) {
    const option = this.getOptionsAtLevel(level)[index]
    if (option?.disabled) return
    const next = [...this.activePath]
    next[level] = index
    next.splice(level + 1)
    this.activePath = next

    // If leaf node, emit value and close
    if (!option?.children?.length) {
      const path = buildPathFromIndices(this.options, next)
      const values = path.map((p) => p.value)
      this.commitValue(values, path)
      this.close()
    }
  }

  private clearAll(e?: Event) {
    e?.stopPropagation()
    if (this.disabled) return
    this.commitValue(null, [])
    this.activePath = []
    this.dispatchEvent(new CustomEvent('clear', { bubbles: true, composed: true }))
  }

  private get searchResults(): { path: CascadeOption[]; values: string[] }[] | null {
    const q = this.search.trim().toLowerCase()
    if (!q) return null
    const results: { path: CascadeOption[]; values: string[] }[] = []
    const walk = (opts: CascadeOption[], path: CascadeOption[], values: string[]) => {
      for (const opt of opts) {
        const newPath = [...path, opt]
        const newValues = [...values, opt.value]
        if (opt.label.toLowerCase().includes(q) && !opt.children?.length) {
          results.push({ path: newPath, values: newValues })
        }
        if (opt.children?.length) {
          walk(opt.children, newPath, newValues)
        }
      }
    }
    walk(this.options, [], [])
    return results
  }

  private selectSearchResult(result: { path: CascadeOption[]; values: string[] }) {
    this.commitValue(result.values, result.path)
    this.close()
  }

  render() {
    const selectedPath =
      this.value?.length ? buildPathFromIndices(this.options, findPathIndices(this.options, this.value)) : []
    const displayLabel =
      selectedPath.length > 0 ? selectedPath.map((p) => p.label).join(this.separator) : this.placeholder
    const hasVal = selectedPath.length > 0

    const levels: { options: CascadeOption[]; level: number }[] = [{ options: this.options, level: 0 }]
    for (let i = 0; i < this.activePath.length; i++) {
      const idx = this.activePath[i]
      const current = levels[i]!.options
      if (idx == null || !current[idx]?.children?.length) break
      levels.push({ options: current[idx]!.children!, level: i + 1 })
    }

    const searchResults = this.searchResults

    return html`
      <div part="base" class="relative w-full">
        <button
          part="trigger"
          type="button"
          role="combobox"
          aria-expanded=${this.isOpen ? 'true' : 'false'}
          aria-haspopup="listbox"
          aria-label=${this.accessibleLabel ?? nothing}
          ?disabled=${this.disabled || this.loading}
          data-slot="cascade-select"
          class=${cn(
            'flex w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent text-sm shadow-xs transition-[color,box-shadow] outline-none',
            'hover:border-ring/50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
            'disabled:cursor-not-allowed disabled:opacity-50 text-foreground',
            sizeClasses[this.size] ?? sizeClasses.default,
          )}
          @click=${this.toggleOpen}
        >
          <span class=${cn('flex-1 truncate text-left', hasVal ? 'text-foreground' : 'text-muted-foreground')}>
            ${displayLabel}
          </span>
          <span class="flex shrink-0 items-center gap-1">
            ${this.loading
              ? icon(Loader2, 'loader-2', 'text-muted-foreground size-4 animate-spin')
              : this.clearable && hasVal && !this.disabled
                ? html`
                    <span
                      role="button"
                      tabindex="0"
                      aria-label="Clear selection"
                      class="text-muted-foreground hover:text-foreground flex size-4 items-center justify-center rounded transition-colors cursor-pointer"
                      @click=${(e: Event) => this.clearAll(e)}
                    >
                      ${icon(X, 'x', 'size-4')}
                    </span>
                  `
                : html`
                    <span class=${cn('text-muted-foreground size-4 shrink-0 transition-transform duration-200', this.isOpen && 'rotate-180')}>
                      ${icon(ChevronDown, 'chevron-down', 'size-4')}
                    </span>
                  `}
          </span>
        </button>

        ${this.isOpen
          ? html`
              <div
                part="content"
                data-slot="cascade-popover"
                style=${styleMap(this.pos)}
                class="bg-popover text-popover-foreground fixed inset-auto m-0 z-50 max-h-80 min-w-44 overflow-hidden rounded-md border shadow-md"
              >
                <div class="flex max-h-80 flex-col">
                  ${this.searchable
                    ? html`
                        <div class="border-b p-2">
                          <div class="relative">
                            <span class="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2 pointer-events-none">
                              ${icon(Search, 'search', 'size-4')}
                            </span>
                            <input
                              .value=${this.search}
                              placeholder=${this.searchPlaceholder}
                              aria-label="Search options"
                              class="border-input focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent pl-8 text-sm shadow-xs outline-none focus-visible:ring-[3px] text-foreground placeholder:text-muted-foreground"
                              @input=${(e: Event) => (this.search = (e.target as HTMLInputElement).value)}
                            />
                          </div>
                        </div>
                      `
                    : nothing}

                  ${this.loading
                    ? html`
                        <div class="text-muted-foreground flex items-center justify-center gap-2 py-6 text-sm">
                          ${icon(Loader2, 'loader-2', 'size-4 animate-spin')}
                          Loading...
                        </div>
                      `
                    : searchResults
                      ? html`
                          <div class="flex-1 overflow-y-auto p-1 max-h-64">
                            ${searchResults.length === 0
                              ? html`<div class="text-muted-foreground py-6 text-center text-sm">${this.emptyText}</div>`
                              : searchResults.map(
                                  (result, i) => html`
                                    <button
                                      type="button"
                                      class="hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring/50 flex w-full items-center gap-1.5 rounded-sm px-2 py-1.5 text-left text-sm outline-none focus-visible:ring-2"
                                      @click=${() => this.selectSearchResult(result)}
                                    >
                                      <span class="flex-1 truncate">
                                        ${result.path.map((p) => p.label).join(this.separator)}
                                      </span>
                                    </button>
                                  `,
                                )}
                          </div>
                        `
                      : html`
                          <div class="flex flex-1 overflow-x-auto overflow-y-hidden">
                            ${levels.map(
                              (lvl) => html`
                                <div class="max-w-56 min-w-44 shrink-0 overflow-y-auto border-r p-1 last:border-r-0 max-h-72">
                                  ${lvl.options.map(
                                    (opt, idx) => html`
                                      <button
                                        type="button"
                                        ?disabled=${opt.disabled}
                                        class=${cn(
                                          'flex w-full items-center justify-between gap-1.5 rounded-sm px-2 py-1.5 text-left text-sm outline-none',
                                          'hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring/50 focus-visible:ring-2',
                                          'disabled:cursor-not-allowed disabled:opacity-50',
                                          this.activePath[lvl.level] === idx && 'bg-accent text-accent-foreground font-medium',
                                        )}
                                        @click=${() => this.selectAtLevel(lvl.level, idx)}
                                      >
                                        <span class="flex-1 truncate">${opt.label}</span>
                                        ${this.activePath[lvl.level] === idx && !opt.children?.length
                                          ? icon(Check, 'check', 'size-4 shrink-0')
                                          : opt.children?.length
                                            ? icon(ChevronRight, 'chevron-right', 'text-muted-foreground size-3.5 shrink-0')
                                            : nothing}
                                      </button>
                                    `,
                                  )}
                                </div>
                              `,
                            )}
                          </div>
                        `}
                </div>
              </div>
            `
          : nothing}
      </div>
    `
  }
}

customElements.get('uip-cascade-select') || customElements.define('uip-cascade-select', UipCascadeSelect)

declare global {
  interface HTMLElementTagNameMap {
    'uip-cascade-select': UipCascadeSelect
  }
}

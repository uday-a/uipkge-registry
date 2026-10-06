import { LitElement, css, html, nothing } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { Calendar } from 'lucide'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { icon } from '../../lib/icon'
import { computePosition } from '../../lib/position'

export interface MentionOption {
  value: string
  label: string
  description?: string
  avatar?: string
  email?: string
  handle?: string
  bio?: string
  joined?: string
  following?: number | string
  followers?: number | string
  verified?: boolean
  disabled?: boolean
  [key: string]: unknown
}

const PROPERTIES_TO_COPY = [
  'direction',
  'boxSizing',
  'width',
  'height',
  'overflowX',
  'overflowY',
  'borderTopWidth',
  'borderRightWidth',
  'borderBottomWidth',
  'borderLeftWidth',
  'borderStyle',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'fontStyle',
  'fontVariant',
  'fontWeight',
  'fontStretch',
  'fontSize',
  'fontSizeAdjust',
  'lineHeight',
  'fontFamily',
  'textAlign',
  'textTransform',
  'textIndent',
  'textDecoration',
  'letterSpacing',
  'wordSpacing',
  'tabSize',
  'whiteSpace',
  'wordBreak',
  'wordWrap',
] as const

interface CaretRect {
  top: number
  left: number
  height: number
}

function getCaretRect(textarea: HTMLTextAreaElement, position: number): CaretRect {
  if (typeof document === 'undefined') return { top: 0, left: 0, height: 16 }
  const div = document.createElement('div')
  document.body.appendChild(div)

  const style = div.style
  const computed = window.getComputedStyle(textarea)

  style.position = 'absolute'
  style.visibility = 'hidden'
  style.whiteSpace = 'pre-wrap'
  style.wordWrap = 'break-word'
  style.top = '0'
  style.left = '0'

  for (const prop of PROPERTIES_TO_COPY) {
    ;(style as any)[prop] = (computed as any)[prop]
  }

  style.overflow = 'hidden'

  const text = textarea.value.substring(0, position)
  div.textContent = text

  const span = document.createElement('span')
  span.textContent = textarea.value.substring(position) || '.'
  div.appendChild(span)

  const spanRect = span.getBoundingClientRect()
  const divRect = div.getBoundingClientRect()
  const taRect = textarea.getBoundingClientRect()

  const result: CaretRect = {
    top: taRect.top + (spanRect.top - divRect.top) - textarea.scrollTop,
    left: taRect.left + (spanRect.left - divRect.left) - textarea.scrollLeft,
    height: spanRect.height,
  }

  document.body.removeChild(div)
  return result
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

const stringListConverter = {
  fromAttribute: (v: string | null): string[] => {
    if (!v) return ['@']
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

let uid = 0

/**
 * <uip-mentions> — the registry Mentions textarea as a web component.
 *
 * Form-associated: submits `name=value` with its <form>.
 */
export class UipMentions extends LitElement {
  static formAssociated = true
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true }
  static styles = [tailwind, css`:host { display: block; position: relative; width: 100%; }`]

  static properties = {
    value: { reflect: true },
    defaultValue: { attribute: 'default-value' },
    options: { converter: jsonConverter },
    triggers: { converter: stringListConverter },
    triggerPrefixes: { attribute: 'trigger-prefixes', converter: jsonConverter },
    prefixText: { attribute: 'prefix' },
    rows: { type: Number },
    loading: { type: Boolean, reflect: true },
    placeholder: {},
    disabled: { type: Boolean, reflect: true },
    readOnly: { type: Boolean, attribute: 'readonly', reflect: true },
    name: { reflect: true },
    accessibleLabel: { attribute: 'aria-label' },
    open: { state: true },
    activeTrigger: { state: true },
    query: { state: true },
    highlightedIndex: { state: true },
    pos: { state: true },
  }

  value = ''
  defaultValue?: string
  options: MentionOption[] | Record<string, MentionOption[]> = []
  triggers: string[] = ['@']
  triggerPrefixes?: Record<string, string>
  prefixText = '@'
  rows = 4
  loading = false
  placeholder = ''
  disabled = false
  readOnly = false
  name?: string
  accessibleLabel?: string

  loadOptions?: (query: string, trigger: string) => Promise<MentionOption[]>

  private open = false
  private activeTrigger = '@'
  private query = ''
  private triggerIndex = -1
  private highlightedIndex = 0
  private asyncResults: MentionOption[] = []
  private isAsyncLoading = false
  private pos: Record<string, string> = {}
  private initialValue = ''
  private listboxId = `mentions-list-${++uid}`
  private internals = this.attachInternals()
  private debounceTimer?: ReturnType<typeof setTimeout>

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'mentions')
    if (this.defaultValue !== undefined && this.getAttribute('value') === null) {
      this.value = this.defaultValue
    }
    this.initialValue = this.value
    document.addEventListener('pointerdown', this.onDocumentPointerDown)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    document.removeEventListener('pointerdown', this.onDocumentPointerDown)
    if (this.debounceTimer) clearTimeout(this.debounceTimer)
  }

  private onDocumentPointerDown = (e: PointerEvent) => {
    if (!this.open) return
    const path = e.composedPath()
    if (!path.includes(this)) {
      this.open = false
    }
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if (changed.has('value') || changed.has('name')) {
      this.internals.setFormValue(this.value ?? '')
    }
  }

  formResetCallback() {
    this.value = this.initialValue
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
  }

  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled
  }

  private get textarea(): HTMLTextAreaElement | null {
    return this.renderRoot?.querySelector('textarea')
  }

  private get popoverEl(): HTMLElement | null {
    return this.renderRoot?.querySelector('[data-slot=mentions-popover]')
  }

  private get currentOptionsList(): MentionOption[] {
    if (!this.options) return []
    if (Array.isArray(this.options)) return this.options
    if (typeof this.options === 'object') {
      return (this.options as Record<string, MentionOption[]>)[this.activeTrigger] ?? []
    }
    return []
  }

  private get filtered(): MentionOption[] {
    if (this.loadOptions) return this.asyncResults
    const source = this.currentOptionsList
    if (!this.query) return source
    const q = this.query.toLowerCase()
    return source.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        o.value.toLowerCase().includes(q) ||
        (o.email && o.email.toLowerCase().includes(q)),
    )
  }

  private findActiveMention(val: string, caret: number): { trigger: string; index: number; query: string } | null {
    const triggers = this.triggers ?? ['@']
    for (let i = caret - 1; i >= 0; i--) {
      const ch = val[i]!
      if (triggers.includes(ch)) {
        const before = i === 0 ? '' : val[i - 1]!
        if (i === 0 || /\s/.test(before)) {
          return { trigger: ch, index: i, query: val.substring(i + 1, caret) }
        }
        return null
      }
      if (/\s/.test(ch)) return null
    }
    return null
  }

  private updatePosition() {
    const ta = this.textarea
    if (!ta) return
    const rect = getCaretRect(ta, ta.selectionStart ?? 0)
    this.pos = {
      position: 'fixed',
      top: `${rect.top + rect.height + 4}px`,
      left: `${rect.left}px`,
      zIndex: '50',
    }
  }

  private scheduleAsync(trigger: string, q: string) {
    if (this.debounceTimer) clearTimeout(this.debounceTimer)
    this.debounceTimer = setTimeout(async () => {
      if (!this.loadOptions) return
      this.isAsyncLoading = true
      try {
        const res = await this.loadOptions(q, trigger)
        this.asyncResults = res
      } finally {
        this.isAsyncLoading = false
      }
    }, 200)
  }

  private onInput(e: Event) {
    const target = e.target as HTMLTextAreaElement
    const next = target.value
    this.value = next
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
    this.dispatchEvent(new CustomEvent('value-change', { detail: { value: next }, bubbles: true, composed: true }))

    const match = this.findActiveMention(next, target.selectionStart ?? 0)
    if (match) {
      this.open = true
      this.activeTrigger = match.trigger
      this.triggerIndex = match.index
      this.query = match.query
      this.highlightedIndex = 0
      this.dispatchEvent(
        new CustomEvent('search', {
          detail: { trigger: match.trigger, query: match.query },
          bubbles: true,
          composed: true,
        }),
      )
      if (this.loadOptions) this.scheduleAsync(match.trigger, match.query)
      requestAnimationFrame(() => this.updatePosition())
    } else {
      this.open = false
    }
  }

  private insert(option: MentionOption) {
    const ta = this.textarea
    if (!ta) return
    const caret = ta.selectionStart ?? 0
    const before = this.value.substring(0, this.triggerIndex)
    const after = this.value.substring(caret)
    const prefix = this.triggerPrefixes?.[this.activeTrigger] ?? this.activeTrigger ?? this.prefixText ?? '@'
    const token = `${prefix}${option.value} `
    const next = before + token + after
    this.value = next
    this.open = false

    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
    this.dispatchEvent(new CustomEvent('value-change', { detail: { value: next }, bubbles: true, composed: true }))
    this.dispatchEvent(new CustomEvent('select', { detail: { option }, bubbles: true, composed: true }))

    requestAnimationFrame(() => {
      const pos = before.length + token.length
      ta.focus()
      ta.setSelectionRange(pos, pos)
    })
  }

  private onKeyDown(e: KeyboardEvent) {
    if (!this.open) return
    if (e.key === 'Escape') {
      e.preventDefault()
      this.open = false
      return
    }
    const filtered = this.filtered
    if (filtered.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      this.highlightedIndex = (this.highlightedIndex + 1) % filtered.length
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      this.highlightedIndex = (this.highlightedIndex - 1 + filtered.length) % filtered.length
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault()
      const opt = filtered[this.highlightedIndex]
      if (opt && !opt.disabled) this.insert(opt)
    }
  }

  render() {
    const filtered = this.filtered
    const isLoading = this.loading || this.isAsyncLoading

    return html`
      <div part="base" class="relative w-full" data-uipkge="" data-slot="mentions">
        <textarea
          part="textarea"
          .value=${this.value}
          rows=${this.rows}
          placeholder=${this.placeholder}
          ?disabled=${this.disabled}
          ?readonly=${this.readOnly}
          name=${this.name ?? nothing}
          role="combobox"
          aria-autocomplete="list"
          aria-haspopup="listbox"
          aria-expanded=${this.open ? 'true' : 'false'}
          aria-controls=${this.listboxId}
          aria-label=${this.accessibleLabel ?? nothing}
          class="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-16 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          @input=${this.onInput}
          @keydown=${this.onKeyDown}
          @scroll=${() => this.updatePosition()}
        ></textarea>

        ${this.open
          ? html`
              <div
                part="popover"
                data-slot="mentions-popover"
                style=${styleMap(this.pos)}
                class="border-border/80 bg-popover text-popover-foreground w-64 rounded-lg p-1 shadow-md border fixed"
              >
                <div id=${this.listboxId}>
                  ${isLoading
                    ? html`<div class="text-muted-foreground px-2 py-3 text-sm" role="status">Loading...</div>`
                    : filtered.length === 0
                      ? html`<div class="text-muted-foreground px-2 py-3 text-sm" role="status">No matches</div>`
                      : html`
                          <ul class="max-h-64 overflow-auto" role="listbox" aria-label="Mentions">
                            ${filtered.map((opt, i) => {
                              const active = i === this.highlightedIndex
                              return html`
                                <li
                                  role="option"
                                  aria-selected=${active ? 'true' : 'false'}
                                  aria-disabled=${opt.disabled ? 'true' : nothing}
                                  class=${cn(
                                    'flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
                                    active && !opt.disabled ? 'bg-accent text-accent-foreground' : '',
                                    opt.disabled ? 'cursor-not-allowed opacity-50' : '',
                                  )}
                                  @mouseenter=${() => !opt.disabled && (this.highlightedIndex = i)}
                                  @mousedown=${(e: MouseEvent) => {
                                    e.preventDefault()
                                    if (!opt.disabled) this.insert(opt)
                                  }}
                                >
                                  ${opt.avatar
                                    ? html`<img src=${opt.avatar} alt="" class="size-6 rounded-full object-cover" />`
                                    : nothing}
                                  <div class="min-w-0 flex-1">
                                    <div class="truncate font-medium">${opt.label}</div>
                                    ${opt.description || opt.email
                                      ? html`<div class="text-muted-foreground truncate text-xs">
                                          ${opt.description || opt.email}
                                        </div>`
                                      : nothing}
                                  </div>
                                </li>
                              `
                            })}
                          </ul>
                        `}
                </div>
              </div>
            `
          : nothing}
      </div>
    `
  }
}

/* -------------------------------------------------------------------------- */
/*                                UipMentionTag                               */
/* -------------------------------------------------------------------------- */

export class UipMentionTag extends LitElement {
  static styles = [tailwind, css`:host { display: inline-block; vertical-align: baseline; }`]

  static properties = {
    trigger: {},
    name: {},
    handle: {},
    email: {},
    avatar: {},
    bio: {},
    joined: {},
    location: {},
    following: {},
    followers: {},
    verified: { type: Boolean, reflect: true },
    href: {},
    popoverEnabled: { converter: trueUnlessFalse, attribute: 'popover' },
    isHovered: { state: true },
    isFollowing: { state: true },
    pos: { state: true },
  }

  trigger = '@'
  name?: string
  handle?: string
  email?: string
  avatar?: string
  bio?: string
  joined?: string
  location?: string
  following?: number | string
  followers?: number | string
  verified = false
  href?: string
  popoverEnabled = true

  private isHovered = false
  private isFollowing = false
  private pos: Record<string, string> = {}
  private hoverTimer?: ReturnType<typeof setTimeout>

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'mention-tag')
    this.addEventListener('mouseenter', this.onMouseEnter)
    this.addEventListener('mouseleave', this.onMouseLeave)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.removeEventListener('mouseenter', this.onMouseEnter)
    this.removeEventListener('mouseleave', this.onMouseLeave)
    if (this.hoverTimer) clearTimeout(this.hoverTimer)
  }

  private onMouseEnter = () => {
    if (!this.popoverEnabled) return
    if (this.hoverTimer) clearTimeout(this.hoverTimer)
    this.hoverTimer = setTimeout(() => {
      this.isHovered = true
      this.updateComplete.then(() => {
        const trigger = this.renderRoot?.querySelector('[data-slot=mention-tag-anchor]')
        const popover = this.renderRoot?.querySelector('[data-slot=mention-card]')
        if (trigger && popover) {
          const { style } = computePosition(trigger, popover as HTMLElement, { side: 'bottom', align: 'start', sideOffset: 6 })
          this.pos = style
        }
      })
    }, 150)
  }

  private onMouseLeave = () => {
    if (this.hoverTimer) clearTimeout(this.hoverTimer)
    this.hoverTimer = setTimeout(() => {
      this.isHovered = false
    }, 100)
  }

  render() {
    const formattedHandle = this.handle || this.name || ''
    const fullHandle = formattedHandle.startsWith(this.trigger) ? formattedHandle : `${this.trigger}${formattedHandle}`
    const initials = (this.name || this.handle || 'U').slice(0, 2).toUpperCase()

    const triggerContent = html`
      <span
        data-slot="mention-tag-anchor"
        class="inline-flex cursor-pointer items-center gap-0.5 rounded px-1.5 py-0.5 text-sm font-medium transition-colors select-none bg-muted/70 text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none"
      >
        <span class="text-primary font-semibold">${this.trigger}</span>
        <span>${this.name || this.handle || this.email}</span>
      </span>
    `

    return html`
      <span class="relative inline-block">
        ${this.href
          ? html`<a href=${this.href} class="no-underline text-inherit">${triggerContent}</a>`
          : triggerContent}

        ${this.popoverEnabled && this.isHovered
          ? html`
              <div
                data-slot="mention-card"
                style=${styleMap(this.pos)}
                class="border-border/80 bg-popover text-popover-foreground fixed inset-auto m-0 z-50 w-80 rounded-xl p-4 shadow-lg border"
                @mouseenter=${() => {
                  if (this.hoverTimer) clearTimeout(this.hoverTimer)
                }}
                @mouseleave=${this.onMouseLeave}
              >
                <div class="space-y-3">
                  <div class="flex items-start justify-between gap-3">
                    <div class="ring-border/50 size-12 ring-2 relative rounded-full overflow-hidden flex items-center justify-center bg-muted text-foreground text-sm font-semibold">
                      ${this.avatar
                        ? html`<img src=${this.avatar} alt=${this.name || this.handle || ''} class="size-full object-cover" />`
                        : initials}
                    </div>
                    <button
                      type="button"
                      class=${cn(
                        'h-8 rounded-full px-3.5 text-xs font-semibold transition-[transform,background-color] duration-150 active:scale-95',
                        this.isFollowing
                          ? 'border-border text-foreground hover:bg-muted border bg-transparent'
                          : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs',
                      )}
                      @click=${(e: Event) => {
                        e.stopPropagation()
                        this.isFollowing = !this.isFollowing
                      }}
                    >
                      ${this.isFollowing ? 'Following' : 'Follow'}
                    </button>
                  </div>

                  <div>
                    <div class="flex items-center gap-1">
                      <span class="text-foreground text-sm font-bold tracking-tight">${this.name || this.handle}</span>
                      ${this.verified
                        ? html`
                            <span class="text-primary inline-flex" title="Verified">
                              <svg class="size-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                              </svg>
                            </span>
                          `
                        : nothing}
                    </div>
                    <p class="text-muted-foreground font-mono text-xs">${fullHandle}</p>
                    ${this.email ? html`<p class="text-muted-foreground mt-0.5 text-xs">${this.email}</p>` : nothing}
                  </div>

                  ${this.bio ? html`<p class="text-foreground/90 text-xs leading-relaxed">${this.bio}</p>` : nothing}

                  ${this.joined || this.location
                    ? html`
                        <div class="text-muted-foreground flex items-center gap-4 text-xs">
                          ${this.joined
                            ? html`
                                <div class="flex items-center gap-1">
                                  ${icon(Calendar, 'calendar', 'size-3.5 opacity-70')}
                                  <span>Joined ${this.joined}</span>
                                </div>
                              `
                            : nothing}
                        </div>
                      `
                    : nothing}

                  ${this.following !== undefined || this.followers !== undefined
                    ? html`
                        <div class="border-border/50 flex items-center gap-4 border-t pt-1 text-xs">
                          ${this.following !== undefined
                            ? html`
                                <div>
                                  <span class="text-foreground font-bold">${this.following}</span>
                                  <span class="text-muted-foreground ml-1">Following</span>
                                </div>
                              `
                            : nothing}
                          ${this.followers !== undefined
                            ? html`
                                <div>
                                  <span class="text-foreground font-bold">${this.followers}</span>
                                  <span class="text-muted-foreground ml-1">Followers</span>
                                </div>
                              `
                            : nothing}
                        </div>
                      `
                    : nothing}
                </div>
              </div>
            `
          : nothing}
      </span>
    `
  }
}

customElements.get('uip-mentions') || customElements.define('uip-mentions', UipMentions)
customElements.get('uip-mention-tag') || customElements.define('uip-mention-tag', UipMentionTag)

declare global {
  interface HTMLElementTagNameMap {
    'uip-mentions': UipMentions
    'uip-mention-tag': UipMentionTag
  }
}

import { LitElement, css, html, nothing } from 'lit'
import { Braces, Check, ChevronDown, ChevronRight, Copy, FoldVertical, Search, UnfoldVertical } from 'lucide'
import { cn } from '../../lib/utils'
import { icon } from '../../lib/icon'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'

export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue }

function pathKey(path: (string | number)[]): string {
  return path.length ? path.map((p) => (typeof p === 'number' ? `[${p}]` : `.${p}`)).join('') : '$'
}

function typeOf(val: JsonValue): 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null' {
  if (val === null) return 'null'
  if (Array.isArray(val)) return 'array'
  return typeof val as 'object' | 'string' | 'number' | 'boolean'
}

function formatValue(val: JsonValue): string {
  if (val === null) return 'null'
  if (typeof val === 'string') return JSON.stringify(val)
  return String(val)
}

const typeColor: Record<string, string> = {
  string: 'text-emerald-600 dark:text-emerald-400',
  number: 'text-blue-600 dark:text-blue-400',
  boolean: 'text-amber-600 dark:text-amber-400',
  null: 'text-muted-foreground italic',
  object: 'text-foreground',
  array: 'text-foreground',
}

const keyColor = 'text-violet-600 dark:text-violet-400'

/**
 * <uip-json-tree-view> — Interactive JSON explorer with search, syntax coloring,
 * collapsible nodes, path copy, and depth management.
 */
export class UipJsonTreeView extends LitElement {
  static styles = [
    tailwind,
    css`
      :host {
        display: block;
        width: 100%;
      }
    `,
  ]

  static properties = {
    data: { type: Object, attribute: false },
    expandDepth: { type: Number, attribute: 'expand-depth' },
    maxDepth: { type: Number, attribute: 'max-depth' },
    showSearch: {
      type: Boolean,
      attribute: 'show-search',
      converter: { fromAttribute: (v: string | null) => v !== null && v !== 'false' },
    },
    showToolbar: {
      type: Boolean,
      attribute: 'show-toolbar',
      converter: { fromAttribute: (v: string | null) => v !== null && v !== 'false' },
    },
    rootLabel: { type: String, attribute: 'root-label' },
    search: { state: true },
    expanded: { state: true },
    copiedPath: { state: true },
  }

  data: JsonValue = {}
  expandDepth = 1
  maxDepth = 100
  showSearch = true
  showToolbar = true
  rootLabel = 'root'

  search = ''
  expanded = new Set<string>()
  copiedPath: string | null = null

  private copyTimer: ReturnType<typeof setTimeout> | null = null

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'json-tree-view')
    this.initExpanded()
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    if (this.copyTimer) clearTimeout(this.copyTimer)
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('data') || changedProperties.has('expandDepth')) {
      this.initExpanded()
    }
  }

  private initExpanded() {
    const next = new Set<string>()
    const walk = (val: JsonValue, path: (string | number)[] = [], depth = 0) => {
      if (depth >= this.expandDepth) return
      if (val !== null && typeof val === 'object') {
        next.add(pathKey(path))
        const entries = Array.isArray(val) ? val.map((v, i) => [i, v] as const) : Object.entries(val)
        for (const [k, v] of entries) {
          walk(v as JsonValue, [...path, k], depth + 1)
        }
      }
    }
    walk(this.data)
    this.expanded = next
  }

  private toggle(path: (string | number)[]) {
    const k = pathKey(path)
    const next = new Set(this.expanded)
    if (next.has(k)) next.delete(k)
    else next.add(k)
    this.expanded = next
  }

  expandAll() {
    const next = new Set<string>()
    const walk = (val: JsonValue, path: (string | number)[] = [], depth = 0) => {
      if (depth >= this.maxDepth) return
      if (val !== null && typeof val === 'object') {
        next.add(pathKey(path))
        const entries = Array.isArray(val) ? val.map((v, i) => [i, v] as const) : Object.entries(val)
        for (const [k, v] of entries) {
          walk(v as JsonValue, [...path, k], depth + 1)
        }
      }
    }
    walk(this.data)
    this.expanded = next
  }

  collapseAll() {
    this.expanded = new Set()
  }

  private matchesSearch(val: JsonValue): boolean {
    if (!this.search) return true
    const term = this.search.toLowerCase()
    const walk = (v: JsonValue): boolean => {
      if (v === null) return 'null'.includes(term)
      if (typeof v === 'string') return v.toLowerCase().includes(term)
      if (typeof v === 'number' || typeof v === 'boolean') return String(v).includes(term)
      if (Array.isArray(v)) return v.some(walk)
      if (typeof v === 'object')
        return Object.entries(v).some(([k, value]) => k.toLowerCase().includes(term) || walk(value))
      return false
    }
    return walk(val)
  }

  private async copyValue(val: JsonValue, path: (string | number)[]) {
    const str = typeof val === 'string' ? val : JSON.stringify(val, null, 2)
    const p = pathKey(path)
    try {
      await navigator.clipboard.writeText(str)
      this.copiedPath = p
      this.dispatchEvent(
        new CustomEvent('copy', {
          detail: { value: str, path: p },
          bubbles: true,
          composed: true,
        }),
      )
      if (this.copyTimer) clearTimeout(this.copyTimer)
      this.copyTimer = setTimeout(() => {
        this.copiedPath = null
      }, 1200)
    } catch {
      /* ignore */
    }
  }

  private countMatches(val: JsonValue): number {
    if (!this.search) return 0
    let count = 0
    const term = this.search.toLowerCase()
    const walk = (v: JsonValue) => {
      if (v === null) {
        if ('null'.includes(term)) count++
        return
      }
      if (typeof v === 'string') {
        if (v.toLowerCase().includes(term)) count++
        return
      }
      if (typeof v === 'number' || typeof v === 'boolean') {
        if (String(v).includes(term)) count++
        return
      }
      if (Array.isArray(v)) {
        v.forEach(walk)
        return
      }
      if (typeof v === 'object') {
        Object.entries(v).forEach(([k, item]) => {
          if (k.toLowerCase().includes(term)) count++
          walk(item)
        })
      }
    }
    walk(val)
    return count
  }

  private renderNode(
    data: JsonValue,
    path: (string | number)[],
    label: string,
    depth: number,
    isRoot = false,
  ): unknown {
    const key = pathKey(path)
    const type = typeOf(data)
    const isContainer = type === 'object' || type === 'array'
    const open = this.expanded.has(key)
    const dimmed = Boolean(this.search && !this.matchesSearch(data))

    const entries: [string | number, JsonValue][] = isContainer
      ? Array.isArray(data)
        ? data.map((v, i) => [i, v] as [number, JsonValue])
        : (Object.entries(data as object) as [string, JsonValue][])
      : []

    const count = entries.length
    const indent = isRoot ? 0 : 16

    // Collapsed preview
    let collapsedPreview = ''
    if (!open && isContainer) {
      const items = entries.slice(0, 3)
      const parts = items.map(([k, v]) => {
        const vt = typeOf(v)
        let valStr = ''
        if (vt === 'string') valStr = `"${String(v).slice(0, 20)}"`
        else if (vt === 'array') valStr = '[…]'
        else if (vt === 'object') valStr = '{…}'
        else valStr = formatValue(v)
        return `${Array.isArray(data) ? '' : `"${k}": `}${valStr}`
      })
      const suffix = count > 3 ? ', …' : ''
      const openBr = type === 'array' ? '[' : '{'
      const closeBr = type === 'array' ? ']' : '}'
      collapsedPreview = `${openBr}${parts.join(', ')}${suffix}${closeBr}`
    }

    const isCopied = this.copiedPath === key

    return html`
      <div
        class=${cn(
          'group flex flex-col font-mono text-xs select-none',
          dimmed && 'opacity-40',
        )}
        style="margin-left: ${indent}px;"
      >
        <div
          class="hover:bg-muted/50 flex items-center gap-1.5 rounded py-0.5 px-1 cursor-pointer transition-colors"
          @click=${() => (isContainer ? this.toggle(path) : this.copyValue(data, path))}
        >
          <!-- Toggle icon / spacer -->
          ${isContainer
            ? html`
                <span class="text-muted-foreground flex size-4 items-center justify-center">
                  ${open
                    ? icon(ChevronDown, 'chevron-down', 'size-3.5')
                    : icon(ChevronRight, 'chevron-right', 'size-3.5')}
                </span>
              `
            : html`<span class="size-4"></span>`}

          <!-- Key / Label -->
          <span class=${cn('font-semibold', keyColor)}>${label}:</span>

          <!-- Value / Preview -->
          ${isContainer
            ? html`
                <span class="text-muted-foreground">
                  ${open ? (type === 'array' ? `[${count}]` : `{${count}}`) : collapsedPreview}
                </span>
              `
            : html`<span class=${typeColor[type] || 'text-foreground'}>${formatValue(data)}</span>`}

          <!-- Quick Copy icon -->
          <button
            type="button"
            class="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 ml-auto p-0.5 transition-opacity"
            title="Copy value"
            aria-label="Copy value"
            @click=${(e: Event) => {
              e.stopPropagation()
              this.copyValue(data, path)
            }}
          >
            ${isCopied ? icon(Check, 'check', 'size-3 text-success') : icon(Copy, 'copy', 'size-3')}
          </button>
        </div>

        <!-- Expanded Children -->
        ${isContainer && open
          ? html`
              <div class="flex flex-col">
                ${entries.map(([childKey, childVal]) =>
                  this.renderNode(childVal, [...path, childKey], String(childKey), depth + 1),
                )}
              </div>
            `
          : nothing}
      </div>
    `
  }

  render() {
    const t = typeOf(this.data)
    const summary =
      t === 'array'
        ? `Array(${(this.data as JsonValue[]).length})`
        : t === 'object'
          ? `Object(${Object.keys(this.data as object).length})`
          : t

    const matchCount = this.countMatches(this.data)

    return html`
      <div
        part="base"
        class="border-border bg-background flex flex-col overflow-hidden rounded-lg border font-mono text-sm"
      >
        <!-- Toolbar -->
        ${this.showToolbar || this.showSearch
          ? html`
              <div class="border-border flex items-center gap-2 border-b px-3 py-2">
                <div class="flex items-center gap-1.5 font-sans">
                  ${icon(Braces, 'braces', 'text-muted-foreground size-4')}
                  <span class="text-muted-foreground text-xs font-mono">${summary}</span>
                </div>
                <div class="ml-auto flex items-center gap-1 font-sans">
                  ${this.showSearch
                    ? html`
                        <div class="relative">
                          ${icon(
                            Search,
                            'search',
                            'text-muted-foreground absolute top-1/2 left-2 size-3.5 -translate-y-1/2',
                          )}
                          <input
                            type="text"
                            class="border-input bg-muted/40 focus:border-ring focus:ring-ring/30 h-7 w-32 rounded-md pr-2 pl-7 text-xs transition-[width] outline-none focus:w-44 focus:ring-2 font-mono"
                            placeholder="Filter..."
                            aria-label="Filter JSON tree"
                            .value=${this.search}
                            @input=${(e: Event) => (this.search = (e.target as HTMLInputElement).value)}
                          />
                        </div>
                      `
                    : nothing}
                  ${this.search
                    ? html`
                        <span class="text-muted-foreground text-xs">
                          ${matchCount} match${matchCount === 1 ? '' : 'es'}
                        </span>
                      `
                    : nothing}
                  <button
                    type="button"
                    class="text-muted-foreground hover:text-foreground hover:bg-accent inline-flex size-7 items-center justify-center rounded-md transition-colors"
                    title="Expand all"
                    aria-label="Expand all"
                    @click=${this.expandAll}
                  >
                    ${icon(UnfoldVertical, 'unfold-vertical', 'size-4')}
                  </button>
                  <button
                    type="button"
                    class="text-muted-foreground hover:text-foreground hover:bg-accent inline-flex size-7 items-center justify-center rounded-md transition-colors"
                    title="Collapse all"
                    aria-label="Collapse all"
                    @click=${this.collapseAll}
                  >
                    ${icon(FoldVertical, 'fold-vertical', 'size-4')}
                  </button>
                </div>
              </div>
            `
          : nothing}

        <!-- Tree Area -->
        <div class="min-h-0 flex-1 overflow-auto p-2" role="tree" aria-label=${this.rootLabel}>
          ${this.renderNode(this.data, [], this.rootLabel, 0, true)}
        </div>
      </div>
    `
  }
}

customElements.get('uip-json-tree-view') || customElements.define('uip-json-tree-view', UipJsonTreeView)

declare global {
  interface HTMLElementTagNameMap {
    'uip-json-tree-view': UipJsonTreeView
  }
}

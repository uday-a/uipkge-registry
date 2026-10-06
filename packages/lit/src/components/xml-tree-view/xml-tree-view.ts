import { LitElement, css, html, isServer, nothing } from 'lit'
import { AlertCircle, Check, ChevronDown, ChevronRight, CodeXml, Copy, FoldVertical, Search, UnfoldVertical } from 'lucide'
import { cn } from '../../lib/utils'
import { icon } from '../../lib/icon'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'

export type XmlNodeType = 'element' | 'text' | 'comment' | 'cdata'

export interface XmlAttr {
  name: string
  value: string
}

export interface XmlNode {
  type: XmlNodeType
  name: string
  attributes: XmlAttr[]
  text: string
  children: XmlNode[]
}

export interface ParseXmlResult {
  root: XmlNode | null
  error: string | null
}

function domToNode(node: Node): XmlNode | null {
  if (node.nodeType === Node.ELEMENT_NODE) {
    const el = node as Element
    const attributes: XmlAttr[] = Array.from(el.attributes).map((a) => ({
      name: a.name,
      value: a.value,
    }))
    const children: XmlNode[] = []
    for (const child of Array.from(el.childNodes)) {
      const n = domToNode(child)
      if (n) children.push(n)
    }
    return {
      type: 'element',
      name: el.tagName,
      attributes,
      text: '',
      children,
    }
  }

  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent ?? ''
    if (!text.trim()) return null
    return { type: 'text', name: '', attributes: [], text, children: [] }
  }

  if (node.nodeType === Node.COMMENT_NODE) {
    return {
      type: 'comment',
      name: '',
      attributes: [],
      text: node.textContent ?? '',
      children: [],
    }
  }

  if (node.nodeType === Node.CDATA_SECTION_NODE) {
    return {
      type: 'cdata',
      name: '',
      attributes: [],
      text: node.textContent ?? '',
      children: [],
    }
  }

  return null
}

export function parseXml(source: string): ParseXmlResult {
  const trimmed = source?.trim() ?? ''
  if (!trimmed) return { root: null, error: 'Empty XML' }

  if (typeof DOMParser === 'undefined') {
    return { root: null, error: 'DOMParser is not available in this environment' }
  }

  try {
    const doc = new DOMParser().parseFromString(trimmed, 'application/xml')
    const parseError = doc.querySelector('parsererror')
    if (parseError) {
      const msg = parseError.textContent?.replace(/\s+/g, ' ').trim() || 'Invalid XML'
      return { root: null, error: msg }
    }
    const el = doc.documentElement
    if (!el) return { root: null, error: 'Empty document' }
    const root = domToNode(el)
    if (!root) return { root: null, error: 'Could not read document element' }
    return { root, error: null }
  } catch (e) {
    return { root: null, error: e instanceof Error ? e.message : 'Failed to parse XML' }
  }
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
}

function escapeText(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
}

export function serializeXml(node: XmlNode, indent = 0): string {
  const pad = '  '.repeat(indent)

  if (node.type === 'text') return node.text
  if (node.type === 'comment') return `${pad}<!--${node.text}-->`
  if (node.type === 'cdata') return `${pad}<![CDATA[${node.text}]]>`

  const attrs =
    node.attributes.length > 0 ? ' ' + node.attributes.map((a) => `${a.name}="${escapeAttr(a.value)}"`).join(' ') : ''

  if (node.children.length === 0) {
    return `${pad}<${node.name}${attrs} />`
  }

  if (node.children.length === 1 && node.children[0]!.type === 'text') {
    return `${pad}<${node.name}${attrs}>${escapeText(node.children[0]!.text)}</${node.name}>`
  }

  const inner = node.children.map((c) => serializeXml(c, indent + 1)).join('\n')
  return `${pad}<${node.name}${attrs}>\n${inner}\n${pad}</${node.name}>`
}

export function isExpandable(node: XmlNode): boolean {
  if (node.type !== 'element') return false
  if (node.children.length === 0) return false
  if (node.children.length === 1 && node.children[0]!.type === 'text') return false
  return true
}

export function countElements(node: XmlNode): number {
  let n = node.type === 'element' ? 1 : 0
  for (const c of node.children) n += countElements(c)
  return n
}

export function pathKey(path: string[]): string {
  return path.length ? '/' + path.join('/') : '/'
}

export function walkExpandable(
  node: XmlNode,
  path: string[],
  depth: number,
  max: number,
  visit: (path: string[], node: XmlNode) => void,
) {
  if (depth >= max) return
  if (isExpandable(node)) {
    visit(path, node)
    const counts = new Map<string, number>()
    const totals = new Map<string, number>()
    for (const c of node.children) {
      if (c.type === 'element') totals.set(c.name, (totals.get(c.name) ?? 0) + 1)
    }
    node.children.forEach((child, i) => {
      let segment: string
      if (child.type === 'element') {
        const n = (counts.get(child.name) ?? 0) + 1
        counts.set(child.name, n)
        const total = totals.get(child.name) ?? 1
        segment = total > 1 ? `${child.name}[${n}]` : child.name
      } else if (child.type === 'comment') {
        segment = `comment()[${i}]`
      } else {
        segment = `text()[${i}]`
      }
      walkExpandable(child, [...path, segment], depth + 1, max, visit)
    })
  }
}

const tagColor = 'text-violet-600 dark:text-violet-400'
const attrNameColor = 'text-blue-600 dark:text-blue-400'
const attrValueColor = 'text-emerald-600 dark:text-emerald-400'
const textColor = 'text-emerald-600 dark:text-emerald-400'

/**
 * <uip-xml-tree-view> — Interactive XML inspector with syntax highlighting,
 * node folding, XPath-style breadcrumbs, and search filtering.
 */
export class UipXmlTreeView extends LitElement {
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
    data: { type: String },
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
    parsedResult: { state: true },
  }

  data = ''
  expandDepth = 1
  maxDepth = 100
  showSearch = true
  showToolbar = true
  rootLabel?: string

  search = ''
  expanded = new Set<string>()
  copiedPath: string | null = null
  parsedResult: ParseXmlResult = { root: null, error: null }

  private copyTimer: ReturnType<typeof setTimeout> | null = null

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'xml-tree-view')
    this.parseAndInit()
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    if (this.copyTimer) clearTimeout(this.copyTimer)
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('data') || changedProperties.has('expandDepth')) {
      this.parseAndInit()
    }
  }

  private parseAndInit() {
    if (isServer) return
    this.parsedResult = parseXml(this.data)
    const next = new Set<string>()
    if (this.parsedResult.root) {
      walkExpandable(this.parsedResult.root, [], 0, this.expandDepth, (path) => {
        next.add(pathKey(path))
      })
    }
    this.expanded = next
  }

  private toggle(path: string[]) {
    const k = pathKey(path)
    const next = new Set(this.expanded)
    if (next.has(k)) next.delete(k)
    else next.add(k)
    this.expanded = next
  }

  expandAll() {
    const next = new Set<string>()
    if (this.parsedResult.root) {
      walkExpandable(this.parsedResult.root, [], 0, this.maxDepth, (path) => {
        next.add(pathKey(path))
      })
    }
    this.expanded = next
  }

  collapseAll() {
    this.expanded = new Set()
  }

  private matchesSearch(node: XmlNode): boolean {
    if (!this.search) return true
    const term = this.search.toLowerCase()
    const walk = (n: XmlNode): boolean => {
      if (n.name.toLowerCase().includes(term)) return true
      if (n.text.toLowerCase().includes(term)) return true
      if (n.attributes.some((a) => a.name.toLowerCase().includes(term) || a.value.toLowerCase().includes(term)))
        return true
      return n.children.some(walk)
    }
    return walk(node)
  }

  private async copyNode(node: XmlNode, path: string[]) {
    const text = serializeXml(node)
    const p = pathKey(path)
    try {
      await navigator.clipboard.writeText(text)
      this.copiedPath = p
      this.dispatchEvent(
        new CustomEvent('copy', {
          detail: { value: text, path: p },
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

  private renderNode(node: XmlNode, path: string[], depth: number, isRoot = false): unknown {
    const key = pathKey(path)
    const expandable = isExpandable(node)
    const open = this.expanded.has(key)
    const dimmed = Boolean(this.search && !this.matchesSearch(node))
    const isCopied = this.copiedPath === key
    const indent = isRoot ? 0 : 16

    if (node.type === 'comment') {
      return html`
        <div
          class=${cn('flex items-center gap-1 text-muted-foreground italic font-mono text-xs py-0.5 px-1', dimmed && 'opacity-40')}
          style="margin-left: ${indent}px;"
        >
          <span>&lt;!--${node.text}--&gt;</span>
        </div>
      `
    }

    if (node.type === 'cdata') {
      return html`
        <div
          class=${cn('flex items-center gap-1 text-muted-foreground font-mono text-xs py-0.5 px-1', dimmed && 'opacity-40')}
          style="margin-left: ${indent}px;"
        >
          <span>&lt;![CDATA[${node.text}]]&gt;</span>
        </div>
      `
    }

    if (node.type === 'text') {
      return html`
        <div
          class=${cn('flex items-center gap-1 font-mono text-xs py-0.5 px-1', textColor, dimmed && 'opacity-40')}
          style="margin-left: ${indent}px;"
        >
          <span>${node.text}</span>
        </div>
      `
    }

    // Element node
    const hasSingleText = node.children.length === 1 && node.children[0]!.type === 'text'
    const singleText = hasSingleText ? node.children[0]!.text : ''

    const counts = new Map<string, number>()
    const totals = new Map<string, number>()
    for (const c of node.children) {
      if (c.type === 'element') totals.set(c.name, (totals.get(c.name) ?? 0) + 1)
    }

    return html`
      <div
        class=${cn('group flex flex-col font-mono text-xs select-none', dimmed && 'opacity-40')}
        style="margin-left: ${indent}px;"
      >
        <div
          class="hover:bg-muted/50 flex items-center gap-1.5 rounded py-0.5 px-1 cursor-pointer transition-colors"
          @click=${() => (expandable ? this.toggle(path) : this.copyNode(node, path))}
        >
          <!-- Toggle icon / spacer -->
          ${expandable
            ? html`
                <span class="text-muted-foreground flex size-4 items-center justify-center">
                  ${open
                    ? icon(ChevronDown, 'chevron-down', 'size-3.5')
                    : icon(ChevronRight, 'chevron-right', 'size-3.5')}
                </span>
              `
            : html`<span class="size-4"></span>`}

          <!-- Open Tag -->
          <span class="text-muted-foreground">&lt;</span>
          <span class=${cn('font-semibold', tagColor)}>${node.name}</span>

          <!-- Attributes -->
          ${node.attributes.map(
            (a) => html`
              <span class="ml-1">
                <span class=${attrNameColor}>${a.name}</span>
                <span class="text-muted-foreground">=</span>
                <span class=${attrValueColor}>"${a.value}"</span>
              </span>
            `,
          )}

          ${node.children.length === 0
            ? html`<span class="text-muted-foreground">/&gt;</span>`
            : hasSingleText
              ? html`
                  <span class="text-muted-foreground">&gt;</span>
                  <span class=${textColor}>${singleText}</span>
                  <span class="text-muted-foreground">&lt;/</span>
                  <span class=${cn('font-semibold', tagColor)}>${node.name}</span>
                  <span class="text-muted-foreground">&gt;</span>
                `
              : html`<span class="text-muted-foreground">&gt;</span>`}

          ${expandable && !open
            ? html`
                <span class="text-muted-foreground ml-1">…</span>
                <span class="text-muted-foreground">&lt;/</span>
                <span class=${cn('font-semibold', tagColor)}>${node.name}</span>
                <span class="text-muted-foreground">&gt;</span>
              `
            : nothing}

          <!-- Quick Copy icon -->
          <button
            type="button"
            class="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 ml-auto p-0.5 transition-opacity"
            title="Copy XML"
            aria-label="Copy XML"
            @click=${(e: Event) => {
              e.stopPropagation()
              this.copyNode(node, path)
            }}
          >
            ${isCopied ? icon(Check, 'check', 'size-3 text-success') : icon(Copy, 'copy', 'size-3')}
          </button>
        </div>

        <!-- Expanded Children -->
        ${expandable && open
          ? html`
              <div class="flex flex-col">
                ${node.children.map((child, i) => {
                  let segment: string
                  if (child.type === 'element') {
                    const n = (counts.get(child.name) ?? 0) + 1
                    counts.set(child.name, n)
                    const total = totals.get(child.name) ?? 1
                    segment = total > 1 ? `${child.name}[${n}]` : child.name
                  } else if (child.type === 'comment') {
                    segment = `comment()[${i}]`
                  } else {
                    segment = `text()[${i}]`
                  }
                  return this.renderNode(child, [...path, segment], depth + 1)
                })}
                <div class="text-muted-foreground py-0.5 px-1 ml-4">
                  <span>&lt;/</span>
                  <span class=${cn('font-semibold', tagColor)}>${node.name}</span>
                  <span>&gt;</span>
                </div>
              </div>
            `
          : nothing}
      </div>
    `
  }

  render() {
    const { root, error } = this.parsedResult

    if (error) {
      return html`
        <div
          part="base"
          class="border-destructive/50 bg-destructive/5 text-destructive flex items-center gap-3 rounded-lg border p-4 text-xs font-mono"
        >
          ${icon(AlertCircle, 'alert-circle', 'size-5 shrink-0')}
          <div>
            <p class="font-semibold font-sans">XML Parse Error</p>
            <p class="mt-0.5 opacity-90">${error}</p>
          </div>
        </div>
      `
    }

    const count = root ? countElements(root) : 0
    const summary = `${count} element${count === 1 ? '' : 's'}`

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
                  ${icon(CodeXml, 'code-xml', 'text-muted-foreground size-4')}
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
                            aria-label="Filter XML tree"
                            .value=${this.search}
                            @input=${(e: Event) => (this.search = (e.target as HTMLInputElement).value)}
                          />
                        </div>
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
        <div class="min-h-0 flex-1 overflow-auto p-2" role="tree">
          ${root ? this.renderNode(root, [this.rootLabel ?? root.name], 0, true) : nothing}
        </div>
      </div>
    `
  }
}

customElements.get('uip-xml-tree-view') || customElements.define('uip-xml-tree-view', UipXmlTreeView)

declare global {
  interface HTMLElementTagNameMap {
    'uip-xml-tree-view': UipXmlTreeView
  }
}

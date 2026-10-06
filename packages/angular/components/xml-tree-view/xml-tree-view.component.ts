import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnChanges,
  Output,
  SimpleChanges,
  booleanAttribute,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'

export interface XmlAttr {
  name: string
  value: string
}

export interface XmlNode {
  type: 'element' | 'text' | 'comment' | 'cdata'
  name?: string
  attributes?: Record<string, string>
  attrs?: XmlAttr[]
  children?: XmlNode[]
  value?: string
  text?: string
}

export function pathKey(path: string[]): string {
  return path.length ? '/' + path.join('/') : '/'
}

export function isExpandable(node: XmlNode): boolean {
  if (node.type !== 'element') return false
  if (!node.children || node.children.length === 0) return false
  if (
    node.children.length === 1 &&
    (node.children[0].type === 'text' || (!node.children[0].type && node.children[0].value))
  ) {
    return false
  }
  return true
}

export function countElements(node: XmlNode): number {
  let n = node.type === 'element' ? 1 : 0
  for (const c of node.children ?? []) n += countElements(c)
  return n
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
}

function escapeText(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
}

export function serializeXml(node: XmlNode, indent = 0): string {
  const pad = '  '.repeat(indent)
  const val = node.text ?? node.value ?? ''

  if (node.type === 'text') return val
  if (node.type === 'comment') return `${pad}<!--${val}-->`
  if (node.type === 'cdata') return `${pad}<![CDATA[${val}]]>`

  const attrs = Object.entries(node.attributes ?? {})
    .map(([k, v]) => ` ${k}="${escapeAttr(v)}"`)
    .join('')

  const children = node.children ?? []
  if (children.length === 0) {
    return `${pad}<${node.name}${attrs} />`
  }

  if (children.length === 1 && (children[0].type === 'text' || (!children[0].type && children[0].value))) {
    const text = children[0].text ?? children[0].value ?? ''
    return `${pad}<${node.name}${attrs}>${escapeText(text)}</${node.name}>`
  }

  const inner = children.map((c) => serializeXml(c, indent + 1)).join('\n')
  return `${pad}<${node.name}${attrs}>\n${inner}\n${pad}</${node.name}>`
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
    for (const c of node.children ?? []) {
      if (c.type === 'element' && c.name) totals.set(c.name, (totals.get(c.name) ?? 0) + 1)
    }
    ;(node.children ?? []).forEach((child, i) => {
      let segment: string
      if (child.type === 'element' && child.name) {
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

export function childEntries(node: XmlNode, path: string[]) {
  const counts = new Map<string, number>()
  const totals = new Map<string, number>()
  for (const c of node.children ?? []) {
    if (c.type === 'element' && c.name) totals.set(c.name, (totals.get(c.name) ?? 0) + 1)
  }
  return (node.children ?? []).map((child, i) => {
    let segment: string
    if (child.type === 'element' && child.name) {
      const n = (counts.get(child.name) ?? 0) + 1
      counts.set(child.name, n)
      const total = totals.get(child.name) ?? 1
      segment = total > 1 ? `${child.name}[${n}]` : child.name
    } else if (child.type === 'comment') {
      segment = `comment()[${i}]`
    } else {
      segment = `text()[${i}]`
    }
    return { child, segment, path: [...path, segment] as string[] }
  })
}

function domToNode(node: Node): XmlNode | null {
  if (node.nodeType === Node.ELEMENT_NODE) {
    const el = node as Element
    const attributes: Record<string, string> = {}
    const attrs: XmlAttr[] = []
    for (let i = 0; i < el.attributes.length; i++) {
      const a = el.attributes[i]
      attributes[a.name] = a.value
      attrs.push({ name: a.name, value: a.value })
    }
    const children: XmlNode[] = []
    for (let i = 0; i < el.childNodes.length; i++) {
      const n = domToNode(el.childNodes[i])
      if (n) children.push(n)
    }
    return {
      type: 'element',
      name: el.tagName,
      attributes,
      attrs,
      text: '',
      value: '',
      children,
    }
  }

  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent ?? ''
    if (!text.trim()) return null
    return { type: 'text', name: '', attributes: {}, attrs: [], text, value: text, children: [] }
  }

  if (node.nodeType === Node.COMMENT_NODE) {
    const text = node.textContent ?? ''
    return { type: 'comment', name: '', attributes: {}, attrs: [], text, value: text, children: [] }
  }

  if (node.nodeType === Node.CDATA_SECTION_NODE) {
    const text = node.textContent ?? ''
    return { type: 'cdata', name: '', attributes: {}, attrs: [], text, value: text, children: [] }
  }

  return null
}

export function parseXml(input: string): { root: XmlNode | null; error: string | null } {
  const src = input?.trim() ?? ''
  if (!src) return { root: null, error: 'Empty XML' }

  if (typeof DOMParser !== 'undefined') {
    try {
      const doc = new DOMParser().parseFromString(src, 'application/xml')
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

  // Fallback lexer parser for Node / non-DOM environments
  let pos = 0
  const stack: XmlNode[] = []
  let root: XmlNode | null = null

  const attach = (n: XmlNode) => {
    if (stack.length) {
      stack[stack.length - 1]!.children!.push(n)
    } else if (!root) {
      root = n
    }
  }

  while (pos < src.length) {
    if (src.startsWith('<!--', pos)) {
      const end = src.indexOf('-->', pos + 4)
      const value = end === -1 ? src.slice(pos + 4) : src.slice(pos + 4, end)
      attach({ type: 'comment', value, text: value, attributes: {}, attrs: [], children: [] })
      pos = end === -1 ? src.length : end + 3
    } else if (src.startsWith('<![CDATA[', pos)) {
      const end = src.indexOf(']]>', pos + 9)
      const value = end === -1 ? src.slice(pos + 9) : src.slice(pos + 9, end)
      attach({ type: 'cdata', value, text: value, attributes: {}, attrs: [], children: [] })
      pos = end === -1 ? src.length : end + 3
    } else if (src[pos] === '<') {
      const end = src.indexOf('>', pos + 1)
      if (end === -1) {
        return { root: null, error: 'Unclosed tag' }
      }
      const raw = src.slice(pos + 1, end).trim()
      pos = end + 1
      if (!raw || raw.startsWith('?') || raw.startsWith('!')) continue
      if (raw.startsWith('/')) {
        if (!stack.length) return { root: null, error: 'Unexpected closing tag' }
        stack.pop()
        continue
      }
      const selfClose = raw.endsWith('/')
      const body = selfClose ? raw.slice(0, -1).trim() : raw
      const parts = body.split(/\s+/)
      const name = parts[0] ?? 'node'
      const attributes: Record<string, string> = {}
      const attrs: XmlAttr[] = []
      const attrRe = /([\w:.-]+)\s*=\s*("([^"]*)"|'([^']*)')/g
      let m: RegExpExecArray | null
      while ((m = attrRe.exec(body)) !== null) {
        const k = m[1]!
        const v = m[3] ?? m[4] ?? ''
        attributes[k] = v
        attrs.push({ name: k, value: v })
      }
      const el: XmlNode = { type: 'element', name, attributes, attrs, children: [] }
      attach(el)
      if (!selfClose) stack.push(el)
    } else {
      const next = src.indexOf('<', pos)
      const value = (next === -1 ? src.slice(pos) : src.slice(pos, next)).trim()
      pos = next === -1 ? src.length : next
      if (value) attach({ type: 'text', value, text: value, attributes: {}, attrs: [], children: [] })
    }
  }

  if (stack.length > 0) {
    return { root: null, error: 'Unclosed tag: ' + stack[stack.length - 1]?.name }
  }

  return { root, error: null }
}

const tagColor = 'text-violet-600 dark:text-violet-400'
const attrNameColor = 'text-blue-600 dark:text-blue-400'
const attrValueColor = 'text-emerald-600 dark:text-emerald-400'
const textColor = 'text-emerald-600 dark:text-emerald-400'
const commentColor = 'text-muted-foreground'
const punctColor = 'text-muted-foreground'

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-xml-tree-node, [ui-xml-tree-node]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"xml-tree-node"',
    '[attr.data-uipkge]': '""',
    '[attr.role]': '"treeitem"',
    '[attr.aria-expanded]': 'expandable ? open : null',
    '[class]': 'hostClass',
  },
  template: `
    @if (node) {
      @if (node.type === 'element' && expandable) {
        <div
          data-tree-row
          [attr.data-tree-id]="key"
          [attr.data-tree-parent]="parentKey"
          tabindex="0"
          class="group hover:bg-accent/40 focus-visible:ring-ring/50 -mx-1 flex items-center gap-0.5 rounded px-1 py-0.5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
          [style.padding-left.px]="indent"
          (click)="toggle()"
          (keydown)="handleRowKeydown($event)"
        >
          <button
            type="button"
            class="text-muted-foreground hover:text-foreground hover:bg-accent inline-flex size-4 shrink-0 items-center justify-center rounded"
            [attr.aria-expanded]="open"
            [attr.aria-label]="open ? 'Collapse' : 'Expand'"
            tabindex="-1"
            (click)="toggle($event)"
          >
            @if (open) {
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="size-3.5"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            } @else {
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="size-3.5"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            }
          </button>
          <span class="${punctColor} select-none">&lt;</span>
          <span class="${tagColor} select-none">{{ node.name }}</span>
          @for (attr of attributeList; track attr.name) {
            <span class="select-none">&nbsp;</span>
            <span class="${attrNameColor} select-none">{{ attr.name }}</span>
            <span class="${punctColor} select-none">=</span>
            <span class="${attrValueColor} select-none">"{{ attr.value }}"</span>
          }
          <span class="${punctColor} select-none">&gt;</span>
          @if (open) {
            <span class="text-muted-foreground ml-0.5 text-xs">
              {{ childCount }} {{ childCount === 1 ? 'child' : 'children' }}
            </span>
          } @else {
            <span class="text-muted-foreground ml-1 truncate text-xs select-none">{{ collapsedPreview }}</span>
          }
          <button
            type="button"
            class="text-muted-foreground hover:text-foreground focus-visible:ring-ring ml-auto inline-flex size-5 shrink-0 items-center justify-center rounded opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-1"
            title="Copy"
            aria-label="Copy"
            tabindex="-1"
            (click)="handleCopy($event)"
          >
            @if (isCopied) {
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="size-3 text-emerald-500"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            } @else {
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="size-3"
              >
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
            }
          </button>
        </div>

        @if (open) {
          <div role="group">
            @for (entry of entries; track entry.segment) {
              <ui-xml-tree-node
                [node]="entry.child"
                [path]="entry.path"
                [isRoot]="false"
                [tree]="tree"
                [depth]="depth + 1"
              />
            }
            <div class="flex items-center gap-0.5 py-0.5 select-none" [style.padding-left.px]="indent">
              <span class="inline-flex size-4 shrink-0"></span>
              <span class="${punctColor}">&lt;/</span>
              <span class="${tagColor}">{{ node.name }}</span>
              <span class="${punctColor}">&gt;</span>
            </div>
          </div>
        }
      }

      @if (node.type === 'element' && !expandable) {
        <div
          data-tree-row
          [attr.data-tree-id]="key"
          [attr.data-tree-parent]="parentKey"
          tabindex="0"
          class="group hover:bg-accent/40 focus-visible:ring-ring/50 -mx-1 flex items-center gap-0.5 rounded px-1 py-0.5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
          [style.padding-left.px]="indent"
          (click)="handleCopy()"
          (keydown)="handleRowKeydown($event)"
        >
          <span class="inline-flex size-4 shrink-0"></span>
          <span class="${punctColor} select-none">&lt;</span>
          <span class="${tagColor} select-none">{{ node.name }}</span>
          @for (attr of attributeList; track attr.name) {
            <span class="select-none">&nbsp;</span>
            <span class="${attrNameColor} select-none">{{ attr.name }}</span>
            <span class="${punctColor} select-none">=</span>
            <span class="${attrValueColor} select-none">"{{ attr.value }}"</span>
          }
          @if (textOnlyChild !== null) {
            <span class="${punctColor} select-none">&gt;</span>
            <span class="${textColor} truncate">{{ textOnlyChild }}</span>
            <span class="${punctColor} shrink-0 select-none">&lt;/</span>
            <span class="${tagColor} shrink-0 select-none">{{ node.name }}</span>
            <span class="${punctColor} shrink-0 select-none">&gt;</span>
          } @else {
            <span class="${punctColor} select-none"> /&gt;</span>
          }
          <button
            type="button"
            class="text-muted-foreground hover:text-foreground focus-visible:ring-ring ml-auto inline-flex size-5 shrink-0 items-center justify-center rounded opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-1"
            title="Copy"
            aria-label="Copy"
            tabindex="-1"
            (click)="handleCopy($event)"
          >
            @if (isCopied) {
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="size-3 text-emerald-500"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            } @else {
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="size-3"
              >
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
            }
          </button>
        </div>
      }

      @if (node.type === 'comment') {
        <div
          data-tree-row
          [attr.data-tree-id]="key"
          [attr.data-tree-parent]="parentKey"
          tabindex="0"
          class="group hover:bg-accent/40 focus-visible:ring-ring/50 -mx-1 flex items-center gap-0.5 rounded px-1 py-0.5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
          [style.padding-left.px]="indent"
          (click)="handleCopy()"
          (keydown)="handleRowKeydown($event)"
        >
          <span class="inline-flex size-4 shrink-0"></span>
          <span class="${commentColor} truncate italic select-none">&lt;!--{{ node.text || node.value }}--&gt;</span>
          <button
            type="button"
            class="text-muted-foreground hover:text-foreground focus-visible:ring-ring ml-auto inline-flex size-5 shrink-0 items-center justify-center rounded opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-1"
            title="Copy"
            aria-label="Copy"
            tabindex="-1"
            (click)="handleCopy($event)"
          >
            @if (isCopied) {
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="size-3 text-emerald-500"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            } @else {
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="size-3"
              >
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
            }
          </button>
        </div>
      }

      @if (node.type === 'cdata') {
        <div
          data-tree-row
          [attr.data-tree-id]="key"
          [attr.data-tree-parent]="parentKey"
          tabindex="0"
          class="group hover:bg-accent/40 focus-visible:ring-ring/50 -mx-1 flex items-center gap-0.5 rounded px-1 py-0.5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
          [style.padding-left.px]="indent"
          (click)="handleCopy()"
          (keydown)="handleRowKeydown($event)"
        >
          <span class="inline-flex size-4 shrink-0"></span>
          <span class="${punctColor} select-none">&lt;![CDATA[</span>
          <span class="${textColor} truncate">{{ node.text || node.value }}</span>
          <span class="${punctColor} shrink-0 select-none">]]&gt;</span>
          <button
            type="button"
            class="text-muted-foreground hover:text-foreground focus-visible:ring-ring ml-auto inline-flex size-5 shrink-0 items-center justify-center rounded opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-1"
            title="Copy"
            aria-label="Copy"
            tabindex="-1"
            (click)="handleCopy($event)"
          >
            @if (isCopied) {
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="size-3 text-emerald-500"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            } @else {
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="size-3"
              >
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
            }
          </button>
        </div>
      }

      @if (node.type === 'text') {
        <div
          data-tree-row
          [attr.data-tree-id]="key"
          [attr.data-tree-parent]="parentKey"
          tabindex="0"
          class="group hover:bg-accent/40 focus-visible:ring-ring/50 -mx-1 flex items-center gap-0.5 rounded px-1 py-0.5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
          [style.padding-left.px]="indent"
          (click)="handleCopy()"
          (keydown)="handleRowKeydown($event)"
        >
          <span class="inline-flex size-4 shrink-0"></span>
          <span class="${textColor} truncate">{{ node.text || node.value }}</span>
          <button
            type="button"
            class="text-muted-foreground hover:text-foreground focus-visible:ring-ring ml-auto inline-flex size-5 shrink-0 items-center justify-center rounded opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-1"
            title="Copy"
            aria-label="Copy"
            tabindex="-1"
            (click)="handleCopy($event)"
          >
            @if (isCopied) {
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="size-3 text-emerald-500"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            } @else {
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="size-3"
              >
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
            }
          </button>
        </div>
      }
    }
  `,
})
export class UiXmlTreeNodeComponent {
  @Input() node?: XmlNode
  @Input() path: string[] = []
  @Input({ transform: booleanAttribute }) isRoot = false
  @Input() tree?: UiXmlTreeViewComponent
  @Input() depth = 0
  @Input('class') className?: string

  get key(): string {
    return pathKey(this.path)
  }

  get parentKey(): string | null {
    return this.path.length ? pathKey(this.path.slice(0, -1)) : null
  }

  get open(): boolean {
    return this.tree ? this.tree.isExpanded(this.path) : false
  }

  get expandable(): boolean {
    return this.node ? isExpandable(this.node) : false
  }

  get isCopied(): boolean {
    return this.tree?.copiedPath === this.key
  }

  get indent(): number {
    return this.isRoot ? 0 : 20
  }

  get attributeList(): XmlAttr[] {
    if (!this.node) return []
    if (this.node.attrs) return this.node.attrs
    return Object.entries(this.node.attributes ?? {}).map(([name, value]) => ({ name, value }))
  }

  get childCount(): number {
    return (this.node?.children ?? []).filter((c) => c.type === 'element').length
  }

  get collapsedPreview(): string {
    if (!this.node || this.open || !this.expandable) return ''
    const tags = (this.node.children ?? []).filter((c) => c.type === 'element').slice(0, 3)
    const parts = tags.map((c) => `<${c.name}${Object.keys(c.attributes ?? {}).length ? ' …' : ''}>`)
    const suffix = this.childCount > 3 ? ' …' : ''
    return parts.join(' ') + suffix
  }

  get textOnlyChild(): string | null {
    if (
      this.node?.type === 'element' &&
      this.node.children?.length === 1 &&
      (this.node.children[0].type === 'text' || (!this.node.children[0].type && this.node.children[0].value))
    ) {
      return this.node.children[0].text ?? this.node.children[0].value ?? ''
    }
    return null
  }

  get entries() {
    return this.node ? childEntries(this.node, this.path) : []
  }

  get hostClass(): string {
    const dimmed = this.tree && this.node && this.tree.search && !this.tree.matchesSearch(this.node)
    return cn('block', dimmed && 'opacity-30', this.className)
  }

  indentStyle(): Record<string, string> {
    return { 'padding-left': `${this.depth * 20}px` }
  }

  toggle(e?: MouseEvent): void {
    e?.stopPropagation()
    if (this.tree) {
      this.tree.toggle(this.path)
    }
  }

  handleCopy(e?: MouseEvent): void {
    e?.stopPropagation()
    if (!this.node || !this.tree) return
    const val = this.node.type === 'element' ? serializeXml(this.node) : (this.node.text ?? this.node.value ?? '')
    this.tree.copyNode(val, this.path)
  }

  handleRowKeydown(e: KeyboardEvent): void {
    const target = e.currentTarget as HTMLElement

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (this.expandable) this.toggle()
      else this.handleCopy()
      return
    }

    if (e.key === 'ArrowRight') {
      e.preventDefault()
      if (this.expandable && !this.open) {
        this.toggle()
      } else if (this.expandable && this.open) {
        const tree = target.closest('[role="tree"]')
        const rows = tree ? Array.from(tree.querySelectorAll<HTMLElement>('[data-tree-row]')) : []
        const idx = rows.indexOf(target)
        if (idx >= 0 && idx < rows.length - 1) rows[idx + 1]?.focus()
      }
      return
    }

    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      if (this.expandable && this.open) {
        this.toggle()
      } else if (this.parentKey) {
        const tree = target.closest('[role="tree"]')
        const parent = tree?.querySelector<HTMLElement>(`[data-tree-row][data-tree-id="${CSS.escape(this.parentKey)}"]`)
        parent?.focus()
      }
      return
    }

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      const tree = target.closest('[role="tree"]')
      const rows = tree ? Array.from(tree.querySelectorAll<HTMLElement>('[data-tree-row]')) : []
      const idx = rows.indexOf(target)
      if (idx < 0) return
      const next = e.key === 'ArrowDown' ? rows[idx + 1] : rows[idx - 1]
      next?.focus()
      return
    }

    if (e.key === 'Home') {
      e.preventDefault()
      const tree = target.closest('[role="tree"]')
      const rows = tree ? Array.from(tree.querySelectorAll<HTMLElement>('[data-tree-row]')) : []
      rows[0]?.focus()
      return
    }

    if (e.key === 'End') {
      e.preventDefault()
      const tree = target.closest('[role="tree"]')
      const rows = tree ? Array.from(tree.querySelectorAll<HTMLElement>('[data-tree-row]')) : []
      rows[rows.length - 1]?.focus()
    }
  }
}

/**
 * Angular port of UIPKGE XmlTreeView. Collapsible XML inspector with
 * color-coded tags, click-to-copy, search filter, and expand/collapse-all.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-xml-tree-view, [ui-xml-tree-view]',
  standalone: true,
  imports: [UiXmlTreeNodeComponent],
  host: {
    '[attr.data-slot]': '"xml-tree-view"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
  },
  template: `
    @if (showToolbar || showSearch) {
      <div class="border-border flex items-center gap-2 border-b px-3 py-2">
        <div class="flex items-center gap-1.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="text-muted-foreground size-4"
          >
            <path d="m18 16 4-4-4-4" />
            <path d="m6 8-4 4 4 4" />
            <path d="m14.5 4-5 16" />
          </svg>
          <span class="text-muted-foreground text-xs">{{ summary }}</span>
        </div>
        <div class="ml-auto flex items-center gap-1">
          @if (showSearch && !parseError) {
            <div class="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="text-muted-foreground absolute top-1/2 left-2 size-3.5 -translate-y-1/2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                [value]="search"
                (input)="onSearchInput($event)"
                placeholder="Filter..."
                aria-label="Filter XML tree"
                class="border-input bg-muted/40 focus:border-ring focus:ring-ring/30 h-7 w-32 rounded-md pr-2 pl-7 text-xs transition-[width] outline-none focus:w-44 focus:ring-2"
              />
            </div>
          }
          @if (search && !parseError) {
            <span class="text-muted-foreground text-xs">
              {{ searchMatchCount }} match{{ searchMatchCount === 1 ? '' : 'es' }}
            </span>
          }
          @if (!parseError) {
            <button
              type="button"
              class="text-muted-foreground hover:text-foreground hover:bg-accent inline-flex size-7 items-center justify-center rounded-md transition-colors"
              title="Expand all"
              aria-label="Expand all"
              (click)="expandAll()"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="size-4"
              >
                <path d="M12 22v-6" />
                <path d="M12 8V2" />
                <path d="M4 12H2" />
                <path d="M10 12H8" />
                <path d="M16 12h-2" />
                <path d="M22 12h-2" />
                <path d="m15 19-3 3-3-3" />
                <path d="m9 5 3-3 3 3" />
              </svg>
            </button>
            <button
              type="button"
              class="text-muted-foreground hover:text-foreground hover:bg-accent inline-flex size-7 items-center justify-center rounded-md transition-colors"
              title="Collapse all"
              aria-label="Collapse all"
              (click)="collapseAll()"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="size-4"
              >
                <path d="M12 22v-6" />
                <path d="M12 8V2" />
                <path d="M4 12H2" />
                <path d="M10 12H8" />
                <path d="M16 12h-2" />
                <path d="M22 12h-2" />
                <path d="m9 19 3-3 3 3" />
                <path d="m15 5-3 3-3-3" />
              </svg>
            </button>
          }
        </div>
      </div>
    }

    @if (parseError) {
      <div class="text-destructive flex items-start gap-2 p-4 text-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="mt-0.5 size-4 shrink-0"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" x2="12" y1="8" y2="12" />
          <line x1="12" x2="12.01" y1="16" y2="16" />
        </svg>
        <div class="min-w-0">
          <p class="font-sans font-medium">Invalid XML</p>
          <p class="text-muted-foreground mt-1 font-mono text-xs break-words">{{ parseError }}</p>
        </div>
      </div>
    } @else if (root) {
      <div class="min-h-0 flex-1 overflow-auto p-2" role="tree" [attr.aria-label]="effectiveRootLabel">
        <ui-xml-tree-node [node]="root" [path]="[]" [isRoot]="true" [tree]="this" [depth]="0" />
      </div>
    }
    <ng-content />
  `,
})
export class UiXmlTreeViewComponent implements OnInit, OnChanges {
  @Input() data = ''
  @Input() expandDepth = 1
  @Input() maxDepth = 100
  @Input({ transform: booleanAttribute }) showSearch = true
  @Input({ transform: booleanAttribute }) showToolbar = true
  @Input() rootLabel?: string
  @Input('class') className?: string

  @Output() copy = new EventEmitter<{ value: string; path: string }>()

  expanded = new Set<string>()
  search = ''
  copiedPath: string | null = null

  root: XmlNode | null = null
  parseError: string | null = null

  get hostClass(): string {
    return cn('bg-background flex flex-col overflow-hidden rounded-lg border font-mono text-sm block', this.className)
  }

  get effectiveRootLabel(): string {
    return this.rootLabel ?? this.root?.name ?? 'xml'
  }

  get summary(): string {
    if (this.parseError) return 'Parse error'
    if (!this.root) return 'Empty'
    const n = countElements(this.root)
    return `${this.root.name} · ${n} element${n === 1 ? '' : 's'}`
  }

  get searchMatchCount(): number {
    if (!this.search || !this.root) return 0
    let count = 0
    const term = this.search.toLowerCase()
    const walk = (n: XmlNode) => {
      if (n.type === 'element') {
        if (n.name?.toLowerCase().includes(term)) count++
        for (const [k, v] of Object.entries(n.attributes ?? {})) {
          if (k.toLowerCase().includes(term) || v.toLowerCase().includes(term)) count++
        }
        for (const c of n.children ?? []) walk(c)
        return
      }
      const val = n.text ?? n.value ?? ''
      if (val.toLowerCase().includes(term)) count++
    }
    walk(this.root)
    return count
  }

  ngOnInit(): void {
    this.reparse()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['expandDepth']) {
      this.reparse()
    }
  }

  private reparse(): void {
    const res = parseXml(this.data)
    this.root = res.root
    this.parseError = res.error
    this.resetExpanded()
  }

  private resetExpanded(): void {
    const next = new Set<string>()
    if (this.root) {
      walkExpandable(this.root, [], 0, this.expandDepth, (path) => {
        next.add(pathKey(path))
      })
    }
    this.expanded = next
  }

  parsedRoot(): XmlNode | null {
    return this.root ?? parseXml(this.data).root
  }

  rootName(): string {
    if (this.rootLabel) return this.rootLabel
    return this.parsedRoot()?.name ?? 'root'
  }

  isExpanded(path: string[]): boolean {
    return this.expanded.has(pathKey(path))
  }

  toggle(path: string[]): void {
    const k = pathKey(path)
    const next = new Set(this.expanded)
    if (next.has(k)) next.delete(k)
    else next.add(k)
    this.expanded = next
  }

  expandAll(): void {
    const next = new Set<string>()
    const root = this.parsedRoot()
    if (root) {
      walkExpandable(root, [], 0, this.maxDepth, (path) => {
        next.add(pathKey(path))
      })
      if (root.name) {
        next.add(pathKey([root.name]))
      }
    }
    this.expanded = next
  }

  collapseAll(): void {
    this.expanded = new Set()
  }

  onSearchInput(e: Event): void {
    this.search = (e.target as HTMLInputElement).value
    if (!this.search) {
      this.resetExpanded()
      return
    }
    const next = new Set<string>()
    if (this.root) {
      walkExpandable(this.root, [], 0, this.maxDepth, (path, node) => {
        if (this.matchesSearch(node)) next.add(pathKey(path))
      })
    }
    this.expanded = next
  }

  matchesSearch(node: XmlNode): boolean {
    const q = this.search.trim().toLowerCase()
    if (!q) return true
    if (node.name?.toLowerCase().includes(q)) return true
    const val = node.text ?? node.value ?? ''
    if (val.toLowerCase().includes(q)) return true
    return Object.entries(node.attributes ?? {}).some(
      ([k, v]) => k.toLowerCase().includes(q) || v.toLowerCase().includes(q),
    )
  }

  copyNode(value: string, path: string[]): void {
    const p = pathKey(path)
    this.copiedPath = p
    this.copy.emit({ value, path: p })
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(value)
      }
    } catch {
      // clipboard optional
    }
    setTimeout(() => {
      if (this.copiedPath === p) this.copiedPath = null
    }, 1200)
  }
}

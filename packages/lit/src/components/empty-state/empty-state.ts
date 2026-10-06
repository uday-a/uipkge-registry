import { LitElement, css, html, nothing } from 'lit'
import { html as staticHtml, unsafeStatic } from 'lit/static-html.js'
import {
  BellOff,
  CloudOff,
  Database,
  FileX2,
  FolderOpen,
  ImageOff,
  Inbox,
  Search,
  SearchX,
  ServerCrash,
  WifiOff,
  type IconNode,
} from 'lucide'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { icon } from '../../lib/icon'

interface IconEntry {
  node: IconNode
  name: string
}

/**
 * Named icons for the `icon` attribute (kebab-case lucide names). React takes
 * a Lucide component; the attribute covers the common empty-state glyphs and
 * `slot="icon"` accepts any other <svg>.
 */
const namedIcons: Record<string, IconEntry> = {
  inbox: { node: Inbox, name: 'inbox' },
  search: { node: Search, name: 'search' },
  'search-x': { node: SearchX, name: 'search-x' },
  'server-crash': { node: ServerCrash, name: 'server-crash' },
  'file-x-2': { node: FileX2, name: 'file-x-corner' },
  'folder-open': { node: FolderOpen, name: 'folder-open' },
  database: { node: Database, name: 'database' },
  'wifi-off': { node: WifiOff, name: 'wifi-off' },
  'cloud-off': { node: CloudOff, name: 'cloud-off' },
  'image-off': { node: ImageOff, name: 'image-off' },
  'bell-off': { node: BellOff, name: 'bell-off' },
}

/**
 * <uip-empty-state> — the registry EmptyState as a web component.
 *
 *   <uip-empty-state icon="inbox" title="No messages" description="…">
 *     <uip-button>New message</uip-button>
 *   </uip-empty-state>
 *
 * Class strings are React's verbatim. `icon` is a kebab-case lucide name (see
 * `namedIcons`); slot your own <svg slot="icon"> for anything else. `title` /
 * `description` render the heading (h1-h6 via `heading-tag`, default h3) and
 * the paragraph; the default slot is the action row.
 *
 * `role` is the native host attribute (`status` default, like React — set
 * `role="alert"` for assertive states); `aria-live` follows it. Parts: `base`
 * (the container), `icon`, `title`, `description`.
 */
export class UipEmptyState extends LitElement {
  // React's root is a block <div>.
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    icon: { reflect: true },
    title: {},
    description: {},
    headingTag: { attribute: 'heading-tag', reflect: true },
    hasSlottedIcon: { state: true },
  }

  icon?: string
  override title: string = ''
  description?: string
  headingTag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' = 'h3'
  private hasSlottedIcon = false

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'empty-state')
  }

  protected updated() {
    // icon() takes no extra attributes; expose the named icon as `part="icon"`.
    const svg = this.renderRoot.querySelector(':scope > div > svg')
    if (svg && !svg.hasAttribute('part')) {
      svg.setAttribute('part', 'icon')
      svg.setAttribute('aria-hidden', 'true')
    }
  }

  private onIconSlotChange(e: Event) {
    this.hasSlottedIcon = (e.target as HTMLSlotElement)
      .assignedNodes()
      .some((n) => n.nodeType === 1 || n.textContent?.trim())
  }

  render() {
    // The host's native `role` attribute is the API (never a `role` property —
    // it already exists on HTMLElement); default to React's `status`.
    const role = this.getAttribute('role') ?? 'status'
    const entry = this.icon ? namedIcons[this.icon] : undefined
    const showIcon =
      entry && !this.hasSlottedIcon ? icon(entry.node, entry.name, 'text-muted-foreground mx-auto mb-3 size-10') : nothing
    const tag = unsafeStatic(this.headingTag)
    return html`<div
      part="base"
      role=${role}
      aria-live=${role === 'alert' ? 'assertive' : 'polite'}
      data-uipkge=""
      data-slot="empty-state"
      class="flex flex-col items-center py-4 text-center"
    >
      ${showIcon}
      <slot
        name="icon"
        class="[&::slotted(svg)]:text-muted-foreground [&::slotted(svg)]:mx-auto [&::slotted(svg)]:mb-3 [&::slotted(svg)]:size-10"
        @slotchange=${this.onIconSlotChange}
      ></slot>
      ${this.title
        ? staticHtml`<${tag} part="title" data-uipkge="" data-slot="empty-state-title" class="text-foreground font-medium">${this.title}</${tag}>`
        : nothing}
      ${this.description
        ? html`<p part="description" data-uipkge="" data-slot="empty-state-description" class="text-muted-foreground mt-1 max-w-sm text-sm">
            ${this.description}
          </p>`
        : nothing}
      <slot></slot>
    </div>`
  }
}

customElements.get('uip-empty-state') || customElements.define('uip-empty-state', UipEmptyState)

declare global {
  interface HTMLElementTagNameMap {
    'uip-empty-state': UipEmptyState
  }
}

import { LitElement, css, html, nothing } from 'lit'
import { Search } from 'lucide'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { icon } from '../../lib/icon'

interface Item {
  el: Element
  value: string
  keywords: string[]
  disabled: boolean
  nodes: Node[]
}
type Entry = { kind: 'group'; heading?: string; value: string; items: Item[] } | { kind: 'separator' }

let uid = 0

const rootClasses = 'bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md'
const dialogRootClasses =
  '[&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-1 [&_[cmdk-input-wrapper]_svg]:size-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:size-5'

/** cmdk-style fuzzy match: every search character appears in order. */
function matches(haystack: string, search: string) {
  const h = haystack.toLowerCase()
  let i = 0
  for (const ch of search.toLowerCase().replace(/\s+/g, '')) {
    i = h.indexOf(ch, i)
    if (i < 0) return false
    i++
  }
  return true
}

/** Clone an item's light-DOM children for rendering; <uip-command-shortcut> becomes CommandShortcut's span. */
function cloneContent(el: Element): Node[] {
  return [...el.childNodes].map((n) => {
    if (n instanceof Element && n.localName === 'uip-command-shortcut') {
      const span = document.createElement('span')
      span.setAttribute('data-uipkge', '')
      span.setAttribute('data-slot', 'command-shortcut')
      span.className = 'text-muted-foreground ml-auto text-xs tracking-widest'
      span.textContent = n.textContent
      return span
    }
    return n.cloneNode(true)
  })
}

/**
 * <uip-command> — the registry Command (cmdk: Command + CommandInput +
 * CommandList + CommandEmpty + CommandGroup + CommandItem + CommandSeparator +
 * CommandShortcut) as ONE web component. <uip-command-dialog> is
 * CommandDialog: the same element inside a native modal <dialog>.
 *
 *   <uip-command placeholder="Type a command or search…">
 *     <uip-command-empty>No results found.</uip-command-empty>
 *     <uip-command-group heading="Suggestions">
 *       <uip-command-item value="calendar"><svg …></svg>Calendar</uip-command-item>
 *       <uip-command-item value="profile">…Profile<uip-command-shortcut>⌘P</uip-command-shortcut></uip-command-item>
 *     </uip-command-group>
 *     <uip-command-separator></uip-command-separator>
 *   </uip-command>
 *
 * Children are data, like <uip-select>'s <option>s: the element reads them and
 * renders the input (role=combobox) and the listbox in ONE shadow root, so
 * aria-controls / aria-activedescendant resolve. Focus stays in the input.
 * Filtering is cmdk's: fuzzy match on `value` + `keywords` (value defaults to
 * the item text); groups with no match and separators hide while searching.
 * Arrow keys / Home / End / Ctrl+N/P/J/K move, Enter selects. Anything with
 * `slot="list"` renders at the end of the list (loading states).
 *
 * The host is Command's root box, so React's `className` goes on the host
 * (`class="max-w-md rounded-lg border shadow-sm"`).
 *
 * Properties: `placeholder`, `label` (sr-only input label), `loop`, `search`
 * (input text), `value` (highlighted item), `filter` (cmdk's custom filter
 * fn — `(value, search, keywords) => number | boolean`, set via property;
 * numbers > 0 show, 0 hides; order is preserved, no re-sorting),
 * `should-filter` (default true; `="false"` disables built-in filtering and
 * shows all items — cmdk's `shouldFilter`).
 * Events: `select` on the chosen <uip-command-item> (bubbles, composed;
 * detail: { value }) — CommandItem's onSelect; `value-change` (detail:
 * { value }) — Command's onValueChange; the inner input's `input` event.
 */
export type CommandFilter = (value: string, search: string, keywords?: string[]) => number | boolean

export class UipCommand extends LitElement {
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    placeholder: {},
    label: {},
    loop: { type: Boolean },
    search: {},
    value: {},
    filter: { attribute: false },
    shouldFilter: {
      type: Boolean,
      attribute: 'should-filter',
      converter: { fromAttribute: (v: string | null) => v !== null && v !== 'false' },
    },
    entries: { state: true },
    emptyNodes: { state: true },
  }

  placeholder?: string
  label?: string
  loop = false
  search = ''
  value = ''
  filter?: CommandFilter
  shouldFilter = true
  protected entries: Entry[] = []
  protected emptyNodes: Node[] | null = null
  protected readonly uidBase = `uip-command-${++uid}`
  protected dialogMode = false
  private childObserver?: MutationObserver

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', this.dialogMode ? 'command-dialog' : 'command')
    this.readItems()
    this.childObserver = new MutationObserver(() => this.readItems())
    this.childObserver.observe(this, { childList: true, subtree: true, characterData: true, attributes: true })
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.childObserver?.disconnect()
  }

  private readItems() {
    const item = (el: Element): Item => ({
      el,
      value: (el.getAttribute('value') ?? el.textContent ?? '').trim(),
      keywords: (el.getAttribute('keywords') ?? '').split(',').map((k) => k.trim()).filter(Boolean),
      disabled: el.hasAttribute('disabled'),
      nodes: cloneContent(el),
    })
    const entries: Entry[] = []
    let loose: Entry | undefined
    for (const child of this.children) {
      if (child.localName === 'uip-command-group') {
        loose = undefined
        entries.push({
          kind: 'group',
          heading: child.getAttribute('heading') ?? undefined,
          value: child.getAttribute('value') ?? child.getAttribute('heading') ?? '',
          items: [...child.children].filter((c) => c.localName === 'uip-command-item').map(item),
        })
      } else if (child.localName === 'uip-command-item') {
        // Items outside a group render in an unlabelled group, like cmdk.
        if (!loose) entries.push((loose = { kind: 'group', value: '', items: [] }))
        if (loose.kind === 'group') loose.items.push(item(child))
      } else if (child.localName === 'uip-command-separator') {
        loose = undefined
        entries.push({ kind: 'separator' })
      }
    }
    this.entries = entries
    const empty = this.querySelector(':scope > uip-command-empty')
    this.emptyNodes = empty ? cloneContent(empty) : null
  }

  // --- filtering / selection -------------------------------------------------
  private isVisible(i: Item) {
    if (!this.shouldFilter || !this.search) return true
    if (this.filter) {
      const score = this.filter(i.value, this.search, i.keywords)
      return typeof score === 'number' ? score > 0 : Boolean(score)
    }
    return matches([i.value, ...i.keywords].join(' '), this.search)
  }

  /** Visible items in render order. */
  private get visible() {
    return this.entries.flatMap((e) => (e.kind === 'group' ? e.items.filter((i) => this.isVisible(i)) : []))
  }

  protected willUpdate(changed: Map<string, unknown>) {
    // cmdk selects the first item whenever the search or the items change and
    // the current one is gone (a new filter / shouldFilter re-evaluates too).
    if (changed.has('search') || changed.has('entries') || changed.has('filter') || changed.has('shouldFilter')) {
      const vis = this.visible.filter((i) => !i.disabled)
      if (changed.has('search') || changed.has('filter') || changed.has('shouldFilter') || !vis.some((i) => i.value === this.value))
        this.setValue(vis[0]?.value ?? '')
    }
  }

  private setValue(value: string) {
    if (value === this.value) return
    this.value = value
    this.dispatchEvent(new CustomEvent('value-change', { detail: { value }, bubbles: true, composed: true }))
  }

  private move(dir: 1 | -1 | 'first' | 'last') {
    const vis = this.visible.filter((i) => !i.disabled)
    if (!vis.length) return
    const cur = vis.findIndex((i) => i.value === this.value)
    let next: number
    if (dir === 'first') next = 0
    else if (dir === 'last') next = vis.length - 1
    else {
      next = cur + dir
      if (next < 0) next = this.loop ? vis.length - 1 : 0
      if (next >= vis.length) next = this.loop ? 0 : vis.length - 1
    }
    this.setValue(vis[next].value)
    this.updateComplete.then(() =>
      this.renderRoot.querySelector('[cmdk-item][data-selected="true"]')?.scrollIntoView({ block: 'nearest' }),
    )
  }

  protected selectItem(item: Item) {
    if (item.disabled) return
    this.setValue(item.value)
    item.el.dispatchEvent(new CustomEvent('select', { detail: { value: item.value }, bubbles: true, composed: true }))
  }

  private onKeyDown(e: KeyboardEvent) {
    const k = e.key
    const vim = e.ctrlKey && !e.metaKey && !e.altKey
    if (k === 'ArrowDown' || (vim && (k === 'n' || k === 'j'))) {
      e.preventDefault()
      this.move(1)
    } else if (k === 'ArrowUp' || (vim && (k === 'p' || k === 'k'))) {
      e.preventDefault()
      this.move(-1)
    } else if (k === 'Home') {
      e.preventDefault()
      this.move('first')
    } else if (k === 'End') {
      e.preventDefault()
      this.move('last')
    } else if (k === 'Enter' && !e.isComposing) {
      const item = this.visible.find((i) => i.value === this.value)
      if (item) {
        e.preventDefault()
        this.selectItem(item)
      }
    }
  }

  private onInput(e: Event) {
    this.search = (e.target as HTMLInputElement).value
  }

  /** Focus the search input. */
  focus(options?: FocusOptions) {
    this.renderRoot?.querySelector<HTMLInputElement>('[cmdk-input]')?.focus(options)
  }

  // --- render ----------------------------------------------------------------
  protected renderCommand(extraClass?: string) {
    const listId = `${this.uidBase}-list`
    const inputId = `${this.uidBase}-input`
    const labelId = `${this.uidBase}-label`
    const itemId = (i: Item) => `${this.uidBase}-item-${this.itemIndex(i)}`
    const selected = this.visible.find((i) => i.value === this.value)
    const nVisible = this.visible.length
    return html`<div
      part="base"
      cmdk-root=""
      data-uipkge=""
      data-slot="command"
      class=${cn(rootClasses, extraClass)}
      @keydown=${this.onKeyDown}
    >
      <label cmdk-label="" for=${inputId} id=${labelId} class="sr-only">${this.label ?? ''}</label>
      <div data-uipkge="" data-slot="command-input-wrapper" cmdk-input-wrapper="" class="flex h-9 items-center gap-2 border-b px-3">
        ${icon(Search, 'search', 'text-muted-foreground size-4 shrink-0')}
        <input
          id=${inputId}
          cmdk-input=""
          data-uipkge=""
          data-slot="command-input"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded="true"
          aria-controls=${listId}
          aria-labelledby=${labelId}
          aria-activedescendant=${selected ? itemId(selected) : nothing}
          autocomplete="off"
          autocorrect="off"
          spellcheck="false"
          type="text"
          placeholder=${this.placeholder ?? nothing}
          .value=${this.search}
          class="placeholder:text-muted-foreground focus-visible:ring-ring/40 flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          @input=${this.onInput}
        />
      </div>
      <div
        id=${listId}
        cmdk-list=""
        role="listbox"
        tabindex="-1"
        aria-label="Suggestions"
        data-uipkge=""
        data-slot="command-list"
        class="max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto"
      >
        <div cmdk-list-sizer="">
          ${nVisible === 0 && this.emptyNodes
            ? html`<div cmdk-empty="" role="presentation" data-uipkge="" data-slot="command-empty" class="py-6 text-center text-sm">
                ${this.emptyNodes}
              </div>`
            : nothing}
          ${this.entries.map((entry, gi) => {
            if (entry.kind === 'separator') {
              return this.search && this.shouldFilter
                ? nothing
                : html`<div cmdk-separator="" role="separator" data-uipkge="" data-slot="command-separator" class="bg-border -mx-1 h-px"></div>`
            }
            const items = entry.items.filter((i) => this.isVisible(i))
            if (!items.length) return nothing
            const headingId = `${this.uidBase}-group-${gi}`
            return html`<div
              cmdk-group=""
              role="presentation"
              data-value=${entry.value}
              data-uipkge=""
              data-slot="command-group"
              class="text-foreground [&_[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium"
            >
              ${entry.heading
                ? html`<div cmdk-group-heading="" aria-hidden="true" id=${headingId}>${entry.heading}</div>`
                : nothing}
              <div cmdk-group-items="" role="group" aria-labelledby=${entry.heading ? headingId : nothing}>
                ${items.map((item) => {
                  const isSel = item.value === this.value
                  return html`<div
                    id=${itemId(item)}
                    cmdk-item=""
                    role="option"
                    aria-disabled=${item.disabled ? 'true' : 'false'}
                    aria-selected=${isSel ? 'true' : 'false'}
                    data-disabled=${item.disabled ? 'true' : 'false'}
                    data-selected=${isSel ? 'true' : 'false'}
                    data-value=${item.value}
                    data-uipkge=""
                    data-slot="command-item"
                    class="data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                    @pointermove=${() => !item.disabled && this.setValue(item.value)}
                    @click=${() => this.selectItem(item)}
                  >
                    ${item.nodes}
                  </div>`
                })}
              </div>
            </div>`
          })}
          <slot name="list"></slot>
        </div>
      </div>
    </div>`
  }

  private itemIndex(item: Item) {
    let n = 0
    for (const e of this.entries) {
      if (e.kind !== 'group') continue
      const i = e.items.indexOf(item)
      if (i >= 0) return n + i
      n += e.items.length
    }
    return -1
  }

  render() {
    return this.renderCommand()
  }
}

/**
 * <uip-command-dialog> — CommandDialog: <uip-command> inside a native modal
 * <dialog> (top layer, focus trap, Escape, focus returned to the opener). The
 * overlay is the dialog's ::backdrop. `heading` / `description` are the
 * sr-only DialogTitle / DialogDescription (React's `title` / `description`;
 * `title` is an HTMLElement attribute, so it's `heading` here).
 *
 * Properties: `open`, `heading`, `description` + everything <uip-command> has.
 * Events: `open-change` (detail: { open }) + <uip-command>'s events.
 */
export class UipCommandDialog extends UipCommand {
  // Only the <dialog> is visible; the host takes no layout space.
  static styles = [tailwind, css`:host { display: contents; }`]

  static properties = {
    ...UipCommand.properties,
    open: { type: Boolean, reflect: true },
    heading: {},
    description: {},
    state: { state: true },
  }

  open = false
  heading = 'Command Palette'
  description = 'Search for a command to run...'
  private state: 'open' | 'closed' = 'closed'

  constructor() {
    super()
    this.dialogMode = true
  }

  private get dialog() {
    return this.renderRoot.querySelector('dialog')
  }

  show() {
    this.setOpen(true)
  }

  close() {
    this.setOpen(false)
  }

  private setOpen(open: boolean) {
    if (this.open === open) return
    this.open = open
    this.dispatchEvent(new CustomEvent('open-change', { detail: { open }, bubbles: true, composed: true }))
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if (changed.has('open')) {
      this.state = this.open ? 'open' : 'closed'
      // Each opening starts with an empty search (the palette is re-mounted in React).
      if (this.open && this.search) {
        changed.set('search', this.search)
        this.search = ''
      }
    }
    super.willUpdate(changed)
  }

  protected updated(changed: Map<string, unknown>) {
    if (!changed.has('open')) return
    const dialog = this.dialog
    if (!dialog) return
    if (this.open && !dialog.open) {
      dialog.showModal()
    } else if (!this.open && dialog.open) {
      let closed = false
      const done = () => {
        if (closed || this.open) return
        closed = true
        dialog.close()
      }
      setTimeout(done, 400)
      const anims = dialog.getAnimations()
      if (anims.length) Promise.all(anims.map((a) => a.finished)).then(done, done)
      else done()
    }
  }

  private onCancel(e: Event) {
    e.preventDefault()
    this.close()
  }

  private onDialogClick(e: MouseEvent) {
    if (e.target === this.dialog) this.close()
  }

  render() {
    return html`<dialog
      part="content"
      data-uipkge=""
      data-slot="command-dialog"
      data-state=${this.state}
      aria-labelledby=${`${this.uidBase}-title`}
      aria-describedby=${`${this.uidBase}-description`}
      class="bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 open:grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 overflow-hidden rounded-lg border p-0 shadow-lg duration-200 m-0 backdrop:bg-black/50"
      @cancel=${this.onCancel}
      @close=${() => this.close()}
      @click=${this.onDialogClick}
    >
      <h2 id=${`${this.uidBase}-title`} class="sr-only">${this.heading}</h2>
      <p id=${`${this.uidBase}-description`} class="sr-only">${this.description}</p>
      ${this.renderCommand(dialogRootClasses)}
    </dialog>`
  }
}

customElements.get('uip-command') || customElements.define('uip-command', UipCommand)
customElements.get('uip-command-dialog') || customElements.define('uip-command-dialog', UipCommandDialog)

declare global {
  interface HTMLElementTagNameMap {
    'uip-command': UipCommand
    'uip-command-dialog': UipCommandDialog
  }
}

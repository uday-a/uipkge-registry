import { LitElement, css, html, isServer, nothing, unsafeCSS, type TemplateResult } from 'lit'
import { live } from 'lit/directives/live.js'
import { styleMap } from 'lit/directives/style-map.js'
import type { Editor } from '@tiptap/core'
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  Code,
  Heading1,
  Heading2,
  Italic,
  Link as LinkIcon,
  List,
  ListChecks,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  RemoveFormatting,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo2,
  type IconNode,
} from 'lucide'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { icon } from '../../lib/icon'
import '../toggle/toggle'
import '../separator/separator'
import '../button/button'
import '../input/input'
import '../popover/popover'
import type { UipInput } from '../input/input'

// Copied verbatim from React's `richTextEditorCss` (which React injects as a
// <style> tag): placeholder, compact prose overrides, task list, links.
const richTextEditorCss = `
/* Editor placeholder */
.rich-text-editor .tiptap p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: var(--muted-foreground);
  opacity: 0.5;
  pointer-events: none;
  height: 0;
}

/* Prose overrides for compact styling */
.rich-text-content .tiptap {
  min-height: inherit;
}

.rich-text-content .tiptap > *:first-child {
  margin-top: 0;
}

.rich-text-content .tiptap > *:last-child {
  margin-bottom: 0;
}

.rich-text-content .tiptap h1 {
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.3;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.rich-text-content .tiptap h2 {
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.3;
  margin-top: 0.75rem;
  margin-bottom: 0.375rem;
}

.rich-text-content .tiptap p {
  font-size: 0.875rem;
  line-height: 1.6;
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
}

.rich-text-content .tiptap ul,
.rich-text-content .tiptap ol {
  padding-left: 1.25rem;
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
}

.rich-text-content .tiptap li {
  font-size: 0.875rem;
  margin-top: 0.125rem;
  margin-bottom: 0.125rem;
}

.rich-text-content .tiptap blockquote {
  border-left: 3px solid var(--border);
  padding-left: 0.75rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  color: var(--muted-foreground);
  font-style: italic;
}

.rich-text-content .tiptap code {
  background: var(--muted);
  border-radius: 0.25rem;
  padding: 0.125rem 0.25rem;
  font-size: 0.8rem;
  font-family: ui-monospace, monospace;
}

.rich-text-content .tiptap pre {
  background: var(--muted);
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.rich-text-content .tiptap pre code {
  background: none;
  padding: 0;
  font-size: 0.8rem;
}

.rich-text-content .tiptap hr {
  border-color: var(--border);
  margin-top: 0.75rem;
  margin-bottom: 0.75rem;
}

/* Task list styling */
.rich-text-content .tiptap ul[data-type='taskList'] {
  list-style: none;
  padding-left: 0;
}

.rich-text-content .tiptap ul[data-type='taskList'] li {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.rich-text-content .tiptap ul[data-type='taskList'] li > label {
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.rich-text-content .tiptap ul[data-type='taskList'] li > label input[type='checkbox'] {
  accent-color: var(--primary);
  width: 0.875rem;
  height: 0.875rem;
  cursor: pointer;
}

.rich-text-content .tiptap ul[data-type='taskList'] li > div {
  flex: 1;
}

/* Link styling */
.rich-text-content .tiptap a {
  color: var(--primary);
  text-decoration: underline;
  cursor: pointer;
}
`

// TipTap's own base stylesheet (@tiptap/core src/style.ts, verbatim). TipTap
// injects it into document.head, which can't reach this shadow root, so the
// element turns `injectCSS` off and adopts it here instead.
const tiptapCoreCss = `.ProseMirror {
  position: relative;
}

.ProseMirror {
  word-wrap: break-word;
  white-space: pre-wrap;
  white-space: break-spaces;
  -webkit-font-variant-ligatures: none;
  font-variant-ligatures: none;
  font-feature-settings: "liga" 0; /* the above doesn't seem to work in Edge */
}

.ProseMirror [contenteditable="false"] {
  white-space: normal;
}

.ProseMirror [contenteditable="false"] [contenteditable="true"] {
  white-space: pre-wrap;
}

.ProseMirror pre {
  white-space: pre-wrap;
}

img.ProseMirror-separator {
  display: inline !important;
  border: none !important;
  margin: 0 !important;
  width: 0 !important;
  height: 0 !important;
}

.ProseMirror-gapcursor {
  display: none;
  pointer-events: none;
  position: absolute;
  margin: 0;
}

.ProseMirror-gapcursor:after {
  content: "";
  display: block;
  position: absolute;
  top: -2px;
  width: 20px;
  border-top: 1px solid black;
  animation: ProseMirror-cursor-blink 1.1s steps(2, start) infinite;
}

@keyframes ProseMirror-cursor-blink {
  to {
    visibility: hidden;
  }
}

.ProseMirror-hideselection *::selection {
  background: transparent;
}

.ProseMirror-hideselection *::-moz-selection {
  background: transparent;
}

.ProseMirror-hideselection * {
  caret-color: transparent;
}

.ProseMirror-focused .ProseMirror-gapcursor {
  display: block;
}`

interface ToolbarItem {
  type: 'button' | 'separator' | 'link'
  icon?: [IconNode, string, string?]
  action?: () => void
  isActive?: () => boolean
  title?: string
}

// React's Toggle `className`, applied to uip-toggle's inner button through
// ::part (rules from this shadow root win over the toggle's own classes, the
// same result twMerge gives React).
const toggleClass =
  '[&::part(base)]:focus-visible:ring-ring [&::part(base)]:size-7 [&::part(base)]:p-0 [&::part(base)]:focus-visible:ring-2 [&::part(base)]:focus-visible:outline-none'
// React's `<Separator orientation="vertical" className="mx-1 h-5" />`.
const separatorClass = '[&::part(base)]:mx-1 [&::part(base)]:h-5'

// Internal controls fire their own input / change / open-change / pressed-change
// (and ProseMirror's contenteditable fires native `input`); all are composed and
// would surface on the host. Only the editor's own events should.
const stop = (e: Event) => e.stopPropagation()

/**
 * <uip-rich-text-editor> — the registry RichTextEditor (TipTap) as a web component.
 *
 *   <uip-rich-text-editor value="<p>Hello</p>" placeholder="Write…" min-height="150px"></uip-rich-text-editor>
 *
 * Same extensions, toolbar (essential row + collapsible extended row), link
 * popover and content styles as React. TipTap is imported lazily in
 * `firstUpdated` (SSR-safe) and destroyed in `disconnectedCallback`
 * (re-created if the element is re-connected). Like React, the toolbar only
 * renders once the editor exists.
 *
 * Props: `value` (HTML; the attribute is the initial / reset value, the
 * property is live and setting it replaces the content without emitting),
 * `placeholder` (default "Start writing..."), `min-height` (default "120px"),
 * `name` (form field name — an addition: the element is form-associated and
 * submits its HTML).
 *
 * Styling: React's `className` → classes on the host for layout; the root
 * box is `::part(base)`, the editor surface (React's `editorClassName`) is
 * `::part(content)`, the toolbar is `::part(toolbar)`.
 *
 * Events: `input` on every edit and `value-change` (React's `onValueChange`,
 * `detail` = { value: HTML }), both after `.value` is updated; `change` when focus leaves
 * the element after an edit.
 *
 * Shadow DOM: ProseMirror resolves `view.root` to this shadow root and reads
 * the selection from `shadowRoot.getSelection()` (Chromium), falls back to
 * `document.getSelection()` (Firefox, which reports shadow nodes there) and
 * uses `getComposedRanges` on Safari — so no patching is needed here.
 * `focus()` on the host focuses the editor.
 */
export class UipRichTextEditor extends LitElement {
  static formAssociated = true
  // :host display can't be a utility class (the host has no template of its own).
  // Plus React's injected stylesheet and TipTap's core stylesheet (see above).
  static styles = [tailwind, css`:host { display: block; }`, unsafeCSS(richTextEditorCss), unsafeCSS(tiptapCoreCss)]

  static properties = {
    value: {},
    placeholder: {},
    minHeight: { attribute: 'min-height' },
    name: { reflect: true },
    showExtended: { state: true },
    linkOpen: { state: true },
    linkUrl: { state: true },
    ready: { state: true },
  }

  value = ''
  placeholder = 'Start writing...'
  minHeight = '120px'
  name?: string
  private showExtended = false
  private linkOpen = false
  private linkUrl = ''
  private ready = false

  private editor?: Editor
  private internals = this.attachInternals()
  private defaultValue = ''
  private valueAtFocus?: string
  private initToken = 0

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'rich-text-editor')
    this.defaultValue = this.getAttribute('value') ?? ''
    this.addEventListener('focusin', this.onFocusIn)
    this.addEventListener('focusout', this.onFocusOut)
    // Re-connected after a move: firstUpdated won't run again.
    if (this.hasUpdated && !this.editor) this.initEditor()
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.removeEventListener('focusin', this.onFocusIn)
    this.removeEventListener('focusout', this.onFocusOut)
    this.initToken++
    this.editor?.destroy()
    this.editor = undefined
    this.ready = false
    this.linkOpen = false
  }

  protected firstUpdated() {
    this.initEditor()
  }

  private async initEditor() {
    if (isServer) return
    const token = ++this.initToken
    const [core, starter, placeholder, underline, link, textAlign, taskList, taskItem] = await Promise.all([
      import('@tiptap/core'),
      import('@tiptap/starter-kit'),
      import('@tiptap/extension-placeholder'),
      import('@tiptap/extension-underline'),
      import('@tiptap/extension-link'),
      import('@tiptap/extension-text-align'),
      import('@tiptap/extension-task-list'),
      import('@tiptap/extension-task-item'),
    ])
    // Disconnected (or re-initialised) while the chunks were loading.
    if (token !== this.initToken || !this.isConnected) return
    const mount = this.renderRoot.querySelector<HTMLElement>('[part=content]')
    if (!mount) return
    this.editor = new core.Editor({
      element: mount,
      content: this.value,
      // TipTap would inject its base CSS into document.head; it's in static styles instead.
      injectCSS: false,
      extensions: [
        starter.StarterKit.configure({
          heading: { levels: [1, 2, 3] },
          // StarterKit ships its own link + underline since v3 — disabled so the
          // standalone packages can be registered with their own configuration.
          link: false,
          underline: false,
        }),
        placeholder.Placeholder.configure({ placeholder: this.placeholder }),
        underline.Underline,
        link.Link.configure({
          openOnClick: false,
          HTMLAttributes: { class: 'text-primary underline cursor-pointer' },
        }),
        textAlign.TextAlign.configure({ types: ['heading', 'paragraph'] }),
        taskList.TaskList,
        taskItem.TaskItem.configure({ nested: true }),
      ],
      editorProps: {
        attributes: {
          class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none',
        },
      },
      onUpdate: ({ editor }) => {
        this.value = editor.getHTML()
        this.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
        this.dispatchEvent(new CustomEvent('value-change', { detail: { value: this.value }, bubbles: true, composed: true }))
      },
      // Re-render on every transaction so the toolbar tracks the selection.
      onTransaction: () => this.requestUpdate(),
    })
    this.ready = true
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if (changed.has('value')) {
      this.internals.setFormValue(this.value ?? '')
      // External value change (not one the editor just emitted).
      if (this.editor && this.editor.getHTML() !== this.value) {
        this.editor.commands.setContent(this.value || '', { emitUpdate: false })
      }
    }
  }

  formResetCallback() {
    this.value = this.defaultValue
  }

  override focus(options?: FocusOptions) {
    if (this.editor) this.editor.commands.focus()
    else super.focus(options)
  }

  // `change` like a native field: once focus leaves the whole element after an
  // edit. Focus moving to the toolbar or the link popover (same shadow tree,
  // so relatedTarget is retargeted to the host) doesn't count.
  private onFocusIn = () => {
    this.valueAtFocus ??= this.value
  }

  private onFocusOut = (e: FocusEvent) => {
    if (e.relatedTarget === this) return
    const before = this.valueAtFocus
    this.valueAtFocus = undefined
    if (before !== undefined && before !== this.value) {
      this.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
    }
  }

  // --- link popover (React replaced window.prompt with this) -----------------
  private onLinkOpenChange(e: CustomEvent<{ open: boolean }>) {
    e.stopPropagation()
    this.linkOpen = e.detail.open
    // Prefill with the current href so the popover edits instead of replaces.
    if (this.linkOpen) this.linkUrl = (this.editor?.getAttributes('link').href as string | undefined) ?? ''
  }

  private applyLink() {
    const url = this.linkUrl.trim()
    if (!this.editor || !url) return
    this.editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    this.linkOpen = false
  }

  private removeLink() {
    this.editor?.chain().focus().extendMarkRange('link').unsetLink().run()
    this.linkUrl = ''
    this.linkOpen = false
  }

  private get essentialItems(): ToolbarItem[] {
    const e = this.editor
    if (!e) return []
    return [
      { type: 'button', icon: [Bold, 'bold'], action: () => e.chain().focus().toggleBold().run(), isActive: () => e.isActive('bold'), title: 'Bold' },
      { type: 'button', icon: [Italic, 'italic'], action: () => e.chain().focus().toggleItalic().run(), isActive: () => e.isActive('italic'), title: 'Italic' },
      { type: 'button', icon: [UnderlineIcon, 'underline'], action: () => e.chain().focus().toggleUnderline().run(), isActive: () => e.isActive('underline'), title: 'Underline' },
      { type: 'button', icon: [Strikethrough, 'strikethrough'], action: () => e.chain().focus().toggleStrike().run(), isActive: () => e.isActive('strike'), title: 'Strikethrough' },
      { type: 'separator' },
      { type: 'button', icon: [List, 'list'], action: () => e.chain().focus().toggleBulletList().run(), isActive: () => e.isActive('bulletList'), title: 'Bullet list' },
      { type: 'button', icon: [ListOrdered, 'list-ordered'], action: () => e.chain().focus().toggleOrderedList().run(), isActive: () => e.isActive('orderedList'), title: 'Numbered list' },
      { type: 'separator' },
      { type: 'link', icon: [LinkIcon, 'link'], isActive: () => e.isActive('link'), title: 'Link' },
      { type: 'separator' },
      { type: 'button', icon: [Undo2, 'undo-2'], action: () => e.chain().focus().undo().run(), isActive: () => false, title: 'Undo' },
      { type: 'button', icon: [Redo2, 'redo-2'], action: () => e.chain().focus().redo().run(), isActive: () => false, title: 'Redo' },
    ]
  }

  private get extendedItems(): ToolbarItem[] {
    const e = this.editor
    if (!e) return []
    return [
      { type: 'button', icon: [Heading1, 'heading-1'], action: () => e.chain().focus().toggleHeading({ level: 1 }).run(), isActive: () => e.isActive('heading', { level: 1 }), title: 'Heading 1' },
      { type: 'button', icon: [Heading2, 'heading-2'], action: () => e.chain().focus().toggleHeading({ level: 2 }).run(), isActive: () => e.isActive('heading', { level: 2 }), title: 'Heading 2' },
      { type: 'separator' },
      { type: 'button', icon: [Code, 'code'], action: () => e.chain().focus().toggleCode().run(), isActive: () => e.isActive('code'), title: 'Inline code' },
      { type: 'button', icon: [Quote, 'quote'], action: () => e.chain().focus().toggleBlockquote().run(), isActive: () => e.isActive('blockquote'), title: 'Blockquote' },
      { type: 'button', icon: [Minus, 'minus'], action: () => e.chain().focus().setHorizontalRule().run(), isActive: () => false, title: 'Divider' },
      { type: 'button', icon: [ListChecks, 'list-checks'], action: () => e.chain().focus().toggleTaskList().run(), isActive: () => e.isActive('taskList'), title: 'Task list' },
      { type: 'separator' },
      { type: 'button', icon: [AlignLeft, 'text-align-start', 'lucide-text lucide-align-left'], action: () => e.chain().focus().setTextAlign('left').run(), isActive: () => e.isActive({ textAlign: 'left' }), title: 'Align left' },
      { type: 'button', icon: [AlignCenter, 'text-align-center', 'lucide-align-center'], action: () => e.chain().focus().setTextAlign('center').run(), isActive: () => e.isActive({ textAlign: 'center' }), title: 'Align center' },
      { type: 'button', icon: [AlignRight, 'text-align-end', 'lucide-align-right'], action: () => e.chain().focus().setTextAlign('right').run(), isActive: () => e.isActive({ textAlign: 'right' }), title: 'Align right' },
      { type: 'separator' },
      { type: 'button', icon: [RemoveFormatting, 'remove-formatting'], action: () => e.chain().focus().clearNodes().unsetAllMarks().run(), isActive: () => false, title: 'Clear formatting' },
    ]
  }

  private renderToggle(item: ToolbarItem, onClick: () => void, slot?: string) {
    // `live`: uip-toggle flips its own `pressed` on click; the editor's state
    // (not the click) decides it, so re-assert it on every render.
    return html`<uip-toggle
      slot=${slot ?? nothing}
      size="sm"
      .pressed=${live(!!item.isActive?.())}
      title=${item.title ?? nothing}
      aria-label=${item.title ?? nothing}
      class=${toggleClass}
      @click=${() => {
        onClick()
        this.requestUpdate()
      }}
      >${item.icon ? icon(item.icon[0], item.icon[1], cn(item.icon[2], 'size-3.5')) : nothing}</uip-toggle
    >`
  }

  private renderItem(item: ToolbarItem): TemplateResult {
    if (item.type === 'separator') {
      return html`<uip-separator orientation="vertical" class=${separatorClass}></uip-separator>`
    }
    if (item.type === 'link') {
      const active = !!item.isActive?.()
      return html`<uip-popover
        align="start"
        class="[&::part(content)]:w-72 [&::part(content)]:p-3"
        .open=${this.linkOpen}
        @open-change=${this.onLinkOpenChange}
      >
        ${this.renderToggle(item, () => {}, 'trigger')}
        <form
          class="flex flex-col gap-2"
          @submit=${(e: Event) => {
            e.preventDefault()
            this.applyLink()
          }}
        >
          <label for="link-url" class="text-foreground text-xs font-medium">Link URL</label>
          <uip-input
            id="link-url"
            .value=${live(this.linkUrl)}
            type="url"
            size="small"
            placeholder="https://example.com"
            autocomplete="url"
            @input=${(e: Event) => (this.linkUrl = (e.target as UipInput).value)}
            @keydown=${(e: KeyboardEvent) => {
              // The inner <input> is in uip-input's shadow root, so Enter can't
              // implicitly submit this form.
              if (e.key === 'Enter' && !e.isComposing) {
                e.preventDefault()
                this.applyLink()
              }
            }}
          ></uip-input>
          <div class="flex items-center justify-end gap-2">
            ${active
              ? html`<uip-button type="button" variant="ghost" size="sm" @click=${this.removeLink}>Remove</uip-button>`
              : nothing}
            <uip-button type="submit" size="sm" ?disabled=${!this.linkUrl.trim()}>Apply</uip-button>
          </div>
        </form>
      </uip-popover>`
    }
    return this.renderToggle(item, () => item.action?.())
  }

  private renderToolbar() {
    const expandLabel = this.showExtended ? 'Hide more options' : 'Show more options'
    return html`<div
      part="toolbar"
      class="border-b"
      role="toolbar"
      aria-label="Text formatting"
    >
      <!-- Essential row -->
      <div class="flex items-center gap-0.5 px-2 py-1.5">
        ${this.essentialItems.map((item) => this.renderItem(item))}
        <uip-separator orientation="vertical" class=${separatorClass}></uip-separator>
        <!-- Expand toggle -->
        <button
          type="button"
          title=${expandLabel}
          aria-label=${expandLabel}
          aria-expanded=${this.showExtended ? 'true' : 'false'}
          class=${cn(
            'text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:ring-ring inline-flex size-7 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none',
            this.showExtended && 'bg-muted text-foreground',
          )}
          @click=${() => (this.showExtended = !this.showExtended)}
        >
          ${icon(ChevronDown, 'chevron-down', cn('size-3.5 transition-transform duration-200', this.showExtended && 'rotate-180'))}
        </button>
      </div>
      <!-- Extended row (collapsible) -->
      <div
        class=${cn(
          'grid transition-colors duration-200 ease-in-out',
          this.showExtended ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div class="overflow-hidden">
          <div class="flex items-center gap-0.5 border-t px-2 py-1.5">
            ${this.extendedItems.map((item) => this.renderItem(item))}
          </div>
        </div>
      </div>
    </div>`
  }

  render() {
    return html`<div
      part="base"
      data-uipkge=""
      data-slot="rich-text-editor"
      class="rich-text-editor rounded-lg border"
      @input=${stop}
      @change=${stop}
      @open-change=${stop}
      @pressed-change=${stop}
    >
      ${this.ready ? this.renderToolbar() : nothing}
      <!-- Editor (TipTap mounts its ProseMirror view in here) -->
      <div
        part="content"
        class="rich-text-content cursor-text overflow-y-auto px-3 py-2"
        style=${styleMap({ minHeight: this.minHeight })}
        @click=${() => this.editor?.commands.focus()}
      ></div>
    </div>`
  }
}

customElements.get('uip-rich-text-editor') || customElements.define('uip-rich-text-editor', UipRichTextEditor)

declare global {
  interface HTMLElementTagNameMap {
    'uip-rich-text-editor': UipRichTextEditor
  }
}

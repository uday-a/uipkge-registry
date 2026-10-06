<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface RichTextEditorProps extends HTMLAttributes<HTMLDivElement> {
    value?: string
    placeholder?: string
    editorClass?: string
    minHeight?: string
    onValueChange?: (html: string) => void
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { Editor } from '@tiptap/core'
  import StarterKit from '@tiptap/starter-kit'
  import Placeholder from '@tiptap/extension-placeholder'
  import Underline from '@tiptap/extension-underline'
  import Link from '@tiptap/extension-link'
  import TextAlign from '@tiptap/extension-text-align'
  import TaskList from '@tiptap/extension-task-list'
  import TaskItem from '@tiptap/extension-task-item'
  import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    List,
    ListOrdered,
    ListChecks,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Link as LinkIcon,
    Heading1,
    Heading2,
    Quote,
    Minus,
    Undo2,
    Redo2,
    Code,
    RemoveFormatting,
    ChevronDown,
  } from '@lucide/svelte'
  import { untrack } from 'svelte'
  import { Toggle } from '$lib/components/ui/toggle'
  import { Separator } from '$lib/components/ui/separator'
  import { Button } from '$lib/components/ui/button'
  import { Input } from '$lib/components/ui/input'
  import { cn } from '$lib/utils'

  let {
    class: className,
    value = $bindable(''),
    placeholder = 'Start writing...',
    editorClass,
    minHeight = '120px',
    onValueChange,
    ref = $bindable(null),
    ...restProps
  }: RichTextEditorProps = $props()

  let element: HTMLDivElement | null = $state(null)
  let editor = $state<Editor | null>(null)
  // Bumped on every transaction so toolbar active-states re-derive.
  let tick = $state(0)

  $effect(() => {
    if (!element) return
    // untrack mount-time content/placeholder: onUpdate writes `value` below,
    // which would otherwise re-trigger this effect and recreate the editor on
    // every keystroke (destroy/create loop → effect_update_depth_exceeded).
    // External updates still flow through the controlled effect underneath.
    const initialContent = untrack(() => value)
    const initialPlaceholder = untrack(() => placeholder)
    const e: Editor = new Editor({
      element,
      content: initialContent,
      extensions: [
        StarterKit.configure({
          heading: { levels: [1, 2, 3] },
          // StarterKit ships its own link + underline since v3 — disable them so
          // we can register the standalone packages with our own configuration
          // without TipTap warning about duplicate extension names.
          link: false,
          underline: false,
        }),
        Placeholder.configure({ placeholder: initialPlaceholder }),
        Underline,
        Link.configure({
          openOnClick: false,
          HTMLAttributes: { class: 'text-primary underline cursor-pointer' },
        }),
        TextAlign.configure({ types: ['heading', 'paragraph'] }),
        TaskList,
        TaskItem.configure({ nested: true }),
      ],
      editorProps: {
        attributes: {
          class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none',
        },
      },
      onUpdate: ({ editor: updated }: any) => {
        const html = updated.getHTML()
        value = html
        onValueChange?.(html)
      },
    })
    editor = e
    lastSyncedHtml = null
    const bump = () => tick++
    e.on('transaction', bump)
    return () => {
      e.off('transaction', bump)
      e.destroy()
      editor = null
    }
  })

  // Controlled updates from the parent.
  // Guarded two ways: tiptap normalizes content ('' -> '<p></p>'), so a naive
  // getHTML() comparison re-pushes on every run; each push dispatches a
  // transaction that re-triggers this effect (effect_update_depth_exceeded).
  let lastSyncedHtml: string | null = null
  $effect(() => {
    const html = value ?? ''
    if (editor && html !== lastSyncedHtml && editor.getHTML() !== html) {
      lastSyncedHtml = html
      editor.commands.setContent(html, { emitUpdate: false })
    }
  })

  // Link editing lives in an inline panel rather than window.prompt: a native
  // prompt is unstyleable, blocks the main thread, cannot be tested, and is
  // suppressed outright in sandboxed iframes and some mobile browsers.
  let linkOpen = $state(false)
  let linkUrl = $state('')
  let linkPanelEl: HTMLDivElement | null = $state(null)
  const linkFieldId = `rte-link-${Math.random().toString(36).slice(2, 9)}`

  function openLinkEditor() {
    if (!editor) return
    // Prefill with the current href so the panel edits instead of replaces.
    linkUrl = (editor.getAttributes('link').href as string | undefined) ?? ''
    linkOpen = true
  }

  function applyLink() {
    const url = linkUrl.trim()
    if (!editor || !url) return
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    linkOpen = false
  }

  function removeLink() {
    editor?.chain().focus().extendMarkRange('link').unsetLink().run()
    linkUrl = ''
    linkOpen = false
  }

  $effect(() => {
    if (!linkOpen) return
    linkPanelEl?.querySelector('input')?.focus()
    const onDocPointerDown = (e: PointerEvent) => {
      if (linkPanelEl && !linkPanelEl.contains(e.target as Node)) linkOpen = false
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') linkOpen = false
    }
    document.addEventListener('pointerdown', onDocPointerDown, { capture: true })
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDocPointerDown, { capture: true })
      document.removeEventListener('keydown', onKey)
    }
  })

  interface ToolbarItem {
    type: 'button' | 'separator' | 'link'
    icon?: any
    action?: () => void
    isActive?: () => boolean
    title?: string
  }

  let showExtended = $state(false)

  const essentialItems = $derived.by((): ToolbarItem[] => {
    void tick
    if (!editor) return []
    const e = editor
    return [
      { type: 'button', icon: Bold, action: () => e.chain().focus().toggleBold().run(), isActive: () => e.isActive('bold'), title: 'Bold' },
      { type: 'button', icon: Italic, action: () => e.chain().focus().toggleItalic().run(), isActive: () => e.isActive('italic'), title: 'Italic' },
      { type: 'button', icon: UnderlineIcon, action: () => e.chain().focus().toggleUnderline().run(), isActive: () => e.isActive('underline'), title: 'Underline' },
      { type: 'button', icon: Strikethrough, action: () => e.chain().focus().toggleStrike().run(), isActive: () => e.isActive('strike'), title: 'Strikethrough' },
      { type: 'separator' },
      { type: 'button', icon: List, action: () => e.chain().focus().toggleBulletList().run(), isActive: () => e.isActive('bulletList'), title: 'Bullet list' },
      { type: 'button', icon: ListOrdered, action: () => e.chain().focus().toggleOrderedList().run(), isActive: () => e.isActive('orderedList'), title: 'Numbered list' },
      { type: 'separator' },
      { type: 'link', icon: LinkIcon, action: openLinkEditor, isActive: () => e.isActive('link'), title: 'Link' },
      { type: 'separator' },
      { type: 'button', icon: Undo2, action: () => e.chain().focus().undo().run(), isActive: () => false, title: 'Undo' },
      { type: 'button', icon: Redo2, action: () => e.chain().focus().redo().run(), isActive: () => false, title: 'Redo' },
    ]
  })

  const extendedItems = $derived.by((): ToolbarItem[] => {
    void tick
    if (!editor) return []
    const e = editor
    return [
      { type: 'button', icon: Heading1, action: () => e.chain().focus().toggleHeading({ level: 1 }).run(), isActive: () => e.isActive('heading', { level: 1 }), title: 'Heading 1' },
      { type: 'button', icon: Heading2, action: () => e.chain().focus().toggleHeading({ level: 2 }).run(), isActive: () => e.isActive('heading', { level: 2 }), title: 'Heading 2' },
      { type: 'separator' },
      { type: 'button', icon: Code, action: () => e.chain().focus().toggleCode().run(), isActive: () => e.isActive('code'), title: 'Inline code' },
      { type: 'button', icon: Quote, action: () => e.chain().focus().toggleBlockquote().run(), isActive: () => e.isActive('blockquote'), title: 'Blockquote' },
      { type: 'button', icon: Minus, action: () => e.chain().focus().setHorizontalRule().run(), isActive: () => false, title: 'Divider' },
      { type: 'button', icon: ListChecks, action: () => e.chain().focus().toggleTaskList().run(), isActive: () => e.isActive('taskList'), title: 'Task list' },
      { type: 'separator' },
      { type: 'button', icon: AlignLeft, action: () => e.chain().focus().setTextAlign('left').run(), isActive: () => e.isActive({ textAlign: 'left' }), title: 'Align left' },
      { type: 'button', icon: AlignCenter, action: () => e.chain().focus().setTextAlign('center').run(), isActive: () => e.isActive({ textAlign: 'center' }), title: 'Align center' },
      { type: 'button', icon: AlignRight, action: () => e.chain().focus().setTextAlign('right').run(), isActive: () => e.isActive({ textAlign: 'right' }), title: 'Align right' },
      { type: 'separator' },
      { type: 'button', icon: RemoveFormatting, action: () => e.chain().focus().clearNodes().unsetAllMarks().run(), isActive: () => false, title: 'Clear formatting' },
    ]
  })

  const linkActive = $derived.by(() => {
    void tick
    return editor?.isActive('link') ?? false
  })
</script>

<div bind:this={ref} data-uipkge data-slot="rich-text-editor" class={cn('rich-text-editor rounded-lg border', className)} {...restProps}>
  <!-- Toolbar -->
  {#if editor}
    <div class="border-b" role="toolbar" aria-label="Text formatting">
      <!-- Essential row -->
      <div class="relative flex items-center gap-0.5 px-2 py-1.5">
        {#each essentialItems as item, i (i)}
          {#if item.type === 'separator'}
            <Separator orientation="vertical" class="mx-1 h-5" />
          {:else if item.type === 'link'}
            {@const LinkItemIcon = item.icon}
            <Toggle
              size="sm"
              pressed={item.isActive?.()}
              title={item.title}
              aria-label={item.title}
              class="focus-visible:ring-ring size-7 p-0 focus-visible:ring-2 focus-visible:outline-none"
              onclick={openLinkEditor}
            >
              <LinkItemIcon class="size-3.5" aria-hidden="true" />
            </Toggle>
          {:else}
            {@const ItemIcon = item.icon}
            <Toggle
              size="sm"
              pressed={item.isActive?.()}
              title={item.title}
              aria-label={item.title}
              class="focus-visible:ring-ring size-7 p-0 focus-visible:ring-2 focus-visible:outline-none"
              onclick={() => item.action?.()}
            >
              <ItemIcon class="size-3.5" aria-hidden="true" />
            </Toggle>
          {/if}
        {/each}

        <Separator orientation="vertical" class="mx-1 h-5" />

        <!-- Expand toggle -->
        <button
          type="button"
          title={showExtended ? 'Hide more options' : 'Show more options'}
          aria-label={showExtended ? 'Hide more options' : 'Show more options'}
          aria-expanded={showExtended}
          class={cn(
            'text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:ring-ring inline-flex size-7 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none',
            showExtended && 'bg-muted text-foreground',
          )}
          onclick={() => (showExtended = !showExtended)}
        >
          <ChevronDown
            class={cn('size-3.5 transition-transform duration-200', showExtended && 'rotate-180')}
            aria-hidden="true"
          />
        </button>

        <!-- Link panel -->
        {#if linkOpen}
          <div
            bind:this={linkPanelEl}
            class="bg-popover text-popover-foreground absolute top-full left-2 z-50 mt-1 w-72 rounded-md border p-3 shadow-md"
          >
            <form
              class="flex flex-col gap-2"
              onsubmit={(e) => {
                e.preventDefault()
                applyLink()
              }}
            >
              <label for={linkFieldId} class="text-foreground text-xs font-medium">Link URL</label>
              <Input
                id={linkFieldId}
                bind:value={linkUrl}
                type="url"
                size="small"
                placeholder="https://example.com"
                autocomplete="url"
                spellcheck={false}
              />
              <div class="flex items-center justify-end gap-2">
                {#if linkActive}
                  <Button type="button" variant="ghost" size="sm" onclick={removeLink}>Remove</Button>
                {/if}
                <Button type="submit" size="sm" disabled={!linkUrl.trim()}>Apply</Button>
              </div>
            </form>
          </div>
        {/if}
      </div>

      <!-- Extended row (collapsible) -->
      <div class={cn('grid transition-colors duration-200 ease-in-out', showExtended ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')}>
        <div class="overflow-hidden">
          <div class="flex items-center gap-0.5 border-t px-2 py-1.5">
            {#each extendedItems as item, i (i)}
              {#if item.type === 'separator'}
                <Separator orientation="vertical" class="mx-1 h-5" />
              {:else}
                {@const ExtIcon = item.icon}
                <Toggle
                  size="sm"
                  pressed={item.isActive?.()}
                  title={item.title}
                  aria-label={item.title}
                  class="focus-visible:ring-ring size-7 p-0 focus-visible:ring-2 focus-visible:outline-none"
                  onclick={() => item.action?.()}
                >
                  <ExtIcon class="size-3.5" aria-hidden="true" />
                </Toggle>
              {/if}
            {/each}
          </div>
        </div>
      </div>
    </div>
  {/if}

  <!-- Editor -->
  <div
    bind:this={element}
    class={cn('rich-text-content cursor-text overflow-y-auto px-3 py-2', editorClass)}
    style="min-height: {minHeight};"
    onclick={() => editor?.commands.focus()}
  ></div>
</div>

<style>
  /* Editor placeholder */
  :global(.rich-text-editor .tiptap p.is-editor-empty:first-child::before) {
    content: attr(data-placeholder);
    float: left;
    color: var(--muted-foreground);
    opacity: 0.5;
    pointer-events: none;
    height: 0;
  }

  /* Prose overrides for compact styling */
  :global(.rich-text-content .tiptap) {
    min-height: inherit;
  }

  :global(.rich-text-content .tiptap > *:first-child) {
    margin-top: 0;
  }

  :global(.rich-text-content .tiptap > *:last-child) {
    margin-bottom: 0;
  }

  :global(.rich-text-content .tiptap h1) {
    font-size: 1.25rem;
    font-weight: 700;
    line-height: 1.3;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }

  :global(.rich-text-content .tiptap h2) {
    font-size: 1.1rem;
    font-weight: 600;
    line-height: 1.3;
    margin-top: 0.75rem;
    margin-bottom: 0.375rem;
  }

  :global(.rich-text-content .tiptap p) {
    font-size: 0.875rem;
    line-height: 1.6;
    margin-top: 0.25rem;
    margin-bottom: 0.25rem;
  }

  :global(.rich-text-content .tiptap ul),
  :global(.rich-text-content .tiptap ol) {
    padding-left: 1.25rem;
    margin-top: 0.25rem;
    margin-bottom: 0.25rem;
  }

  :global(.rich-text-content .tiptap li) {
    font-size: 0.875rem;
    margin-top: 0.125rem;
    margin-bottom: 0.125rem;
  }

  :global(.rich-text-content .tiptap blockquote) {
    border-left: 3px solid var(--border);
    padding-left: 0.75rem;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    color: var(--muted-foreground);
    font-style: italic;
  }

  :global(.rich-text-content .tiptap code) {
    background: var(--muted);
    border-radius: 0.25rem;
    padding: 0.125rem 0.25rem;
    font-size: 0.8rem;
    font-family: ui-monospace, monospace;
  }

  :global(.rich-text-content .tiptap pre) {
    background: var(--muted);
    border-radius: 0.5rem;
    padding: 0.75rem 1rem;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }

  :global(.rich-text-content .tiptap pre code) {
    background: none;
    padding: 0;
    font-size: 0.8rem;
  }

  :global(.rich-text-content .tiptap hr) {
    border-color: var(--border);
    margin-top: 0.75rem;
    margin-bottom: 0.75rem;
  }

  /* Task list styling */
  :global(.rich-text-content .tiptap ul[data-type='taskList']) {
    list-style: none;
    padding-left: 0;
  }

  :global(.rich-text-content .tiptap ul[data-type='taskList'] li) {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
  }

  :global(.rich-text-content .tiptap ul[data-type='taskList'] li > label) {
    flex-shrink: 0;
    margin-top: 0.125rem;
  }

  :global(.rich-text-content .tiptap ul[data-type='taskList'] li > label input[type='checkbox']) {
    accent-color: var(--primary);
    width: 0.875rem;
    height: 0.875rem;
    cursor: pointer;
  }

  :global(.rich-text-content .tiptap ul[data-type='taskList'] li > div) {
    flex: 1;
  }

  /* Link styling */
  :global(.rich-text-content .tiptap a) {
    color: var(--primary);
    text-decoration: underline;
    cursor: pointer;
  }
</style>

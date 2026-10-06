import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
  booleanAttribute,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core'
import type { ControlValueAccessor } from '@angular/forms'
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import { cn } from '@/lib/utils'

export type RichTextMark = 'bold' | 'italic' | 'underline' | 'strike' | 'code'
export type RichTextBlock = 'paragraph' | 'h1' | 'h2' | 'h3' | 'bulletList' | 'orderedList' | 'blockquote' | 'codeBlock'

// Ported from RichTextEditor (React/Vue). Injected once so the component ships
// self-contained (placeholder, prose overrides, task-list, blockquote/code/hr/link styling).
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

/**
 * Angular port of UIPKGE RichTextEditor (React/Vue parity): TipTap WYSIWYG editor
 * with an essential + extended toolbar, link popover, and task lists. Same props as
 * React (`value`, `onValueChange`) and Vue (`modelValue`), plus an Angular-only
 * `disabled` extra.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-rich-text-editor, [ui-rich-text-editor]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[attr.data-slot]': '"rich-text-editor"',
    '[attr.data-uipkge]': '""',
    '[attr.data-disabled]': 'disabled ? "" : null',
    '[class]': 'hostClass',
  },
  template: `
    <style>
      ${richTextEditorCss}
    </style>

    <!-- Toolbar -->
    @if (editor) {
      <div class="border-b" role="toolbar" aria-label="Text formatting">
        <!-- Essential row -->
        <div class="flex items-center gap-0.5 px-2 py-1.5">
          <!-- Bold -->
          <button
            type="button"
            data-uipkge=""
            data-slot="toggle"
            [attr.data-state]="isActive('bold') ? 'on' : 'off'"
            [attr.aria-pressed]="isActive('bold')"
            title="Bold"
            aria-label="Bold"
            class="focus-visible:ring-ring hover:bg-muted hover:text-muted-foreground inline-flex size-7 min-w-8 items-center justify-center gap-2 rounded-md bg-transparent p-0 text-sm font-medium whitespace-nowrap transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
            [class.bg-accent]="isActive('bold')"
            [class.text-accent-foreground]="isActive('bold')"
            [disabled]="disabled"
            (click)="toggleMark('bold')"
          >
            <svg
              class="lucide lucide-bold size-3.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8" />
            </svg>
          </button>

          <!-- Italic -->
          <button
            type="button"
            data-uipkge=""
            data-slot="toggle"
            [attr.data-state]="isActive('italic') ? 'on' : 'off'"
            [attr.aria-pressed]="isActive('italic')"
            title="Italic"
            aria-label="Italic"
            class="focus-visible:ring-ring hover:bg-muted hover:text-muted-foreground inline-flex size-7 min-w-8 items-center justify-center gap-2 rounded-md bg-transparent p-0 text-sm font-medium whitespace-nowrap transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
            [class.bg-accent]="isActive('italic')"
            [class.text-accent-foreground]="isActive('italic')"
            [disabled]="disabled"
            (click)="toggleMark('italic')"
          >
            <svg
              class="lucide lucide-italic size-3.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="19" x2="10" y1="4" y2="4" />
              <line x1="14" x2="5" y1="20" y2="20" />
              <line x1="15" x2="9" y1="4" y2="20" />
            </svg>
          </button>

          <!-- Underline -->
          <button
            type="button"
            data-uipkge=""
            data-slot="toggle"
            [attr.data-state]="isActive('underline') ? 'on' : 'off'"
            [attr.aria-pressed]="isActive('underline')"
            title="Underline"
            aria-label="Underline"
            class="focus-visible:ring-ring hover:bg-muted hover:text-muted-foreground inline-flex size-7 min-w-8 items-center justify-center gap-2 rounded-md bg-transparent p-0 text-sm font-medium whitespace-nowrap transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
            [class.bg-accent]="isActive('underline')"
            [class.text-accent-foreground]="isActive('underline')"
            [disabled]="disabled"
            (click)="toggleMark('underline')"
          >
            <svg
              class="lucide lucide-underline size-3.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M6 4v6a6 6 0 0 0 12 0V4" />
              <line x1="4" x2="20" y1="20" y2="20" />
            </svg>
          </button>

          <!-- Strikethrough -->
          <button
            type="button"
            data-uipkge=""
            data-slot="toggle"
            [attr.data-state]="isActive('strike') ? 'on' : 'off'"
            [attr.aria-pressed]="isActive('strike')"
            title="Strikethrough"
            aria-label="Strikethrough"
            class="focus-visible:ring-ring hover:bg-muted hover:text-muted-foreground inline-flex size-7 min-w-8 items-center justify-center gap-2 rounded-md bg-transparent p-0 text-sm font-medium whitespace-nowrap transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
            [class.bg-accent]="isActive('strike')"
            [class.text-accent-foreground]="isActive('strike')"
            [disabled]="disabled"
            (click)="toggleMark('strike')"
          >
            <svg
              class="lucide lucide-strikethrough size-3.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M16 4H9a3 3 0 0 0-2.83 4" />
              <path d="M14 12a4 4 0 0 1 0 8H6" />
              <line x1="4" x2="20" y1="12" y2="12" />
            </svg>
          </button>

          <!-- Separator -->
          <div
            data-slot="separator"
            role="none"
            data-orientation="vertical"
            class="bg-border mx-1 h-5 w-px shrink-0"
          ></div>

          <!-- Bullet list -->
          <button
            type="button"
            data-uipkge=""
            data-slot="toggle"
            [attr.data-state]="isActive('bulletList') ? 'on' : 'off'"
            [attr.aria-pressed]="isActive('bulletList')"
            title="Bullet list"
            aria-label="Bullet list"
            class="focus-visible:ring-ring hover:bg-muted hover:text-muted-foreground inline-flex size-7 min-w-8 items-center justify-center gap-2 rounded-md bg-transparent p-0 text-sm font-medium whitespace-nowrap transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
            [class.bg-accent]="isActive('bulletList')"
            [class.text-accent-foreground]="isActive('bulletList')"
            [disabled]="disabled"
            (click)="setBlock('bulletList')"
          >
            <svg
              class="lucide lucide-list size-3.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M3 5h.01" />
              <path d="M3 12h.01" />
              <path d="M3 19h.01" />
              <path d="M8 5h13" />
              <path d="M8 12h13" />
              <path d="M8 19h13" />
            </svg>
          </button>

          <!-- Numbered list -->
          <button
            type="button"
            data-uipkge=""
            data-slot="toggle"
            [attr.data-state]="isActive('orderedList') ? 'on' : 'off'"
            [attr.aria-pressed]="isActive('orderedList')"
            title="Numbered list"
            aria-label="Numbered list"
            class="focus-visible:ring-ring hover:bg-muted hover:text-muted-foreground inline-flex size-7 min-w-8 items-center justify-center gap-2 rounded-md bg-transparent p-0 text-sm font-medium whitespace-nowrap transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
            [class.bg-accent]="isActive('orderedList')"
            [class.text-accent-foreground]="isActive('orderedList')"
            [disabled]="disabled"
            (click)="setBlock('orderedList')"
          >
            <svg
              class="lucide lucide-list-ordered size-3.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M11 5h10" />
              <path d="M11 12h10" />
              <path d="M11 19h10" />
              <path d="M4 4h1v5" />
              <path d="M4 9h2" />
              <path d="M6.5 20H3.4c0-1 2.6-1.925 2.6-3.5a1.5 1.5 0 0 0-2.6-1.02" />
            </svg>
          </button>

          <!-- Separator -->
          <div
            data-slot="separator"
            role="none"
            data-orientation="vertical"
            class="bg-border mx-1 h-5 w-px shrink-0"
          ></div>

          <!-- Link + URL popover -->
          <div class="relative">
            <button
              type="button"
              data-uipkge=""
              data-slot="toggle"
              [attr.data-state]="isActive('link') ? 'on' : 'off'"
              [attr.aria-pressed]="isActive('link')"
              [attr.aria-expanded]="linkOpen"
              title="Link"
              aria-label="Link"
              class="focus-visible:ring-ring hover:bg-muted hover:text-muted-foreground inline-flex size-7 min-w-8 items-center justify-center gap-2 rounded-md bg-transparent p-0 text-sm font-medium whitespace-nowrap transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
              [class.bg-accent]="isActive('link')"
              [class.text-accent-foreground]="isActive('link')"
              [disabled]="disabled"
              (click)="openLinkEditor()"
            >
              <svg
                class="lucide lucide-link size-3.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </button>
            @if (linkOpen) {
              <div
                class="border-border bg-card absolute top-full left-0 z-50 mt-1 w-72 rounded-md border p-3 shadow-md"
                (keydown.escape)="closeLinkEditor(true)"
              >
                <form class="flex flex-col gap-2" (submit)="applyLink(); $event.preventDefault()">
                  <label [for]="linkFieldId" class="text-foreground text-xs font-medium">Link URL</label>
                  <input
                    #linkInput
                    [id]="linkFieldId"
                    [value]="linkUrl"
                    (input)="linkUrl = $any($event.target).value"
                    type="url"
                    placeholder="https://example.com"
                    autocomplete="url"
                    spellcheck="false"
                    class="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-8 w-full rounded-md border px-2.5 text-sm focus-visible:ring-2 focus-visible:outline-none"
                  />
                  <div class="flex items-center justify-end gap-2">
                    @if (isActive('link')) {
                      <button
                        type="button"
                        class="hover:bg-muted hover:text-foreground inline-flex h-8 items-center rounded-md px-3 text-xs font-medium"
                        (click)="removeLink()"
                      >
                        Remove
                      </button>
                    }
                    <button
                      type="submit"
                      class="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-8 items-center rounded-md px-3 text-xs font-medium disabled:pointer-events-none disabled:opacity-50"
                      [disabled]="!linkUrl.trim()"
                    >
                      Apply
                    </button>
                  </div>
                </form>
              </div>
            }
          </div>

          <!-- Separator -->
          <div
            data-slot="separator"
            role="none"
            data-orientation="vertical"
            class="bg-border mx-1 h-5 w-px shrink-0"
          ></div>

          <!-- Undo -->
          <button
            type="button"
            data-uipkge=""
            data-slot="toggle"
            [attr.data-state]="'off'"
            [attr.aria-pressed]="false"
            title="Undo"
            aria-label="Undo"
            class="focus-visible:ring-ring hover:bg-muted hover:text-muted-foreground inline-flex size-7 min-w-8 items-center justify-center gap-2 rounded-md bg-transparent p-0 text-sm font-medium whitespace-nowrap transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
            [disabled]="disabled"
            (click)="undo()"
          >
            <svg
              class="lucide lucide-undo-2 size-3.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M9 14 4 9l5-5" />
              <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11" />
            </svg>
          </button>

          <!-- Redo -->
          <button
            type="button"
            data-uipkge=""
            data-slot="toggle"
            [attr.data-state]="'off'"
            [attr.aria-pressed]="false"
            title="Redo"
            aria-label="Redo"
            class="focus-visible:ring-ring hover:bg-muted hover:text-muted-foreground inline-flex size-7 min-w-8 items-center justify-center gap-2 rounded-md bg-transparent p-0 text-sm font-medium whitespace-nowrap transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
            [disabled]="disabled"
            (click)="redo()"
          >
            <svg
              class="lucide lucide-redo-2 size-3.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m15 14 5-5-5-5" />
              <path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13" />
            </svg>
          </button>

          <!-- Separator -->
          <div
            data-slot="separator"
            role="none"
            data-orientation="vertical"
            class="bg-border mx-1 h-5 w-px shrink-0"
          ></div>

          <!-- Expand toggle -->
          <button
            type="button"
            [title]="showExtended ? 'Hide more options' : 'Show more options'"
            [attr.aria-label]="showExtended ? 'Hide more options' : 'Show more options'"
            [attr.aria-expanded]="showExtended"
            [class]="expandClass"
            [disabled]="disabled"
            (click)="toggleExtended()"
          >
            <svg
              class="lucide lucide-chevron-down size-3.5 transition-transform duration-200"
              [class.rotate-180]="showExtended"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        </div>

        <!-- Extended row (collapsible) -->
        <div
          [class]="extendedWrapClass"
        >
          <div class="overflow-hidden">
            <div class="flex items-center gap-0.5 border-t px-2 py-1.5">
              <!-- Heading 1 -->
              <button
                type="button"
                data-uipkge=""
                data-slot="toggle"
                [attr.data-state]="isActive('h1') ? 'on' : 'off'"
                [attr.aria-pressed]="isActive('h1')"
                title="Heading 1"
                aria-label="Heading 1"
                class="focus-visible:ring-ring hover:bg-muted hover:text-muted-foreground inline-flex size-7 min-w-8 items-center justify-center gap-2 rounded-md bg-transparent p-0 text-sm font-medium whitespace-nowrap transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                [class.bg-accent]="isActive('h1')"
                [class.text-accent-foreground]="isActive('h1')"
                [disabled]="disabled"
                (click)="setBlock('h1')"
              >
                <svg
                  class="lucide lucide-heading-1 size-3.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M4 12h8" />
                  <path d="M4 18V6" />
                  <path d="M12 18V6" />
                  <path d="m17 12 3-2v8" />
                </svg>
              </button>

              <!-- Heading 2 -->
              <button
                type="button"
                data-uipkge=""
                data-slot="toggle"
                [attr.data-state]="isActive('h2') ? 'on' : 'off'"
                [attr.aria-pressed]="isActive('h2')"
                title="Heading 2"
                aria-label="Heading 2"
                class="focus-visible:ring-ring hover:bg-muted hover:text-muted-foreground inline-flex size-7 min-w-8 items-center justify-center gap-2 rounded-md bg-transparent p-0 text-sm font-medium whitespace-nowrap transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                [class.bg-accent]="isActive('h2')"
                [class.text-accent-foreground]="isActive('h2')"
                [disabled]="disabled"
                (click)="setBlock('h2')"
              >
                <svg
                  class="lucide lucide-heading-2 size-3.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M4 12h8" />
                  <path d="M4 18V6" />
                  <path d="M12 18V6" />
                  <path d="M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1" />
                </svg>
              </button>

              <!-- Separator -->
              <div
                data-slot="separator"
                role="none"
                data-orientation="vertical"
                class="bg-border mx-1 h-5 w-px shrink-0"
              ></div>

              <!-- Inline code -->
              <button
                type="button"
                data-uipkge=""
                data-slot="toggle"
                [attr.data-state]="isActive('code') ? 'on' : 'off'"
                [attr.aria-pressed]="isActive('code')"
                title="Inline code"
                aria-label="Inline code"
                class="focus-visible:ring-ring hover:bg-muted hover:text-muted-foreground inline-flex size-7 min-w-8 items-center justify-center gap-2 rounded-md bg-transparent p-0 text-sm font-medium whitespace-nowrap transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                [class.bg-accent]="isActive('code')"
                [class.text-accent-foreground]="isActive('code')"
                [disabled]="disabled"
                (click)="toggleMark('code')"
              >
                <svg
                  class="lucide lucide-code size-3.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="m16 18 6-6-6-6" />
                  <path d="m8 6-6 6 6 6" />
                </svg>
              </button>

              <!-- Blockquote -->
              <button
                type="button"
                data-uipkge=""
                data-slot="toggle"
                [attr.data-state]="isActive('blockquote') ? 'on' : 'off'"
                [attr.aria-pressed]="isActive('blockquote')"
                title="Blockquote"
                aria-label="Blockquote"
                class="focus-visible:ring-ring hover:bg-muted hover:text-muted-foreground inline-flex size-7 min-w-8 items-center justify-center gap-2 rounded-md bg-transparent p-0 text-sm font-medium whitespace-nowrap transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                [class.bg-accent]="isActive('blockquote')"
                [class.text-accent-foreground]="isActive('blockquote')"
                [disabled]="disabled"
                (click)="setBlock('blockquote')"
              >
                <svg
                  class="lucide lucide-quote size-3.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"
                  />
                  <path
                    d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"
                  />
                </svg>
              </button>

              <!-- Divider -->
              <button
                type="button"
                data-uipkge=""
                data-slot="toggle"
                [attr.data-state]="'off'"
                [attr.aria-pressed]="false"
                title="Divider"
                aria-label="Divider"
                class="focus-visible:ring-ring hover:bg-muted hover:text-muted-foreground inline-flex size-7 min-w-8 items-center justify-center gap-2 rounded-md bg-transparent p-0 text-sm font-medium whitespace-nowrap transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                [disabled]="disabled"
                (click)="insertHr()"
              >
                <svg
                  class="lucide lucide-minus size-3.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M5 12h14" />
                </svg>
              </button>

              <!-- Task list -->
              <button
                type="button"
                data-uipkge=""
                data-slot="toggle"
                [attr.data-state]="isActive('taskList') ? 'on' : 'off'"
                [attr.aria-pressed]="isActive('taskList')"
                title="Task list"
                aria-label="Task list"
                class="focus-visible:ring-ring hover:bg-muted hover:text-muted-foreground inline-flex size-7 min-w-8 items-center justify-center gap-2 rounded-md bg-transparent p-0 text-sm font-medium whitespace-nowrap transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                [class.bg-accent]="isActive('taskList')"
                [class.text-accent-foreground]="isActive('taskList')"
                [disabled]="disabled"
                (click)="toggleTaskList()"
              >
                <svg
                  class="lucide lucide-list-checks size-3.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M13 5h8" />
                  <path d="M13 12h8" />
                  <path d="M13 19h8" />
                  <path d="m3 17 2 2 4-4" />
                  <path d="m3 7 2 2 4-4" />
                </svg>
              </button>

              <!-- Separator -->
              <div
                data-slot="separator"
                role="none"
                data-orientation="vertical"
                class="bg-border mx-1 h-5 w-px shrink-0"
              ></div>

              <!-- Align left -->
              <button
                type="button"
                data-uipkge=""
                data-slot="toggle"
                [attr.data-state]="isActive('alignLeft') ? 'on' : 'off'"
                [attr.aria-pressed]="isActive('alignLeft')"
                title="Align left"
                aria-label="Align left"
                class="focus-visible:ring-ring hover:bg-muted hover:text-muted-foreground inline-flex size-7 min-w-8 items-center justify-center gap-2 rounded-md bg-transparent p-0 text-sm font-medium whitespace-nowrap transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                [class.bg-accent]="isActive('alignLeft')"
                [class.text-accent-foreground]="isActive('alignLeft')"
                [disabled]="disabled"
                (click)="setAlign('left')"
              >
                <svg
                  class="lucide lucide-align-left size-3.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M21 5H3" />
                  <path d="M15 12H3" />
                  <path d="M17 19H3" />
                </svg>
              </button>

              <!-- Align center -->
              <button
                type="button"
                data-uipkge=""
                data-slot="toggle"
                [attr.data-state]="isActive('alignCenter') ? 'on' : 'off'"
                [attr.aria-pressed]="isActive('alignCenter')"
                title="Align center"
                aria-label="Align center"
                class="focus-visible:ring-ring hover:bg-muted hover:text-muted-foreground inline-flex size-7 min-w-8 items-center justify-center gap-2 rounded-md bg-transparent p-0 text-sm font-medium whitespace-nowrap transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                [class.bg-accent]="isActive('alignCenter')"
                [class.text-accent-foreground]="isActive('alignCenter')"
                [disabled]="disabled"
                (click)="setAlign('center')"
              >
                <svg
                  class="lucide lucide-align-center size-3.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M21 5H3" />
                  <path d="M17 12H7" />
                  <path d="M19 19H5" />
                </svg>
              </button>

              <!-- Align right -->
              <button
                type="button"
                data-uipkge=""
                data-slot="toggle"
                [attr.data-state]="isActive('alignRight') ? 'on' : 'off'"
                [attr.aria-pressed]="isActive('alignRight')"
                title="Align right"
                aria-label="Align right"
                class="focus-visible:ring-ring hover:bg-muted hover:text-muted-foreground inline-flex size-7 min-w-8 items-center justify-center gap-2 rounded-md bg-transparent p-0 text-sm font-medium whitespace-nowrap transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                [class.bg-accent]="isActive('alignRight')"
                [class.text-accent-foreground]="isActive('alignRight')"
                [disabled]="disabled"
                (click)="setAlign('right')"
              >
                <svg
                  class="lucide lucide-align-right size-3.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M21 5H3" />
                  <path d="M21 12H9" />
                  <path d="M21 19H7" />
                </svg>
              </button>

              <!-- Separator -->
              <div
                data-slot="separator"
                role="none"
                data-orientation="vertical"
                class="bg-border mx-1 h-5 w-px shrink-0"
              ></div>

              <!-- Clear formatting -->
              <button
                type="button"
                data-uipkge=""
                data-slot="toggle"
                [attr.data-state]="'off'"
                [attr.aria-pressed]="false"
                title="Clear formatting"
                aria-label="Clear formatting"
                class="focus-visible:ring-ring hover:bg-muted hover:text-muted-foreground inline-flex size-7 min-w-8 items-center justify-center gap-2 rounded-md bg-transparent p-0 text-sm font-medium whitespace-nowrap transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                [disabled]="disabled"
                (click)="clearFormatting()"
              >
                <svg
                  class="lucide lucide-remove-formatting size-3.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M4 7V4h16v3" />
                  <path d="M5 20h6" />
                  <path d="M13 4 8 20" />
                  <path d="m15 15 5 5" />
                  <path d="m20 15-5 5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- Content Area -->
    <div [class]="contentClass" [style.min-height]="minHeight" (click)="focusEditor()">
      <div #editorHost></div>
    </div>
  `,
})
export class UiRichTextEditorComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() value?: string
  @Input() modelValue = ''
  @Input() placeholder = 'Start writing...'
  @Input('class') className?: string
  @Input() editorClass?: string
  @Input() editorClassName?: string
  @Input() minHeight = '120px'
  @Input({ transform: booleanAttribute }) disabled = false
  @Output() valueChange = new EventEmitter<string>()
  @Output() modelValueChange = new EventEmitter<string>()
  /** Reactive-forms hook: host apps bind a ControlValueAccessor. */
  valueAccessor?: ControlValueAccessor

  @ViewChild('editorHost') editorHost?: ElementRef<HTMLElement>
  @ViewChild('linkInput') linkInput?: ElementRef<HTMLInputElement>
  private cdr?: ChangeDetectorRef

  constructor() {
    try {
      this.cdr = inject(ChangeDetectorRef, { optional: true }) ?? undefined
    } catch {
      // Instantiated outside injection context (e.g. unit tests)
    }
  }

  private static nextId = 0

  editor: Editor | null = null
  showExtended = false
  linkOpen = false
  linkUrl = ''
  readonly linkFieldId = `rte-link-${UiRichTextEditorComponent.nextId++}`
  private lastInsideEvent: Event | null = null

  @HostListener('click', ['$event'])
  onHostClick(event: Event): void {
    this.lastInsideEvent = event
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (event === this.lastInsideEvent) {
      this.lastInsideEvent = null
      return
    }
    if (this.linkOpen) this.closeLinkEditor(false)
  }

  get currentContent(): string {
    return this.value !== undefined ? this.value : this.modelValue
  }

  get hostClass(): string {
    return cn(
      'rich-text-editor block rounded-lg border',
      this.disabled && 'opacity-50 pointer-events-none',
      this.className,
    )
  }

  get contentClass(): string {
    return cn('rich-text-content cursor-text overflow-y-auto px-3 py-2', this.editorClassName ?? this.editorClass)
  }

  get expandClass(): string {
    return cn(
      'text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:ring-ring inline-flex size-7 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none',
      this.showExtended && 'bg-muted text-foreground',
    )
  }

  get extendedWrapClass(): string {
    return cn(
      'grid transition-colors duration-200 ease-in-out',
      this.showExtended ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
    )
  }

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return
    const host = this.editorHost?.nativeElement
    if (!host || this.editor) return
    this.editor = new Editor({
      element: host,
      content: this.currentContent,
      editable: !this.disabled,
      extensions: [
        StarterKit.configure({
          heading: { levels: [1, 2, 3] },
          // StarterKit ships its own link + underline since v3 — disable them so
          // we can register the standalone packages with our own configuration
          // without TipTap warning about duplicate extension names.
          link: false,
          underline: false,
        }),
        Placeholder.configure({ placeholder: this.placeholder }),
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
      onUpdate: ({ editor }) => this.handleUpdate(editor.getHTML()),
    })
    this.cdr?.detectChanges()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['disabled'] && this.editor) this.editor.setEditable(!this.disabled)
    if ((changes['value'] || changes['modelValue']) && this.editor) {
      const current = this.currentContent
      if (this.editor.getHTML() !== current) {
        this.editor.commands.setContent(current || '', { emitUpdate: false })
      }
    }
  }

  ngOnDestroy(): void {
    this.editor?.destroy()
    this.editor = null
  }

  setContent(html: string): void {
    if (this.disabled) return
    this.modelValue = html
    this.value = html
    this.editor?.commands.setContent(html, { emitUpdate: false })
    this.modelValueChange.emit(html)
    this.valueChange.emit(html)
  }

  handleUpdate(html: string): void {
    this.modelValue = html
    this.value = html
    this.modelValueChange.emit(html)
    this.valueChange.emit(html)
  }

  focusEditor(): void {
    this.editor?.commands.focus()
  }

  isActive(key: string): boolean {
    const editor = this.editor
    if (!editor) return false
    switch (key) {
      case 'h1':
        return editor.isActive('heading', { level: 1 })
      case 'h2':
        return editor.isActive('heading', { level: 2 })
      case 'h3':
        return editor.isActive('heading', { level: 3 })
      case 'alignLeft':
        return editor.isActive({ textAlign: 'left' })
      case 'alignCenter':
        return editor.isActive({ textAlign: 'center' })
      case 'alignRight':
        return editor.isActive({ textAlign: 'right' })
      default:
        return editor.isActive(key)
    }
  }

  isMarkActive(mark: RichTextMark): boolean {
    return this.isActive(mark)
  }

  toggleMark(mark: RichTextMark): void {
    if (this.disabled) return
    const editor = this.editor
    if (!editor) return
    switch (mark) {
      case 'bold':
        editor.chain().focus().toggleBold().run()
        break
      case 'italic':
        editor.chain().focus().toggleItalic().run()
        break
      case 'underline':
        editor.chain().focus().toggleUnderline().run()
        break
      case 'strike':
        editor.chain().focus().toggleStrike().run()
        break
      case 'code':
        editor.chain().focus().toggleCode().run()
        break
    }
  }

  setBlock(block: RichTextBlock): void {
    if (this.disabled) return
    const editor = this.editor
    if (!editor) return
    switch (block) {
      case 'bulletList':
        editor.chain().focus().toggleBulletList().run()
        break
      case 'orderedList':
        editor.chain().focus().toggleOrderedList().run()
        break
      case 'h1':
        editor.chain().focus().toggleHeading({ level: 1 }).run()
        break
      case 'h2':
        editor.chain().focus().toggleHeading({ level: 2 }).run()
        break
      case 'h3':
        editor.chain().focus().toggleHeading({ level: 3 }).run()
        break
      case 'blockquote':
        editor.chain().focus().toggleBlockquote().run()
        break
      case 'codeBlock':
        editor.chain().focus().toggleCodeBlock().run()
        break
      default:
        editor.chain().focus().setParagraph().run()
        break
    }
  }

  setAlign(dir: 'left' | 'center' | 'right'): void {
    if (!this.disabled) this.editor?.chain().focus().setTextAlign(dir).run()
  }

  insertHr(): void {
    if (!this.disabled) this.editor?.chain().focus().setHorizontalRule().run()
  }

  toggleTaskList(): void {
    if (!this.disabled) this.editor?.chain().focus().toggleTaskList().run()
  }

  clearFormatting(): void {
    if (!this.disabled) this.editor?.chain().focus().clearNodes().unsetAllMarks().run()
  }

  undo(): void {
    if (!this.disabled) this.editor?.chain().focus().undo().run()
  }

  redo(): void {
    if (!this.disabled) this.editor?.chain().focus().redo().run()
  }

  toggleExtended(): void {
    this.showExtended = !this.showExtended
  }

  openLinkEditor(): void {
    if (this.disabled) return
    const editor = this.editor
    if (!editor) return
    // Prefill with the current href so the popover edits instead of replaces.
    this.linkUrl = (editor.getAttributes('link').href as string | undefined) ?? ''
    this.linkOpen = true
    setTimeout(() => this.linkInput?.nativeElement.focus(), 0)
  }

  applyLink(): void {
    const url = this.linkUrl.trim()
    if (!this.editor || !url) return
    this.editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    this.linkOpen = false
  }

  removeLink(): void {
    this.editor?.chain().focus().extendMarkRange('link').unsetLink().run()
    this.linkUrl = ''
    this.linkOpen = false
  }

  closeLinkEditor(refocus = false): void {
    this.linkOpen = false
    if (refocus) this.editor?.commands.focus()
  }

  wordCount(): number {
    const text = this.currentContent.replace(/<[^>]*>/g, ' ').trim()
    if (!text) return 0
    return text.split(/\s+/).length
  }

  clear(): void {
    if (!this.disabled) this.setContent('')
  }
}

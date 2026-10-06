import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  booleanAttribute,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'

/**
 * Angular port of UIPKGE TagsInput, 1:1 with the React component: type a value and press a
 * commit key (Enter / comma by default, or `addOnKeys` / `delimiter`) to add a chip;
 * Backspace on an empty draft removes the last chip; blur commits the draft; `addOnPaste`
 * splits pasted text on whitespace; `unique` rejects duplicates and `max` caps the list.
 * Clicking anywhere in the box focuses the input. `value` / `defaultValue` / `valueChange`
 * work controlled or uncontrolled like React. Class strings copied verbatim from React.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-tags-input, [ui-tags-input]',
  standalone: true,
  host: {
    'data-uipkge': '',
    'data-slot': 'tags-input',
    '[class]': 'hostClass',
    '(click)': 'focusInput()',
  },
  template: `
    @for (tag of tags; track $index; let i = $index) {
      <span
        data-uipkge=""
        data-slot="tags-input-item"
        class="bg-secondary data-[state=active]:ring-ring ring-offset-background flex h-5 items-center rounded-md data-[state=active]:ring-2 data-[state=active]:ring-offset-2"
      >
        <span data-slot="tags-input-item-text" class="rounded bg-transparent px-2 py-0.5 text-sm">{{ tag }}</span>
        <button
          type="button"
          [attr.aria-label]="'Remove ' + tag"
          [disabled]="disabled"
          data-slot="tags-input-item-delete"
          class="hover:text-foreground focus-visible:ring-ring mr-1 flex rounded bg-transparent focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none"
          (mousedown)="$event.preventDefault()"
          (click)="$event.stopPropagation(); removeAt(i)"
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
            class="lucide lucide-x h-4 w-4"
            aria-hidden="true"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </span>
    }

    @if (!disabled) {
      <input
        #input
        data-slot="tags-input-input"
        [value]="draft()"
        [attr.placeholder]="atMax ? null : (placeholder ?? null)"
        [disabled]="atMax"
        class="min-h-5 flex-1 bg-transparent px-1 text-sm focus:outline-none disabled:cursor-default"
        (input)="draft.set($any($event.target).value)"
        (keydown)="handleKeyDown($event)"
        (paste)="handlePaste($event)"
        (blur)="addTag(draft())"
      />
    }
  `,
})
export class UiTagsInputComponent {
  /** Controlled list of tags (pair with `valueChange`). Leave unset for uncontrolled use. */
  @Input() value?: string[]
  /** Uncontrolled initial list. */
  @Input() defaultValue?: string[]
  @Input() placeholder?: string
  @Input({ transform: booleanAttribute }) disabled = false
  /** Keys that commit the typed value into a tag. Defaults to Enter + comma. */
  @Input() addOnKeys?: string[]
  /** Split pasted text on whitespace and add each token as a tag. */
  @Input({ transform: booleanAttribute }) addOnPaste = false
  /** Character that commits the typed value into a tag (alias for addOnKeys). */
  @Input() delimiter?: string
  /** Reject duplicate tags (case-sensitive). */
  @Input({ transform: booleanAttribute }) unique = true
  /** Maximum number of tags allowed. */
  @Input() max?: number
  @Input('class') className?: string

  /** Fires with the next list whenever a tag is added or removed (React `onValueChange`). */
  @Output() valueChange = new EventEmitter<string[]>()

  @ViewChild('input') private inputRef?: ElementRef<HTMLInputElement>

  readonly draft = signal('')
  private readonly internal = signal<string[] | null>(null)

  get tags(): string[] {
    if (this.value !== undefined) return this.value
    return this.internal() ?? this.defaultValue ?? []
  }

  get commitKeys(): string[] {
    return this.addOnKeys ?? (this.delimiter ? [this.delimiter] : ['Enter', ','])
  }

  get atMax(): boolean {
    return this.max !== undefined && this.tags.length >= this.max
  }

  get hostClass(): string {
    return cn(
      'border-input bg-background flex flex-wrap items-center gap-2 rounded-md border px-2 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none',
      'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
      'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
      this.disabled && 'pointer-events-none opacity-50',
      this.className,
    )
  }

  focusInput(): void {
    if (!this.disabled) this.inputRef?.nativeElement.focus()
  }

  private commit(next: string[]): void {
    const capped = this.max !== undefined ? next.slice(0, this.max) : next
    if (this.value === undefined) this.internal.set(capped)
    this.valueChange.emit(capped)
  }

  addTag(raw: string): void {
    const trimmed = raw.trim()
    if (!trimmed) return
    if (this.atMax || (this.unique && this.tags.includes(trimmed))) {
      this.setDraft('')
      return
    }
    this.commit([...this.tags, trimmed])
    this.setDraft('')
  }

  removeAt(index: number): void {
    this.commit(this.tags.filter((_, i) => i !== index))
  }

  handleKeyDown(e: KeyboardEvent): void {
    if (this.commitKeys.includes(e.key)) {
      e.preventDefault()
      this.addTag(this.draft())
    } else if (e.key === 'Backspace' && this.draft() === '' && this.tags.length > 0) {
      this.removeAt(this.tags.length - 1)
    }
  }

  handlePaste(e: ClipboardEvent): void {
    if (!this.addOnPaste) return
    const text = e.clipboardData?.getData('text') ?? ''
    if (!text.trim()) return
    e.preventDefault()
    const tokens = text
      .split(/\s+/)
      .map((t) => t.trim())
      .filter(Boolean)
    let next = [...this.tags]
    for (const token of tokens) {
      if (this.max !== undefined && next.length >= this.max) break
      if (this.unique && next.includes(token)) continue
      next = [...next, token]
    }
    this.commit(next)
    this.setDraft('')
  }

  /** The input is bound to `draft`, but also reset its DOM value (a signal set to '' twice is a no-op). */
  private setDraft(v: string): void {
    this.draft.set(v)
    if (this.inputRef) this.inputRef.nativeElement.value = v
  }
}

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
 * Angular port of the React FileUpload: a visually hidden `<input type="file">` plus a
 * dashed dropzone (role="button") that opens the picker on click / Enter / Space and
 * accepts dropped files. Single mode keeps the first file; `multiple` replaces the list
 * with the new selection (like React). `value` / `defaultValue` / `valueChange`
 * (`[(value)]`, a `File[]`).
 *
 * Slots (React props): `[slot=icon]` replaces the upload icon, the default content replaces
 * the "Click to upload or drag and drop" copy, and `[slot=content]` / `<ui-file-upload-content>`
 * renders below the dropzone (React `content`, e.g. the file list).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-file-upload, [ui-file-upload]',
  standalone: true,
  host: {
    '[class]': 'hostClass',
  },
  template: `
    <input
      #input
      type="file"
      [attr.accept]="accept ?? null"
      [multiple]="multiple"
      [disabled]="disabled"
      class="sr-only"
      tabindex="-1"
      (change)="handleFiles($any($event.target).files)"
    />
    <div
      role="button"
      [attr.tabindex]="disabled ? -1 : 0"
      [attr.aria-disabled]="disabled || null"
      [attr.aria-label]="multiple ? 'Upload files' : 'Upload file'"
      [class]="dropzoneClass"
      (click)="openFilePicker()"
      (keydown)="onDropzoneKeyDown($event)"
      (drop)="handleDrop($event)"
      (dragover)="handleDragOver($event)"
      (dragleave)="isDragging.set(false)"
    >
      <ng-content select="[slot=icon]"
        ><svg
          class="text-muted-foreground mb-2 size-10"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
          /></svg
      ></ng-content>
      <ng-content
        ><p class="text-muted-foreground text-sm">
          <span class="text-foreground font-semibold">Click to upload</span> or drag and drop
        </p>
        @if (accept) {
          <p class="text-muted-foreground/70 mt-1 text-xs">{{ accept }}</p>
        }
      </ng-content>
    </div>
    <ng-content select="[slot=content], ui-file-upload-content, [ui-file-upload-content]" />
  `,
})
export class UiFileUploadComponent {
  private readonly _value = signal<File[] | undefined>(undefined)
  private readonly _internal = signal<File[] | null>(null)
  readonly isDragging = signal(false)

  @Input() accept?: string
  @Input({ transform: booleanAttribute }) multiple = false
  @Input({ transform: booleanAttribute }) disabled = false
  /** Controlled file list. */
  @Input()
  set value(v: File[] | null | undefined) {
    this._value.set(v ?? undefined)
  }
  get value(): File[] {
    return this._value() ?? this._internal() ?? this.defaultValue ?? []
  }
  /** Uncontrolled initial file list. */
  @Input() defaultValue?: File[]
  @Output() valueChange = new EventEmitter<File[]>()
  @Input('class') className?: string

  @ViewChild('input', { static: true }) inputRef!: ElementRef<HTMLInputElement>

  get hostClass(): string {
    return cn('block space-y-3', this.className)
  }

  get dropzoneClass(): string {
    return cn(
      'border-muted-foreground/25 hover:border-muted-foreground/50 bg-muted/50 focus-visible:ring-ring flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none',
      this.isDragging() && 'border-primary bg-primary/5',
      this.disabled && 'pointer-events-none opacity-50',
    )
  }

  private emit(files: File[]): void {
    if (this._value() === undefined) this._internal.set(files)
    this.valueChange.emit(files)
  }

  handleFiles(files: FileList | null): void {
    if (this.disabled || !files) return
    const fileArray = Array.from(files)
    const first = fileArray[0]
    this.emit(this.multiple ? fileArray : first ? [first] : [])
  }

  handleDrop(e: DragEvent): void {
    e.preventDefault()
    this.isDragging.set(false)
    if (this.disabled) return
    this.handleFiles(e.dataTransfer?.files ?? null)
  }

  handleDragOver(e: DragEvent): void {
    if (this.disabled) return
    e.preventDefault()
    this.isDragging.set(true)
  }

  /** Open the native file picker. */
  openFilePicker(): void {
    if (this.disabled) return
    this.inputRef.nativeElement.click()
  }

  onDropzoneKeyDown(e: KeyboardEvent): void {
    if (this.disabled) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      this.openFilePicker()
    }
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-file-upload-trigger, [ui-file-upload-trigger]',
  standalone: true,
  host: { '[class]': 'hostClass' },
  template: `<ng-content />`,
})
export class UiFileUploadTriggerComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn('block cursor-pointer', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-file-upload-content, [ui-file-upload-content]',
  standalone: true,
  host: { '[class]': 'hostClass' },
  template: `<ng-content />`,
})
export class UiFileUploadContentComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn('block space-y-2', this.className)
  }
}

/**
 * One file row (React FileUploadItem): file icon, name, size in KB and a remove button,
 * unless content is projected, which replaces the whole row body.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-file-upload-item, [ui-file-upload-item]',
  standalone: true,
  host: { '[class]': 'hostClass' },
  template: `
    <ng-content
      ><svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-file text-muted-foreground size-8 shrink-0"
        aria-hidden="true"
      >
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      </svg>
      <div class="min-w-0 flex-1">
        <p class="truncate text-sm font-medium">{{ current?.name }}</p>
        <p class="text-muted-foreground text-xs">{{ ((current?.size ?? 0) / 1024).toFixed(1) }} KB</p>
      </div>
      <button
        type="button"
        class="text-muted-foreground hover:text-foreground focus-visible:ring-ring ml-auto rounded-sm transition-colors duration-200 focus-visible:ring-1 focus-visible:outline-none"
        (click)="remove.emit()"
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
          class="lucide lucide-x size-4"
          aria-hidden="true"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
        <span class="sr-only">Remove file</span>
      </button></ng-content
    >
  `,
})
export class UiFileUploadItemComponent {
  @Input({ required: true }) file!: File
  /** `file` may still be unset on first render; the template reads it through this. */
  get current(): File | undefined {
    return this.file
  }
  /** React `onRemove`. */
  @Output() remove = new EventEmitter<void>()
  @Input('class') className?: string

  get hostClass(): string {
    return cn('bg-muted/50 flex items-center gap-3 rounded-md border p-3', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-file-upload-item-name, [ui-file-upload-item-name]',
  standalone: true,
  host: { '[class]': 'hostClass' },
  template: `<ng-content />`,
})
export class UiFileUploadItemNameComponent {
  @Input('class') className?: string

  get hostClass(): string {
    // React renders a <p>; `block` gives the custom element the same box.
    return cn('block truncate text-sm font-medium', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-file-upload-item-size, [ui-file-upload-item-size]',
  standalone: true,
  host: { '[class]': 'hostClass' },
  template: `<ng-content />`,
})
export class UiFileUploadItemSizeComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn('text-muted-foreground text-xs', this.className)
  }
}

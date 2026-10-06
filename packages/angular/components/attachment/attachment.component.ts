import { Component, EventEmitter, Input, Output, booleanAttribute, ChangeDetectionStrategy } from '@angular/core'
import { cn } from '@/lib/utils'
import { attachmentMediaVariants, attachmentVariants, type AttachmentVariants } from './attachment.variants'

export type AttachmentState = 'idle' | 'uploading' | 'processing' | 'error' | 'done'
export type AttachmentSize = NonNullable<AttachmentVariants['size']>
export type AttachmentOrientation = NonNullable<AttachmentVariants['orientation']>
export type AttachmentMedia = 'file' | 'image' | 'code'

/**
 * Angular port of UIPKGE Attachment. Single file/image chip driven by
 * `state`, `size`, `orientation`, `media`, `src`, `removable` props.
 * Class strings come from shared `attachmentVariants` — identical to Vue/React.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-attachment, [ui-attachment]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"attachment"',
    '[attr.data-uipkge]': '""',
    '[attr.data-state]': 'state',
    '[attr.data-size]': 'size',
    '[attr.data-orientation]': 'orientation',
    '[class]': 'hostClass',
  },
  template: `
    <div data-uipkge data-slot="attachment-media" [class]="mediaClass">
      @if (src && media === 'image' && !busy) {
        <img [src]="src" [alt]="alt" class="size-full object-cover" />
      } @else if (busy) {
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
          class="lucide lucide-loader-circle size-4 motion-safe:animate-spin"
          aria-hidden="true"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      } @else if (media === 'code') {
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
          class="lucide lucide-file-code"
          aria-hidden="true"
        >
          <path d="M10 12.5 8 15l2 2.5" />
          <path d="m14 12.5 2 2.5-2 2.5" />
          <path d="M14 2v4a2 2 0 0 0 2 2h4" />
          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" />
        </svg>
      } @else if (media === 'image') {
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
          class="lucide lucide-image"
          aria-hidden="true"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
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
          class="lucide lucide-file-text"
          aria-hidden="true"
        >
          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
          <path d="M14 2v4a2 2 0 0 0 2 2h4" />
          <path d="M10 9H8" />
          <path d="M16 13H8" />
          <path d="M16 17H8" />
        </svg>
      }
    </div>
    <div data-uipkge data-slot="attachment-content" class="min-w-0 flex-1 leading-tight">
      <span data-uipkge data-slot="attachment-title" [class]="titleClass">{{ title }}</span>
      @if (description) {
        <span data-uipkge data-slot="attachment-description" [class]="descriptionClass">{{ description }}</span>
      }
    </div>
    @if (removable) {
      <button
        type="button"
        data-uipkge
        data-slot="attachment-remove"
        class="text-muted-foreground hover:bg-accent hover:text-foreground relative z-10 inline-flex size-7 shrink-0 items-center justify-center rounded-md"
        [attr.aria-label]="'Remove ' + title"
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
          class="lucide lucide-x size-3.5"
          aria-hidden="true"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    }
    <ng-content />
  `,
})
export class UiAttachmentComponent {
  @Input() title = ''
  @Input() description?: string
  @Input() state: AttachmentState = 'done'
  @Input() size: AttachmentSize = 'default'
  @Input() orientation: AttachmentOrientation = 'horizontal'
  @Input() media: AttachmentMedia = 'file'
  @Input() src?: string
  @Input() alt = ''
  @Input({ transform: booleanAttribute }) removable = false
  @Input('class') className?: string

  @Output() remove = new EventEmitter<void>()

  get busy(): boolean {
    return this.state === 'uploading' || this.state === 'processing'
  }

  get hostClass(): string {
    return cn(attachmentVariants({ size: this.size, orientation: this.orientation }), this.className)
  }

  get mediaClass(): string {
    return cn(attachmentMediaVariants({ size: this.size }))
  }

  get titleClass(): string {
    return cn('block truncate font-medium', this.busy && 'animate-pulse')
  }

  get descriptionClass(): string {
    return cn('text-muted-foreground mt-0.5 block truncate text-xs', this.state === 'error' && 'text-destructive/80')
  }
}

export { attachmentMediaVariants, attachmentVariants, type AttachmentVariants }

import { LitElement, css, html, nothing } from 'lit'
import { File as FileIcon, X } from 'lucide'
import { cn } from '../../lib/utils'
import { icon } from '../../lib/icon'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'

/* --------------------------------------------------------------- File Upload */

export class UipFileUpload extends LitElement {
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
    accept: { type: String },
    multiple: { type: Boolean },
    disabled: { type: Boolean },
    files: { type: Array, attribute: false },
    isDragging: { state: true },
  }

  accept?: string
  multiple = false
  disabled = false
  files: File[] = []

  isDragging = false

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'file-upload')
  }

  openFilePicker() {
    if (this.disabled) return
    const input = this.renderRoot.querySelector('input[type=file]') as HTMLInputElement | null
    input?.click()
  }

  private handleFiles(fileList: FileList | null) {
    if (this.disabled || !fileList) return
    const newFiles = Array.from(fileList)
    const updated = this.multiple ? [...this.files, ...newFiles] : newFiles.slice(0, 1)
    this.files = updated
    this.dispatchEvent(
      new CustomEvent('value-change', {
        detail: { files: updated },
        bubbles: true,
        composed: true,
      }),
    )
    this.requestUpdate()
  }

  private onInputChange(e: Event) {
    const input = e.target as HTMLInputElement
    this.handleFiles(input.files)
    input.value = ''
  }

  private onDrop(e: DragEvent) {
    e.preventDefault()
    this.isDragging = false
    if (this.disabled) return
    this.handleFiles(e.dataTransfer?.files ?? null)
  }

  private onDragOver(e: DragEvent) {
    if (this.disabled) return
    e.preventDefault()
    this.isDragging = true
  }

  private onDragLeave() {
    this.isDragging = false
  }

  private onKeyDown(e: KeyboardEvent) {
    if (this.disabled) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      this.openFilePicker()
    }
  }

  render() {
    return html`
      <div part="base" class="space-y-3">
        <input
          type="file"
          accept=${this.accept ?? nothing}
          ?multiple=${this.multiple}
          ?disabled=${this.disabled}
          class="sr-only"
          tabindex="-1"
          @change=${this.onInputChange}
        />

        <div
          role="button"
          tabindex=${this.disabled ? -1 : 0}
          aria-disabled=${this.disabled ? 'true' : nothing}
          aria-label=${this.multiple ? 'Upload files' : 'Upload file'}
          class=${cn(
            'border-muted-foreground/25 hover:border-muted-foreground/50 bg-muted/50 focus-visible:ring-ring flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none cursor-pointer',
            this.isDragging && 'border-primary bg-primary/5',
            this.disabled && 'pointer-events-none opacity-50',
          )}
          @click=${this.openFilePicker}
          @keydown=${this.onKeyDown}
          @drop=${this.onDrop}
          @dragover=${this.onDragOver}
          @dragleave=${this.onDragLeave}
        >
          <slot name="icon">
            <svg
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
              />
            </svg>
          </slot>
          <slot>
            <p class="text-muted-foreground text-sm">
              <span class="text-foreground font-semibold">Click to upload</span> or drag and drop
            </p>
            ${this.accept
              ? html`<p class="text-muted-foreground/70 mt-1 text-xs">${this.accept}</p>`
              : nothing}
          </slot>
        </div>

        <slot name="content"></slot>
      </div>
    `
  }
}

/* ------------------------------------------------------- File Upload Trigger */

export class UipFileUploadTrigger extends LitElement {
  static styles = [
    tailwind,
    css`
      :host {
        display: block;
        cursor: pointer;
      }
    `,
  ]

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'file-upload-trigger')
    this.addEventListener('click', () => {
      const parent = this.closest('uip-file-upload') as UipFileUpload | null
      parent?.openFilePicker()
    })
  }

  render() {
    return html`<slot></slot>`
  }
}

/* ------------------------------------------------------- File Upload Content */

export class UipFileUploadContent extends LitElement {
  static styles = [
    tailwind,
    css`
      :host {
        display: block;
        width: 100%;
      }
    `,
  ]

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'file-upload-content')
  }

  render() {
    return html`<div class="space-y-2"><slot></slot></div>`
  }
}

/* ---------------------------------------------------------- File Upload Item */

export class UipFileUploadItem extends LitElement {
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
    file: { type: Object },
    fileName: { type: String, attribute: 'file-name' },
    fileSize: { type: Number, attribute: 'file-size' },
  }

  file?: File
  fileName = ''
  fileSize = 0

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'file-upload-item')
  }

  private onRemoveClick(e: Event) {
    e.stopPropagation()
    this.dispatchEvent(
      new CustomEvent('remove', {
        detail: { file: this.file },
        bubbles: true,
        composed: true,
      }),
    )
  }

  render() {
    const name = this.file?.name ?? this.fileName
    const size = this.file?.size ?? this.fileSize
    const formattedSize = (size / 1024).toFixed(1) + ' KB'

    return html`
      <div
        part="base"
        class="bg-muted/50 border-border flex items-center gap-3 rounded-md border p-3 text-sm"
      >
        <slot>
          ${icon(FileIcon, 'file-icon', 'text-muted-foreground size-8 shrink-0')}
          <div class="min-w-0 flex-1">
            <p class="truncate font-medium text-foreground">${name}</p>
            <p class="text-muted-foreground text-xs">${formattedSize}</p>
          </div>
          <button
            type="button"
            class="text-muted-foreground hover:text-foreground focus-visible:ring-ring ml-auto rounded-sm p-1 transition-colors focus-visible:ring-1 focus-visible:outline-none"
            aria-label="Remove file"
            @click=${this.onRemoveClick}
          >
            ${icon(X, 'x', 'size-4')}
          </button>
        </slot>
      </div>
    `
  }
}

/* ----------------------------------------------------- File Upload Item Name */

export class UipFileUploadItemName extends LitElement {
  static styles = [
    tailwind,
    css`
      :host {
        display: block;
      }
    `,
  ]

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'file-upload-item-name')
  }

  render() {
    return html`<p class="truncate text-sm font-medium text-foreground"><slot></slot></p>`
  }
}

/* ----------------------------------------------------- File Upload Item Size */

export class UipFileUploadItemSize extends LitElement {
  static styles = [
    tailwind,
    css`
      :host {
        display: inline;
      }
    `,
  ]

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'file-upload-item-size')
  }

  render() {
    return html`<span class="text-muted-foreground text-xs"><slot></slot></span>`
  }
}

/* -------------------------------------------------------------- Registration */

customElements.get('uip-file-upload') || customElements.define('uip-file-upload', UipFileUpload)
customElements.get('uip-file-upload-trigger') || customElements.define('uip-file-upload-trigger', UipFileUploadTrigger)
customElements.get('uip-file-upload-content') || customElements.define('uip-file-upload-content', UipFileUploadContent)
customElements.get('uip-file-upload-item') || customElements.define('uip-file-upload-item', UipFileUploadItem)
customElements.get('uip-file-upload-item-name') || customElements.define('uip-file-upload-item-name', UipFileUploadItemName)
customElements.get('uip-file-upload-item-size') || customElements.define('uip-file-upload-item-size', UipFileUploadItemSize)

declare global {
  interface HTMLElementTagNameMap {
    'uip-file-upload': UipFileUpload
    'uip-file-upload-trigger': UipFileUploadTrigger
    'uip-file-upload-content': UipFileUploadContent
    'uip-file-upload-item': UipFileUploadItem
    'uip-file-upload-item-name': UipFileUploadItemName
    'uip-file-upload-item-size': UipFileUploadItemSize
  }
}

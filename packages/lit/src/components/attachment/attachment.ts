import { LitElement, css, html, nothing } from 'lit'
import { FileCode, FileText, Image, Loader2, X } from 'lucide'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { icon } from '../../lib/icon'
import { attachmentMediaVariants, attachmentVariants, type AttachmentVariants } from './attachment.variants'

type Size = NonNullable<AttachmentVariants['size']>
type Orientation = NonNullable<AttachmentVariants['orientation']>
type State = 'idle' | 'uploading' | 'processing' | 'error' | 'done'
type Media = 'file' | 'image' | 'code'

/**
 * <uip-attachment> — file and media attachment chip.
 */
export class UipAttachment extends LitElement {
  static styles = [tailwind, css`:host { display: inline-flex; }`]

  static properties = {
    title: { reflect: true },
    description: { reflect: true },
    state: { reflect: true },
    size: { reflect: true },
    orientation: { reflect: true },
    media: { reflect: true },
    src: { reflect: true },
    alt: { reflect: true },
    removable: { type: Boolean, reflect: true },
  }

  override title = ''
  description?: string
  state: State = 'done'
  size: Size = 'default'
  orientation: Orientation = 'horizontal'
  media: Media = 'file'
  src?: string
  alt = ''
  removable = false

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'attachment')
  }

  willUpdate() {
    this.setAttribute('data-state', this.state)
    this.setAttribute('data-size', this.size)
    this.setAttribute('data-orientation', this.orientation)
  }

  private onRemoveClick(e: MouseEvent) {
    e.stopPropagation()
    this.dispatchEvent(new CustomEvent('remove', { bubbles: true, composed: true }))
  }

  render() {
    const busy = this.state === 'uploading' || this.state === 'processing'
    const size = this.size
    const orientation = this.orientation
    const state = this.state
    const media = this.media

    let mediaContent
    if (this.src && media === 'image' && !busy) {
      mediaContent = html`<img src=${this.src} alt=${this.alt} class="size-full object-cover" />`
    } else if (busy) {
      mediaContent = icon(Loader2, 'loader-2', 'size-4 motion-safe:animate-spin')
    } else if (media === 'code') {
      mediaContent = icon(FileCode, 'file-code')
    } else if (media === 'image') {
      mediaContent = icon(Image, 'image')
    } else {
      mediaContent = icon(FileText, 'file-text')
    }

    return html`
      <div
        part="base"
        data-slot="attachment"
        data-state=${state}
        data-size=${size}
        data-orientation=${orientation}
        class=${cn(attachmentVariants({ size, orientation }))}
      >
        <div data-slot="attachment-media" class=${cn(attachmentMediaVariants({ size }))}>
          ${mediaContent}
        </div>
        <div data-slot="attachment-content" class="min-w-0 flex-1 leading-tight">
          <span data-slot="attachment-title" class=${cn('block truncate font-medium', busy && 'animate-pulse')}>
            ${this.title}
          </span>
          ${this.description
            ? html`
                <span
                  data-slot="attachment-description"
                  class=${cn(
                    'text-muted-foreground mt-0.5 block truncate text-xs',
                    state === 'error' && 'text-destructive/80',
                  )}
                >
                  ${this.description}
                </span>
              `
            : nothing}
        </div>
        ${this.removable
          ? html`
              <button
                type="button"
                data-slot="attachment-remove"
                class="text-muted-foreground hover:bg-accent hover:text-foreground relative z-10 inline-flex size-7 shrink-0 items-center justify-center rounded-md"
                aria-label=${`Remove ${this.title}`}
                @click=${this.onRemoveClick}
              >
                ${icon(X, 'x', 'size-3.5')}
              </button>
            `
          : nothing}
      </div>
    `
  }
}

customElements.get('uip-attachment') || customElements.define('uip-attachment', UipAttachment)

declare global {
  interface HTMLElementTagNameMap {
    'uip-attachment': UipAttachment
  }
}

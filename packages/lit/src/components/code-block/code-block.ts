import { LitElement, css, html, nothing } from 'lit'
import { Check, ChevronDown, ChevronUp, Copy } from 'lucide'
import { cn } from '../../lib/utils'
import { icon } from '../../lib/icon'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'

let idCounter = 0

/**
 * <uip-code-block> — Source code display with syntax highlighting / preformatted code,
 * line numbers, copy button, and collapse toggle.
 */
export class UipCodeBlock extends LitElement {
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
    code: { type: String },
    language: { type: String },
    showLineNumbers: {
      type: Boolean,
      attribute: 'show-line-numbers',
      converter: { fromAttribute: (v: string | null) => v !== null && v !== 'false' },
    },
    maxHeight: { type: String, attribute: 'max-height' },
    defaultExpanded: {
      type: Boolean,
      attribute: 'default-expanded',
      converter: { fromAttribute: (v: string | null) => v !== null && v !== 'false' },
    },
    showHeader: {
      type: Boolean,
      attribute: 'show-header',
      converter: { fromAttribute: (v: string | null) => v !== null && v !== 'false' },
    },
    isExpanded: { state: true },
    copyStatus: { state: true },
  }

  code = ''
  language = 'tsx'
  showLineNumbers = true
  maxHeight = '400px'
  defaultExpanded = true
  showHeader = true

  isExpanded = true
  copyStatus: 'idle' | 'copied' | 'error' = 'idle'

  private bodyId = `uip-code-block-${++idCounter}`
  private copyResetTimer: ReturnType<typeof setTimeout> | null = null

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'code-block')
    this.isExpanded = this.defaultExpanded
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    if (this.copyResetTimer) clearTimeout(this.copyResetTimer)
  }

  private async copyToClipboard() {
    try {
      await navigator.clipboard.writeText(this.code)
      this.copyStatus = 'copied'
      this.dispatchEvent(new CustomEvent('copy', { detail: { code: this.code }, bubbles: true, composed: true }))
    } catch {
      this.copyStatus = 'error'
    } finally {
      if (this.copyResetTimer) clearTimeout(this.copyResetTimer)
      this.copyResetTimer = setTimeout(() => {
        this.copyStatus = 'idle'
      }, 1600)
    }
  }

  render() {
    const lines = this.code ? this.code.split('\n') : []
    const bodyVisible = !this.showHeader || this.isExpanded
    const copyLabel = this.copyStatus === 'copied' ? 'Copied' : this.copyStatus === 'error' ? 'Copy failed' : 'Copy'

    return html`
      <div
        part="base"
        class="group border-border bg-muted/20 relative overflow-hidden rounded-lg border font-mono text-sm"
      >
        ${this.showHeader
          ? html`
              <div class="border-border bg-muted/40 flex items-center justify-between gap-2 border-b px-3 py-2">
                <span class="text-muted-foreground text-xs font-medium tracking-wide uppercase">${this.language}</span>
                <div class="flex items-center gap-1 font-sans">
                  <button
                    type="button"
                    class="hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
                    @click=${this.copyToClipboard}
                  >
                    ${this.copyStatus === 'copied'
                      ? icon(Check, 'check', 'text-success size-3')
                      : icon(Copy, 'copy', 'size-3')}
                    <span
                      class=${cn('text-xs', this.copyStatus === 'error' && 'text-destructive')}
                      aria-live="polite"
                      aria-atomic="true"
                    >
                      ${copyLabel}
                    </span>
                  </button>
                  <button
                    type="button"
                    class="hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
                    aria-expanded=${this.isExpanded ? 'true' : 'false'}
                    aria-controls=${this.bodyId}
                    @click=${() => (this.isExpanded = !this.isExpanded)}
                  >
                    ${this.isExpanded
                      ? icon(ChevronUp, 'chevron-up', 'size-3')
                      : icon(ChevronDown, 'chevron-down', 'size-3')}
                    <span class="text-xs">${this.isExpanded ? 'Hide' : 'Show'} code</span>
                  </button>
                </div>
              </div>
            `
          : nothing}

        <div
          id=${this.bodyId}
          role="region"
          aria-label="${this.language} code sample"
          tabindex="0"
          ?hidden=${!bodyVisible}
          class="bg-background/40 focus-visible:ring-ring overflow-auto font-mono text-sm leading-relaxed focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset"
          style="max-height: ${this.maxHeight};"
        >
          <div class="flex w-max min-w-full">
            ${this.showLineNumbers
              ? html`
                  <div
                    aria-hidden="true"
                    class="text-muted-foreground/60 border-border/60 bg-muted/30 sticky left-0 border-r px-3 py-3 text-right tabular-nums select-none"
                  >
                    ${lines.map((_, i) => html`<span class="block">${i + 1}</span>`)}
                  </div>
                `
              : nothing}
            <pre class="m-0 min-w-max flex-1"><code class="block cursor-text px-4 py-3 whitespace-pre">${this.code}</code></pre>
          </div>
        </div>
      </div>
    `
  }
}

customElements.get('uip-code-block') || customElements.define('uip-code-block', UipCodeBlock)

declare global {
  interface HTMLElementTagNameMap {
    'uip-code-block': UipCodeBlock
  }
}

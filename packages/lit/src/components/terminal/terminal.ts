import { LitElement, css, html, isServer, nothing } from 'lit'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'

export interface TerminalLine {
  prompt?: string
  command?: string
  output?: string
  type?: 'command' | 'output'
}

const trueByDefault = {
  fromAttribute: (v: string | null) => v !== 'false' && v !== null,
  toAttribute: (v: boolean) => (v ? '' : 'false'),
}

/**
 * <uip-terminal> — simulated terminal window.
 */
export class UipTerminal extends LitElement {
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
    lines: { attribute: false },
    title: { reflect: true },
    promptChar: { attribute: 'prompt-char', reflect: true },
    theme: { reflect: true },
    autoScroll: { attribute: 'auto-scroll', converter: trueByDefault, reflect: true },
    typing: { type: Boolean, reflect: true },
    typingSpeed: { type: Number, attribute: 'typing-speed', reflect: true },
    maxHeight: { attribute: 'max-height', reflect: true },
    visibleCount: { state: true },
  }

  lines: TerminalLine[] = []
  override title = 'bash'
  promptChar = '$'
  theme: 'dark' | 'light' = 'dark'
  autoScroll = true
  typing = false
  typingSpeed = 120
  maxHeight = '400px'

  private visibleCount = 0
  private typingTimer?: ReturnType<typeof setTimeout>

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'terminal')
    this.visibleCount = this.typing ? 0 : this.lines.length
    this.startTypingIfNeeded()
    if (!this.typing) {
      requestAnimationFrame(() => this.scrollToBottom())
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.stopTyping()
  }

  willUpdate() {
    this.setAttribute('data-theme', this.theme)
  }

  protected updated(changedProps: Map<string, unknown>) {
    super.updated(changedProps)
    if (changedProps.has('lines') || changedProps.has('typing')) {
      if (this.typing) {
        this.visibleCount = 0
      } else {
        this.visibleCount = this.lines.length
        requestAnimationFrame(() => this.scrollToBottom())
      }
      this.startTypingIfNeeded()
    }
  }

  private stopTyping() {
    if (this.typingTimer) {
      clearTimeout(this.typingTimer)
      this.typingTimer = undefined
    }
  }

  private startTypingIfNeeded() {
    if (isServer || !this.typing) return
    this.stopTyping()
    if (this.visibleCount >= this.lines.length) return

    this.typingTimer = setTimeout(() => {
      this.visibleCount++
      this.scrollToBottom()
      this.startTypingIfNeeded()
    }, this.typingSpeed)
  }

  private scrollToBottom() {
    if (!this.autoScroll) return
    const body = this.renderRoot.querySelector<HTMLElement>('[data-slot=terminal-body]')
    if (body) {
      body.scrollTop = body.scrollHeight
    }
  }

  render() {
    const resolvedLines = this.lines.map((l) => ({
      ...l,
      type: l.type ?? (l.prompt || l.command ? 'command' : 'output'),
      prompt: l.prompt ?? (l.type === 'output' ? '' : this.promptChar),
    }))

    const shownLines = resolvedLines.slice(0, this.visibleCount)

    return html`
      <div
        part="base"
        data-slot="terminal"
        data-theme=${this.theme}
        class=${cn(
          'relative overflow-hidden rounded-lg border font-mono text-sm shadow-sm',
          this.theme === 'dark' ? 'bg-card text-card-foreground border-border' : 'bg-muted border-border',
        )}
      >
        <!-- Title bar -->
        <div class="border-border bg-muted flex items-center gap-2 border-b px-4 py-2.5">
          <div class="flex gap-1.5">
            <span class="bg-destructive size-3 rounded-full"></span>
            <span class="bg-warning size-3 rounded-full"></span>
            <span class="bg-success size-3 rounded-full"></span>
          </div>
          <span class="text-muted-foreground ml-2 text-xs">${this.title}</span>
        </div>

        <!-- Body -->
        <div
          data-slot="terminal-body"
          class="overflow-auto p-4 leading-relaxed"
          style="max-height: ${this.maxHeight};"
        >
          ${shownLines.map(
            (line) => html`
              <div data-slot="terminal-line" class="break-words whitespace-pre-wrap">
                ${line.type === 'command'
                  ? html`
                      <div data-slot="terminal-command" class="flex flex-wrap items-baseline gap-x-1.5">
                        <span class="text-success shrink-0 font-semibold">${line.prompt}</span>
                        <span>${line.command}</span>
                      </div>
                    `
                  : nothing}
                ${line.output
                  ? html`
                      <div data-slot="terminal-output" class="text-muted-foreground">
                        ${line.output}
                      </div>
                    `
                  : nothing}
              </div>
            `,
          )}
        </div>
      </div>
    `
  }
}

customElements.get('uip-terminal') || customElements.define('uip-terminal', UipTerminal)

declare global {
  interface HTMLElementTagNameMap {
    'uip-terminal': UipTerminal
  }
}

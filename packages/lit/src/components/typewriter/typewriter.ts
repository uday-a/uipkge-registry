import { LitElement, css, html, isServer, nothing } from 'lit'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'

const trueByDefault = { fromAttribute: (v: string | null) => v !== 'false', toAttribute: () => null }

const typewriterStyles = css`
  :host {
    display: inline-block;
  }
  @keyframes caret-blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }
  .animate-caret-blink {
    animation: caret-blink 1s infinite;
  }
`

/**
 * <uip-typewriter> — Dynamic typewriter text animation with looping phrases and blinking caret.
 */
export class UipTypewriter extends LitElement {
  static styles = [tailwind, typewriterStyles]

  static properties = {
    phrases: {
      type: Array,
      converter: {
        fromAttribute: (v: string | null) => {
          if (!v) return []
          try {
            const parsed = JSON.parse(v)
            return Array.isArray(parsed) ? parsed : [parsed]
          } catch {
            return [v]
          }
        },
      },
    },
    typingSpeed: { type: Number, attribute: 'typing-speed' },
    deletingSpeed: { type: Number, attribute: 'deleting-speed' },
    pause: { type: Number },
    startDelay: { type: Number, attribute: 'start-delay' },
    loop: { converter: trueByDefault },
    showCaret: { attribute: 'show-caret', converter: trueByDefault },
    text: { state: true },
    reduced: { state: true },
  }

  phrases: string | string[] = []
  typingSpeed = 45
  deletingSpeed = 25
  pause = 1600
  startDelay = 0
  loop = true
  showCaret = true

  private text = ''
  private reduced = false
  private timer?: ReturnType<typeof setTimeout>
  private phraseIndex = 0
  private charCount = 0
  private isDeleting = false

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'typewriter')
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.clearTimer()
  }

  private clearTimer() {
    if (this.timer !== undefined) {
      clearTimeout(this.timer)
      this.timer = undefined
    }
  }

  private get phraseList(): string[] {
    if (Array.isArray(this.phrases)) return this.phrases
    if (typeof this.phrases === 'string' && this.phrases) return [this.phrases]
    return []
  }

  protected firstUpdated() {
    if (isServer) return
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    this.reduced = isReduced
    const list = this.phraseList

    if (isReduced) {
      this.text = list[0] ?? ''
      return
    }

    if (this.startDelay > 0) {
      this.timer = setTimeout(() => this.step(), this.startDelay)
    } else {
      this.step()
    }
  }

  private step() {
    const list = this.phraseList
    if (list.length === 0) return

    const current = list[this.phraseIndex] ?? ''

    if (!this.isDeleting) {
      this.charCount += 1
      this.text = current.slice(0, this.charCount)

      if (this.charCount < current.length) {
        this.timer = setTimeout(() => this.step(), this.typingSpeed)
      } else if (this.loop || this.phraseIndex < list.length - 1) {
        this.timer = setTimeout(() => {
          this.isDeleting = true
          this.step()
        }, this.pause)
      }
    } else {
      this.charCount -= 1
      this.text = current.slice(0, this.charCount)

      if (this.charCount > 0) {
        this.timer = setTimeout(() => this.step(), this.deletingSpeed)
      } else {
        this.isDeleting = false
        this.phraseIndex = (this.phraseIndex + 1) % list.length
        this.timer = setTimeout(() => this.step(), this.typingSpeed)
      }
    }
  }

  render() {
    const srText = this.phraseList.join('. ')

    return html`
      <span part="base" class="inline-block">
        <span class="sr-only">${srText}</span>
        <span aria-hidden="true" class="whitespace-pre-wrap">
          <span>${this.text}</span>
          ${this.showCaret
            ? html`
                <span
                  part="caret"
                  class=${cn(
                    'inline-block h-[1em] w-[0.5ch] bg-current align-baseline',
                    !this.reduced && 'animate-caret-blink',
                  )}
                ></span>
              `
            : nothing}
        </span>
      </span>
    `
  }
}

customElements.get('uip-typewriter') || customElements.define('uip-typewriter', UipTypewriter)

declare global {
  interface HTMLElementTagNameMap {
    'uip-typewriter': UipTypewriter
  }
}

import { LitElement, css, html, isServer, nothing } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'

interface Segment {
  text: string
  space: boolean
}

function buildSegments(text: string, mode: 'words' | 'chars'): Segment[] {
  const source = text.replace(/\s+/g, ' ').trim()
  if (mode === 'chars') {
    return Array.from(source).map((ch) => ({ text: ch, space: ch === ' ' }))
  }
  const words = source.split(' ')
  return words.flatMap((word, i) =>
    i < words.length - 1
      ? [
          { text: word, space: false },
          { text: '', space: true },
        ]
      : [{ text: word, space: false }],
  )
}

const trueByDefault = { fromAttribute: (v: string | null) => v !== 'false', toAttribute: () => null }

const textRevealStyles = css`
  :host {
    display: inline-block;
  }
  .text-reveal-seg {
    opacity: 0;
    transform: translateY(0.5em);
    transition-property: opacity, transform, filter;
    transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
  }
  :host([data-revealed]) .text-reveal-seg,
  .is-revealed .text-reveal-seg {
    opacity: 1;
    transform: translateY(0);
  }
  .text-reveal-blur {
    filter: blur(8px);
  }
  :host([data-revealed]) .text-reveal-blur,
  .is-revealed .text-reveal-blur {
    filter: blur(0);
  }
  @media (prefers-reduced-motion: reduce) {
    .text-reveal-seg {
      opacity: 1 !important;
      transform: none !important;
      filter: none !important;
      transition: none !important;
    }
  }
`

/**
 * <uip-text-reveal> — Word-by-word or character-by-character reveal on scroll.
 */
export class UipTextReveal extends LitElement {
  static styles = [tailwind, textRevealStyles]

  static properties = {
    text: { type: String },
    mode: { type: String },
    stagger: { type: Number },
    duration: { type: Number },
    delay: { type: Number },
    blurred: { attribute: 'blur', converter: trueByDefault },
    once: { converter: trueByDefault },
    revealed: { state: true },
  }

  text = ''
  mode: 'words' | 'chars' = 'words'
  stagger = 40
  duration = 600
  delay = 0
  blurred = true
  once = true

  private revealed = false
  private observer?: IntersectionObserver

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'text-reveal')
    this.setAttribute('aria-label', this.text)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.observer?.disconnect()
  }

  protected firstUpdated() {
    if (isServer) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || typeof IntersectionObserver === 'undefined') {
      this.revealed = true
      this.setAttribute('data-revealed', '')
      return
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.revealed = true
            this.setAttribute('data-revealed', '')
            if (this.once) this.observer?.disconnect()
          } else if (!this.once) {
            this.revealed = false
            this.removeAttribute('data-revealed')
          }
        }
      },
      { threshold: 0.2 },
    )
    this.observer.observe(this)
  }

  render() {
    const segments = buildSegments(this.text, this.mode)

    return html`
      <span
        part="base"
        class=${cn('inline-block', this.revealed && 'is-revealed')}
        aria-hidden="true"
      >
        ${segments.map((seg, i) =>
          seg.space
            ? html`<span>&nbsp;</span>`
            : html`
                <span
                  data-slot="text-reveal-segment"
                  class=${cn(
                    'text-reveal-seg inline-block will-change-transform',
                    this.blurred && 'text-reveal-blur',
                  )}
                  style=${styleMap({
                    transitionDelay: `${this.delay + i * this.stagger}ms`,
                    transitionDuration: `${this.duration}ms`,
                  })}
                >
                  ${seg.text}
                </span>
              `,
        )}
      </span>
    `
  }
}

customElements.get('uip-text-reveal') || customElements.define('uip-text-reveal', UipTextReveal)

declare global {
  interface HTMLElementTagNameMap {
    'uip-text-reveal': UipTextReveal
  }
}

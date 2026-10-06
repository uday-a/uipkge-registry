import { LitElement, css, html, isServer, nothing } from 'lit'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'

const countdownStyles = css`
  @keyframes countdown-digit-flip {
    0% {
      opacity: 0;
      transform: translateY(45%) scale(0.92);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  .countdown-digit {
    display: inline-block;
    animation: countdown-digit-flip 280ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  @media (prefers-reduced-motion: reduce) {
    .countdown-digit {
      animation: none !important;
    }
  }
`

export interface CountdownRenderProps {
  days: number
  hours: number
  minutes: number
  seconds: number
  display: string
  finished: boolean
}

function renderDigits(value: number, pad: boolean) {
  const text = pad ? String(value).padStart(2, '0') : String(value)
  return html`
    ${[...text].map(
      (ch, i) => html`
        <span key=${`${i}-${ch}`} class="countdown-digit tabular-nums">${ch}</span>
      `,
    )}
  `
}

/**
 * <uip-countdown> — countdown timer to a target date or timestamp.
 */
export class UipCountdown extends LitElement {
  static styles = [
    tailwind,
    countdownStyles,
    css`
      :host {
        display: inline-flex;
      }
    `,
  ]

  static properties = {
    target: { reflect: true },
    format: { reflect: true },
    paused: { type: Boolean, reflect: true },
    label: { reflect: true },
    pad: { type: Boolean, reflect: true },
    separator: { reflect: true },
    renderDays: { attribute: false },
    renderHours: { attribute: false },
    renderMinutes: { attribute: false },
    renderSeconds: { attribute: false },
    now: { state: true },
    finished: { state: true },
  }

  target: Date | string | number = Date.now()
  format = 'DD:HH:MM:SS'
  paused = false
  label = ''
  pad = true
  separator = ':'
  renderDays?: (days: number) => unknown
  renderHours?: (hours: number) => unknown
  renderMinutes?: (minutes: number) => unknown
  renderSeconds?: (seconds: number) => unknown

  private now = Date.now()
  private finished = false
  private timer?: ReturnType<typeof setInterval>

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'countdown')
    this.now = Date.now()
    this.startTimer()
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.stopTimer()
  }

  private stopTimer() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = undefined
    }
  }

  private startTimer() {
    if (isServer) return
    this.stopTimer()

    const targetMs = this.getTargetMs()
    const remainingNow = Math.max(0, targetMs - Date.now())
    if (remainingNow <= 0) {
      if (!this.finished) {
        this.finished = true
        this.dispatchEvent(new CustomEvent('finish', { bubbles: true, composed: true }))
      }
      return
    }

    if (this.paused) return

    this.timer = setInterval(() => {
      const next = Date.now()
      const remaining = Math.max(0, targetMs - next)
      this.now = next
      this.dispatchEvent(new CustomEvent('tick', { detail: { remaining }, bubbles: true, composed: true }))
      if (remaining <= 0) {
        this.finished = true
        this.dispatchEvent(new CustomEvent('finish', { bubbles: true, composed: true }))
        this.stopTimer()
      }
    }, 1000)
  }

  protected updated(changedProps: Map<string, unknown>) {
    super.updated(changedProps)
    if (changedProps.has('target') || changedProps.has('paused')) {
      if (changedProps.has('target')) {
        this.finished = false
        this.now = Date.now()
      }
      this.startTimer()
    }
    this.setAttribute('data-finished', String(this.finished))
    this.setAttribute('data-paused', String(this.paused))
  }

  private getTargetMs(): number {
    const t = this.target
    if (t instanceof Date) return t.getTime()
    if (typeof t === 'number') return t
    const parsed = new Date(t).getTime()
    return Number.isNaN(parsed) ? Date.now() : parsed
  }

  render() {
    const targetMs = this.getTargetMs()
    const remainingMs = Math.max(0, targetMs - this.now)

    const total = remainingMs
    const days = Math.floor(total / 86_400_000)
    const hours = Math.floor((total % 86_400_000) / 3_600_000)
    const minutes = Math.floor((total % 3_600_000) / 60_000)
    const seconds = Math.floor((total % 60_000) / 1000)

    let displayDays = days
    let displayHours = hours
    let displayMinutes = minutes
    let displaySeconds = seconds

    const f = this.format
    if (f === 'HH:MM:SS') {
      displayHours = days * 24 + hours
    } else if (f === 'MM:SS') {
      displayMinutes = days * 24 * 60 + hours * 60 + minutes
    } else if (f === 'SS') {
      displaySeconds = Math.floor(remainingMs / 1000)
    }

    const pad = this.pad
    const sep = this.separator

    return html`
      <div
        part="base"
        data-slot="countdown"
        data-finished=${this.finished ? 'true' : 'false'}
        data-paused=${this.paused ? 'true' : 'false'}
        class="inline-flex flex-col gap-1"
      >
        ${this.label
          ? html`
              <span
                data-slot="countdown-label"
                class="text-muted-foreground text-xs font-medium tracking-wide uppercase"
              >
                ${this.label}
              </span>
            `
          : nothing}
        <div
          data-slot="countdown-display"
          class="flex items-baseline gap-1 font-mono tabular-nums"
          role="timer"
          aria-live=${this.finished || this.paused ? 'off' : 'polite'}
          aria-atomic="true"
        >
          <slot>
            ${f.includes('DD')
              ? html`
                  ${this.renderDays
                    ? this.renderDays(days)
                    : html`
                        <span data-slot="countdown-days" class="text-foreground inline-flex text-2xl font-semibold">
                          ${renderDigits(displayDays, pad)}
                        </span>
                      `}
                `
              : nothing}
            ${f.includes('DD') && f.includes('HH') ? html`<span class="text-muted-foreground text-2xl">${sep}</span>` : nothing}
            ${f.includes('HH')
              ? html`
                  ${this.renderHours
                    ? this.renderHours(displayHours)
                    : html`
                        <span data-slot="countdown-hours" class="text-foreground inline-flex text-2xl font-semibold">
                          ${renderDigits(displayHours, pad)}
                        </span>
                      `}
                `
              : nothing}
            ${f.includes('HH') && f.includes('MM') ? html`<span class="text-muted-foreground text-2xl">${sep}</span>` : nothing}
            ${f.includes('MM')
              ? html`
                  ${this.renderMinutes
                    ? this.renderMinutes(displayMinutes)
                    : html`
                        <span data-slot="countdown-minutes" class="text-foreground inline-flex text-2xl font-semibold">
                          ${renderDigits(displayMinutes, pad)}
                        </span>
                      `}
                `
              : nothing}
            ${f.includes('MM') && f.includes('SS') ? html`<span class="text-muted-foreground text-2xl">${sep}</span>` : nothing}
            ${f.includes('SS')
              ? html`
                  ${this.renderSeconds
                    ? this.renderSeconds(displaySeconds)
                    : html`
                        <span data-slot="countdown-seconds" class="text-foreground inline-flex text-2xl font-semibold">
                          ${renderDigits(displaySeconds, pad)}
                        </span>
                      `}
                `
              : nothing}
          </slot>
        </div>
      </div>
    `
  }
}

customElements.get('uip-countdown') || customElements.define('uip-countdown', UipCountdown)

declare global {
  interface HTMLElementTagNameMap {
    'uip-countdown': UipCountdown
  }
}

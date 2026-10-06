import { LitElement, css, html, isServer, nothing } from 'lit'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import {
  formatAbsoluteTime,
  formatVisibleTime,
  toDate,
  type RelativeTimeDisplay,
  type RelativeTimeNumeric,
  type RelativeTimeParseAs,
  type RelativeTimeStyle,
} from './format-relative-time'

type DateInput = Date | string | number

// Attributes are strings; an all-digit string is epoch ms (React accepts numbers).
const fromAttr = (v: string | null) => (v == null ? undefined : /^-?\d+$/.test(v) ? Number(v) : v)

/**
 * <uip-relative-time> — the registry RelativeTime: a <time> showing "5 minutes
 * ago" (or absolute / both), with the full localized datetime as its title.
 *
 * Ticks every `update-interval` ms (default 30 000; `0` freezes) unless `now`
 * is given. The timer only runs in the browser while connected, so SSR output
 * is a single stable render. Slotted content replaces the label (React's
 * `children`).
 *
 * React's `className` → style the part from outside, e.g.
 * `class="[&::part(base)]:text-xs"`.
 */
export class UipRelativeTime extends LitElement {
  // display: contents so the inner <time> is laid out where React's is (inline
  // in text, a flex item in a flex row). An inline host that gets blockified
  // as a flex item adds its own line box (inherited line-height) around the
  // smaller <time> text and grows the row.
  static styles = [tailwind, css`:host { display: contents; }`]

  static properties = {
    date: { converter: { fromAttribute: fromAttr } },
    now: { converter: { fromAttribute: fromAttr } },
    formatStyle: { attribute: 'format-style' },
    numeric: {},
    locale: {},
    display: {},
    timeZone: { attribute: 'time-zone' },
    parseAs: { attribute: 'parse-as' },
    updateInterval: { type: Number, attribute: 'update-interval' },
  }

  date?: DateInput
  now?: DateInput
  formatStyle: RelativeTimeStyle = 'long'
  numeric: RelativeTimeNumeric = 'auto'
  locale?: string
  display: RelativeTimeDisplay = 'relative'
  timeZone?: string
  parseAs: RelativeTimeParseAs = 'local'
  updateInterval = 30_000
  private timer?: ReturnType<typeof setInterval>

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'relative-time')
    this.syncTimer()
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.stopTimer()
  }

  protected updated(changed: Map<string, unknown>) {
    if (changed.has('updateInterval') || changed.has('now')) this.syncTimer()
  }

  private stopTimer() {
    clearInterval(this.timer)
    this.timer = undefined
  }

  private syncTimer() {
    this.stopTimer()
    if (isServer || !this.isConnected || this.updateInterval <= 0 || this.now !== undefined) return
    this.timer = setInterval(() => this.requestUpdate(), this.updateInterval)
  }

  render() {
    if (this.date === undefined || this.date === '') return nothing
    const resolvedDate = toDate(this.date, this.parseAs)
    if (Number.isNaN(resolvedDate.getTime())) return nothing
    const resolvedNow = this.now === undefined ? new Date() : toDate(this.now, this.parseAs)
    const label = formatVisibleTime(resolvedDate, resolvedNow, {
      display: this.display,
      style: this.formatStyle,
      numeric: this.numeric,
      locale: this.locale,
      timeZone: this.timeZone,
    })
    const absolute = formatAbsoluteTime(resolvedDate, this.locale, this.timeZone)
    return html`<time
      part="base"
      data-uipkge=""
      data-slot="relative-time"
      data-display=${this.display}
      data-timezone=${this.timeZone || 'local'}
      data-parse-as=${this.parseAs}
      datetime=${resolvedDate.toISOString()}
      title=${absolute}
      class="text-muted-foreground text-sm tabular-nums"
      ><slot>${label}</slot></time
    >`
  }
}

customElements.get('uip-relative-time') || customElements.define('uip-relative-time', UipRelativeTime)

declare global {
  interface HTMLElementTagNameMap {
    'uip-relative-time': UipRelativeTime
  }
}

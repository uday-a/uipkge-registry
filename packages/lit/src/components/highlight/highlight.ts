import { LitElement, css, html } from 'lit'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'

interface Segment {
  text: string
  match: boolean
}

function buildPattern(query: string | RegExp, caseSensitive: boolean, wholeWord: boolean): RegExp | null {
  if (query instanceof RegExp) {
    const flags = query.flags.includes('g') ? query.flags : query.flags + 'g'
    return new RegExp(query.source, flags)
  }
  if (!query) return null
  const escaped = String(query).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const body = wholeWord ? `\\b${escaped}\\b` : escaped
  const flags = caseSensitive ? 'g' : 'gi'
  return new RegExp(body, flags)
}

/**
 * <uip-highlight> — highlights matching substrings within text.
 */
export class UipHighlight extends LitElement {
  static styles = [tailwind, css`:host { display: inline; }`]

  static properties = {
    text: { reflect: true },
    query: {},
    highlightTag: { attribute: 'highlight-tag', reflect: true },
    highlightClass: { attribute: 'highlight-class', reflect: true },
    caseSensitive: { type: Boolean, attribute: 'case-sensitive', reflect: true },
    wholeWord: { type: Boolean, attribute: 'whole-word', reflect: true },
    maxHighlights: { type: Number, attribute: 'max-highlights', reflect: true },
  }

  text = ''
  query: string | RegExp = ''
  highlightTag: 'mark' | 'span' = 'mark'
  highlightClass?: string
  caseSensitive = false
  wholeWord = false
  maxHighlights = 0

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'highlight')
  }

  protected updated(changedProps: Map<string, unknown>) {
    super.updated(changedProps)
    if (
      changedProps.has('text') ||
      changedProps.has('query') ||
      changedProps.has('caseSensitive') ||
      changedProps.has('wholeWord') ||
      changedProps.has('maxHighlights')
    ) {
      this.emitCounts()
    }
  }

  private emitCounts() {
    const pattern = buildPattern(this.query, this.caseSensitive, this.wholeWord)
    if (!this.text || !pattern) {
      this.dispatchEvent(new CustomEvent('match-count', { detail: { count: 0 }, bubbles: true, composed: true }))
      this.dispatchEvent(new CustomEvent('total-match-count', { detail: { count: 0 }, bubbles: true, composed: true }))
      return
    }

    let total = 0
    let m: RegExpExecArray | null
    while ((m = pattern.exec(this.text)) !== null) {
      total++
      if (m[0] === '') pattern.lastIndex++
    }

    const rendered = this.maxHighlights > 0 ? Math.min(total, this.maxHighlights) : total
    this.dispatchEvent(new CustomEvent('match-count', { detail: { count: rendered }, bubbles: true, composed: true }))
    this.dispatchEvent(new CustomEvent('total-match-count', { detail: { count: total }, bubbles: true, composed: true }))
  }

  render() {
    const text = this.text
    const query = this.query

    if (!text) return html``
    if (!query) return html`<span part="base">${text}</span>`

    const pattern = buildPattern(query, this.caseSensitive, this.wholeWord)
    if (!pattern) return html`<span part="base">${text}</span>`

    const segments: Segment[] = []
    let last = 0
    let count = 0
    let m: RegExpExecArray | null

    while ((m = pattern.exec(text)) !== null) {
      if (m.index > last) {
        segments.push({ text: text.slice(last, m.index), match: false })
      }
      segments.push({ text: m[0], match: true })
      last = m.index + m[0].length
      count++
      if (this.maxHighlights > 0 && count >= this.maxHighlights) break
      if (m[0] === '') pattern.lastIndex++
    }

    if (last < text.length) {
      segments.push({ text: text.slice(last), match: false })
    }

    const matchClass = cn(
      'bg-accent text-accent-foreground dark:bg-accent/30 dark:text-accent-foreground rounded px-0.5 font-medium',
      this.highlightClass,
    )

    return html`
      <span part="base">
        ${segments.map((seg) =>
          seg.match
            ? this.highlightTag === 'span'
              ? html`<span part="match" data-slot="highlight-match" class=${matchClass}>${seg.text}</span>`
              : html`<mark part="match" data-slot="highlight-match" class=${matchClass}>${seg.text}</mark>`
            : html`${seg.text}`,
        )}
      </span>
    `
  }
}

customElements.get('uip-highlight') || customElements.define('uip-highlight', UipHighlight)

declare global {
  interface HTMLElementTagNameMap {
    'uip-highlight': UipHighlight
  }
}

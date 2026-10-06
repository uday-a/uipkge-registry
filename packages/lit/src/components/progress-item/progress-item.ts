import { LitElement, css, html } from 'lit'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import '../progress/progress'

// Maps to canonical shadcn chart tokens (chart-1..5). Cycles through 5 hues.
// React targets `[&_[data-slot=progress-indicator]]`, which can't see into
// <uip-progress>'s shadow root, so the same colours go on its `indicator` part.
const barColors = [
  '[&::part(indicator)]:bg-primary',
  '[&::part(indicator)]:bg-[var(--chart-1)]',
  '[&::part(indicator)]:bg-[var(--chart-2)]',
  '[&::part(indicator)]:bg-[var(--chart-3)]',
  '[&::part(indicator)]:bg-[var(--chart-4)]',
  '[&::part(indicator)]:bg-[var(--chart-5)]',
]

/**
 * <uip-progress-item> — the registry ProgressItem: a label / value row over a
 * <uip-progress>.
 *
 * The inner progress re-exports its parts, so the indicator colour can be set
 * from outside and wins over `color-index` (React: "barClass takes precedence"):
 * React's `barClass` → `class="[&::part(indicator)]:bg-emerald-500"` (the bar
 * colour) or `[&::part(progress)]:…` (the track) on the host. Parts: `base`
 * (the row), `progress` (the track) and `indicator`.
 */
export class UipProgressItem extends LitElement {
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    label: {},
    value: { type: Number },
    secondaryLabel: { attribute: 'secondary-label' },
    colorIndex: { type: Number, attribute: 'color-index' },
  }

  label = ''
  value = 0
  secondaryLabel?: string
  colorIndex?: number

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'progress-item')
  }

  render() {
    const colorClass = this.colorIndex !== undefined ? barColors[this.colorIndex % barColors.length] : ''
    return html`<div part="base" data-uipkge="" data-slot="progress-item" class="group/progress space-y-1.5">
      <div class="flex items-center justify-between text-sm">
        <span class="font-medium">${this.label}</span>
        <span class="text-muted-foreground text-xs tabular-nums">${this.secondaryLabel ?? `${this.value}%`}</span>
      </div>
      <uip-progress
        exportparts="base: progress, indicator"
        .value=${this.value}
        class=${cn(
          '[&::part(base)]:h-2 [&::part(base)]:transition-colors [&::part(base)]:duration-200',
          colorClass,
        )}
      ></uip-progress>
    </div>`
  }
}

customElements.get('uip-progress-item') || customElements.define('uip-progress-item', UipProgressItem)

declare global {
  interface HTMLElementTagNameMap {
    'uip-progress-item': UipProgressItem
  }
}

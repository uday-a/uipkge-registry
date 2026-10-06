import { LitElement, css, html, isServer, nothing } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { Check, Copy } from 'lucide'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { icon } from '../../lib/icon'
import { autoUpdate, computePosition } from '../../lib/position'

export type ClipboardState = 'idle' | 'success' | 'error'

// Radix's <Arrow> svg is 10×5, but the popper measures its RENDERED size — the
// `size-2.5` class makes it 10×10 — and adds that height to sideOffset
// (measured on the React page: 4 + 10 = 14px gap). Same constants as tooltip.
const ARROW_OFFSET = 10

/**
 * <uip-clipboard> — the registry Clipboard (copy button + feedback tooltip) as
 * ONE web component.
 *
 *   <uip-clipboard text="npm install @uipkge/ui" label="Copy install"></uip-clipboard>
 *
 * Button, icon, and label class strings are React's verbatim; the tooltip
 * bubble reuses React's TooltipContent string (the same bubble <uip-tooltip>
 * renders, arrow included). Copies via `navigator.clipboard.writeText` with
 * React's textarea fallback for non-secure contexts, then shows feedback for
 * `timeout` ms (default 2000): the icon swaps to an emerald check and — when
 * `feedback-tooltip` is on (default) — the bubble shows `success-text` /
 * `error-text` instead of `tooltip`. With `feedback-tooltip="false"` the
 * bubble only shows while idle.
 *
 * React's `children` render-prop has no web-component equivalent; the default
 * slot takes static nodes instead, and `data-feedback-state` on the host
 * (`idle` | `success` | `error`) lets page CSS react to the state.
 *
 * Events (bubble, composed): `copy` (detail: { text } — React's `onCopy`,
 * fired before the attempt), `success` (detail: { text }), `error`
 * (detail: { error }).
 *
 * Parts: `base` (the button — React's `className` becomes
 * `class="[&::part(base)]:…"` on the host), `icon`, `label`, `tooltip`.
 */
export class UipClipboard extends LitElement {
  // :host display can't be a utility class (the host has no template of its own).
  // `contents`: the button keeps its own inline-flex box, like an asChild trigger.
  static styles = [tailwind, css`:host { display: contents; }`]

  static properties = {
    text: {},
    label: {},
    disabled: { type: Boolean, reflect: true },
    hideIcon: { type: Boolean, attribute: 'hide-icon' },
    tooltip: {},
    successText: { attribute: 'success-text' },
    errorText: { attribute: 'error-text' },
    timeout: { type: Number },
    feedbackTooltip: { type: Boolean, attribute: 'feedback-tooltip', converter: { fromAttribute: (v: string | null) => v !== 'false', toAttribute: () => null } },
    state: { state: true },
    tipOpen: { state: true },
    tipPos: { state: true },
  }

  text = ''
  label = ''
  disabled = false
  hideIcon = false
  tooltip = 'Copy'
  successText = 'Copied!'
  errorText = 'Failed'
  timeout = 2000
  feedbackTooltip = true
  private state: ClipboardState = 'idle'
  private tipOpen = false
  private tipPos: Record<string, string> = {}
  private resetTimer?: ReturnType<typeof setTimeout>
  private openTimer?: ReturnType<typeof setTimeout>
  private hovering = false
  private stopAutoUpdate?: () => void

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'clipboard')
    this.setAttribute('data-feedback-state', this.state)
    this.addEventListener('pointerenter', this.onPointerEnter)
    this.addEventListener('pointerleave', this.onPointerLeave)
    this.addEventListener('focusin', this.onFocusIn)
    this.addEventListener('focusout', this.onFocusOut)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.removeEventListener('pointerenter', this.onPointerEnter)
    this.removeEventListener('pointerleave', this.onPointerLeave)
    this.removeEventListener('focusin', this.onFocusIn)
    this.removeEventListener('focusout', this.onFocusOut)
    this.teardown()
    clearTimeout(this.resetTimer)
    clearTimeout(this.openTimer)
  }

  private get button() {
    return this.renderRoot.querySelector<HTMLElement>('[data-slot="clipboard"]')
  }

  private get bubble() {
    return this.renderRoot.querySelector<HTMLElement>('[role=tooltip]')
  }

  private get currentTooltip() {
    return this.state === 'success' ? this.successText : this.state === 'error' ? this.errorText : this.tooltip
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if (changed.has('state')) this.setAttribute('data-feedback-state', this.state)
  }

  // --- tooltip (Radix Tooltip behaviour, delay 300 like React's provider) ----
  private get showBubble() {
    return this.feedbackTooltip || this.state === 'idle'
  }

  private onPointerEnter = (e: PointerEvent) => {
    if (e.pointerType === 'touch') return
    this.hovering = true
    if (this.disabled || this.tipOpen || !this.showBubble) return
    clearTimeout(this.openTimer)
    this.openTimer = setTimeout(() => {
      if (this.hovering && this.showBubble) this.tipOpen = true
    }, 300)
  }

  private onPointerLeave = () => {
    this.hovering = false
    clearTimeout(this.openTimer)
    this.tipOpen = false
  }

  private onFocusIn = () => {
    if (this.disabled || !this.showBubble) return
    this.tipOpen = true
  }

  private onFocusOut = () => {
    this.tipOpen = false
  }

  private onDocKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.tipOpen) {
      e.stopPropagation()
      this.tipOpen = false
    }
  }

  protected updated(changed: Map<string, unknown>) {
    // React unmounts the bubble during feedback when `feedbackTooltip` is off —
    // hide it here on state flips too, not just tipOpen changes.
    if ((!changed.has('tipOpen') && !changed.has('state') && !changed.has('feedbackTooltip')) || isServer) return
    const bubble = this.bubble
    if (!bubble) return
    if (this.tipOpen && this.showBubble) {
      if (!bubble.matches(':popover-open')) bubble.showPopover()
      addEventListener('keydown', this.onDocKeyDown, true)
      this.updateComplete.then(() => {
        const btn = this.button
        if (this.tipOpen && btn && !this.stopAutoUpdate) {
          this.stopAutoUpdate = autoUpdate(btn, bubble, () => this.place())
          Promise.all(bubble.getAnimations().map((a) => a.finished)).then(() => this.tipOpen && this.place(), () => {})
        }
      })
    } else {
      this.teardown()
      if (bubble.matches(':popover-open')) bubble.hidePopover()
    }
  }

  private teardown() {
    this.stopAutoUpdate?.()
    this.stopAutoUpdate = undefined
    removeEventListener('keydown', this.onDocKeyDown, true)
  }

  private place() {
    const btn = this.button
    const bubble = this.bubble
    if (!btn || !bubble) return
    const { style } = computePosition(btn, bubble, { side: 'top', sideOffset: 4 + ARROW_OFFSET })
    this.tipPos = style
  }

  // --- copy ------------------------------------------------------------------
  private setFeedback(next: ClipboardState) {
    this.state = next
    if (this.resetTimer) clearTimeout(this.resetTimer)
    this.resetTimer = setTimeout(() => (this.state = 'idle'), this.timeout)
  }

  private async copy() {
    if (this.disabled) return
    const value = this.text
    this.dispatchEvent(new CustomEvent('copy', { detail: { text: value }, bubbles: true, composed: true }))
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value)
      } else {
        // Legacy fallback for non-secure contexts.
        const ta = document.createElement('textarea')
        ta.value = value
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        const ok = document.execCommand('copy')
        document.body.removeChild(ta)
        if (!ok) throw new Error('execCommand copy failed')
      }
      this.setFeedback('success')
      this.dispatchEvent(new CustomEvent('success', { detail: { text: value }, bubbles: true, composed: true }))
    } catch (err) {
      this.setFeedback('error')
      this.dispatchEvent(new CustomEvent('error', { detail: { error: err }, bubbles: true, composed: true }))
    }
  }

  render() {
    const tip = this.currentTooltip
    return html`
      <button
        part="base"
        type="button"
        data-uipkge=""
        data-slot="clipboard"
        data-feedback-state=${this.state}
        ?disabled=${this.disabled}
        aria-label=${tip}
        aria-describedby="uip-clipboard-tip"
        class=${cn(
          'inline-flex items-center gap-2 rounded-md text-sm transition-colors',
          'text-muted-foreground hover:text-foreground',
          'focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px]',
          'disabled:cursor-not-allowed disabled:opacity-50',
        )}
        @click=${() => void this.copy()}
      >
        ${!this.hideIcon
          ? html`<span part="icon" data-slot="clipboard-icon" class="inline-flex">
              ${this.state === 'success' ? icon(Check, 'check', 'size-4 text-emerald-500') : icon(Copy, 'copy', 'size-4')}
            </span>`
          : nothing}
        ${this.label ? html`<span part="label" data-slot="clipboard-label">${this.label}</span>` : nothing}
        <slot></slot>
      </button>
      <div
        part="tooltip"
        id="uip-clipboard-tip"
        role="tooltip"
        popover="manual"
        data-uipkge=""
        data-slot="tooltip-content"
        data-state=${this.tipOpen ? 'instant-open' : 'closed'}
        data-side="top"
        data-align="center"
        style=${styleMap(this.tipPos)}
        class=${cn(
          'bg-foreground text-background motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-95 motion-safe:data-[state=closed]:animate-out motion-safe:blur-in-2 motion-safe:data-[state=closed]:blur-out-2 motion-safe:data-[state=closed]:fade-out-0 motion-safe:data-[state=closed]:zoom-out-95 motion-safe:data-[side=bottom]:slide-in-from-top-2 motion-safe:data-[side=left]:slide-in-from-right-2 motion-safe:data-[side=right]:slide-in-from-left-2 motion-safe:data-[side=top]:slide-in-from-bottom-2 z-50 w-fit rounded-md px-3 py-1.5 text-xs text-balance',
          'fixed inset-auto m-0 overflow-visible text-start',
        )}
      >
        ${tip}
        <span style=${styleMap({ position: 'absolute', left: '50%', bottom: '0', transform: 'translate(-50%, 100%)' })}>
          <svg
            class="bg-foreground fill-foreground z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]"
            width="10"
            height="5"
            viewBox="0 0 30 10"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polygon points="0,0 30,0 15,10"></polygon>
          </svg>
        </span>
      </div>
    `
  }
}

customElements.get('uip-clipboard') || customElements.define('uip-clipboard', UipClipboard)

declare global {
  interface HTMLElementTagNameMap {
    'uip-clipboard': UipClipboard
  }
}

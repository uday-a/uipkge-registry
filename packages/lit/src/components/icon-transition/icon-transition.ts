import { LitElement, css, html, nothing, type TemplateResult } from 'lit'
import { keyed } from 'lit/directives/keyed.js'
import { styleMap } from 'lit/directives/style-map.js'
import {
  Bookmark,
  BookmarkCheck,
  Check,
  Copy,
  Heart,
  Link2,
  Plus,
  Share2,
  Star,
  ThumbsUp,
  UserCheck,
  UserPlus,
  X,
  type IconNode,
} from 'lucide'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { icon } from '../../lib/icon'

interface IconEntry {
  node: IconNode
  name: string
}

/**
 * Named icons for `default-icon` / `active-icon` (kebab-case lucide names).
 * React takes Lucide components; `slot="default-icon"` / `slot="active-icon"`
 * accept any other <svg>.
 */
const namedIcons: Record<string, IconEntry> = {
  copy: { node: Copy, name: 'copy' },
  check: { node: Check, name: 'check' },
  bookmark: { node: Bookmark, name: 'bookmark' },
  'bookmark-check': { node: BookmarkCheck, name: 'bookmark-check' },
  heart: { node: Heart, name: 'heart' },
  share: { node: Share2, name: 'share-2' },
  'share-2': { node: Share2, name: 'share-2' },
  'user-plus': { node: UserPlus, name: 'user-plus' },
  'user-check': { node: UserCheck, name: 'user-check' },
  star: { node: Star, name: 'star' },
  'thumbs-up': { node: ThumbsUp, name: 'thumbs-up' },
  plus: { node: Plus, name: 'plus' },
  link: { node: Link2, name: 'link-2' },
  'link-2': { node: Link2, name: 'link-2' },
  x: { node: X, name: 'x' },
}

// Tailwind safelist (candidates are scanned from source text): `active-class`
// / `icon-class` values are consumer strings applied inside the shadow root,
// so the utilities they use must appear here to be compiled into the shadow
// sheet. Covers the component default plus the demo gallery values.
// text-success text-rose-500 text-info text-amber-500 text-emerald-500 fill-current size-3 size-4 size-5

export type IconTransitionAction = () => boolean | void | Promise<boolean | void>

/**
 * <uip-icon-transition> — the registry IconTransition as a web component.
 *
 *   <uip-icon-transition default-icon="copy" active-icon="check" label="Copy URL" active-label="Copied"></uip-icon-transition>
 *
 * Click runs the optional async `action` (return `false` to skip the flip),
 * then swaps `default-icon` to `active-icon` with a spring pop; by default it
 * auto-reverts after `reset-after` ms (1500 — `0` stays active until
 * `reset()`). Two modes, like React: self-managed (default) or externally
 * controlled via `active`.
 *
 * Renders a <button> by default; `as="span"` is purely visual (the parent
 * drives `trigger()` / `active`). The pop/fade keyframes are React's injected
 * styles verbatim in the static styles — the one allowed CSS exception for
 * React-injected keyframes.
 *
 * Icons: `default-icon` / `active-icon` kebab names (see `namedIcons`), or
 * slot any <svg> into `slot="default-icon"` / `slot="active-icon">`.
 * `icon-class` sizes the icons (default `size-4`); `active-class` tints the
 * root while active (default `text-success` — values must be utilities in the
 * shadow sheet, see the safelist above). The inner control fills the host, so
 * sizing/border/hover classes (React's `className`) go on the host as usual.
 *
 * Events (bubble, composed): `activate`, `reset`. Methods: `trigger()`, `reset()`.
 * Parts: `base` (the button/span), `icon-active`, `icon-default`.
 */
export class UipIconTransition extends LitElement {
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true }
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [
    tailwind,
    css`:host { display: inline-flex; }`,
    // React's injected styles, verbatim (shadow-scoped: `.icon-transition` is
    // the inner control).
    css`
      .icon-transition .icon-transition-slot {
        grid-area: 1 / 1;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .icon-transition .icon-transition-enter-active,
      .icon-transition .icon-transition-leave-active {
        transform-origin: center;
      }
      .icon-transition .icon-transition-enter-active {
        animation: icon-transition-pop var(--it-duration, 240ms) cubic-bezier(0.34, 1.56, 0.64, 1) both;
      }
      .icon-transition .icon-transition-leave-active {
        animation: icon-transition-fade calc(var(--it-duration, 240ms) * 0.66) ease-in both;
      }
      @keyframes icon-transition-pop {
        0% {
          opacity: 0;
          transform: scale(0.5) rotate(-12deg);
        }
        60% {
          opacity: 1;
          transform: scale(1.18) rotate(2deg);
        }
        100% {
          opacity: 1;
          transform: scale(1) rotate(0deg);
        }
      }
      @keyframes icon-transition-fade {
        to {
          opacity: 0;
          transform: scale(0.85);
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .icon-transition .icon-transition-enter-active,
        .icon-transition .icon-transition-leave-active {
          animation-duration: 0ms !important;
        }
      }
    `,
  ]

  static properties = {
    defaultIcon: { attribute: 'default-icon' },
    activeIcon: { attribute: 'active-icon' },
    iconClass: { attribute: 'icon-class' },
    action: { attribute: false },
    resetAfter: {
      attribute: 'reset-after',
      converter: {
        fromAttribute: (v: string | null) => (v === null ? 1500 : v === 'null' ? null : Number(v)),
        toAttribute: (v: unknown) => String(v),
      },
    },
    duration: { type: Number },
    label: {},
    activeLabel: { attribute: 'active-label' },
    activeClass: { attribute: 'active-class' },
    as: { reflect: true },
    active: {
      converter: {
        fromAttribute: (v: string | null) => (v === null ? undefined : v !== 'false'),
        toAttribute: (v: unknown) => (v == null ? null : String(v)),
      },
    },
    internalActive: { state: true },
    prevActive: { state: true },
  }

  defaultIcon = 'copy'
  activeIcon = 'check'
  iconClass = 'size-4'
  action?: IconTransitionAction
  resetAfter: number | null = 1500
  duration = 240
  label?: string
  activeLabel?: string
  activeClass = 'text-success'
  as: 'button' | 'span' = 'button'
  /** External control. When set (even false), it wins over internal state. */
  active?: boolean
  private internalActive = false
  private prevActive: boolean | null = null
  private prevIsActive = false
  private timer?: ReturnType<typeof setTimeout>
  private leaveTimer?: ReturnType<typeof setTimeout>

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'icon-transition')
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    clearTimeout(this.timer)
    clearTimeout(this.leaveTimer)
  }

  private get isActive() {
    return this.active !== undefined ? this.active : this.internalActive
  }

  protected willUpdate(changed: Map<string, unknown>) {
    // Hold the prior icon as the leaving slot for the cross-fade (React holds
    // prevActive in state; Vue's <Transition> does it for free).
    if (changed.has('active') || changed.has('internalActive')) {
      const isActive = this.isActive
      if (this.prevIsActive !== isActive) {
        this.prevActive = this.prevIsActive
        this.prevIsActive = isActive
        clearTimeout(this.leaveTimer)
        this.leaveTimer = setTimeout(() => (this.prevActive = null), this.duration)
      }
    }
  }

  /** Run the action (if any) and flip to the active icon. */
  async trigger() {
    if (this.action) {
      const result = await this.action()
      if (result === false) return
    }
    this.internalActive = true
    this.dispatchEvent(new CustomEvent('activate', { bubbles: true, composed: true }))
    if (this.timer) clearTimeout(this.timer)
    if (this.resetAfter && this.resetAfter > 0) {
      this.timer = setTimeout(() => this.reset(), this.resetAfter as number)
    }
  }

  /** Revert to the default icon. */
  reset() {
    this.internalActive = false
    this.dispatchEvent(new CustomEvent('reset', { bubbles: true, composed: true }))
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = undefined
    }
  }

  private renderIcon(slotActive: boolean): TemplateResult {
    const key = slotActive ? this.activeIcon : this.defaultIcon
    const entry = namedIcons[key]
    const slotName = slotActive ? 'active-icon' : 'default-icon'
    return html`<slot name=${slotName}>${entry ? icon(entry.node, entry.name, this.iconClass) : nothing}</slot>`
  }

  private renderSlot(slotActive: boolean, phase: 'enter' | 'leave') {
    const phaseClass = phase === 'enter' ? 'icon-transition-enter-active' : 'icon-transition-leave-active'
    // part on the slot's fallback icon is unreachable (icon() takes no attrs);
    // expose the slot wrapper instead.
    return html`<span part=${slotActive ? 'icon-active' : 'icon-default'} class=${cn('icon-transition-slot', phaseClass)}>
      ${this.renderIcon(slotActive)}
    </span>`
  }

  render() {
    const isActive = this.isActive
    const classes = cn(
      'icon-transition focus-visible:ring-ring inline-grid size-full place-items-center transition-colors focus-visible:ring-2 focus-visible:outline-none',
      isActive ? this.activeClass : '',
    )
    // `keyed` (React's `key=`): remount the entering slot on every flip so the
    // pop animation restarts; the leaving slot mounts fresh each time by itself.
    const body = html`
      ${this.prevActive !== null && this.prevActive !== isActive ? this.renderSlot(this.prevActive, 'leave') : nothing}
      ${keyed(`enter-${isActive}`, this.renderSlot(isActive, 'enter'))}
    `
    if (this.as === 'span') {
      return html`<span
        part="base"
        data-uipkge=""
        data-slot="icon-transition"
        aria-label=${isActive ? (this.activeLabel ?? this.label ?? nothing) : (this.label ?? nothing)}
        aria-live=${isActive ? 'polite' : nothing}
        class=${classes}
        style=${styleMap({ '--it-duration': `${this.duration}ms` })}
        >${body}</span
      >`
    }
    return html`<button
      part="base"
      data-uipkge=""
      data-slot="icon-transition"
      type="button"
      aria-label=${isActive ? (this.activeLabel ?? this.label ?? nothing) : (this.label ?? nothing)}
      aria-live=${isActive ? 'polite' : nothing}
      class=${classes}
      style=${styleMap({ '--it-duration': `${this.duration}ms` })}
      @click=${() => void this.trigger()}
    >
      ${body}
    </button>`
  }
}

customElements.get('uip-icon-transition') || customElements.define('uip-icon-transition', UipIconTransition)

declare global {
  interface HTMLElementTagNameMap {
    'uip-icon-transition': UipIconTransition
  }
}

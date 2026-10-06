import { LitElement, css, html, isServer, nothing } from 'lit'
import { Check, X, type IconNode } from 'lucide'
import { cn } from '../../lib/utils'
import { icon } from '../../lib/icon'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { stepperIndicatorVariants } from './stepper.variants'

export type StepperOrientation = 'horizontal' | 'vertical'
export type StepperStatus = 'active' | 'completed' | 'pending' | 'error'
export type StepperSize = 'sm' | 'default' | 'lg'

/** React's `StepperStep` config. `icon` is a `lucide` IconNode; `iconName` (kebab-case) adds the `lucide-<name>` class. */
export interface StepperStepConfig {
  id: string | number
  title: string
  description?: string
  icon?: IconNode
  iconName?: string
  disabled?: boolean
  error?: boolean
}

// Indicator row must match stepperIndicatorVariants sizes (sm 7 / default 9 / lg 11).
const indicatorAxisClasses = {
  horizontal: {
    sm: 'h-7 w-full items-center justify-center',
    default: 'h-9 w-full items-center justify-center',
    lg: 'h-11 w-full items-center justify-center',
  },
  vertical: {
    sm: 'w-7 flex-col items-center justify-start self-stretch',
    default: 'w-9 flex-col items-center justify-start self-stretch',
    lg: 'w-11 flex-col items-center justify-start self-stretch',
  },
} as const

// React's injected <style> keyframes, replayed with the Web Animations API
// (the shadow sheet takes no custom CSS). Same timings and easings.
const POP: Keyframe[] = [{ transform: 'scale(0.92)' }, { transform: 'scale(1.06)', offset: 0.55 }, { transform: 'scale(1)' }]
const ICON_IN: Keyframe[] = [
  { opacity: 0, transform: 'scale(0.6)' },
  { opacity: 1, transform: 'scale(1)' },
]

/**
 * <uip-stepper> — the registry Stepper as ONE web component.
 *
 * The header strip (tablist > ol > li[role=tab] with indicator + title
 * buttons and connector segments) is rendered from the `steps` property in a
 * single shadow root, with React's class strings. The default slot is the
 * content area (React's `children`), wrapped in `mt-6 flex-1` only when
 * something is slotted; use <uip-stepper-content step="n"> children to show
 * one panel per step.
 *
 * Custom composition (React's `stepsSlot` + standalone parts):
 *  - `slot="header"` replaces the auto-rendered <ol> (React's `stepsSlot`).
 *    `<uip-stepper-header>` is React's StepperHeader box for that strip.
 *  - Per-step rich content: `slot="title-n"` / `slot="description-n"` /
 *    `slot="icon-n"` (1-based step index, matching `value`) replace the
 *    step's title, description and indicator glyph respectively; without
 *    them the `steps` config renders as before. `<uip-stepper-title>` /
 *    `<uip-stepper-description>` are React's StepperTitle/Description spans
 *    for custom headers. StepperItem/Indicator/Step stay data-driven — the
 *    auto header + these slots cover their custom-content cases.
 *
 * Properties: `steps` (StepperStepConfig[], also JSON via the attribute),
 * `value` (1-based active step, default 1), `orientation`, `size`.
 * Events: `value-change` (detail: { value }) when a completed step is
 * clicked — the element also updates its own `value` (uncontrolled), set it
 * back to veto.
 *
 * Motion: React injects a <style> with keyframes; here the same keyframes run
 * through element.animate() when an indicator's status changes, and the
 * connector fill uses scale utilities keyed on data-completed.
 */
export class UipStepper extends LitElement {
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    steps: { type: Array },
    value: { type: Number, reflect: true },
    orientation: { reflect: true },
    size: { reflect: true },
    hasContent: { state: true },
  }

  steps: StepperStepConfig[] = []
  value = 1
  orientation: StepperOrientation = 'horizontal'
  size: StepperSize = 'default'
  private hasContent = false
  private lastStatus: StepperStatus[] = []

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'stepper')
  }

  private getStatus(index: number): StepperStatus {
    const step = this.steps[index]
    if (step?.error) return 'error'
    if (index + 1 === this.value) return 'active'
    if (index + 1 < this.value) return 'completed'
    return 'pending'
  }

  private isClickable(index: number) {
    return index + 1 < this.value
  }

  private goToStep(stepIndex: number) {
    if (stepIndex < 1 || stepIndex > this.steps.length) return
    if (this.steps[stepIndex - 1]?.disabled) return
    this.value = stepIndex
    this.dispatchEvent(new CustomEvent('value-change', { detail: { value: stepIndex }, bubbles: true, composed: true }))
  }

  private onSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement
    this.hasContent = slot.assignedNodes().some((n) => n.nodeType === 1 || n.textContent?.trim())
  }

  protected updated(changed: Map<string, unknown>) {
    if (changed.has('value')) {
      this.querySelectorAll('uip-stepper-content').forEach((c) => c.requestUpdate())
    }
    if (isServer) return
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const indicators = this.renderRoot.querySelectorAll<HTMLElement>('[data-slot=stepper-indicator]')
    indicators.forEach((el, i) => {
      const svg = el.querySelector(':scope > svg')
      svg?.setAttribute('data-slot', 'stepper-indicator-icon')
      const status = el.dataset.status as StepperStatus
      if (status === this.lastStatus[i]) return
      this.lastStatus[i] = status
      if (reduce || status === 'pending') return
      el.animate(POP, { duration: 280, easing: 'cubic-bezier(0.22, 1.4, 0.36, 1)', fill: 'both' })
      svg?.animate(ICON_IN, { duration: 220, easing: 'cubic-bezier(0.22, 1.2, 0.36, 1)', fill: 'both' })
    })
    this.lastStatus.length = indicators.length
  }

  private renderConnector(edge: 'left' | 'right' | 'top' | 'bottom', completed: boolean) {
    const horizontal = this.orientation === 'horizontal'
    const position = {
      left: 'top-1/2 right-1/2 left-0 h-px -translate-y-1/2',
      right: 'top-1/2 right-0 left-1/2 h-px -translate-y-1/2',
      top: 'top-0 bottom-1/2 left-1/2 w-px -translate-x-1/2',
      bottom: 'top-1/2 bottom-0 left-1/2 w-px -translate-x-1/2',
    }[edge]
    return html`<span
      aria-hidden="true"
      data-slot="stepper-connector"
      data-orientation=${this.orientation}
      data-edge=${edge}
      class=${cn('bg-border pointer-events-none absolute overflow-hidden', position)}
    >
      <span
        data-slot="stepper-connector-fill"
        data-completed=${completed ? 'true' : 'false'}
        data-orientation=${this.orientation}
        class=${cn(
          'bg-primary absolute inset-0',
          // React's injected CSS (scaleX/scaleY 0 -> 1, 320ms) as utilities.
          'transition-[scale] duration-[320ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
          horizontal
            ? 'origin-left scale-x-0 data-[completed=true]:scale-x-100'
            : 'origin-top scale-y-0 data-[completed=true]:scale-y-100',
        )}
      ></span>
    </span>`
  }

  private renderItem(step: StepperStepConfig, index: number) {
    const status = this.getStatus(index)
    const horizontal = this.orientation === 'horizontal'
    const isFirst = index === 0
    const isLast = index === this.steps.length - 1
    const clickable = this.isClickable(index) && !step.disabled
    const navigate = () => clickable && this.goToStep(index + 1)

    const fallbackIcon: [IconNode, string] | null = step.icon
      ? [step.icon, step.iconName ?? 'icon']
      : status === 'completed'
        ? [Check, 'check']
        : status === 'error'
          ? [X, 'x']
          : null

    return html`<li
      data-slot="stepper-item"
      class=${cn(
        'group/stepper-item relative min-w-0',
        horizontal ? 'flex flex-1 flex-col items-center gap-2' : 'flex flex-row items-start gap-3 pb-6 last:pb-0',
        step.disabled && 'opacity-50',
      )}
      role="tab"
      aria-selected=${status === 'active' ? 'true' : 'false'}
      aria-disabled=${step.disabled ? 'true' : nothing}
      data-status=${status}
    >
      <div class=${cn('relative flex shrink-0', indicatorAxisClasses[this.orientation][this.size])}>
        ${isFirst ? nothing : this.renderConnector(horizontal ? 'left' : 'top', index < this.value)}
        ${isLast ? nothing : this.renderConnector(horizontal ? 'right' : 'bottom', index < this.value - 1)}
        <button
          type="button"
          data-slot="stepper-indicator"
          data-status=${status}
          class=${cn(
            stepperIndicatorVariants({ status, size: this.size }),
            'ring-background relative z-10 ring-4 transition-[color,background-color,box-shadow,transform] duration-200 outline-none',
            clickable && 'focus-visible:ring-ring cursor-pointer focus-visible:ring-2 focus-visible:outline-none',
            !clickable && 'cursor-default',
            'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
          )}
          ?disabled=${!clickable}
          aria-current=${status === 'active' ? 'step' : nothing}
          @click=${navigate}
        >
          <slot name=${`icon-${index + 1}`}>
            ${fallbackIcon
              ? icon(fallbackIcon[0], fallbackIcon[1], 'size-4')
              : html`<span class="font-medium" data-slot="stepper-indicator-label">${index + 1}</span>`}
          </slot>
        </button>
      </div>
      <div
        data-slot="stepper-item-content"
        class=${cn('min-w-0', horizontal ? 'max-w-[12rem] text-center' : 'flex-1 pt-1.5')}
      >
        <button
          type="button"
          class=${cn(
            'text-foreground text-sm font-medium text-balance transition-colors duration-200 outline-none',
            clickable &&
              'hover:text-primary focus-visible:text-primary focus-visible:ring-ring cursor-pointer focus-visible:ring-2 focus-visible:outline-none',
            !clickable && 'cursor-default',
            status === 'pending' && 'text-muted-foreground',
            status === 'error' && 'text-destructive',
          )}
          ?disabled=${!clickable}
          @click=${navigate}
        >
          <slot name=${`title-${index + 1}`}>${step.title}</slot>
        </button>
        <slot name=${`description-${index + 1}`}>
          ${step.description
            ? html`<p class="text-muted-foreground mt-0.5 text-xs text-balance">${step.description}</p>`
            : nothing}
        </slot>
      </div>
    </li>`
  }

  render() {
    const horizontal = this.orientation === 'horizontal'
    return html`<div
      part="base"
      class="w-full"
      role="tablist"
      aria-orientation=${this.orientation}
      data-orientation=${this.orientation}
    >
      <slot name="header">
        ${this.steps.length > 0
          ? html`<ol class=${cn('flex', horizontal ? 'flex-row items-start' : 'flex-col items-stretch')}>
              ${this.steps.map((s, i) => this.renderItem(s, i))}
            </ol>`
          : nothing}
      </slot>
      <div class=${this.hasContent ? 'mt-6 flex-1' : ''}>
        <slot @slotchange=${this.onSlotChange}></slot>
      </div>
    </div>`
  }
}

/**
 * <uip-stepper-content step="n"> — React's StepperContent: a tabpanel shown
 * only while `step` equals the active step. The active step comes from
 * `active-step` when set, else from the closest <uip-stepper>'s `value`.
 */
export class UipStepperContent extends LitElement {
  // No :host display rule: it would override the UA `[hidden]` rule used to hide inactive panels.
  static styles = [tailwind]

  static properties = {
    step: { type: Number },
    activeStep: { type: Number, attribute: 'active-step' },
  }

  step = 1
  activeStep?: number

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'stepper-content')
  }

  private get isActive() {
    const active = this.activeStep ?? (isServer ? 1 : (this.closest('uip-stepper')?.value ?? 1))
    return this.step === active
  }

  protected willUpdate() {
    // Hide the host itself so an inactive panel takes no space in the layout.
    this.toggleAttribute('hidden', !this.isActive)
  }

  render() {
    const active = this.isActive
    return html`<div
      part="base"
      data-slot="stepper-content"
      class="stepper-content motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-1 motion-safe:duration-200 motion-safe:ease-out"
      role="tabpanel"
      aria-hidden=${active ? 'false' : 'true'}
    >
      <slot></slot>
    </div>`
  }
}

/**
 * <uip-stepper-header> — React's StepperHeader: the custom header-strip box
 * for `slot="header"`. Class string verbatim; host `class` = React's
 * `className`.
 */
export class UipStepperHeader extends LitElement {
  static styles = [tailwind, css`:host { display: block; }`]

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'stepper-header')
  }

  render() {
    return html`<div part="base" class="stepper-header flex items-center gap-0"><slot></slot></div>`
  }
}

/**
 * <uip-stepper-title> — React's StepperTitle span for custom headers.
 * Class string verbatim; host `class` = React's `className`.
 */
export class UipStepperTitle extends LitElement {
  static styles = [tailwind]

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'stepper-title')
  }

  render() {
    return html`<span part="base" class="text-foreground text-sm font-medium"><slot></slot></span>`
  }
}

/**
 * <uip-stepper-description> — React's StepperDescription span for custom
 * headers. Class string verbatim; host `class` = React's `className`.
 */
export class UipStepperDescription extends LitElement {
  static styles = [tailwind]

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'stepper-description')
  }

  render() {
    return html`<span part="base" class="text-muted-foreground text-xs"><slot></slot></span>`
  }
}

customElements.get('uip-stepper') || customElements.define('uip-stepper', UipStepper)
customElements.get('uip-stepper-content') || customElements.define('uip-stepper-content', UipStepperContent)
customElements.get('uip-stepper-header') || customElements.define('uip-stepper-header', UipStepperHeader)
customElements.get('uip-stepper-title') || customElements.define('uip-stepper-title', UipStepperTitle)
customElements.get('uip-stepper-description') ||
  customElements.define('uip-stepper-description', UipStepperDescription)

declare global {
  interface HTMLElementTagNameMap {
    'uip-stepper': UipStepper
    'uip-stepper-content': UipStepperContent
    'uip-stepper-header': UipStepperHeader
    'uip-stepper-title': UipStepperTitle
    'uip-stepper-description': UipStepperDescription
  }
}

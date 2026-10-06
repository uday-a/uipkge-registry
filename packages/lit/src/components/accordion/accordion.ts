import { LitElement, css, html, nothing } from 'lit'
import { ChevronDown } from 'lucide'
import { cn } from '../../lib/utils'
import { icon } from '../../lib/icon'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { accordionItemVariants, accordionTriggerVariants, accordionVariants } from './accordion.variants'

type Variant = 'default' | 'separated' | 'ghost'

interface Item {
  value: string
  disabled: boolean
  trigger: Element
  content?: Element
  header?: Element
}

let uid = 0

const parseList = (v: string | null) => (v ? v.split(',').map((s) => s.trim()).filter(Boolean) : [])

/**
 * <uip-accordion> — the registry Accordion as ONE web component.
 *
 * Each trigger's aria-controls points at its panel and each panel's
 * aria-labelledby at its trigger. Those ids must live in one shadow root, so
 * items are NOT separate elements: they are flat light-DOM children, paired
 * by `data-value`, that the accordion slots into its own item markup
 * (manual slot assignment):
 *
 *   <uip-accordion type="single" collapsible>
 *     <span slot="trigger" data-value="a">Is it accessible?</span>
 *     <div slot="content" data-value="a">Yes.</div>
 *     <span slot="header" data-value="a">$12/mo</span>   (optional: extra
 *        content in AccordionHeader after the trigger)
 *   </uip-accordion>
 *
 * Like React, the trigger sits directly in the item unless the item has a
 * `header` child, which renders AccordionHeader (h3.flex) around trigger +
 * header content. The trigger child is `display: contents`, so its content
 * lays out as the trigger button's own flex items.
 *
 * `data-disabled` on a trigger child disables that item (AccordionItem
 * `disabled`). Item order is trigger order.
 *
 * Props (React names): type ('single' | 'multiple'), collapsible, value,
 * default-value, disabled, variant ('default' | 'separated' | 'ghost').
 * For type="multiple" `value` is a string[] (attribute: comma-separated).
 *
 * React's per-part `className` → style the shadow parts from outside:
 * `part="item" | "header" | "trigger" | "content"`, e.g.
 * `class="[&::part(content)]:px-4"`.
 *
 * Keyboard: Enter/Space toggle (native button); ArrowDown/ArrowUp move
 * between triggers (wrapping), Home/End jump to first/last.
 * Events: `input`, `change` and `value-change` (detail: { value }).
 */
export class UipAccordion extends LitElement {
  static shadowRootOptions: ShadowRootInit = { ...LitElement.shadowRootOptions, slotAssignment: 'manual' }
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    type: { reflect: true },
    collapsible: { type: Boolean },
    value: {},
    defaultValue: { attribute: 'default-value' },
    disabled: { type: Boolean, reflect: true },
    variant: { reflect: true },
    items: { state: true },
  }

  type: 'single' | 'multiple' = 'single'
  collapsible = false
  value: string | string[] = ''
  defaultValue?: string
  disabled = false
  variant: Variant = 'default'
  private items: Item[] = []
  private readonly uidBase = `uip-accordion-${++uid}`
  private closing = new Set<string>()
  private interacted = false
  private childObserver?: MutationObserver

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'accordion')
    this.setAttribute('data-orientation', 'vertical')
    if (this.defaultValue != null && !this.openValues.length) this.value = this.defaultValue
    this.readItems()
    this.childObserver = new MutationObserver(() => this.readItems())
    this.childObserver.observe(this, {
      childList: true,
      attributes: true,
      subtree: false,
      attributeFilter: ['slot', 'data-value', 'data-disabled'],
    })
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.childObserver?.disconnect()
  }

  willUpdate(changed: Map<string, unknown>) {
    this.setAttribute('data-variant', this.variant)
    if (changed.has('value') && this.type === 'multiple' && typeof this.value === 'string') {
      this.value = parseList(this.value)
    }
  }

  private get openValues(): string[] {
    const v = this.value
    if (Array.isArray(v)) return v
    return this.type === 'multiple' ? parseList(v) : v ? [v] : []
  }

  private readItems() {
    const kids = [...this.children]
    const byValue = (slot: string, value: string) =>
      kids.find((k) => k.getAttribute('slot') === slot && k.getAttribute('data-value') === value)
    this.items = kids
      .filter((k) => k.getAttribute('slot') === 'trigger')
      .map((trigger) => {
        const value = trigger.getAttribute('data-value') ?? ''
        return {
          value,
          disabled: trigger.hasAttribute('data-disabled'),
          trigger,
          content: byValue('content', value),
          header: byValue('header', value),
        }
      })
  }

  private panel(i: number) {
    return this.renderRoot.querySelector<HTMLElement>(`#${this.uidBase}-content-${i}`)
  }

  private measure(el: HTMLElement) {
    // Radix: drop the animation while measuring, then set the size vars the
    // accordion-up/-down keyframes read.
    el.style.animationName = 'none'
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--radix-accordion-content-height', `${el.scrollHeight}px`)
    el.style.setProperty('--radix-accordion-content-width', `${rect.width}px`)
    if (this.interacted) el.style.animationName = ''
  }

  private toggle(i: number) {
    const item = this.items[i]
    if (!item || item.disabled || this.disabled) return
    const open = this.openValues.includes(item.value)
    let next: string[]
    if (this.type === 'multiple') {
      next = open ? this.openValues.filter((v) => v !== item.value) : [...this.openValues, item.value]
    } else {
      if (open && !this.collapsible) return
      next = open ? [] : [item.value]
    }
    this.interacted = true
    // Panels about to close: capture their open height for accordion-up.
    this.items.forEach((it, j) => {
      if (this.openValues.includes(it.value) && !next.includes(it.value)) {
        const el = this.panel(j)
        if (el) this.measure(el)
        this.closing.add(it.value)
        setTimeout(() => this.finishClose(it.value), 400)
      }
    })
    this.value = this.type === 'multiple' ? next : (next[0] ?? '')
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
    this.dispatchEvent(new CustomEvent('value-change', { detail: { value: this.value }, bubbles: true, composed: true }))
  }

  private finishClose(value: string) {
    if (!this.closing.delete(value)) return
    this.requestUpdate()
  }

  private onAnimationEnd(e: AnimationEvent, value: string) {
    if (e.target !== e.currentTarget) return
    if (!this.openValues.includes(value)) this.finishClose(value)
  }

  private onKeyDown(e: KeyboardEvent) {
    const triggers = [...this.renderRoot.querySelectorAll<HTMLButtonElement>('[data-slot=accordion-trigger]')].filter(
      (t) => !t.disabled,
    )
    const i = triggers.indexOf(e.currentTarget as HTMLButtonElement)
    if (i < 0) return
    const n = triggers.length
    const to = { ArrowDown: (i + 1) % n, ArrowUp: (i - 1 + n) % n, Home: 0, End: n - 1 }[e.key]
    if (to === undefined) return
    e.preventDefault()
    triggers[to].focus()
  }

  protected updated() {
    // Manual slot assignment: each item's light-DOM parts go into its slots.
    this.items.forEach((it, i) => {
      const find = (part: string) =>
        this.renderRoot.querySelector<HTMLSlotElement>(`slot[data-part="${part}"][data-index="${i}"]`)
      find('trigger')?.assign(it.trigger)
      if (it.content) find('content')?.assign(it.content)
      if (it.header) find('header')?.assign(it.header)
    })
    // Newly opened panels: measure now that they are visible.
    this.items.forEach((it, i) => {
      const el = this.panel(i)
      if (!el || !this.openValues.includes(it.value)) return
      if (el.dataset.measured !== 'open') {
        el.dataset.measured = 'open'
        this.measure(el)
      }
    })
    this.items.forEach((it, i) => {
      const el = this.panel(i)
      if (el && !this.openValues.includes(it.value)) delete el.dataset.measured
    })
  }

  render() {
    const open = this.openValues
    const v = this.variant
    return html`<div part="root" class=${cn(accordionVariants({ variant: v }))}>
      ${this.items.map((it, i) => {
        const isOpen = open.includes(it.value)
        const state = isOpen ? 'open' : 'closed'
        const disabled = it.disabled || this.disabled
        const locked = isOpen && this.type === 'single' && !this.collapsible
        const triggerId = `${this.uidBase}-trigger-${i}`
        const contentId = `${this.uidBase}-content-${i}`
        const trigger = html`<button
          part="trigger"
          type="button"
          id=${triggerId}
          aria-controls=${contentId}
          aria-expanded=${isOpen ? 'true' : 'false'}
          aria-disabled=${locked ? 'true' : nothing}
          data-state=${state}
          data-orientation="vertical"
          ?data-disabled=${disabled}
          ?disabled=${disabled}
          data-slot="accordion-trigger"
          class=${cn(accordionTriggerVariants({ variant: v }))}
          @click=${() => this.toggle(i)}
          @keydown=${this.onKeyDown}
        >
          <slot data-part="trigger" data-index=${i} class="[&::slotted(*)]:contents"></slot>
          ${icon(
            ChevronDown,
            'chevron-down',
            'text-muted-foreground size-4 shrink-0 transition-transform duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] group-data-[state=open]/accordion-trigger:rotate-180 motion-reduce:transition-none',
          )}
        </button>`
        return html`<div
          part="item"
          data-slot="accordion-item"
          data-state=${state}
          data-orientation="vertical"
          ?data-disabled=${disabled}
          class=${cn(accordionItemVariants({ variant: v }))}
        >
          ${it.header
            ? html`<h3
                part="header"
                data-slot="accordion-header"
                data-state=${state}
                data-orientation="vertical"
                ?data-disabled=${disabled}
                class="flex"
              >
                ${trigger}<slot data-part="header" data-index=${i}></slot>
              </h3>`
            : trigger}
          <div
            part="content"
            id=${contentId}
            role="region"
            aria-labelledby=${triggerId}
            data-state=${state}
            data-orientation="vertical"
            ?data-disabled=${disabled}
            data-slot="accordion-content"
            ?hidden=${!isOpen && !this.closing.has(it.value)}
            class=${cn(
              'text-muted-foreground overflow-hidden text-sm',
              'data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
              'duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]',
              'motion-reduce:animate-none',
            )}
            @animationend=${(e: AnimationEvent) => this.onAnimationEnd(e, it.value)}
          >
            <div class="pt-0 pb-4"><slot data-part="content" data-index=${i}></slot></div>
          </div>
        </div>`
      })}
    </div>`
  }
}

customElements.get('uip-accordion') || customElements.define('uip-accordion', UipAccordion)

declare global {
  interface HTMLElementTagNameMap {
    'uip-accordion': UipAccordion
  }
}

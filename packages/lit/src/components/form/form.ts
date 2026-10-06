import { LitElement, css, html, nothing } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { CircleAlert, CircleCheck, TriangleAlert } from 'lucide'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { icon } from '../../lib/icon'

export type FormStatusValue = 'error' | 'warning' | 'success' | null | undefined

/* -------------------------------------------------------------------------- */
/*                                  UipForm                                   */
/* -------------------------------------------------------------------------- */

export class UipForm extends LitElement {
  static styles = [tailwind, css`:host { display: block; }`]

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'form')
  }

  render() {
    return html`<form part="base" class="space-y-4" @submit=${this.onSubmit}><slot></slot></form>`
  }

  private onSubmit(e: Event) {
    // Let consumers handle submit on the element or native form
    this.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
  }
}

/* -------------------------------------------------------------------------- */
/*                                UipFormItem                                 */
/* -------------------------------------------------------------------------- */

export class UipFormItem extends LitElement {
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    label: {},
    required: { type: Boolean, reflect: true },
    description: {},
    status: { reflect: true },
    help: {},
    layout: { reflect: true },
    labelWidth: { attribute: 'label-width' },
  }

  label?: string
  required = false
  description?: string
  status?: FormStatusValue
  help?: string
  layout: 'vertical' | 'horizontal' = 'vertical'
  labelWidth?: string

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'form-item')
  }

  render() {
    const isHorizontal = this.layout === 'horizontal'

    return html`
      <div
        part="base"
        class=${cn(
          'grid gap-1.5',
          isHorizontal && 'grid-cols-[var(--label-width,140px)_1fr] items-start gap-x-4 gap-y-0',
        )}
        style=${styleMap(this.labelWidth ? { '--label-width': this.labelWidth } : {})}
      >
        ${this.label || this.required
          ? html`
              <div class="flex items-center gap-1">
                ${this.label
                  ? html`<label
                      part="label"
                      class=${cn('text-sm font-medium leading-none select-none', this.status === 'error' && 'text-destructive')}
                    >
                      ${this.label}
                    </label>`
                  : nothing}
                ${this.required
                  ? html`<span class="text-destructive text-sm" aria-hidden="true">*</span>`
                  : nothing}
              </div>
            `
          : nothing}
        <div
          part="control-wrapper"
          class=${cn(
            'space-y-1',
            this.status === 'error' &&
              '[&_input]:border-destructive [&_textarea]:border-destructive [&_button]:border-destructive',
            this.status === 'warning' &&
              '[&_input]:border-warning [&_textarea]:border-warning [&_button]:border-warning',
            this.status === 'success' &&
              '[&_input]:border-success [&_textarea]:border-success [&_button]:border-success',
          )}
        >
          <slot></slot>
          ${this.description
            ? html`<p part="description" class="text-muted-foreground text-xs">${this.description}</p>`
            : nothing}
          ${this.help
            ? html`<p
                part="help"
                role=${this.status === 'error' ? 'alert' : nothing}
                class=${cn(
                  'text-xs',
                  this.status === 'error' && 'text-destructive',
                  this.status === 'warning' && 'text-warning',
                  this.status === 'success' && 'text-success',
                  !this.status && 'text-muted-foreground',
                )}
              >
                ${this.help}
              </p>`
            : nothing}
        </div>
      </div>
    `
  }
}

/* -------------------------------------------------------------------------- */
/*                                UipFormLabel                                */
/* -------------------------------------------------------------------------- */

export class UipFormLabel extends LitElement {
  static styles = [tailwind, css`:host { display: inline-block; }`]

  static properties = {
    htmlFor: { attribute: 'for' },
    error: { type: Boolean, reflect: true },
  }

  htmlFor?: string
  error = false

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'form-label')
  }

  render() {
    return html`
      <label
        part="label"
        for=${this.htmlFor ?? nothing}
        data-error=${this.error ? 'true' : 'false'}
        class=${cn(
          'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
          this.error && 'text-destructive',
        )}
      >
        <slot></slot>
      </label>
    `
  }
}

/* -------------------------------------------------------------------------- */
/*                            UipFormDescription                             */
/* -------------------------------------------------------------------------- */

export class UipFormDescription extends LitElement {
  static styles = [tailwind, css`:host { display: block; }`]

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'form-description')
  }

  render() {
    return html`<p part="base" class="text-muted-foreground text-sm"><slot></slot></p>`
  }
}

/* -------------------------------------------------------------------------- */
/*                               UipFormMessage                               */
/* -------------------------------------------------------------------------- */

export class UipFormMessage extends LitElement {
  static styles = [tailwind, css`:host { display: block; }`]

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'form-message')
  }

  render() {
    return html`<p part="base" role="alert" class="text-destructive text-sm"><slot></slot></p>`
  }
}

/* -------------------------------------------------------------------------- */
/*                               UipFormSection                               */
/* -------------------------------------------------------------------------- */

export class UipFormSection extends LitElement {
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    sectionTitle: { attribute: 'title' },
    subtitle: {},
    description: {},
    divider: { type: Boolean, reflect: true },
    headingLevel: { attribute: 'heading-level' },
  }

  sectionTitle?: string
  subtitle?: string
  description?: string
  divider = false
  headingLevel: 'h2' | 'h3' | 'h4' | 'h5' = 'h4'

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'form-section')
  }

  private renderHeading() {
    const title = this.sectionTitle || this.getAttribute('title')
    if (!title) return nothing
    switch (this.headingLevel) {
      case 'h2':
        return html`<h2 class="text-sm font-semibold">${title}</h2>`
      case 'h3':
        return html`<h3 class="text-sm font-semibold">${title}</h3>`
      case 'h5':
        return html`<h5 class="text-sm font-semibold">${title}</h5>`
      default:
        return html`<h4 class="text-sm font-semibold">${title}</h4>`
    }
  }

  render() {
    const title = this.sectionTitle || this.getAttribute('title')
    return html`
      <div part="base" class="space-y-3">
        ${this.divider || title || this.subtitle
          ? html`
              <div class=${cn(this.divider && 'border-t pt-4')}>
                ${title || this.subtitle
                  ? html`
                      <div class="space-y-1">
                        ${this.renderHeading()}
                        ${this.subtitle
                          ? html`<p class="text-muted-foreground text-xs">${this.subtitle}</p>`
                          : nothing}
                      </div>
                    `
                  : nothing}
              </div>
            `
          : nothing}
        ${this.description
          ? html`<p class="text-muted-foreground text-xs">${this.description}</p>`
          : nothing}
        <slot></slot>
      </div>
    `
  }
}

/* -------------------------------------------------------------------------- */
/*                               UipFormActions                               */
/* -------------------------------------------------------------------------- */

const alignClasses = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
} as const

const gapClasses = {
  sm: 'gap-2',
  md: 'gap-3',
  lg: 'gap-4',
} as const

export class UipFormActions extends LitElement {
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    align: { reflect: true },
    gap: { reflect: true },
  }

  align: 'left' | 'center' | 'right' = 'right'
  gap: 'sm' | 'md' | 'lg' = 'md'

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'form-actions')
  }

  render() {
    return html`
      <div
        part="base"
        class=${cn(
          'flex flex-wrap items-center',
          alignClasses[this.align] ?? alignClasses.right,
          gapClasses[this.gap] ?? gapClasses.md,
        )}
      >
        <slot></slot>
      </div>
    `
  }
}

/* -------------------------------------------------------------------------- */
/*                                UipFormStatus                               */
/* -------------------------------------------------------------------------- */

const statusContainer = {
  error: 'bg-destructive/10 text-destructive border-destructive/20',
  warning: 'bg-warning/10 text-warning border-warning/30',
  success: 'bg-success/10 text-success border-success/30',
} as const

export class UipFormStatus extends LitElement {
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    status: { reflect: true },
    message: {},
  }

  status: 'error' | 'warning' | 'success' = 'error'
  message = ''

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'form-status')
  }

  render() {
    const isError = this.status === 'error'
    const isWarning = this.status === 'warning'

    return html`
      <div
        part="base"
        role=${isError ? 'alert' : 'status'}
        class=${cn(
          'flex items-center gap-2 rounded-md border px-3 py-2 text-sm',
          statusContainer[this.status] ?? statusContainer.error,
        )}
      >
        ${isError
          ? icon(CircleAlert, 'circle-alert', 'size-4 shrink-0')
          : isWarning
            ? icon(TriangleAlert, 'triangle-alert', 'size-4 shrink-0')
            : icon(CircleCheck, 'circle-check', 'size-4 shrink-0')}
        <span>${this.message}</span>
        <slot></slot>
      </div>
    `
  }
}

/* -------------------------------------------------------------------------- */
/*                                Registration                                */
/* -------------------------------------------------------------------------- */

customElements.get('uip-form') || customElements.define('uip-form', UipForm)
customElements.get('uip-form-item') || customElements.define('uip-form-item', UipFormItem)
customElements.get('uip-form-label') || customElements.define('uip-form-label', UipFormLabel)
customElements.get('uip-form-description') || customElements.define('uip-form-description', UipFormDescription)
customElements.get('uip-form-message') || customElements.define('uip-form-message', UipFormMessage)
customElements.get('uip-form-section') || customElements.define('uip-form-section', UipFormSection)
customElements.get('uip-form-actions') || customElements.define('uip-form-actions', UipFormActions)
customElements.get('uip-form-status') || customElements.define('uip-form-status', UipFormStatus)

declare global {
  interface HTMLElementTagNameMap {
    'uip-form': UipForm
    'uip-form-item': UipFormItem
    'uip-form-label': UipFormLabel
    'uip-form-description': UipFormDescription
    'uip-form-message': UipFormMessage
    'uip-form-section': UipFormSection
    'uip-form-actions': UipFormActions
    'uip-form-status': UipFormStatus
  }
}

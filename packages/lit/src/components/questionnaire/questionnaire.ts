import { LitElement, css, html, nothing } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { questionnaireChoiceVariants, questionnaireInputVariants } from './questionnaire.variants'

export type QuestionnaireValue = string | string[]
export type QuestionnaireAnswers = Record<string, QuestionnaireValue | undefined>

export interface QuestionnaireChoiceDef {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

export interface QuestionnaireItemDef {
  name: string
  prompt: string
  description?: string
  required?: boolean
  multiple?: boolean
  choices?: QuestionnaireChoiceDef[]
  input?: { label?: string; placeholder?: string }
}

export type QuestionnaireShortcuts = 'letters' | 'numbers' | false

const objectConverter = {
  fromAttribute: (v: string | null) => {
    if (!v) return undefined
    try {
      return JSON.parse(v)
    } catch {
      return undefined
    }
  },
  toAttribute: (v: unknown) => (v ? JSON.stringify(v) : null),
}

const trueUnlessFalse = {
  fromAttribute: (v: string | null) => v !== 'false',
}

/**
 * <uip-questionnaire> — the registry Questionnaire as a web component.
 *
 * Form-associated: submits answered fields with its <form>.
 */
export class UipQuestionnaire extends LitElement {
  static formAssociated = true
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true }
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    items: { converter: objectConverter },
    shortcuts: {},
    showProgress: { converter: trueUnlessFalse, attribute: 'show-progress' },
    requiredMessage: { attribute: 'required-message' },
    value: { reflect: true },
    defaultValue: { attribute: 'default-value' },
    answers: { converter: objectConverter },
    defaultAnswers: { attribute: 'default-answers', converter: objectConverter },
    showError: { state: true },
  }

  items: QuestionnaireItemDef[] = []
  shortcuts: QuestionnaireShortcuts | string = false
  showProgress = true
  requiredMessage = 'Choose an answer to continue.'
  value?: string
  defaultValue?: string
  answers?: QuestionnaireAnswers
  defaultAnswers?: QuestionnaireAnswers

  private showError = false
  private internalValue?: string
  private internalAnswers: QuestionnaireAnswers = {}
  private internals = this.attachInternals()

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'questionnaire')
    if (this.defaultAnswers) {
      this.internalAnswers = { ...this.defaultAnswers }
    }
    if (this.defaultValue) {
      this.internalValue = this.defaultValue
    }
    this.syncFormValue()
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if (changed.has('answers') || changed.has('items')) {
      this.syncFormValue()
    }
  }

  private syncFormValue() {
    const currentAnswers = this.currentAnswers
    const fd = new FormData()
    for (const [k, v] of Object.entries(currentAnswers)) {
      if (Array.isArray(v)) {
        v.forEach((val) => fd.append(`${k}[]`, val))
      } else if (v !== undefined) {
        fd.append(k, String(v))
      }
    }
    this.internals.setFormValue(fd)
  }

  formResetCallback() {
    this.internalAnswers = this.defaultAnswers ? { ...this.defaultAnswers } : {}
    this.internalValue = this.defaultValue
    this.showError = false
    this.requestUpdate()
    this.syncFormValue()
  }

  private get currentAnswers(): QuestionnaireAnswers {
    return this.answers ?? this.internalAnswers
  }

  private get names(): string[] {
    return this.items.map((i) => i.name)
  }

  private get currentName(): string | undefined {
    return this.value ?? this.internalValue ?? this.names[0]
  }

  private get activeIndex(): number {
    return Math.max(0, this.names.indexOf(this.currentName ?? ''))
  }

  private get current(): QuestionnaireItemDef | undefined {
    return this.items[this.activeIndex]
  }

  private get isFirst(): boolean {
    return this.activeIndex <= 0
  }

  private get isLast(): boolean {
    return this.names.length === 0 || this.activeIndex >= this.names.length - 1
  }

  private setActive(name: string) {
    this.value = name
    this.internalValue = name
    this.showError = false
    this.dispatchEvent(new CustomEvent('value-change', { detail: { value: name }, bubbles: true, composed: true }))
  }

  private writeAnswers(next: QuestionnaireAnswers) {
    this.internalAnswers = next
    this.syncFormValue()
    this.dispatchEvent(new CustomEvent('answers-change', { detail: { answers: next }, bubbles: true, composed: true }))
    this.requestUpdate()
  }

  private isAnswered(name: string): boolean {
    const v = this.currentAnswers[name]
    if (Array.isArray(v)) return v.length > 0
    return typeof v === 'string' && v.trim().length > 0
  }

  private setAnswer(name: string, next: QuestionnaireValue | undefined) {
    this.writeAnswers({ ...this.currentAnswers, [name]: next })
    this.showError = false
  }

  private toggleChoice(name: string, choice: string, multiple?: boolean) {
    if (multiple) {
      const cur = Array.isArray(this.currentAnswers[name]) ? [...(this.currentAnswers[name] as string[])] : []
      this.setAnswer(name, cur.includes(choice) ? cur.filter((v) => v !== choice) : [...cur, choice])
      return
    }
    this.setAnswer(name, choice)
  }

  private shortcutFor(index: number): string | undefined {
    const s = this.shortcuts
    if (!s || s === 'false') return undefined
    if (s === 'letters' && index < 26) return String.fromCharCode(65 + index)
    if (s === 'numbers' && index < 9) return String(index + 1)
    return undefined
  }

  private choiceChecked(name: string, choice: string): boolean {
    const v = this.currentAnswers[name]
    if (Array.isArray(v)) return v.includes(choice)
    return v === choice
  }

  private goTo(index: number) {
    const name = this.names[index]
    if (name) this.setActive(name)
  }

  private goNext(): boolean {
    if (!this.current) return false
    if (this.current.required && !this.isAnswered(this.current.name)) {
      this.showError = true
      return false
    }
    this.showError = false
    if (this.isLast) {
      this.dispatchEvent(new CustomEvent('submit', { detail: { answers: this.currentAnswers }, bubbles: true, composed: true }))
      return true
    }
    this.goTo(this.activeIndex + 1)
    return true
  }

  private skip() {
    if (!this.current || this.current.required) return
    this.showError = false
    if (this.isLast) {
      this.dispatchEvent(new CustomEvent('submit', { detail: { answers: this.currentAnswers }, bubbles: true, composed: true }))
    } else {
      this.goTo(this.activeIndex + 1)
    }
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (e.defaultPrevented) return
    const target = e.target as HTMLElement
    const inField = target.closest('input, textarea, select')
    if (inField) {
      if (e.key === 'Enter' && target.tagName === 'INPUT') {
        e.preventDefault()
        this.goNext()
      }
      return
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      this.goNext()
      return
    }
    if (!this.shortcuts || this.shortcuts === 'false' || e.metaKey || e.ctrlKey || e.altKey || !this.current) return
    const values = this.current.choices?.map((c) => c.value) ?? []
    let idx = -1
    if (this.shortcuts === 'letters') idx = e.key.toLowerCase().charCodeAt(0) - 97
    if (this.shortcuts === 'numbers') idx = Number(e.key) - 1
    if (idx < 0 || idx >= values.length) return
    e.preventDefault()
    this.toggleChoice(this.current.name, values[idx]!, this.current.multiple)
  }

  render() {
    const current = this.current
    const names = this.names
    const answers = this.currentAnswers
    const progress = { current: names.length ? this.activeIndex + 1 : 0, total: Math.max(names.length, 1) }

    return html`
      <form
        part="base"
        data-uipkge=""
        data-slot="questionnaire"
        class="flex w-full max-w-lg flex-col gap-4"
        @submit=${(e: Event) => {
          e.preventDefault()
          this.goNext()
        }}
        @keydown=${this.handleKeyDown}
      >
        ${this.showProgress
          ? html`
              <div
                data-slot="questionnaire-progress"
                role="progressbar"
                aria-valuemin="1"
                aria-valuenow=${progress.current}
                aria-valuemax=${progress.total}
                aria-label=${`Question ${progress.current} of ${progress.total}`}
                class="flex flex-col gap-2"
              >
                <div class="bg-muted h-1 w-full overflow-hidden rounded-full">
                  <div
                    class="bg-primary h-full rounded-full transition-[width] duration-200"
                    style=${styleMap({ width: `${(progress.current / progress.total) * 100}%` })}
                  ></div>
                </div>
                <p class="text-muted-foreground text-xs">
                  Question ${progress.current} of ${progress.total}
                </p>
              </div>
            `
          : nothing}

        ${current
          ? html`
              <fieldset data-slot="questionnaire-item" name=${current.name} class="flex min-w-0 flex-col gap-3">
                <legend data-slot="questionnaire-title" class="text-foreground text-base font-medium">
                  ${current.prompt}
                </legend>
                ${current.description
                  ? html`<p data-slot="questionnaire-description" class="text-muted-foreground text-sm">
                      ${current.description}
                    </p>`
                  : nothing}
                ${current.choices?.length
                  ? html`
                      <div data-slot="questionnaire-choices" role="group" class="flex flex-col gap-2">
                        ${current.choices.map((choice, index) => {
                          const checked = this.choiceChecked(current.name, choice.value)
                          return html`
                            <label
                              data-slot="questionnaire-choice"
                              ?data-checked=${checked}
                              class=${cn(
                                questionnaireChoiceVariants(),
                                choice.disabled && 'pointer-events-none opacity-50',
                              )}
                            >
                              <input
                                class="sr-only"
                                type=${current.multiple ? 'checkbox' : 'radio'}
                                name=${current.name}
                                value=${choice.value}
                                .checked=${checked}
                                ?disabled=${choice.disabled}
                                @change=${() => this.toggleChoice(current.name, choice.value, current.multiple)}
                              />
                              <span class="flex min-w-0 flex-1 flex-col">
                                <span class="font-medium">${choice.label}</span>
                                ${choice.description
                                  ? html`<span class="text-muted-foreground text-xs">${choice.description}</span>`
                                  : nothing}
                              </span>
                              ${this.shortcutFor(index)
                                ? html`
                                    <kbd
                                      data-slot="questionnaire-choice-shortcut"
                                      class="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground"
                                    >
                                      ${this.shortcutFor(index)}
                                    </kbd>
                                  `
                                : nothing}
                            </label>
                          `
                        })}
                      </div>
                    `
                  : nothing}
                ${current.input
                  ? html`
                      <input
                        data-slot="questionnaire-input"
                        type="text"
                        name=${current.name}
                        placeholder=${current.input.placeholder ?? nothing}
                        .value=${typeof answers[current.name] === 'string' ? (answers[current.name] as string) : ''}
                        class=${cn(questionnaireInputVariants())}
                        @input=${(e: Event) => this.setAnswer(current.name, (e.target as HTMLInputElement).value)}
                      />
                    `
                  : nothing}
                ${this.showError && current.required && !this.isAnswered(current.name)
                  ? html`
                      <p data-slot="questionnaire-error" role="alert" class="text-destructive text-sm">
                        ${this.requiredMessage}
                      </p>
                    `
                  : nothing}
              </fieldset>
            `
          : nothing}

        <div data-slot="questionnaire-actions" class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            data-slot="questionnaire-previous"
            class="border-border bg-background hover:bg-accent inline-flex h-9 items-center rounded-md border px-4 text-sm font-medium disabled:opacity-50"
            ?disabled=${this.isFirst}
            @click=${() => {
              if (!this.isFirst) this.goTo(this.activeIndex - 1)
            }}
          >
            Previous
          </button>
          ${current && !current.required
            ? html`
                <button
                  type="button"
                  data-slot="questionnaire-skip"
                  class="hover:bg-accent inline-flex h-9 items-center rounded-md px-4 text-sm font-medium"
                  @click=${this.skip}
                >
                  Skip
                </button>
              `
            : nothing}
          ${!this.isLast
            ? html`
                <button
                  type="button"
                  data-slot="questionnaire-next"
                  class="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 items-center rounded-md px-4 text-sm font-medium"
                  @click=${this.goNext}
                >
                  Next
                </button>
              `
            : html`
                <button
                  type="submit"
                  data-slot="questionnaire-submit"
                  class="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 items-center rounded-md px-4 text-sm font-medium"
                >
                  Submit
                </button>
              `}
        </div>
      </form>
    `
  }
}

customElements.get('uip-questionnaire') || customElements.define('uip-questionnaire', UipQuestionnaire)

declare global {
  interface HTMLElementTagNameMap {
    'uip-questionnaire': UipQuestionnaire
  }
}

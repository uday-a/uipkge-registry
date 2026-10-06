import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core'
import { cn } from '@/lib/utils'
import { questionnaireChoiceVariants, questionnaireInputVariants } from './questionnaire.variants'
import type { QuestionnaireAnswers, QuestionnaireItemDef, QuestionnaireShortcuts, QuestionnaireValue } from './types'

/**
 * Angular port of UIPKGE Questionnaire. Single multi-step question
 * component: items, shortcuts, showProgress — variants are inputs, not
 * extra files. Step state (active/answers/error) mirrors the Vue source.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-questionnaire, [ui-questionnaire]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"questionnaire"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
    '(keydown)': 'onKeydown($event)',
  },
  template: `
    <form class="contents" (submit)="onFormSubmit($event)">
      @if (showProgress) {
        <div
          data-uipkge
          data-slot="questionnaire-progress"
          role="progressbar"
          [attr.aria-valuemin]="1"
          [attr.aria-valuenow]="progress.current"
          [attr.aria-valuemax]="progress.total"
          [attr.aria-label]="'Question ' + progress.current + ' of ' + progress.total"
          class="flex flex-col gap-2"
        >
          <div class="bg-muted h-1 w-full overflow-hidden rounded-full">
            <div
              class="bg-primary h-full rounded-full transition-[width] duration-200"
              [style.width.%]="progressPercent"
            ></div>
          </div>
          <p class="text-muted-foreground text-xs">Question {{ progress.current }} of {{ progress.total }}</p>
        </div>
      }

      @if (current) {
        <fieldset
          data-uipkge
          data-slot="questionnaire-item"
          [attr.name]="current.name"
          class="flex min-w-0 flex-col gap-3"
        >
          <legend data-uipkge data-slot="questionnaire-title" class="text-foreground text-base font-medium">
            {{ current.prompt }}
          </legend>
          @if (current.description) {
            <p data-uipkge data-slot="questionnaire-description" class="text-muted-foreground text-sm">
              {{ current.description }}
            </p>
          }
          @if (current.choices?.length) {
            <div data-uipkge data-slot="questionnaire-choices" role="group" class="flex flex-col gap-2">
              @for (choice of current.choices; track choice.value) {
                <label
                  data-uipkge
                  data-slot="questionnaire-choice"
                  [attr.data-checked]="choiceChecked(current.name, choice.value) ? '' : null"
                  [class]="getChoiceClass(choice)"
                >
                  <input
                    class="sr-only"
                    [type]="current.multiple ? 'checkbox' : 'radio'"
                    [name]="current.name"
                    [value]="choice.value"
                    [checked]="choiceChecked(current.name, choice.value)"
                    [disabled]="choice.disabled ?? false"
                    (change)="toggleChoice(current.name, choice.value, current.multiple)"
                  />
                  <span class="flex min-w-0 flex-1 flex-col">
                    <span class="font-medium">{{ choice.label }}</span>
                    @if (choice.description) {
                      <span class="text-muted-foreground text-xs">{{ choice.description }}</span>
                    }
                  </span>
                  @if (shortcutFor($index)) {
                    <kbd
                      data-uipkge
                      data-slot="questionnaire-choice-shortcut"
                      class="bg-muted text-muted-foreground pointer-events-none ml-auto inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none"
                    >
                      {{ shortcutFor($index) }}
                    </kbd>
                  }
                </label>
              }
            </div>
          }
          @if (current.input) {
            <input
              data-uipkge
              data-slot="questionnaire-input"
              type="text"
              [name]="current.name"
              [placeholder]="current.input.placeholder ?? ''"
              [value]="inputValue(current.name)"
              [class]="inputClass()"
              (input)="onInputChange(current.name, $event)"
            />
          }
          @if (showError && current.required && !isAnswered(current.name)) {
            <p data-uipkge data-slot="questionnaire-error" role="alert" class="text-destructive text-sm">
              {{ requiredMessage }}
            </p>
          }
        </fieldset>
      }

      <div data-uipkge data-slot="questionnaire-actions" class="flex flex-wrap items-center gap-2">
        <button
          type="button"
          data-uipkge
          data-slot="questionnaire-previous"
          class="border-border bg-background hover:bg-accent inline-flex h-9 items-center rounded-md border px-4 text-sm font-medium disabled:opacity-50"
          [disabled]="isFirst"
          (click)="goPrev()"
        >
          Previous
        </button>
        @if (current && !current.required) {
          <button
            type="button"
            data-uipkge
            data-slot="questionnaire-skip"
            class="hover:bg-accent inline-flex h-9 items-center rounded-md px-4 text-sm font-medium"
            (click)="skip()"
          >
            Skip
          </button>
        }
        @if (!isLast) {
          <button
            type="button"
            data-uipkge
            data-slot="questionnaire-next"
            class="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 items-center rounded-md px-4 text-sm font-medium"
            (click)="goNext()"
          >
            Next
          </button>
        } @else {
          <button
            type="button"
            data-uipkge
            data-slot="questionnaire-submit"
            class="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 items-center rounded-md px-4 text-sm font-medium"
            (click)="goNext()"
          >
            Submit
          </button>
        }
      </div>
    </form>
  `,
})
export class UiQuestionnaireComponent {
  @Input() items: QuestionnaireItemDef[] = []
  @Input() modelValue?: string
  @Output() modelValueChange = new EventEmitter<string>()
  @Input() answers: QuestionnaireAnswers = {}
  @Output() answersChange = new EventEmitter<QuestionnaireAnswers>()
  @Input() shortcuts: QuestionnaireShortcuts = false
  @Input() showProgress = true
  @Input() requiredMessage = 'Choose an answer to continue.'
  @Output() submit = new EventEmitter<QuestionnaireAnswers>()
  @Input('class') className?: string

  showError = false

  get names(): string[] {
    return this.items.map((i) => i.name)
  }

  get currentName(): string | undefined {
    return this.modelValue || this.names[0]
  }

  get activeIndex(): number {
    return Math.max(0, this.names.indexOf(this.currentName ?? ''))
  }

  get current(): QuestionnaireItemDef | undefined {
    return this.items[this.activeIndex]
  }

  get isFirst(): boolean {
    return this.activeIndex <= 0
  }

  get isLast(): boolean {
    return this.names.length === 0 || this.activeIndex >= this.names.length - 1
  }

  get progress(): { current: number; total: number } {
    return { current: this.names.length ? this.activeIndex + 1 : 0, total: Math.max(this.names.length, 1) }
  }

  get progressPercent(): number {
    return (this.progress.current / this.progress.total) * 100
  }

  get hostClass(): string {
    return cn('flex w-full max-w-lg flex-col gap-4', this.className)
  }

  choiceClass(): string {
    return questionnaireChoiceVariants()
  }

  getChoiceClass(choice: { disabled?: boolean }): string {
    return cn(this.choiceClass(), choice.disabled && 'pointer-events-none opacity-50')
  }

  inputClass(): string {
    return questionnaireInputVariants()
  }

  isAnswered(name: string): boolean {
    const v = this.answers[name]
    if (Array.isArray(v)) return v.length > 0
    return typeof v === 'string' && v.trim().length > 0
  }

  setAnswer(name: string, value: QuestionnaireValue | undefined): void {
    this.answers = { ...this.answers, [name]: value }
    this.answersChange.emit(this.answers)
    this.showError = false
  }

  toggleChoice(name: string, value: string, multiple?: boolean): void {
    if (multiple) {
      const currentVal = Array.isArray(this.answers[name]) ? [...(this.answers[name] as string[])] : []
      const next = currentVal.includes(value) ? currentVal.filter((v) => v !== value) : [...currentVal, value]
      this.setAnswer(name, next)
      return
    }
    this.setAnswer(name, value)
  }

  choiceChecked(name: string, value: string): boolean {
    const v = this.answers[name]
    if (Array.isArray(v)) return v.includes(value)
    return v === value
  }

  shortcutFor(index: number): string | undefined {
    if (!this.shortcuts) return undefined
    if (this.shortcuts === 'letters' && index < 26) return String.fromCharCode(65 + index)
    if (this.shortcuts === 'numbers' && index < 9) return String(index + 1)
    return undefined
  }

  goTo(index: number): void {
    const name = this.names[index]
    if (!name) return
    this.modelValue = name
    this.modelValueChange.emit(name)
    this.showError = false
  }

  goNext(): void {
    const cur = this.current
    if (cur?.required && !this.isAnswered(cur.name)) {
      this.showError = true
      return
    }
    if (this.isLast) {
      this.submit.emit(this.answers)
      return
    }
    this.goTo(this.activeIndex + 1)
  }

  goPrev(): void {
    this.goTo(this.activeIndex - 1)
  }

  // React/Vue render a <form> root; the host element can't be one, so the inner form
  // carries submit semantics. Enter keydown is preventDefaulted in onKeydown, so this
  // never double-advances.
  onFormSubmit(e: Event): void {
    e.preventDefault()
    this.goNext()
  }

  skip(): void {
    if (!this.current || this.current.required) return
    this.showError = false
    if (this.isLast) {
      this.submit.emit(this.answers)
      return
    }
    this.goTo(this.activeIndex + 1)
  }

  inputValue(name: string): string {
    const v = this.answers[name]
    return typeof v === 'string' ? v : ''
  }

  onInputChange(name: string, event: Event): void {
    const target = event.target as HTMLInputElement
    this.setAnswer(name, target.value)
  }

  onKeydown(e: KeyboardEvent): void {
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
    if (!this.shortcuts || e.metaKey || e.ctrlKey || e.altKey || !this.current) return
    const values = this.current.choices?.map((c) => c.value) ?? []
    let idx = -1
    if (this.shortcuts === 'letters') idx = e.key.toLowerCase().charCodeAt(0) - 97
    if (this.shortcuts === 'numbers') idx = Number(e.key) - 1
    if (idx < 0 || idx >= values.length) return
    e.preventDefault()
    this.toggleChoice(this.current.name, values[idx], this.current.multiple)
  }
}

export { questionnaireChoiceVariants, questionnaireInputVariants } from './questionnaire.variants'
export type { QuestionnaireAnswers, QuestionnaireItemDef, QuestionnaireShortcuts, QuestionnaireValue } from './types'

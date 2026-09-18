'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Kbd } from '@/components/ui/kbd'
import { questionnaireChoiceVariants, questionnaireInputVariants } from './questionnaire.variants'
import type { QuestionnaireAnswers, QuestionnaireItemDef, QuestionnaireShortcuts, QuestionnaireValue } from './types'

export interface QuestionnaireProps extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  items?: QuestionnaireItemDef[]
  shortcuts?: QuestionnaireShortcuts
  showProgress?: boolean
  requiredMessage?: string
  value?: string
  defaultValue?: string
  onValueChange?: (name: string) => void
  answers?: QuestionnaireAnswers
  defaultAnswers?: QuestionnaireAnswers
  onAnswersChange?: (answers: QuestionnaireAnswers) => void
  onSubmit?: (answers: QuestionnaireAnswers) => void
}

function Questionnaire({
  items = [],
  shortcuts = false,
  showProgress = true,
  requiredMessage = 'Choose an answer to continue.',
  value,
  defaultValue,
  onValueChange,
  answers: answersProp,
  defaultAnswers,
  onAnswersChange,
  onSubmit,
  className,
  ...props
}: QuestionnaireProps) {
  const [uncontrolledName, setUncontrolledName] = React.useState(defaultValue)
  const [uncontrolledAnswers, setUncontrolledAnswers] = React.useState<QuestionnaireAnswers>(defaultAnswers ?? {})
  const [showError, setShowError] = React.useState(false)

  const names = items.map((i) => i.name)
  const answers = answersProp ?? uncontrolledAnswers
  const currentName = value ?? uncontrolledName ?? names[0]
  const activeIndex = Math.max(0, names.indexOf(currentName ?? ''))
  const current = items[activeIndex]
  const isFirst = activeIndex <= 0
  const isLast = names.length === 0 || activeIndex >= names.length - 1
  const progress = { current: names.length ? activeIndex + 1 : 0, total: Math.max(names.length, 1) }

  const setActive = (name: string) => {
    onValueChange?.(name)
    if (value === undefined) setUncontrolledName(name)
    setShowError(false)
  }

  const writeAnswers = (next: QuestionnaireAnswers) => {
    onAnswersChange?.(next)
    if (answersProp === undefined) setUncontrolledAnswers(next)
  }

  const isAnswered = (name: string) => {
    const v = answers[name]
    if (Array.isArray(v)) return v.length > 0
    return typeof v === 'string' && v.trim().length > 0
  }

  const setAnswer = (name: string, next: QuestionnaireValue | undefined) => {
    writeAnswers({ ...answers, [name]: next })
    setShowError(false)
  }

  const toggleChoice = (name: string, choice: string, multiple?: boolean) => {
    if (multiple) {
      const cur = Array.isArray(answers[name]) ? [...(answers[name] as string[])] : []
      setAnswer(name, cur.includes(choice) ? cur.filter((v) => v !== choice) : [...cur, choice])
      return
    }
    setAnswer(name, choice)
  }

  const shortcutFor = (index: number) => {
    if (!shortcuts) return
    if (shortcuts === 'letters' && index < 26) return String.fromCharCode(65 + index)
    if (shortcuts === 'numbers' && index < 9) return String(index + 1)
  }

  const choiceChecked = (name: string, choice: string) => {
    const v = answers[name]
    if (Array.isArray(v)) return v.includes(choice)
    return v === choice
  }

  const goTo = (index: number) => {
    const name = names[index]
    if (name) setActive(name)
  }

  const goNext = () => {
    if (!current) return false
    if (current.required && !isAnswered(current.name)) {
      setShowError(true)
      return false
    }
    setShowError(false)
    if (isLast) {
      onSubmit?.(answers)
      return true
    }
    goTo(activeIndex + 1)
    return true
  }

  const skip = () => {
    if (!current || current.required) return
    setShowError(false)
    if (isLast) onSubmit?.(answers)
    else goTo(activeIndex + 1)
  }

  return (
    <form
      data-uipkge=""
      data-slot="questionnaire"
      className={cn('flex w-full max-w-lg flex-col gap-4', className)}
      onSubmit={(e) => {
        e.preventDefault()
        goNext()
      }}
      onKeyDown={(e) => {
        if (e.defaultPrevented) return
        const target = e.target as HTMLElement
        const inField = target.closest('input, textarea, select')
        if (inField) {
          if (e.key === 'Enter' && target.tagName === 'INPUT') {
            e.preventDefault()
            goNext()
          }
          return
        }
        if (e.key === 'Enter') {
          e.preventDefault()
          goNext()
          return
        }
        if (!shortcuts || e.metaKey || e.ctrlKey || e.altKey || !current) return
        const values = current.choices?.map((c) => c.value) ?? []
        let idx = -1
        if (shortcuts === 'letters') idx = e.key.toLowerCase().charCodeAt(0) - 97
        if (shortcuts === 'numbers') idx = Number(e.key) - 1
        if (idx < 0 || idx >= values.length) return
        e.preventDefault()
        toggleChoice(current.name, values[idx], current.multiple)
      }}
      {...props}
    >
      {showProgress ? (
        <div
          data-slot="questionnaire-progress"
          role="progressbar"
          aria-valuemin={1}
          aria-valuenow={progress.current}
          aria-valuemax={progress.total}
          aria-label={`Question ${progress.current} of ${progress.total}`}
          className="flex flex-col gap-2"
        >
          <div className="bg-muted h-1 w-full overflow-hidden rounded-full">
            <div
              className="bg-primary h-full rounded-full transition-[width] duration-200"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            />
          </div>
          <p className="text-muted-foreground text-xs">
            Question {progress.current} of {progress.total}
          </p>
        </div>
      ) : null}

      {current ? (
        <fieldset data-slot="questionnaire-item" name={current.name} className="flex min-w-0 flex-col gap-3">
          <legend data-slot="questionnaire-title" className="text-foreground text-base font-medium">
            {current.prompt}
          </legend>
          {current.description ? (
            <p data-slot="questionnaire-description" className="text-muted-foreground text-sm">
              {current.description}
            </p>
          ) : null}
          {current.choices?.length ? (
            <div data-slot="questionnaire-choices" role="group" className="flex flex-col gap-2">
              {current.choices.map((choice, index) => (
                <label
                  key={choice.value}
                  data-slot="questionnaire-choice"
                  data-checked={choiceChecked(current.name, choice.value) ? '' : undefined}
                  className={cn(questionnaireChoiceVariants(), choice.disabled && 'pointer-events-none opacity-50')}
                >
                  <input
                    className="sr-only"
                    type={current.multiple ? 'checkbox' : 'radio'}
                    name={current.name}
                    value={choice.value}
                    checked={choiceChecked(current.name, choice.value)}
                    disabled={choice.disabled}
                    onChange={() => toggleChoice(current.name, choice.value, current.multiple)}
                  />
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="font-medium">{choice.label}</span>
                    {choice.description ? (
                      <span className="text-muted-foreground text-xs">{choice.description}</span>
                    ) : null}
                  </span>
                  {shortcutFor(index) ? (
                    <Kbd data-slot="questionnaire-choice-shortcut" className="ml-auto">
                      {shortcutFor(index)}
                    </Kbd>
                  ) : null}
                </label>
              ))}
            </div>
          ) : null}
          {current.input ? (
            <input
              data-slot="questionnaire-input"
              type="text"
              name={current.name}
              placeholder={current.input.placeholder}
              value={typeof answers[current.name] === 'string' ? (answers[current.name] as string) : ''}
              className={cn(questionnaireInputVariants())}
              onChange={(e) => setAnswer(current.name, e.target.value)}
            />
          ) : null}
          {showError && current.required && !isAnswered(current.name) ? (
            <p data-slot="questionnaire-error" role="alert" className="text-destructive text-sm">
              {requiredMessage}
            </p>
          ) : null}
        </fieldset>
      ) : null}

      <div data-slot="questionnaire-actions" className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          data-slot="questionnaire-previous"
          className="border-border bg-background hover:bg-accent inline-flex h-9 items-center rounded-md border px-4 text-sm font-medium disabled:opacity-50"
          disabled={isFirst}
          onClick={() => {
            if (!isFirst) goTo(activeIndex - 1)
          }}
        >
          Previous
        </button>
        {current && !current.required ? (
          <button
            type="button"
            data-slot="questionnaire-skip"
            className="hover:bg-accent inline-flex h-9 items-center rounded-md px-4 text-sm font-medium"
            onClick={skip}
          >
            Skip
          </button>
        ) : null}
        {!isLast ? (
          <button
            type="button"
            data-slot="questionnaire-next"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 items-center rounded-md px-4 text-sm font-medium"
            onClick={goNext}
          >
            Next
          </button>
        ) : (
          <button
            type="submit"
            data-slot="questionnaire-submit"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 items-center rounded-md px-4 text-sm font-medium"
          >
            Submit
          </button>
        )}
      </div>
    </form>
  )
}

export { Questionnaire }

<script lang="ts" module>
  import type { HTMLFormAttributes } from 'svelte/elements'
  import type {
    QuestionnaireAnswers,
    QuestionnaireItemDef,
    QuestionnaireShortcuts,
    QuestionnaireValue,
  } from './types'

  export interface QuestionnaireProps extends HTMLFormAttributes {
    items?: QuestionnaireItemDef[]
    shortcuts?: QuestionnaireShortcuts
    showProgress?: boolean
    requiredMessage?: string
    /** Controlled active question name (`bind:value`). Omit for uncontrolled. */
    value?: string
    /** Fires with the next active question name on navigation. */
    onValueChange?: (name: string) => void
    /** Controlled answers map (`bind:answers`). */
    answers?: QuestionnaireAnswers
    /** Fires with the next answers map on every answer. */
    onAnswersChange?: (answers: QuestionnaireAnswers) => void
    /** Fired with the answers map when the last question submits. */
    onSubmit?: (answers: QuestionnaireAnswers) => void
    ref?: HTMLFormElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { Kbd } from '$lib/components/ui/kbd'
  import { questionnaireChoiceVariants, questionnaireInputVariants } from './questionnaire.variants'

  let {
    class: className,
    items = [],
    shortcuts = false,
    showProgress = true,
    requiredMessage = 'Choose an answer to continue.',
    value = $bindable<string | undefined>(undefined),
    onValueChange,
    answers = $bindable<QuestionnaireAnswers>({}),
    onAnswersChange,
    onSubmit,
    ref = $bindable(null),
    ...restProps
  }: QuestionnaireProps = $props()

  let showError = $state(false)

  const names = $derived(items.map((i) => i.name))
  const currentName = $derived(value || names[0])
  const activeIndex = $derived(Math.max(0, names.indexOf(currentName ?? '')))
  const current = $derived(items[activeIndex])
  const isFirst = $derived(activeIndex <= 0)
  const isLast = $derived(names.length === 0 || activeIndex >= names.length - 1)
  const progress = $derived({
    current: names.length ? activeIndex + 1 : 0,
    total: Math.max(names.length, 1),
  })

  function isAnswered(name: string) {
    const v = answers[name]
    if (Array.isArray(v)) return v.length > 0
    return typeof v === 'string' && v.trim().length > 0
  }

  function setAnswer(name: string, answer: QuestionnaireValue | undefined) {
    const next = { ...answers, [name]: answer }
    answers = next
    onAnswersChange?.(next)
    showError = false
  }

  function toggleChoice(name: string, choice: string, multiple?: boolean) {
    if (multiple) {
      const currentVal = Array.isArray(answers[name]) ? [...(answers[name] as string[])] : []
      const next = currentVal.includes(choice) ? currentVal.filter((v) => v !== choice) : [...currentVal, choice]
      setAnswer(name, next)
      return
    }
    setAnswer(name, choice)
  }

  function shortcutFor(index: number) {
    if (!shortcuts) return
    if (shortcuts === 'letters' && index < 26) return String.fromCharCode(65 + index)
    if (shortcuts === 'numbers' && index < 9) return String(index + 1)
  }

  function choiceChecked(name: string, choice: string) {
    const v = answers[name]
    if (Array.isArray(v)) return v.includes(choice)
    return v === choice
  }

  function goTo(index: number) {
    const name = names[index]
    if (!name) return
    value = name
    onValueChange?.(name)
    showError = false
  }

  function goPrev() {
    if (!isFirst) goTo(activeIndex - 1)
  }

  function goNext() {
    const item = current
    if (!item) return false
    if (item.required && !isAnswered(item.name)) {
      showError = true
      return false
    }
    showError = false
    if (isLast) {
      onSubmit?.({ ...answers })
      return true
    }
    goTo(activeIndex + 1)
    return true
  }

  function skip() {
    const item = current
    if (!item || item.required) return
    showError = false
    if (isLast) onSubmit?.({ ...answers })
    else goTo(activeIndex + 1)
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.defaultPrevented) return
    const target = e.target as HTMLElement | null
    const inField = target?.closest('input, textarea, select')
    if (inField) {
      if (e.key === 'Enter' && target?.tagName === 'INPUT') {
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
    if (!shortcuts || e.metaKey || e.ctrlKey || e.altKey) return
    const item = current
    const values = item?.choices?.map((c) => c.value) ?? []
    let idx = -1
    if (shortcuts === 'letters') idx = e.key.toLowerCase().charCodeAt(0) - 97
    if (shortcuts === 'numbers') idx = Number(e.key) - 1
    if (idx < 0 || idx >= values.length) return
    e.preventDefault()
    toggleChoice(item!.name, values[idx]!, item!.multiple)
  }

  function onFreeform(e: Event) {
    const item = current
    if (!item) return
    setAnswer(item.name, (e.target as HTMLInputElement).value)
  }
</script>

<form
  {...restProps}
  bind:this={ref}
  data-uipkge=""
  data-slot="questionnaire"
  class={cn('flex w-full max-w-lg flex-col gap-4', className)}
  onsubmit={(e) => {
    e.preventDefault()
    goNext()
  }}
  onkeydown={onKeydown}
>
  {#if showProgress}
    <div
      data-slot="questionnaire-progress"
      role="progressbar"
      aria-valuemin={1}
      aria-valuenow={progress.current}
      aria-valuemax={progress.total}
      aria-label={`Question ${progress.current} of ${progress.total}`}
      class="flex flex-col gap-2"
    >
      <div class="bg-muted h-1 w-full overflow-hidden rounded-full">
        <div
          class="bg-primary h-full rounded-full transition-[width] duration-200"
          style:width={`${(progress.current / progress.total) * 100}%`}
        ></div>
      </div>
      <p class="text-muted-foreground text-xs">Question {progress.current} of {progress.total}</p>
    </div>
  {/if}

  {#if current}
    <fieldset data-slot="questionnaire-item" name={current.name} class="flex min-w-0 flex-col gap-3">
      <legend data-slot="questionnaire-title" class="text-foreground text-base font-medium">
        {current.prompt}
      </legend>
      {#if current.description}
        <p data-slot="questionnaire-description" class="text-muted-foreground text-sm">
          {current.description}
        </p>
      {/if}
      {#if current.choices?.length}
        <div data-slot="questionnaire-choices" role="group" class="flex flex-col gap-2">
          {#each current.choices as choice, index (choice.value)}
            <label
              data-slot="questionnaire-choice"
              data-checked={choiceChecked(current.name, choice.value) ? '' : undefined}
              class={cn(questionnaireChoiceVariants(), choice.disabled && 'pointer-events-none opacity-50')}
            >
              <input
                class="sr-only"
                type={current.multiple ? 'checkbox' : 'radio'}
                name={current.name}
                value={choice.value}
                checked={choiceChecked(current.name, choice.value)}
                disabled={choice.disabled}
                onchange={() => toggleChoice(current!.name, choice.value, current!.multiple)}
              />
              <span class="flex min-w-0 flex-1 flex-col">
                <span class="font-medium">{choice.label}</span>
                {#if choice.description}
                  <span class="text-muted-foreground text-xs">{choice.description}</span>
                {/if}
              </span>
              {#if shortcutFor(index)}
                <Kbd data-slot="questionnaire-choice-shortcut" class="ml-auto">{shortcutFor(index)}</Kbd>
              {/if}
            </label>
          {/each}
        </div>
      {/if}
      {#if current.input}
        <input
          data-slot="questionnaire-input"
          type="text"
          name={current.name}
          placeholder={current.input.placeholder}
          value={typeof answers[current.name] === 'string' ? answers[current.name] : ''}
          class={cn(questionnaireInputVariants())}
          oninput={onFreeform}
        />
      {/if}
      {#if showError && current.required && !isAnswered(current.name)}
        <p data-slot="questionnaire-error" role="alert" class="text-destructive text-sm">
          {requiredMessage}
        </p>
      {/if}
    </fieldset>
  {/if}

  <div data-slot="questionnaire-actions" class="flex flex-wrap items-center gap-2">
    <button
      type="button"
      data-slot="questionnaire-previous"
      class="border-border bg-background hover:bg-accent inline-flex h-9 items-center rounded-md border px-4 text-sm font-medium disabled:opacity-50"
      disabled={isFirst}
      onclick={goPrev}
    >
      Previous
    </button>
    {#if current && !current.required}
      <button
        type="button"
        data-slot="questionnaire-skip"
        class="hover:bg-accent inline-flex h-9 items-center rounded-md px-4 text-sm font-medium"
        onclick={skip}
      >
        Skip
      </button>
    {/if}
    {#if !isLast}
      <button
        type="button"
        data-slot="questionnaire-next"
        class="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 items-center rounded-md px-4 text-sm font-medium"
        onclick={goNext}
      >
        Next
      </button>
    {:else}
      <button
        type="submit"
        data-slot="questionnaire-submit"
        class="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 items-center rounded-md px-4 text-sm font-medium"
      >
        Submit
      </button>
    {/if}
  </div>
</form>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { Kbd } from '@/components/ui/kbd'
import { questionnaireChoiceVariants, questionnaireInputVariants } from './questionnaire.variants'
import type { QuestionnaireAnswers, QuestionnaireItemDef, QuestionnaireShortcuts, QuestionnaireValue } from './types'

const props = withDefaults(
  defineProps<{
    items?: QuestionnaireItemDef[]
    shortcuts?: QuestionnaireShortcuts
    showProgress?: boolean
    requiredMessage?: string
    class?: HTMLAttributes['class']
  }>(),
  {
    items: () => [],
    shortcuts: false,
    showProgress: true,
    requiredMessage: 'Choose an answer to continue.',
  },
)

const emit = defineEmits<{
  submit: [answers: QuestionnaireAnswers]
}>()

const activeName = defineModel<string>('modelValue')
const answers = defineModel<QuestionnaireAnswers>('answers', { default: () => ({}) })
const showError = ref(false)

const names = computed(() => props.items.map((i) => i.name))
const currentName = computed(() => activeName.value || names.value[0])
const activeIndex = computed(() => Math.max(0, names.value.indexOf(currentName.value ?? '')))
const current = computed(() => props.items[activeIndex.value])
const isFirst = computed(() => activeIndex.value <= 0)
const isLast = computed(() => names.value.length === 0 || activeIndex.value >= names.value.length - 1)
const progress = computed(() => ({
  current: names.value.length ? activeIndex.value + 1 : 0,
  total: Math.max(names.value.length, 1),
}))

function isAnswered(name: string) {
  const v = answers.value[name]
  if (Array.isArray(v)) return v.length > 0
  return typeof v === 'string' && v.trim().length > 0
}

function setAnswer(name: string, value: QuestionnaireValue | undefined) {
  answers.value = { ...answers.value, [name]: value }
  showError.value = false
}

function toggleChoice(name: string, value: string, multiple?: boolean) {
  if (multiple) {
    const currentVal = Array.isArray(answers.value[name]) ? [...(answers.value[name] as string[])] : []
    const next = currentVal.includes(value) ? currentVal.filter((v) => v !== value) : [...currentVal, value]
    setAnswer(name, next)
    return
  }
  setAnswer(name, value)
}

function shortcutFor(index: number) {
  if (!props.shortcuts) return
  if (props.shortcuts === 'letters' && index < 26) return String.fromCharCode(65 + index)
  if (props.shortcuts === 'numbers' && index < 9) return String(index + 1)
}

function choiceChecked(name: string, value: string) {
  const v = answers.value[name]
  if (Array.isArray(v)) return v.includes(value)
  return v === value
}

function goTo(index: number) {
  const name = names.value[index]
  if (!name) return
  activeName.value = name
  showError.value = false
}

function goPrev() {
  if (!isFirst.value) goTo(activeIndex.value - 1)
}

function goNext() {
  const item = current.value
  if (!item) return false
  if (item.required && !isAnswered(item.name)) {
    showError.value = true
    return false
  }
  showError.value = false
  if (isLast.value) {
    emit('submit', { ...answers.value })
    return true
  }
  goTo(activeIndex.value + 1)
  return true
}

function skip() {
  const item = current.value
  if (!item || item.required) return
  showError.value = false
  if (isLast.value) emit('submit', { ...answers.value })
  else goTo(activeIndex.value + 1)
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
  if (!props.shortcuts || e.metaKey || e.ctrlKey || e.altKey) return
  const item = current.value
  const values = item?.choices?.map((c) => c.value) ?? []
  let idx = -1
  if (props.shortcuts === 'letters') idx = e.key.toLowerCase().charCodeAt(0) - 97
  if (props.shortcuts === 'numbers') idx = Number(e.key) - 1
  if (idx < 0 || idx >= values.length) return
  e.preventDefault()
  toggleChoice(item.name, values[idx], item.multiple)
}

function onFreeform(e: Event) {
  const item = current.value
  if (!item) return
  setAnswer(item.name, (e.target as HTMLInputElement).value)
}
</script>

<template>
  <form
    data-uipkge
    data-slot="questionnaire"
    :class="cn('flex w-full max-w-lg flex-col gap-4', props.class)"
    @submit.prevent="goNext"
    @keydown="onKeydown"
  >
    <div
      v-if="showProgress"
      data-slot="questionnaire-progress"
      role="progressbar"
      :aria-valuemin="1"
      :aria-valuenow="progress.current"
      :aria-valuemax="progress.total"
      :aria-label="`Question ${progress.current} of ${progress.total}`"
      class="flex flex-col gap-2"
    >
      <div class="bg-muted h-1 w-full overflow-hidden rounded-full">
        <div
          class="bg-primary h-full rounded-full transition-[width] duration-200"
          :style="{ width: `${(progress.current / progress.total) * 100}%` }"
        />
      </div>
      <p class="text-muted-foreground text-xs">Question {{ progress.current }} of {{ progress.total }}</p>
    </div>

    <fieldset v-if="current" data-slot="questionnaire-item" :name="current.name" class="flex min-w-0 flex-col gap-3">
      <legend data-slot="questionnaire-title" class="text-foreground text-base font-medium">
        {{ current.prompt }}
      </legend>
      <p v-if="current.description" data-slot="questionnaire-description" class="text-muted-foreground text-sm">
        {{ current.description }}
      </p>
      <div v-if="current.choices?.length" data-slot="questionnaire-choices" role="group" class="flex flex-col gap-2">
        <label
          v-for="(choice, index) in current.choices"
          :key="choice.value"
          data-slot="questionnaire-choice"
          :data-checked="choiceChecked(current.name, choice.value) ? '' : undefined"
          :class="cn(questionnaireChoiceVariants(), choice.disabled && 'pointer-events-none opacity-50')"
        >
          <input
            class="sr-only"
            :type="current.multiple ? 'checkbox' : 'radio'"
            :name="current.name"
            :value="choice.value"
            :checked="choiceChecked(current.name, choice.value)"
            :disabled="choice.disabled"
            @change="toggleChoice(current.name, choice.value, current.multiple)"
          />
          <span class="flex min-w-0 flex-1 flex-col">
            <span class="font-medium">{{ choice.label }}</span>
            <span v-if="choice.description" class="text-muted-foreground text-xs">{{ choice.description }}</span>
          </span>
          <Kbd v-if="shortcutFor(index)" data-slot="questionnaire-choice-shortcut" class="ml-auto">{{
            shortcutFor(index)
          }}</Kbd>
        </label>
      </div>
      <input
        v-if="current.input"
        data-slot="questionnaire-input"
        type="text"
        :name="current.name"
        :placeholder="current.input.placeholder"
        :value="typeof answers[current.name] === 'string' ? answers[current.name] : ''"
        :class="cn(questionnaireInputVariants())"
        @input="onFreeform"
      />
      <p
        v-if="showError && current.required && !isAnswered(current.name)"
        data-slot="questionnaire-error"
        role="alert"
        class="text-destructive text-sm"
      >
        {{ requiredMessage }}
      </p>
    </fieldset>

    <div data-slot="questionnaire-actions" class="flex flex-wrap items-center gap-2">
      <button
        type="button"
        data-slot="questionnaire-previous"
        class="border-border bg-background hover:bg-accent inline-flex h-9 items-center rounded-md border px-4 text-sm font-medium disabled:opacity-50"
        :disabled="isFirst"
        @click="goPrev"
      >
        Previous
      </button>
      <button
        v-if="current && !current.required"
        type="button"
        data-slot="questionnaire-skip"
        class="hover:bg-accent inline-flex h-9 items-center rounded-md px-4 text-sm font-medium"
        @click="skip"
      >
        Skip
      </button>
      <button
        v-if="!isLast"
        type="button"
        data-slot="questionnaire-next"
        class="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 items-center rounded-md px-4 text-sm font-medium"
        @click="goNext"
      >
        Next
      </button>
      <button
        v-else
        type="submit"
        data-slot="questionnaire-submit"
        class="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 items-center rounded-md px-4 text-sm font-medium"
      >
        Submit
      </button>
    </div>
  </form>
</template>

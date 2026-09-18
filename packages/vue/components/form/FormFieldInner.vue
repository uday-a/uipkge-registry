<script lang="ts" setup>
import { computed, onUnmounted, provide, shallowRef, watch } from 'vue'
import { FORM_FIELD_INJECTION_KEY } from './injectionKeys'

interface FieldMeta {
  errors: Array<unknown>
  errorMap?: Record<string, Array<unknown> | undefined>
  isDirty: boolean
  isTouched: boolean
  isValid: boolean
}

interface FieldApi {
  name: string
  state: {
    value: unknown
    meta: FieldMeta
  }
  store: {
    subscribe: (cb: () => void) => (() => void) | { unsubscribe: () => void }
  }
  handleChange: (v: unknown) => void
  handleBlur: () => void
}

const props = defineProps<{ field: FieldApi }>()

const snapshot = shallowRef({ value: props.field.state.value, meta: props.field.state.meta })
let unsubscribe: (() => void) | null = null

function refreshSnapshot() {
  snapshot.value = { value: props.field.state.value, meta: props.field.state.meta }
}

function subscribe(field: FieldApi) {
  unsubscribe?.()
  const subscription = field.store.subscribe(refreshSnapshot)
  // TanStack Store supports both legacy callbacks and subscription objects.
  unsubscribe = typeof subscription === 'function' ? subscription : () => subscription.unsubscribe()
  refreshSnapshot()
}

subscribe(props.field)
watch(
  () => props.field,
  (next) => subscribe(next),
)
onUnmounted(() => unsubscribe?.())

function formatError(raw: unknown): string {
  if (typeof raw === 'string') return raw
  if (raw && typeof raw === 'object' && 'message' in raw) {
    return String((raw as { message: unknown }).message)
  }
  return String(raw)
}

const error = computed(() => {
  const meta = snapshot.value.meta
  const flat = meta.errors
  if (Array.isArray(flat) && flat.length > 0 && flat[0] != null) {
    return formatError(flat[0])
  }
  const map = meta.errorMap ?? {}
  for (const key of Object.keys(map)) {
    const arr = map[key]
    if (Array.isArray(arr) && arr.length > 0 && arr[0] != null) {
      return formatError(arr[0])
    }
  }
  return undefined
})

const valid = computed(() => snapshot.value.meta.isValid)
const isDirty = computed(() => snapshot.value.meta.isDirty)
const isTouched = computed(() => snapshot.value.meta.isTouched)

provide(FORM_FIELD_INJECTION_KEY, {
  name: props.field.name,
  error,
  valid,
  isDirty,
  isTouched,
})

const componentField = computed(() => ({
  modelValue: snapshot.value.value,
  'onUpdate:modelValue': (v: unknown) => props.field.handleChange(v),
  onBlur: () => props.field.handleBlur(),
  name: props.field.name,
}))
</script>

<template>
  <slot
    :field="props.field"
    :component-field="componentField"
    :error="error"
    :valid="valid"
    :is-dirty="isDirty"
    :is-touched="isTouched"
  />
</template>

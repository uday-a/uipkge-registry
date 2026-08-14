<script lang="ts" setup>
import { computed, inject } from 'vue'
import FormFieldInner from './FormFieldInner.vue'
import { FORM_INSTANCE_INJECTION_KEY, type TanstackFormApi } from './injectionKeys'

const props = defineProps<{
  form?: TanstackFormApi
  name: string
  validators?: Record<string, unknown>
}>()

const injected = inject(FORM_INSTANCE_INJECTION_KEY, null)

const resolvedForm = computed<TanstackFormApi>(() => {
  const f = props.form ?? injected
  if (!f) throw new Error('<FormField> requires a `form` prop or to be nested inside <Form :form="...">')
  return f
})
</script>

<template>
  <component :is="resolvedForm.Field" :name="props.name" :validators="props.validators">
    <template #default="{ field }">
      <FormFieldInner :field="field">
        <template #default="binding">
          <slot v-bind="binding" />
        </template>
      </FormFieldInner>
    </template>
  </component>
</template>

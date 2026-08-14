<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import { provide } from 'vue'
import { cn } from '@/lib/utils'
import { FORM_INSTANCE_INJECTION_KEY, type TanstackFormApi } from './injectionKeys'

const props = defineProps<{
  form: TanstackFormApi
  class?: HTMLAttributes['class']
}>()

provide(FORM_INSTANCE_INJECTION_KEY, props.form)

function onSubmit(e: Event) {
  e.preventDefault()
  e.stopPropagation()
  void props.form.handleSubmit()
}
</script>

<template>
  <form data-uipkge data-slot="form" :class="cn(props.class)" @submit="onSubmit">
    <slot />
  </form>
</template>

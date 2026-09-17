<script setup lang="ts">
import type { PopoverRootEmits, PopoverRootProps } from 'reka-ui'
import { PopoverRoot, useForwardPropsEmits } from 'reka-ui'
import { computed, onMounted, provide, ref, toRef, useId, watch } from 'vue'
import { POPOVER_INJECTION_KEY, type PopoverCloseBehavior } from './context'

const props = withDefaults(
  defineProps<
    PopoverRootProps & {
      persist?: string | boolean
      closeBehavior?: PopoverCloseBehavior
    }
  >(),
  {
    persist: false,
    closeBehavior: 'auto',
  },
)

const emits = defineEmits<PopoverRootEmits>()

provide(POPOVER_INJECTION_KEY, {
  closeBehavior: toRef(props, 'closeBehavior'),
})

const autoId = useId()
const storageKey = computed(() => {
  if (props.persist === false) return null
  if (props.persist === true) return `uipkge-popover-${autoId}`
  return props.persist
})

const localOpen = ref<boolean>(props.defaultOpen ?? false)

onMounted(() => {
  if (!storageKey.value || typeof localStorage === 'undefined') return
  if (localStorage.getItem(storageKey.value) === '1') {
    localOpen.value = true
    if (props.open === undefined) {
      emits('update:open', true)
    }
  }
})

watch(
  () => (props.open === undefined ? localOpen.value : props.open),
  (v) => {
    if (!storageKey.value || typeof localStorage === 'undefined') return
    if (v) localStorage.setItem(storageKey.value, '1')
    else localStorage.removeItem(storageKey.value)
  },
)

const forwarded = useForwardPropsEmits(
  computed(() => ({
    open: props.open,
    defaultOpen: props.defaultOpen,
    modal: props.modal,
  })),
  emits,
)

function onUpdateOpen(value: boolean) {
  localOpen.value = value
  emits('update:open', value)
}
</script>

<template>
  <PopoverRoot v-slot="slotProps" data-uipkge data-slot="popover" v-bind="forwarded" @update:open="onUpdateOpen">
    <slot v-bind="slotProps" />
  </PopoverRoot>
</template>

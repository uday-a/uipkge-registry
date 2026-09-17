<script setup lang="ts">
import { computed } from 'vue'
import type { DialogRootEmits, DialogRootProps } from 'reka-ui'
import { DialogRoot, useForwardPropsEmits } from 'reka-ui'

const props = defineProps<DialogRootProps>()
const emits = defineEmits<DialogRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)

// Merge forwarded with slotProps to ensure state is passed through
const mergedProps = computed(() => ({
  ...forwarded.value,
}))
</script>

<template>
  <DialogRoot v-slot="slotProps" v-bind="mergedProps">
    <slot v-bind="slotProps" />
  </DialogRoot>
</template>

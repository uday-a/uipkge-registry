<script setup lang="ts">
import { watch } from 'vue'
import { useCommand } from '@/components/ui/command'

const emits = defineEmits<{
  'update:search': [value: string]
}>()

const { filterState } = useCommand()

watch(
  () => filterState.search,
  (v) => {
    emits('update:search', v)
  },
)
</script>

<template>
  <slot />
</template>

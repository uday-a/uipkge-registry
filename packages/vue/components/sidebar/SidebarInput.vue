<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <!-- Sidebar-tuned wrapper over the kit's <Input>. Forwards every slot so
       consumers can pass prefix (search icon) / suffix (kbd hint) / default
       slot content without losing the sidebar height + bg defaults. -->
  <Input
    data-uipkge
    data-slot="sidebar-input"
    data-sidebar="input"
    :class="cn('bg-background h-8 w-full shadow-none', props.class)"
  >
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps" />
    </template>
  </Input>
</template>

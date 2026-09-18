<script setup lang="ts">
import { computed, provide } from 'vue'
import type { TabsRootEmits, TabsRootProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { TabsRoot, useForwardPropsEmits } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<
  TabsRootProps & {
    class?: HTMLAttributes['class']
    orientation?: 'horizontal' | 'vertical'
  }
>()
const emits = defineEmits<TabsRootEmits>()

const delegatedProps = reactiveOmit(props, 'class', 'orientation')
const forwarded = useForwardPropsEmits(delegatedProps, emits)

// Make orientation reachable from descendants without each consumer having to
// pass it manually. TabsList / TabsTrigger inject this to apply variant CSS.
provide(
  Symbol.for('tabsOrientation'),
  computed(() => props.orientation ?? 'horizontal'),
)
</script>

<template>
  <TabsRoot
    data-uipkge
    data-slot="tabs"
    :data-orientation="orientation ?? 'horizontal'"
    :orientation="orientation ?? 'horizontal'"
    v-bind="forwarded"
    :class="cn('flex w-full', orientation === 'vertical' ? 'flex-row gap-4' : 'flex-col gap-2', props.class)"
  >
    <slot />
  </TabsRoot>
</template>

<script setup lang="ts" generic="Type extends 'text' | 'number' = 'text'">
import { nextTick, provide, ref, toRef, watch } from 'vue'
import type { PinInputRootEmits, PinInputRootProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { PinInputRoot, useForwardPropsEmits } from 'reka-ui'
import { cn } from '@/lib/utils'

type PinInputStatus = 'error' | 'warning' | 'success' | 'default'
type PinInputSize = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<
    PinInputRootProps<Type> & {
      class?: HTMLAttributes['class']
      mask?: boolean
      autoSubmit?: boolean
      status?: PinInputStatus
      size?: PinInputSize
    }
  >(),
  {
    otp: true,
    mask: false,
    autoSubmit: false,
    status: 'default',
    size: 'md',
  },
)

const emits = defineEmits<
  Omit<PinInputRootEmits<Type>, 'complete'> & {
    complete: [value: string]
  }
>()

const delegatedProps = reactiveOmit(props, 'class', 'mask', 'autoSubmit', 'status', 'size')
const forwarded = useForwardPropsEmits(delegatedProps, emits)

provide('pinInputContext', {
  mask: toRef(props, 'mask'),
  status: toRef(props, 'status'),
  size: toRef(props, 'size'),
})

function handleComplete(value: (string | number)[]) {
  const joined = value.join('')
  emits('complete', joined)
  if (props.autoSubmit) {
    const event = new CustomEvent('pin-submit', { detail: joined, bubbles: true })
    document.dispatchEvent(event)
  }
}

// One-shot shake when status transitions into error (not on mount / not continuous).
const isShaking = ref(false)
const isFirstStatus = ref(true)

watch(
  () => props.status,
  (next, prev) => {
    // immediate:true so mount-time status="error" does not shake.
    if (isFirstStatus.value) {
      isFirstStatus.value = false
      return
    }
    if (next === 'error' && prev !== 'error') {
      isShaking.value = false
      nextTick(() => {
        isShaking.value = true
      })
    }
  },
  { immediate: true },
)

function onShakeEnd(event: AnimationEvent) {
  if (event.animationName === 'pin-input-shake') {
    isShaking.value = false
  }
}
</script>

<template>
  <PinInputRoot
    :otp="props.otp"
    data-uipkge
    data-slot="pin-input"
    :data-status="props.status === 'default' ? undefined : props.status"
    v-bind="forwarded"
    :class="
      cn(
        'flex items-center gap-2 disabled:cursor-not-allowed has-disabled:opacity-50',
        isShaking && 'pin-input-shake',
        props.class,
      )
    "
    @complete="handleComplete"
    @animationend="onShakeEnd"
  >
    <slot />
  </PinInputRoot>
</template>

<style>
@keyframes pin-input-shake {
  0%,
  100% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-5px);
  }
  40% {
    transform: translateX(5px);
  }
  60% {
    transform: translateX(-3px);
  }
  80% {
    transform: translateX(3px);
  }
}

[data-slot='pin-input'].pin-input-shake {
  animation: pin-input-shake 380ms cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

@media (prefers-reduced-motion: reduce) {
  [data-slot='pin-input'].pin-input-shake {
    animation: none !important;
  }
}
</style>

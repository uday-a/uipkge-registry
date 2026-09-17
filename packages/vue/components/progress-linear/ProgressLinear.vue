<script setup lang="ts">
import { computed } from 'vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { progressLinearVariants } from './progress-linear.variants'

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes['class']
    modelValue?: number
    bgColor?: string
    buffer?: number
    color?: string
    height?: number | string
    indeterminate?: boolean
    reverse?: boolean
    rounded?: 'none' | 'sm' | 'default' | 'md' | 'lg' | 'xl' | 'full'
    stream?: boolean
    striped?: boolean
    active?: boolean
  }>(),
  {
    modelValue: 0,
    indeterminate: false,
    reverse: false,
    stream: false,
    striped: false,
    active: true,
  },
)

const normalizedValue = computed(() => {
  return Math.min(100, Math.max(0, props.modelValue))
})

const normalizedBuffer = computed(() => {
  return Math.min(100, Math.max(0, props.buffer || 0))
})

const heightValue = computed(() => {
  if (typeof props.height === 'number') return `${props.height}px`
  if (typeof props.height === 'string') return props.height
  return '4px'
})

const bgColorValue = computed(() => props.bgColor || 'currentColor')

const progressColorValue = computed(() => props.color || 'currentColor')

const containerClasses = computed(() => cn(progressLinearVariants({ rounded: props.rounded }), props.class))
</script>

<template>
  <div
    data-uipkge
    data-slot="progress-linear"
    role="progressbar"
    :aria-valuemin="0"
    :aria-valuemax="100"
    :aria-valuenow="indeterminate ? undefined : normalizedValue"
    :class="containerClasses"
    :style="{ height: heightValue }"
  >
    <!-- Background -->
    <div
      class="absolute inset-0 transition-colors duration-300"
      :class="[
        striped ? 'progress-striped-light' : '',
        !indeterminate && normalizedBuffer > 0 ? 'opacity-30' : 'opacity-100',
      ]"
      :style="{
        backgroundColor: bgColorValue,
        width: normalizedBuffer > 0 ? `${normalizedBuffer}%` : '100%',
      }"
    />

    <!-- Buffer (if buffer > 0) -->
    <div
      v-if="!indeterminate && normalizedBuffer > 0 && normalizedBuffer < 100"
      class="absolute inset-0 transition-colors duration-300"
      :class="[reverse ? 'right-0 left-auto' : 'right-auto left-0', striped ? 'progress-striped-medium' : '']"
      :style="{
        backgroundColor: bgColorValue,
        width: `${normalizedBuffer}%`,
        opacity: 0.3,
      }"
    />

    <!-- Stream lines (when stream is true) -->
    <div
      v-if="stream && !indeterminate && active"
      class="absolute inset-0 overflow-hidden"
      :class="reverse ? 'right-0 left-auto' : 'right-auto left-0'"
    >
      <div class="animate-stream progress-stream absolute inset-0" :style="{ width: `${normalizedBuffer || 100}%` }" />
    </div>

    <!-- Progress bar -->
    <div
      class="absolute inset-y-0 transition-colors duration-300"
      :class="[
        reverse ? 'right-0 left-auto' : 'right-auto left-0',
        indeterminate ? 'motion-safe:animate-indeterminate' : '',
        striped && !indeterminate ? 'progress-striped-heavy' : '',
      ]"
      :style="{
        width: indeterminate ? '100%' : `${normalizedValue}%`,
        backgroundColor: indeterminate ? undefined : progressColorValue,
      }"
    >
      <!-- Indeterminate animations -->
      <template v-if="indeterminate">
        <div
          class="motion-safe:animate-indeterminate1 absolute inset-y-0 w-full bg-inherit"
          :style="{ backgroundColor: progressColorValue }"
        />
        <div
          class="motion-safe:animate-indeterminate2 absolute inset-y-0 w-full bg-inherit"
          :style="{ backgroundColor: progressColorValue }"
        />
      </template>
    </div>
  </div>
</template>

<style scoped>
/* Gradient utilities */
.progress-striped-light {
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 8px,
    rgba(255, 255, 255, 0.1) 8px,
    rgba(255, 255, 255, 0.1) 16px
  );
}

.progress-striped-medium {
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 8px,
    rgba(255, 255, 255, 0.15) 8px,
    rgba(255, 255, 255, 0.15) 16px
  );
}

.progress-striped-heavy {
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 8px,
    rgba(255, 255, 255, 0.25) 8px,
    rgba(255, 255, 255, 0.25) 16px
  );
}

.progress-stream {
  background-image: repeating-linear-gradient(
    90deg,
    transparent,
    transparent 10px,
    rgba(255, 255, 255, 0.2) 10px,
    rgba(255, 255, 255, 0.2) 20px
  );
  background-size: 40px 40px;
}

@media (prefers-reduced-motion: no-preference) {
  .animate-indeterminate {
    animation: indeterminate 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  .animate-indeterminate1 {
    animation: indeterminate1 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  .animate-indeterminate2 {
    animation: indeterminate2 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  .animate-stream {
    animation: stream 1s linear infinite;
  }
}

@keyframes indeterminate {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(400%);
  }
}

@keyframes indeterminate1 {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(400%);
  }
}

@keyframes indeterminate2 {
  0% {
    transform: translateX(-100%);
    opacity: 1;
  }
  100% {
    transform: translateX(400%);
    opacity: 0;
  }
}

@keyframes stream {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(40px);
  }
}
</style>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, ref, watch } from 'vue'
import QRCodeLib from 'qrcode'
import { Loader2, RotateCcw, Check, ScanLine } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

export type QRCodeType = 'canvas' | 'svg'
export type QRCodeStatus = 'active' | 'expired' | 'loading' | 'scanned'
export type QRCodeErrorLevel = 'L' | 'M' | 'Q' | 'H'

const props = withDefaults(
  defineProps<{
    value: string
    type?: QRCodeType
    size?: number
    color?: string
    bgColor?: string
    icon?: string
    iconSize?: number | { width: number; height: number }
    errorLevel?: QRCodeErrorLevel
    bordered?: boolean
    status?: QRCodeStatus
    marginSize?: number
    class?: HTMLAttributes['class']
  }>(),
  {
    type: 'canvas',
    size: 160,
    // qrcode requires resolvable hex/rgb — CSS vars like var(--foreground) throw.
    color: '#000000',
    bgColor: '#ffffff',
    errorLevel: 'M',
    bordered: true,
    status: 'active',
    marginSize: 0,
  },
)

const emit = defineEmits<{
  refresh: []
}>()

const qrDataUrl = ref('')
const qrSvg = ref('')
const isGenerating = ref(false)

const iconDimensions = computed(() => {
  if (typeof props.iconSize === 'number') {
    return { width: props.iconSize, height: props.iconSize }
  }
  return props.iconSize ?? { width: 40, height: 40 }
})

const errorCorrectionLevel = computed(() => props.errorLevel)

async function generateQR() {
  if (!props.value || props.status === 'loading') return

  isGenerating.value = true
  try {
    const options = {
      width: props.size,
      margin: props.marginSize,
      color: {
        dark: props.color,
        light: props.bgColor,
      },
      errorCorrectionLevel: errorCorrectionLevel.value,
    }

    if (props.type === 'svg') {
      qrSvg.value = await QRCodeLib.toString(props.value, {
        type: 'svg',
        ...options,
      })
    } else {
      qrDataUrl.value = await QRCodeLib.toDataURL(props.value, options)
    }
  } catch (e) {
    console.error('QR Code generation failed:', e)
  } finally {
    isGenerating.value = false
  }
}

watch(
  () => [
    props.value,
    props.type,
    props.size,
    props.color,
    props.bgColor,
    props.errorLevel,
    props.marginSize,
    props.status,
  ],
  () => generateQR(),
  { immediate: true },
)

function downloadQR() {
  const link = document.createElement('a')
  link.download = `qrcode-${props.value.slice(0, 20)}.png`
  link.href = qrDataUrl.value
  link.click()
}

function handleRefresh() {
  emit('refresh')
}

const statusOverlay = computed(() => {
  switch (props.status) {
    case 'expired':
      return {
        icon: RotateCcw,
        text: 'Expired',
        action: handleRefresh,
      }
    case 'scanned':
      return {
        icon: Check,
        text: 'Scanned',
        action: null,
      }
    case 'loading':
      return {
        icon: Loader2,
        text: 'Loading...',
        action: null,
      }
    default:
      return null
  }
})
</script>

<template>
  <div
    data-uipkge
    data-slot="qr-code"
    :aria-busy="status === 'loading' || undefined"
    :class="
      cn('inline-flex flex-col items-center gap-2', bordered && 'bg-background rounded-lg border p-4', props.class)
    "
  >
    <div
      class="relative inline-flex items-center justify-center overflow-hidden"
      :style="{ width: `${size}px`, height: `${size}px` }"
    >
      <!-- QR Code -->
      <template v-if="type === 'svg' && qrSvg">
        <div v-html="qrSvg" class="size-full" />
      </template>
      <template v-else-if="qrDataUrl">
        <img :src="qrDataUrl" :alt="`QR Code for ${value}`" class="size-full" />
      </template>

      <!-- Icon overlay -->
      <div v-if="icon && status === 'active'" class="absolute inset-0 flex items-center justify-center">
        <div
          class="bg-background overflow-hidden rounded-md shadow-sm"
          :style="{
            width: `${iconDimensions.width}px`,
            height: `${iconDimensions.height}px`,
          }"
        >
          <img :src="icon" alt="" class="size-full object-cover" />
        </div>
      </div>

      <!-- Status overlay -->
      <div
        v-if="statusOverlay"
        class="bg-background/90 absolute inset-0 flex flex-col items-center justify-center gap-2 backdrop-blur-sm"
      >
        <component :is="statusOverlay.icon" class="size-8" :class="status === 'loading' && 'animate-spin'" />
        <span class="text-foreground text-sm font-medium">{{ statusOverlay.text }}</span>
        <button
          v-if="statusOverlay.action"
          type="button"
          class="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex items-center gap-1 rounded-md px-3 py-1 text-xs font-medium focus-visible:ring-2 focus-visible:outline-none"
          @click="statusOverlay.action"
        >
          <ScanLine class="size-3" />
          Refresh
        </button>
      </div>
    </div>

    <!-- Download button -->
    <slot name="extra">
      <button
        v-if="type === 'canvas' && status === 'active' && qrDataUrl"
        type="button"
        class="text-muted-foreground hover:text-foreground focus-visible:ring-ring text-xs underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:outline-none"
        @click="downloadQR"
      >
        Download
      </button>
    </slot>
  </div>
</template>

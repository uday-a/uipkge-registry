<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import { cn } from '@/lib/utils'

export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown'

const props = withDefaults(
  defineProps<{
    number?: string
    name?: string
    expiry?: string
    cvc?: string
    brand?: CardBrand | 'auto'
    flipped?: boolean
    variant?: 'default' | 'compact'
    tilt?: boolean
    shimmer?: boolean
    flip?: boolean
    size?: 'sm' | 'md' | 'lg'
    class?: string
  }>(),
  {
    number: '',
    name: '',
    expiry: '',
    cvc: '',
    brand: 'auto',
    flipped: false,
    variant: 'default',
    tilt: false,
    shimmer: false,
    flip: true,
    size: 'md',
  },
)

function detectBrand(raw: string): CardBrand {
  const n = raw.replace(/\D/g, '')
  if (!n) return 'unknown'
  if (/^4/.test(n)) return 'visa'
  if (/^(5[1-5]|2[2-7])/.test(n)) return 'mastercard'
  if (/^3[47]/.test(n)) return 'amex'
  if (/^(6011|65|64[4-9])/.test(n)) return 'discover'
  return 'unknown'
}

const detectedBrand = computed<CardBrand>(() => {
  if (props.brand && props.brand !== 'auto') return props.brand
  return detectBrand(props.number)
})

function formatMasked(raw: string, brand: CardBrand): string {
  const digits = raw.replace(/\D/g, '').slice(0, brand === 'amex' ? 15 : 16)
  const groups = brand === 'amex' ? [4, 6, 5] : [4, 4, 4, 4]
  const total = groups.reduce((a, b) => a + b, 0)
  const padded = (digits + '••••••••••••••••').slice(0, total)
  let i = 0
  return groups
    .map((g) => {
      const slice = padded.slice(i, i + g)
      i += g
      return slice
    })
    .join(' ')
}

const displayNumber = computed(() => formatMasked(props.number, detectedBrand.value))
const displayName = computed(() => (props.name.trim() || 'CARDHOLDER NAME').toUpperCase())
const displayExpiry = computed(() => {
  const raw = props.expiry.replace(/\D/g, '').slice(0, 4)
  if (!raw) return 'MM/YY'
  if (raw.length <= 2) return raw + '/YY'
  return `${raw.slice(0, 2)}/${raw.slice(2, 4)}`
})
const displayCvc = computed(() => {
  const max = detectedBrand.value === 'amex' ? 4 : 3
  const digits = props.cvc.replace(/\D/g, '').slice(0, max)
  return digits || '•••'
})

const displayChars = computed(() => displayNumber.value.split(''))

// Character pop-in animation tracking
const prevDigits = ref('')
const poppedIndexes = ref<Set<number>>(new Set())
let popClearTimer: ReturnType<typeof setTimeout> | null = null

watch(
  () => props.number,
  (next) => {
    const nextDigits = next.replace(/\D/g, '')
    const prev = prevDigits.value
    if (nextDigits.length > prev.length) {
      const newIdx = nextDigits.length - 1
      poppedIndexes.value.add(newIdx)
      if (popClearTimer) clearTimeout(popClearTimer)
      popClearTimer = setTimeout(() => {
        poppedIndexes.value.clear()
      }, 400)
    }
    prevDigits.value = nextDigits
  },
)

onUnmounted(() => {
  if (popClearTimer) clearTimeout(popClearTimer)
})

function charKey(i: number, ch: string) {
  return `${i}-${ch}`
}

function shouldPop(charIndex: number, ch: string): boolean {
  if (ch === '•' || ch === ' ') return false
  const strUpTo = displayNumber.value.slice(0, charIndex + 1)
  const digitCount = (strUpTo.match(/\d/g) || []).length
  return poppedIndexes.value.has(digitCount - 1)
}

// 3D Parallax Tilt
const cardRef = ref<HTMLElement | null>(null)
const tiltX = ref(0)
const tiltY = ref(0)
const isHovering = ref(false)

function onMove(e: MouseEvent) {
  if (!props.tilt || !cardRef.value) return
  const rect = cardRef.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const px = (x / rect.width - 0.5) * 2
  const py = (y / rect.height - 0.5) * 2
  tiltX.value = -py * 10
  tiltY.value = px * 12
  isHovering.value = true
}

function onLeave() {
  if (!props.tilt) return
  tiltX.value = 0
  tiltY.value = 0
  isHovering.value = false
}

const innerTransform = computed(() => {
  const flipDeg = props.flipped ? 180 : 0
  if (props.tilt && isHovering.value) {
    return `perspective(1200px) rotateX(${tiltX.value}deg) rotateY(${tiltY.value + flipDeg}deg) scale3d(1.02, 1.02, 1.02)`
  }
  return `perspective(1200px) rotateY(${flipDeg}deg)`
})

// Sizing
const sizeClass = computed(() => {
  if (props.variant === 'compact') return 'w-[120px]'
  switch (props.size) {
    case 'sm':
      return 'w-[280px]'
    case 'lg':
      return 'w-[420px]'
    case 'md':
    default:
      return 'w-[360px]'
  }
})

// Brand Themes (Materials & Aesthetics)
interface BrandVisual {
  cardClass: string
  accentGlow: string
  foilSheen: string
  guillocheColor: string
  textColor: string
  subtextColor: string
  embossStyle: string
  chipType: 'gold' | 'silver'
}

const BRAND_VISUALS: Record<CardBrand, BrandVisual> = {
  visa: {
    cardClass:
      'bg-[radial-gradient(ellipse_at_top_right,#1e3a8a_0%,#0f2252_45%,#08122c_85%,#040a18_100%)] text-white shadow-[0_22px_45px_-12px_rgba(15,34,82,0.65),0_8px_16px_-8px_rgba(0,0,0,0.5)]',
    accentGlow: 'from-blue-400/20 via-indigo-500/10 to-transparent',
    foilSheen: 'from-white/20 via-blue-200/5 to-transparent',
    guillocheColor: 'rgba(96, 165, 250, 0.12)',
    textColor: 'text-white',
    subtextColor: 'text-blue-200/60',
    embossStyle: 'text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]',
    chipType: 'gold',
  },
  mastercard: {
    cardClass:
      'bg-[radial-gradient(ellipse_at_top_right,#2a0808_0%,#180608_35%,#0f0506_70%,#09090b_100%)] text-white shadow-[0_22px_45px_-12px_rgba(220,38,38,0.35),0_8px_16px_-8px_rgba(0,0,0,0.6)]',
    accentGlow: 'from-red-500/25 via-amber-500/15 to-transparent',
    foilSheen: 'from-white/20 via-orange-300/10 to-transparent',
    guillocheColor: 'rgba(239, 68, 68, 0.1)',
    textColor: 'text-white',
    subtextColor: 'text-zinc-400',
    embossStyle: 'text-zinc-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]',
    chipType: 'gold',
  },
  amex: {
    cardClass:
      'bg-[radial-gradient(ellipse_at_top_right,#1e293b_0%,#0f172a_40%,#090d16_80%,#020617_100%)] text-slate-100 shadow-[0_22px_45px_-12px_rgba(15,23,42,0.7),0_8px_16px_-8px_rgba(0,0,0,0.6)]',
    accentGlow: 'from-slate-300/20 via-teal-500/10 to-transparent',
    foilSheen: 'from-white/25 via-cyan-100/10 to-transparent',
    guillocheColor: 'rgba(148, 163, 184, 0.12)',
    textColor: 'text-slate-100',
    subtextColor: 'text-slate-400',
    embossStyle: 'text-slate-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]',
    chipType: 'silver',
  },
  discover: {
    cardClass:
      'bg-[radial-gradient(ellipse_at_top_right,#431407_0%,#270d04_45%,#1c0903_80%,#0c0401_100%)] text-white shadow-[0_22px_45px_-12px_rgba(194,65,12,0.45),0_8px_16px_-8px_rgba(0,0,0,0.6)]',
    accentGlow: 'from-orange-400/25 via-amber-600/15 to-transparent',
    foilSheen: 'from-white/20 via-amber-200/10 to-transparent',
    guillocheColor: 'rgba(251, 146, 60, 0.12)',
    textColor: 'text-white',
    subtextColor: 'text-amber-200/60',
    embossStyle: 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]',
    chipType: 'gold',
  },
  unknown: {
    cardClass:
      'bg-[radial-gradient(ellipse_at_top_right,#27272a_0%,#18181b_40%,#09090b_85%,#000000_100%)] text-white shadow-[0_22px_45px_-12px_rgba(0,0,0,0.7),0_8px_16px_-8px_rgba(0,0,0,0.5)]',
    accentGlow: 'from-zinc-400/15 via-zinc-600/10 to-transparent',
    foilSheen: 'from-white/18 via-zinc-300/5 to-transparent',
    guillocheColor: 'rgba(255, 255, 255, 0.06)',
    textColor: 'text-white',
    subtextColor: 'text-zinc-400',
    embossStyle: 'text-zinc-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]',
    chipType: 'silver',
  },
}

const theme = computed(() => BRAND_VISUALS[detectedBrand.value])
</script>

<template>
  <div
    ref="cardRef"
    data-uipkge
    data-slot="payment-card"
    role="img"
    :aria-label="`${detectedBrand === 'unknown' ? 'Card' : detectedBrand} ending ${displayNumber.replace(/[•\s]/g, '').slice(-4) || '••••'}, ${displayName}, expires ${displayExpiry}`"
    :class="cn('group relative inline-block select-none [perspective:1200px]', sizeClass, props.class)"
    @mousemove="onMove"
    @mouseleave="onLeave"
  >
    <div
      class="relative aspect-[85.6/53.98] w-full transition-transform [transform-style:preserve-3d]"
      :class="flip ? 'duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)]' : 'duration-300'"
      :style="{ transform: innerTransform }"
    >
      <!-- ================================= FRONT FACE ================================= -->
      <div
        :class="
          cn(
            'pay-card-face absolute inset-0 overflow-hidden rounded-[16px] border border-white/15 [backface-visibility:hidden]',
            theme.cardClass,
          )
        "
      >
        <!-- Fine Guilloché & Security Geometric Wave Pattern -->
        <svg
          class="pointer-events-none absolute inset-0 size-full opacity-60 mix-blend-screen"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 360 227"
          fill="none"
          aria-hidden="true"
        >
          <g :stroke="theme.guillocheColor" stroke-width="0.75" stroke-opacity="0.7">
            <path d="M-40 40 C 60 180, 180 -40, 400 120" />
            <path d="M-40 55 C 60 195, 180 -25, 400 135" />
            <path d="M-40 70 C 60 210, 180 -10, 400 150" />
            <path d="M-40 85 C 60 225, 180 5, 400 165" />
            <path d="M-40 100 C 60 240, 180 20, 400 180" />
            <path d="M-40 115 C 60 255, 180 35, 400 195" />
            <circle cx="280" cy="80" r="90" stroke-width="0.5" stroke-dasharray="2 3" />
            <circle cx="280" cy="80" r="60" stroke-width="0.5" stroke-dasharray="1 2" />
          </g>
        </svg>

        <!-- Brushed Metallic Sheen & Specular Lighting -->
        <div
          class="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.07] to-transparent opacity-80"
        />
        <div
          class="pointer-events-none absolute -inset-y-8 -left-1/3 w-1/2 rotate-12 bg-gradient-to-r opacity-70"
          :class="theme.foilSheen"
        />
        <!-- Ambient Corner Highlights -->
        <div
          class="pointer-events-none absolute -top-12 -right-12 h-44 w-44 rounded-full bg-gradient-to-br blur-2xl"
          :class="theme.accentGlow"
        />
        <div class="pointer-events-none absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-black/40 blur-2xl" />

        <!-- Outer Bevel Perimeter Ring -->
        <div
          class="pointer-events-none absolute inset-0 rounded-[16px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),inset_0_-1px_1px_rgba(0,0,0,0.5)]"
        />

        <!-- Shimmer sweep (opt-in) -->
        <div
          v-if="shimmer"
          class="pointer-events-none absolute -inset-x-full inset-y-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
          style="animation: payment-card-shimmer 2.5s linear infinite"
        />

        <!-- Content Structure -->
        <div :class="cn('absolute inset-0 flex flex-col justify-between', variant === 'compact' ? 'p-2' : 'p-5')">
          <!-- TOP ROW: Bank Watermark / Card Tier & Brand Logo -->
          <div class="flex items-center justify-between">
            <!-- Left: Card Tier / Bank label -->
            <div class="flex items-center gap-1.5">
              <span
                v-if="variant !== 'compact'"
                class="font-mono text-xs font-semibold tracking-[0.25em] text-white/70 uppercase"
              >
                {{
                  detectedBrand === 'amex' ? 'PLATINUM' : detectedBrand === 'mastercard' ? 'WORLD ELITE' : 'SIGNATURE'
                }}
              </span>
              <span v-else class="font-mono text-xs font-bold tracking-widest text-white/70 uppercase"> CARD </span>
            </div>

            <!-- Right: Authentic Brand Logo -->
            <div class="flex items-center justify-end" style="perspective: 600px">
              <Transition name="brand-pop" mode="out-in">
                <!-- VISA -->
                <div v-if="detectedBrand === 'visa'" key="visa" class="flex items-center">
                  <svg
                    :class="variant === 'compact' ? 'h-3 w-auto' : 'h-6 w-auto'"
                    viewBox="0 0 78 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-label="Visa"
                  >
                    <path
                      d="M29.5 23.2H23.9L27.4 1.8H33L29.5 23.2ZM52.4 2.3C51.3 1.9 49.5 1.5 47.3 1.5C41.8 1.5 37.9 4.4 37.8 8.6C37.7 11.7 40.5 13.4 42.6 14.4C44.8 15.5 45.5 16.2 45.5 17.1C45.5 18.6 43.7 19.2 42.1 19.2C39.8 19.2 38.5 18.9 36.8 18.1L36 17.7L35.1 23C36.6 23.7 39.2 24.2 41.8 24.2C47.7 24.2 51.5 21.3 51.6 16.9C51.7 13.4 49.6 11.7 47 10.4C45.2 9.5 44.1 8.9 44.1 8C44.1 7.2 45 6.4 46.8 6.4C48.3 6.4 49.6 6.7 50.8 7.2L51.3 7.5L52.4 2.3ZM67.5 1.8H63.2C61.8 1.8 60.8 2.2 60.2 3.6L51.4 23.2H57.3L58.5 19.9H65.7L66.4 23.2H71.6L67.5 1.8ZM60.1 15.5C60.6 14.2 62.5 8.9 62.5 8.9C62.5 8.9 63 7.6 63.3 6.7L63.8 8.7C63.8 8.7 64.9 14.1 65.2 15.5H60.1ZM18.7 1.8L13.2 16.4L12.6 13.4C11.6 10 8.7 6.3 5.4 4.5L10.3 23.2H16.3L25.1 1.8H18.7ZM8.3 1.8H0.2L0 2.3C6.3 3.9 10.4 7.7 12.1 12.4L10.4 3.7C10.1 2.4 9.3 1.9 8.3 1.8H0.2L0 2.3C6.3 3.9 10.4 7.7 12.1 12.4Z"
                      fill="white"
                    />
                    <path
                      d="M12.1 12.4L10.4 3.7C10.1 2.4 9.3 1.9 8.3 1.8H0.2L0 2.3C6.3 3.9 10.4 7.7 12.1 12.4Z"
                      fill="#F9A01B"
                    />
                  </svg>
                </div>

                <!-- MASTERCARD -->
                <div v-else-if="detectedBrand === 'mastercard'" key="mastercard" class="flex items-center gap-1.5">
                  <svg
                    :class="variant === 'compact' ? 'h-3.5 w-auto' : 'h-7 w-auto'"
                    viewBox="0 0 48 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-label="Mastercard"
                  >
                    <circle cx="15" cy="15" r="15" fill="#EB001B" />
                    <circle cx="33" cy="15" r="15" fill="#F79E1B" fill-opacity="0.92" />
                    <path
                      d="M24 4.5C27.5 7.1 29.8 11.2 29.8 16C29.8 20.8 27.5 24.9 24 27.5C20.5 24.9 18.2 20.8 18.2 16C18.2 11.2 20.5 7.1 24 4.5Z"
                      fill="#FF5F00"
                    />
                  </svg>
                  <span
                    v-if="variant !== 'compact'"
                    class="font-mono text-xs font-bold tracking-tight text-white lowercase"
                    style="letter-spacing: -0.05em"
                  >
                    mastercard
                  </span>
                </div>

                <!-- AMEX -->
                <div v-else-if="detectedBrand === 'amex'" key="amex" class="flex items-center">
                  <div
                    :class="
                      cn(
                        'flex items-center justify-center rounded-sm bg-[#006fcf] font-sans font-bold tracking-tighter text-white shadow-xs',
                        variant === 'compact' ? 'px-1 py-0.5 text-xs' : 'px-2 py-1 text-xs',
                      )
                    "
                  >
                    AMEX
                  </div>
                </div>

                <!-- DISCOVER -->
                <div
                  v-else-if="detectedBrand === 'discover'"
                  key="discover"
                  class="flex items-center gap-0.5 font-bold tracking-wider text-white"
                  :class="variant === 'compact' ? 'text-xs' : 'text-xs'"
                >
                  <span>DISC</span>
                  <span
                    class="inline-block rounded-full bg-gradient-to-br from-amber-400 to-orange-600 shadow-xs"
                    :class="variant === 'compact' ? 'size-2' : 'size-3.5'"
                  />
                  <span>VER</span>
                </div>

                <!-- UNKNOWN / SLEEK DEFAULT -->
                <div v-else key="unknown" class="flex items-center gap-1 opacity-80">
                  <div class="size-2 rounded-full bg-white/60" />
                  <div class="size-2 rounded-full bg-white/30" />
                  <span
                    class="font-mono font-bold tracking-widest text-white/80 uppercase"
                    :class="variant === 'compact' ? 'text-xs' : 'text-xs'"
                  >
                    PREMIUM
                  </span>
                </div>
              </Transition>
            </div>
          </div>

          <!-- MIDDLE ROW: EMV Chip + Contactless Symbol -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <!-- Ultra-Realistic Metallic EMV Chip -->
              <div
                :class="
                  cn(
                    'relative overflow-hidden rounded-[5px] border border-amber-950/40 shadow-[0_2px_5px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.6)]',
                    theme.chipType === 'silver'
                      ? 'bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400'
                      : 'bg-gradient-to-br from-[#ffe082] via-[#ffb300] to-[#ff8f00]',
                    variant === 'compact' ? 'h-3.5 w-5' : 'h-8 w-11',
                  )
                "
              >
                <!-- Authentic Chip Circuit Etching Lines -->
                <div class="absolute inset-[2px] rounded-[3px] border border-black/25" />
                <div class="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-black/30" />
                <div class="absolute inset-y-0 left-1/3 w-px bg-black/30" />
                <div class="absolute inset-y-0 right-1/3 w-px bg-black/30" />
                <div
                  class="absolute top-1/4 right-1/3 left-1/3 h-1/2 rounded-[2px] border border-black/25 bg-black/10"
                />
                <!-- Metallic Glint Reflection -->
                <div
                  class="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent"
                />
              </div>

              <!-- Contactless NFC Radio Waves -->
              <svg
                v-if="variant !== 'compact'"
                viewBox="0 0 24 24"
                class="h-5 w-auto text-white/70 drop-shadow-sm"
                fill="none"
                stroke="currentColor"
                stroke-width="1.75"
                stroke-linecap="round"
                aria-hidden="true"
              >
                <path d="M6.5 8a6 6 0 0 1 0 8" />
                <path d="M10 6a9.5 9.5 0 0 1 0 12" />
                <path d="M13.5 4a13 13 0 0 1 0 16" />
              </svg>
            </div>

            <!-- Holographic Security Stamp (Optional realistic detail) -->
            <div v-if="variant !== 'compact'" class="pay-card-holo h-7 w-9 rounded-[4px] opacity-75 shadow-xs" />
          </div>

          <!-- CARD NUMBER (Authentic Embossed Raised Digits) -->
          <div
            :class="
              cn(
                'flex flex-nowrap items-center font-mono font-bold tracking-[0.18em] tabular-nums',
                theme.embossStyle,
                variant === 'compact' ? 'my-0.5 text-xs' : 'my-1 text-base sm:text-lg',
              )
            "
          >
            <span class="sr-only">{{ displayNumber }}</span>
            <span
              v-for="(ch, i) in displayChars"
              :key="charKey(i, ch)"
              :class="
                cn(
                  'inline-block origin-bottom tabular-nums transition-transform',
                  ch === '•' && 'text-[0.85em] opacity-50',
                  shouldPop(i, ch) && 'pay-char-pop',
                )
              "
              aria-hidden="true"
            >
              {{ ch === ' ' ? '\u00A0' : ch }}
            </span>
          </div>

          <!-- BOTTOM ROW: Cardholder Name + Expiry Date -->
          <div class="flex items-end justify-between gap-3">
            <!-- Cardholder Name -->
            <div class="min-w-0 flex-1">
              <div
                v-if="variant !== 'compact'"
                class="text-xs font-semibold tracking-[0.2em] uppercase"
                :class="theme.subtextColor"
              >
                CARDHOLDER NAME
              </div>
              <div
                :class="
                  cn(
                    'truncate font-semibold tracking-wider uppercase',
                    theme.embossStyle,
                    variant === 'compact' ? 'text-xs' : 'text-xs',
                  )
                "
              >
                {{ displayName }}
              </div>
            </div>

            <!-- Expiry Date -->
            <div class="shrink-0 text-right">
              <div
                v-if="variant !== 'compact'"
                class="flex items-center justify-end gap-1 text-xs font-semibold tracking-wider uppercase"
                :class="theme.subtextColor"
              >
                <span class="text-[6px] leading-tight">GOOD<br />THRU</span>
                <span>MONTH/YEAR</span>
              </div>
              <div
                :class="
                  cn(
                    'font-mono font-semibold tracking-wider whitespace-nowrap',
                    theme.embossStyle,
                    variant === 'compact' ? 'text-xs' : 'text-xs',
                  )
                "
              >
                {{ displayExpiry }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ================================= BACK FACE ================================= -->
      <div
        :class="
          cn(
            'pay-card-face absolute inset-0 [transform:rotateY(180deg)] overflow-hidden rounded-[16px] border border-white/15 [backface-visibility:hidden]',
            theme.cardClass,
          )
        "
      >
        <!-- Specular Bevel Perimeter -->
        <div
          class="pointer-events-none absolute inset-0 rounded-[16px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),inset_0_-1px_1px_rgba(0,0,0,0.5)]"
        />

        <!-- Full-Width Deep Matte Magnetic Stripe -->
        <div
          :class="
            cn(
              'w-full bg-gradient-to-b from-neutral-950 via-black to-neutral-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_0_rgba(0,0,0,0.8)]',
              variant === 'compact' ? 'mt-2 h-4' : 'mt-4 h-10',
            )
          "
        />

        <div :class="cn('relative flex flex-col justify-between', variant === 'compact' ? 'p-2' : 'p-4')">
          <!-- Signature Panel + CVV Code -->
          <div :class="cn('flex items-stretch gap-2', variant === 'compact' ? 'mt-1' : 'mt-2')">
            <!-- White Security Hatched Signature Strip -->
            <div
              :class="
                cn(
                  'relative flex-1 overflow-hidden rounded-[3px] border border-slate-300/80 bg-white/95 px-2 py-1',
                  variant === 'compact' ? 'h-4' : 'h-8',
                )
              "
              style="
                background-image: repeating-linear-gradient(
                  -45deg,
                  rgba(0, 0, 0, 0.05) 0px,
                  rgba(0, 0, 0, 0.05) 2px,
                  transparent 2px,
                  transparent 6px
                );
              "
            >
              <div
                v-if="variant !== 'compact'"
                class="font-mono text-xs font-semibold tracking-wider text-slate-400 uppercase"
              >
                AUTHORIZED SIGNATURE
              </div>
            </div>

            <!-- Printed CVV Code Box -->
            <div
              :class="
                cn(
                  'flex flex-col items-center justify-center rounded-[3px] border border-slate-300 bg-white font-mono font-bold text-slate-950 shadow-inner',
                  variant === 'compact' ? 'px-1 text-xs' : 'px-3 text-xs',
                )
              "
            >
              <span v-if="variant !== 'compact'" class="text-[6px] font-bold tracking-widest text-slate-400 uppercase">
                CVV
              </span>
              <span class="leading-none tracking-widest italic">{{ displayCvc }}</span>
            </div>
          </div>

          <!-- Microtext Disclaimer & Regulatory Compliance Marks -->
          <div v-if="variant !== 'compact'" class="mt-3 space-y-1.5">
            <p class="text-[7.5px] leading-snug text-white/50">
              This card is property of the issuing bank and must be returned upon request. Use is subject to the
              cardholder agreement.
            </p>
            <div
              class="flex items-center justify-between border-t border-white/10 pt-2 text-xs font-medium text-white/60"
            >
              <span>24/7 Support: 1-800-555-0199</span>
              <span class="font-mono font-bold tracking-wider text-white/75">CIRRUS · PLUS · STAR</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@keyframes payment-card-shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(200%);
  }
}

@keyframes pay-char-pop {
  0% {
    opacity: 0;
    transform: translateY(8px) scale(0.6);
  }
  50% {
    opacity: 1;
    transform: translateY(-2px) scale(1.15);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.pay-char-pop {
  animation: pay-char-pop 360ms cubic-bezier(0.22, 1.4, 0.36, 1) both;
}

.pay-card-holo {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.2) 0%,
    rgba(56, 189, 248, 0.6) 25%,
    rgba(168, 85, 247, 0.6) 50%,
    rgba(251, 146, 60, 0.55) 75%,
    rgba(74, 222, 128, 0.5) 100%
  );
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.35),
    0 2px 6px rgba(0, 0, 0, 0.3);
}

.brand-pop-enter-active,
.brand-pop-leave-active {
  transition:
    opacity 300ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 300ms cubic-bezier(0.22, 1, 0.36, 1);
  transform-style: preserve-3d;
  backface-visibility: hidden;
}

.brand-pop-enter-from {
  opacity: 0;
  transform: scale(0.7) rotateY(-90deg);
}

.brand-pop-leave-to {
  opacity: 0;
  transform: scale(0.7) rotateY(90deg);
}

@media (prefers-reduced-motion: reduce) {
  [data-slot='payment-card'] [class*='transition-'] {
    transition-duration: 0ms !important;
  }
  [data-slot='payment-card'] [style*='payment-card-shimmer'] {
    animation: none !important;
  }
  .pay-char-pop {
    animation: none !important;
  }
  .brand-pop-enter-active,
  .brand-pop-leave-active {
    transition-duration: 0ms !important;
  }
}
</style>

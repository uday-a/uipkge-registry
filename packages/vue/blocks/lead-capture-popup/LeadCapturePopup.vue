<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { ArrowRight, Check, Clock, Copy, Sparkles, Star, X } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Props {
  headline?: string
  subtitle?: string
  discountCode?: string
  discountPercent?: number
  initialSeconds?: number
  socialProofRating?: string
  socialProofCount?: string
  initialSubmitted?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  headline: 'Unlock 20% Off Your First Order',
  subtitle: 'Join 45,000+ engineers receiving our weekly curated component teardowns and architectural breakdowns.',
  discountCode: 'WELCOME20',
  discountPercent: 20,
  initialSeconds: 599,
  socialProofRating: '4.9/5',
  socialProofCount: '1,200+ developers',
  initialSubmitted: false,
})

const emit = defineEmits<{
  (e: 'submit', payload: { email: string; discountCode: string }): void
  (e: 'dismiss'): void
  (e: 'copy', code: string): void
  (e: 'reset'): void
}>()

const email = ref('')
const isSubmitted = ref(props.initialSubmitted)
const isDismissed = ref(false)
const copied = ref(false)
const timeLeft = ref(props.initialSeconds)

let timer: ReturnType<typeof setInterval> | null = null

const formattedTime = computed(() => {
  const mins = Math.floor(timeLeft.value / 60)
  const secs = timeLeft.value % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
})

onMounted(() => {
  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else if (timer) {
      clearInterval(timer)
    }
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

function handleSubmit() {
  if (!email.value || !email.value.includes('@')) return
  isSubmitted.value = true
  emit('submit', { email: email.value, discountCode: props.discountCode })
}

function handleDismiss() {
  isDismissed.value = true
  emit('dismiss')
}

function handleReset() {
  isSubmitted.value = false
  isDismissed.value = false
  email.value = ''
  copied.value = false
  timeLeft.value = props.initialSeconds
  emit('reset')
}

function copyCoupon() {
  navigator.clipboard?.writeText(props.discountCode)
  copied.value = true
  emit('copy', props.discountCode)
  setTimeout(() => {
    copied.value = false
  }, 2000)
}

defineExpose({
  reset: handleReset,
  open: () => {
    isDismissed.value = false
  },
})
</script>

<template>
  <div v-if="!isDismissed" data-slot="lead-capture-popup" :class="cn('w-full', props.class)">
    <div
      class="bg-card text-card-foreground border-border relative mx-auto w-full max-w-lg overflow-hidden rounded-2xl border p-6 shadow-xl sm:p-8"
    >
      <!-- Background Ambient Glow -->
      <div class="bg-primary/10 pointer-events-none absolute -top-12 -right-12 size-40 rounded-full blur-2xl" />

      <!-- Top Right Dismiss Button -->
      <button
        type="button"
        aria-label="Dismiss popup"
        class="text-muted-foreground hover:text-foreground focus-visible:ring-ring absolute top-4 right-4 rounded-full p-1.5 transition-colors focus-visible:ring-2 focus-visible:outline-hidden"
        @click="handleDismiss"
      >
        <X class="size-4" />
      </button>

      <!-- FORM STATE -->
      <div v-if="!isSubmitted" class="relative z-10 space-y-6">
        <!-- Top Badge -->
        <div class="flex items-center">
          <Badge
            variant="secondary"
            class="border-primary/20 bg-primary/10 text-primary inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium"
          >
            <Sparkles class="fill-primary/20 text-primary size-3.5" />
            Limited Time Welcome Gift
          </Badge>
        </div>

        <!-- Urgency Countdown Bar -->
        <div
          class="flex items-center justify-between gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3.5 py-2 text-xs text-amber-900 dark:text-amber-300"
        >
          <div class="flex items-center gap-2">
            <Clock class="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <span class="font-medium">Claim your {{ discountPercent }}% discount code before the timer expires:</span>
          </div>
          <span
            class="rounded bg-amber-500/20 px-2 py-0.5 font-mono text-xs font-bold text-amber-950 tabular-nums dark:text-amber-200"
          >
            {{ formattedTime }}
          </span>
        </div>

        <!-- Headline & Subtitle -->
        <div class="space-y-2">
          <h2 class="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
            {{ headline }}
          </h2>
          <p class="text-muted-foreground text-sm leading-relaxed">
            {{ subtitle }}
          </p>
        </div>

        <!-- Value Bullet Points (3 items with emerald checkmarks) -->
        <ul class="space-y-2.5" role="list">
          <li class="text-muted-foreground flex items-center gap-2.5 text-xs sm:text-sm">
            <span
              class="flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
            >
              <Check class="size-2.5 stroke-[3]" />
            </span>
            <span>No spam ever &mdash; high-signal engineering teardowns</span>
          </li>
          <li class="text-muted-foreground flex items-center gap-2.5 text-xs sm:text-sm">
            <span
              class="flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
            >
              <Check class="size-2.5 stroke-[3]" />
            </span>
            <span>1-click unsubscribe anytime with zero friction</span>
          </li>
          <li class="text-muted-foreground flex items-center gap-2.5 text-xs sm:text-sm">
            <span
              class="flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
            >
              <Check class="size-2.5 stroke-[3]" />
            </span>
            <span>Instant coupon delivery straight to your screen &amp; inbox</span>
          </li>
        </ul>

        <!-- Email Capture Form -->
        <form class="space-y-3 pt-1" @submit.prevent="handleSubmit">
          <Input
            v-model="email"
            type="email"
            placeholder="engineer@company.com"
            required
            autocomplete="email"
            aria-label="Email address"
            class="border-border bg-background focus-visible:ring-primary h-11 text-sm shadow-xs focus-visible:ring-2"
          />

          <Button type="submit" size="lg" class="h-11 w-full justify-center gap-2 text-sm font-semibold shadow-xs">
            Claim My {{ discountPercent }}% Discount
            <ArrowRight class="size-4" />
          </Button>
        </form>

        <!-- Social Proof Line -->
        <div class="text-muted-foreground flex items-center justify-center gap-1.5 text-xs">
          <div class="flex items-center gap-0.5 text-amber-500 dark:text-amber-400" aria-hidden="true">
            <Star class="size-3.5 fill-current" />
            <Star class="size-3.5 fill-current" />
            <Star class="size-3.5 fill-current" />
            <Star class="size-3.5 fill-current" />
            <Star class="size-3.5 fill-current" />
          </div>
          <span class="text-foreground font-medium">{{ socialProofRating }}</span>
          <span>rating by {{ socialProofCount }}</span>
        </div>

        <!-- Dismiss / Decline link -->
        <div class="text-center">
          <button
            type="button"
            class="text-muted-foreground hover:text-foreground focus-visible:ring-ring min-h-6 rounded text-xs underline underline-offset-4 transition-colors focus-visible:ring-2 focus-visible:outline-hidden"
            @click="handleDismiss"
          >
            No thanks, I prefer paying full price
          </button>
        </div>
      </div>

      <!-- SUCCESS STATE -->
      <div v-else class="relative z-10 space-y-5 text-center">
        <div
          class="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        >
          <Sparkles class="size-6" />
        </div>

        <div class="space-y-1.5">
          <Badge
            variant="outline"
            class="border-emerald-500/30 bg-emerald-500/10 font-medium text-emerald-700 dark:text-emerald-400"
          >
            {{ discountPercent }}% Discount Unlocked
          </Badge>
          <h3 class="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">You&rsquo;re all set!</h3>
          <p class="text-muted-foreground text-xs sm:text-sm">
            We&rsquo;ve dispatched your code and welcome gift to
            <span class="text-foreground font-medium">{{ email || 'engineer@company.com' }}</span
            >.
          </p>
        </div>

        <!-- Coupon Card Box -->
        <div class="border-border bg-muted/40 relative space-y-3 rounded-xl border-2 border-dashed p-4">
          <span class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Your Exclusive Coupon Code
          </span>
          <div class="flex items-center justify-center gap-2">
            <code
              class="border-border bg-background text-foreground rounded-lg border px-3 py-1.5 font-mono text-xl font-bold tracking-widest sm:text-2xl"
            >
              {{ discountCode }}
            </code>
            <Button
              variant="secondary"
              size="sm"
              class="gap-1.5 shadow-xs"
              :aria-label="copied ? 'Copied code' : 'Copy discount code'"
              @click="copyCoupon"
            >
              <Check v-if="copied" class="size-3.5 text-emerald-600 dark:text-emerald-400" />
              <Copy v-else class="size-3.5" />
              <span>{{ copied ? 'Copied!' : 'Copy Code' }}</span>
            </Button>
          </div>
          <p class="text-muted-foreground text-xs">
            Valid for the next <span class="font-mono font-medium">{{ formattedTime }}</span> at checkout.
          </p>
        </div>

        <div class="space-y-2 pt-2">
          <Button class="h-11 w-full justify-center gap-2 text-sm font-semibold shadow-xs" @click="handleDismiss">
            Start Exploring Components
            <ArrowRight class="size-4" />
          </Button>
          <button
            type="button"
            class="text-muted-foreground hover:text-foreground focus-visible:ring-ring min-h-6 rounded text-xs underline underline-offset-4 transition-colors focus-visible:ring-2 focus-visible:outline-hidden"
            @click="handleReset"
          >
            Enter a different email
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Reopen trigger fallback when dismissed -->
  <div
    v-else
    class="flex flex-col items-center justify-center p-8 text-center"
    data-slot="lead-capture-popup-dismissed"
  >
    <p class="text-muted-foreground text-sm">Popup was dismissed.</p>
    <Button variant="outline" size="sm" class="mt-3 gap-2" @click="handleReset">
      <Sparkles class="text-primary size-3.5" />
      Reopen Welcome Popup
    </Button>
  </div>
</template>

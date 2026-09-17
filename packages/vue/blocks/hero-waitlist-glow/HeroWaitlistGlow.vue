<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { ArrowRight, Check, CheckCircle2, Copy, Shield } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

type Role = 'frontend' | 'architect' | 'founder'

interface RoleOption {
  id: Role
  label: string
  perk: string
}

const roleOptions: RoleOption[] = [
  { id: 'frontend', label: 'Frontend / UI Engineer', perk: 'Direct access to raw SFC / TSX templates & Figma tokens' },
  { id: 'architect', label: 'Solutions Architect', perk: 'Full unbundled AST registry spec & self-hosting blueprints' },
  { id: 'founder', label: 'Founder / CTO', perk: 'Zero runtime dependency compliance & white-label enterprise SLA' },
]

const selectedRole = ref<Role>('frontend')
const email = ref('')
const isSubmitted = ref(false)
const queueNumber = ref<number | null>(null)
const referralCopied = ref(false)

// Countdown timer state
const timeLeft = ref({
  days: 14,
  hours: 8,
  minutes: 42,
  seconds: 19,
})

let timerInterval: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  timerInterval = setInterval(() => {
    if (timeLeft.value.seconds > 0) {
      timeLeft.value.seconds--
    } else {
      timeLeft.value.seconds = 59
      if (timeLeft.value.minutes > 0) {
        timeLeft.value.minutes--
      } else {
        timeLeft.value.minutes = 59
        if (timeLeft.value.hours > 0) {
          timeLeft.value.hours--
        }
      }
    }
  }, 1000)
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})

function submitWaitlist() {
  if (!email.value || !email.value.includes('@')) return
  queueNumber.value = Math.floor(Math.random() * 80) + 120
  isSubmitted.value = true
}

function copyReferral() {
  navigator.clipboard.writeText(`https://uipkge.dev/join?ref=${queueNumber.value || 142}`)
  referralCopied.value = true
  setTimeout(() => (referralCopied.value = false), 2000)
}

const activeRoleObj = computed(() => roleOptions.find((r) => r.id === selectedRole.value)!)
</script>

<template>
  <section
    data-slot="hero-waitlist-glow"
    class="bg-background relative overflow-hidden px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8"
  >
    <!-- Center Radial Glow -->
    <div
      class="bg-primary/15 pointer-events-none absolute top-1/4 left-1/2 -z-10 h-96 w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl"
    />

    <div class="mx-auto max-w-4xl space-y-10">
      <!-- Top Pill -->
      <div
        class="border-border bg-muted/40 inline-flex items-center gap-2 rounded-full border px-3.5 py-1 font-mono text-xs shadow-xs"
      >
        <span class="size-2 rounded-full bg-emerald-500" />
        <span class="text-foreground font-medium">Public Registry Release</span>
        <span class="text-muted-foreground">&bull;</span>
        <span class="text-primary font-semibold">96% Claimed</span>
      </div>

      <!-- Main Headline -->
      <div class="mx-auto max-w-3xl space-y-4">
        <h1 class="text-foreground text-4xl leading-[1.12] font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Unbundled UI components and composable application blocks.
        </h1>
        <p class="text-muted-foreground mx-auto max-w-2xl text-base leading-relaxed sm:text-lg">
          Join over thousands of developers building high-velocity web applications with unbundled Vue 3.5 & React 19
          components.
        </p>
      </div>

      <!-- Live Countdown Bar -->
      <div class="mx-auto grid max-w-md grid-cols-4 gap-3">
        <div class="border-border bg-card/60 rounded-xl border p-3 backdrop-blur-sm">
          <p class="text-foreground font-mono text-2xl font-bold">{{ String(timeLeft.days).padStart(2, '0') }}</p>
          <p class="text-muted-foreground mt-0.5 font-mono text-xs uppercase">Days</p>
        </div>
        <div class="border-border bg-card/60 rounded-xl border p-3 backdrop-blur-sm">
          <p class="text-foreground font-mono text-2xl font-bold">{{ String(timeLeft.hours).padStart(2, '0') }}</p>
          <p class="text-muted-foreground mt-0.5 font-mono text-xs uppercase">Hours</p>
        </div>
        <div class="border-border bg-card/60 rounded-xl border p-3 backdrop-blur-sm">
          <p class="text-foreground font-mono text-2xl font-bold">{{ String(timeLeft.minutes).padStart(2, '0') }}</p>
          <p class="text-muted-foreground mt-0.5 font-mono text-xs uppercase">Mins</p>
        </div>
        <div class="border-border bg-card/60 rounded-xl border p-3 backdrop-blur-sm">
          <p class="text-foreground font-mono text-2xl font-bold">{{ String(timeLeft.seconds).padStart(2, '0') }}</p>
          <p class="text-muted-foreground mt-0.5 font-mono text-xs uppercase">Secs</p>
        </div>
      </div>

      <!-- Interactive Waitlist Workbench Card -->
      <Card
        class="border-border bg-card/95 mx-auto max-w-2xl overflow-hidden rounded-2xl p-6 text-left shadow-sm backdrop-blur-md sm:p-8"
      >
        <div v-if="!isSubmitted" class="space-y-6">
          <!-- Role Selection Tabs -->
          <div class="space-y-2">
            <label class="text-muted-foreground font-mono text-xs tracking-wider uppercase">Select Your Track</label>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="opt in roleOptions"
                :key="opt.id"
                type="button"
                class="rounded-lg border p-2.5 text-center text-xs font-medium transition-all"
                :class="
                  selectedRole === opt.id
                    ? 'border-primary bg-primary/10 text-foreground font-semibold shadow-xs'
                    : 'border-border bg-background/50 text-muted-foreground hover:text-foreground'
                "
                @click="selectedRole = opt.id"
              >
                {{ opt.label.split(' ')[0] }}
              </button>
            </div>
            <p class="text-muted-foreground pt-1 text-xs italic">&rarr; {{ activeRoleObj.perk }}</p>
          </div>

          <!-- Email Input & Submit -->
          <form class="space-y-3" @submit.prevent="submitWaitlist">
            <div class="flex flex-col items-center gap-2 sm:flex-row">
              <Input
                v-model="email"
                type="email"
                placeholder="name@company.com"
                required
                class="bg-background h-11 font-mono text-sm"
              />
              <Button type="submit" size="lg" class="h-11 w-full shrink-0 gap-2 px-6 font-semibold sm:w-auto">
                <span>Get Started</span>
                <ArrowRight class="size-4" />
              </Button>
            </div>
            <p class="text-muted-foreground flex items-center gap-1.5 text-xs">
              <Shield class="size-3.5 text-emerald-500" />
              <span>Zero spam. Instant private registry token delivered upon verification.</span>
            </p>
          </form>
        </div>

        <!-- Success Queue State -->
        <div v-else class="space-y-5 py-4 text-center">
          <div
            class="mx-auto flex size-12 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
          >
            <CheckCircle2 class="size-6" />
          </div>

          <div class="space-y-1">
            <h3 class="text-foreground text-xl font-bold">You're on the list!</h3>
            <p class="text-primary font-mono text-xs font-semibold">Priority Spot: #{{ queueNumber }} in line</p>
            <p class="text-muted-foreground mx-auto max-w-sm text-xs">
              We dispatched an invitation link to <span class="text-foreground font-mono">{{ email }}</span
              >.
            </p>
          </div>

          <!-- Referral Link Box -->
          <div class="border-border bg-muted/30 mx-auto max-w-md space-y-2 rounded-xl border p-3">
            <div class="text-muted-foreground flex items-center justify-between font-mono text-xs">
              <span>Jump 5 spots per referral</span>
              <span class="font-bold text-emerald-500">+5 boost</span>
            </div>
            <div class="flex items-center gap-2">
              <Input
                readonly
                :value="`https://uipkge.dev/join?ref=${queueNumber}`"
                class="bg-background h-9 font-mono text-xs"
              />
              <Button type="button" size="sm" variant="outline" class="h-9 gap-1.5 px-3" @click="copyReferral">
                <Check v-if="referralCopied" class="size-3 text-emerald-500" />
                <Copy v-else class="size-3" />
                <span>{{ referralCopied ? 'Copied' : 'Copy' }}</span>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </section>
</template>

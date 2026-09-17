<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { ArrowRight, Timer, X } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const props = withDefaults(
  defineProps<{
    /** ISO timestamp the countdown runs to. */
    deadline?: string
    /** sessionStorage key holding the dismissal. */
    storageKey?: string
  }>(),
  {
    deadline: '',
    storageKey: 'uipkge:countdown-dismissed',
  },
)

const dismissed = ref(false)
// Null until mounted: the server has no clock the client agrees with, so the
// digits only appear once the timer is running.
const remaining = ref<number | null>(null)
let timer: ReturnType<typeof setInterval> | undefined

const target = computed(() => {
  const parsed = props.deadline ? Date.parse(props.deadline) : Number.NaN
  // Fall back to 72 hours out so the demo and a mis-set prop still read sensibly.
  return Number.isNaN(parsed) ? Date.now() + 72 * 60 * 60 * 1000 : parsed
})

const parts = computed(() => {
  const ms = Math.max(remaining.value ?? 0, 0)
  const total = Math.floor(ms / 1000)
  return [
    { label: 'd', value: Math.floor(total / 86400) },
    { label: 'h', value: Math.floor((total % 86400) / 3600) },
    { label: 'm', value: Math.floor((total % 3600) / 60) },
    { label: 's', value: total % 60 },
  ]
})

function dismiss() {
  dismissed.value = true
  try {
    window.sessionStorage.setItem(props.storageKey, '1')
  } catch {
    // Blocked storage: the dismissal still holds for this page view.
  }
}

onMounted(() => {
  try {
    dismissed.value = window.sessionStorage.getItem(props.storageKey) === '1'
  } catch {
    dismissed.value = false
  }
  const tick = () => (remaining.value = target.value - Date.now())
  tick()
  timer = setInterval(tick, 1000)
})

onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <div
    v-if="!dismissed"
    data-slot="announcement-countdown-bar"
    class="border-border bg-muted/60 border-b backdrop-blur"
  >
    <div class="mx-auto flex min-h-11 max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-6 py-2 text-sm">
      <Badge variant="secondary" class="shrink-0 gap-1.5">
        <Timer class="size-3" aria-hidden="true" />
        Ends soon
      </Badge>

      <p class="min-w-0">
        <span class="font-medium">Annual plans are 20% off</span>
        <span class="text-muted-foreground"> for teams that start before the quarter closes.</span>
      </p>

      <!-- tabular-nums + fixed-width cells keep the bar from reflowing each second. -->
      <div v-if="remaining !== null" class="text-muted-foreground flex items-center gap-1 font-mono text-xs">
        <span v-for="part in parts" :key="part.label" class="tabular-nums">
          <span class="text-foreground inline-block min-w-[2ch] text-right font-semibold">
            {{ String(part.value).padStart(2, '0') }} </span
          >{{ part.label }}
        </span>
      </div>

      <div class="ml-auto flex shrink-0 items-center gap-1">
        <Button variant="ghost" size="sm" class="h-7">
          Claim it
          <ArrowRight class="ml-1 size-3.5" aria-hidden="true" />
        </Button>
        <Separator orientation="vertical" class="hidden h-5 sm:block" />
        <Button variant="ghost" size="icon" class="size-7" aria-label="Dismiss announcement" @click="dismiss">
          <X class="size-3.5" aria-hidden="true" />
        </Button>
      </div>
    </div>
  </div>
</template>

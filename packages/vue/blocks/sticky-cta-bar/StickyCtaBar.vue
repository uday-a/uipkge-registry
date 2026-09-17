<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { Sparkles, X } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const props = withDefaults(
  defineProps<{
    /** Scroll distance in pixels before the bar reveals. */
    threshold?: number
    /** sessionStorage key holding the dismissal, so it stays closed for the session. */
    storageKey?: string
  }>(),
  {
    threshold: 480,
    storageKey: 'uipkge:sticky-cta-dismissed',
  },
)

// Starts hidden so server and first client render agree — the scroll handler
// is the only thing that reveals it.
const visible = ref(false)
const dismissed = ref(false)

function onScroll() {
  visible.value = !dismissed.value && window.scrollY > props.threshold
}

function dismiss() {
  dismissed.value = true
  visible.value = false
  try {
    window.sessionStorage.setItem(props.storageKey, '1')
  } catch {
    // Private browsing or blocked storage: dismissing still holds for this page view.
  }
}

onMounted(() => {
  try {
    dismissed.value = window.sessionStorage.getItem(props.storageKey) === '1'
  } catch {
    dismissed.value = false
  }
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="translate-y-full opacity-0"
    leave-active-class="transition duration-150 ease-in"
    leave-to-class="translate-y-full opacity-0"
  >
    <div
      v-show="visible"
      data-slot="sticky-cta-bar"
      class="fixed inset-x-0 bottom-0 z-50 px-4 pb-4"
      role="region"
      aria-label="Trial offer"
    >
      <div
        class="border-border bg-card/95 mx-auto flex max-w-4xl flex-wrap items-center gap-x-5 gap-y-3 rounded-xl border p-3 pl-4 shadow-lg backdrop-blur"
      >
        <Badge variant="secondary" class="gap-1.5">
          <Sparkles class="size-3" aria-hidden="true" />
          Free for 14 days
        </Badge>

        <p class="min-w-0 grow text-sm">
          <span class="font-medium">Start on the full plan.</span>
          <span class="text-muted-foreground"> No card, no sales call, cancel from the dashboard.</span>
        </p>

        <div class="flex items-center gap-2">
          <Button size="sm">Start free trial</Button>
          <Button size="sm" variant="ghost" class="hidden sm:inline-flex">Talk to us</Button>
          <Separator orientation="vertical" class="hidden h-6 sm:block" />
          <Button size="icon" variant="ghost" aria-label="Dismiss this offer" @click="dismiss">
            <X class="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  </Transition>
</template>

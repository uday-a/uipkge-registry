<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { ArrowRight, X } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

const props = withDefaults(defineProps<{ revealAt?: number }>(), { revealAt: 15 })

// Both start at rest so server and first client paint agree; the scroll handler
// is the only thing that reveals the bar or moves the progress.
const progress = ref(0)
const visible = ref(false)
const dismissed = ref(false)

function onScroll() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight
  const percent = scrollable > 0 ? Math.min(Math.round((window.scrollY / scrollable) * 100), 100) : 0
  progress.value = percent
  visible.value = !dismissed.value && percent >= props.revealAt
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
})
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
      data-slot="sticky-cta-reading-progress"
      class="border-border bg-card/95 fixed inset-x-0 bottom-0 z-50 border-t backdrop-blur"
      role="region"
      aria-label="Reading progress and trial offer"
    >
      <Progress :model-value="progress" class="h-0.5 rounded-none" aria-label="Reading progress" />

      <div class="mx-auto flex max-w-5xl flex-wrap items-center gap-x-5 gap-y-2 px-6 py-3">
        <Badge variant="secondary" class="shrink-0 tabular-nums">{{ progress }}% read</Badge>

        <p class="min-w-0 grow text-sm">
          <span class="font-medium">Finished the technical detail?</span>
          <span class="text-muted-foreground"> The trial runs on your real warehouse, read-only.</span>
        </p>

        <div class="flex shrink-0 items-center gap-2">
          <Button size="sm">
            Start free
            <ArrowRight class="ml-1.5 size-3.5" aria-hidden="true" />
          </Button>
          <Separator orientation="vertical" class="hidden h-5 sm:block" />
          <Button
            size="icon"
            variant="ghost"
            class="size-7"
            aria-label="Dismiss"
            @click="((dismissed = true), (visible = false))"
          >
            <X class="size-3.5" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  </Transition>
</template>

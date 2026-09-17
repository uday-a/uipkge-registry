<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { ArrowRight } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const props = withDefaults(defineProps<{ interval?: number }>(), { interval: 6000 })

const messages = [
  { label: 'New', text: 'Row-level scoping now evaluates against SCIM groups.', cta: 'Changelog' },
  { label: 'Event', text: 'Live walkthrough of the five-week rollout, every Thursday.', cta: 'Save a seat' },
  { label: 'Docs', text: 'The reconciliation checklist for your first close is published.', cta: 'Read it' },
]

const index = ref(0)
const paused = ref(false)
let timer: ReturnType<typeof setInterval> | undefined

function advance() {
  index.value = (index.value + 1) % messages.length
}

function start() {
  stop()
  timer = setInterval(() => {
    if (!paused.value) advance()
  }, props.interval)
}

function stop() {
  clearInterval(timer)
  timer = undefined
}

onMounted(start)
onBeforeUnmount(stop)
</script>

<template>
  <div
    data-slot="announcement-rotating-strip"
    class="border-border bg-muted/60 border-b backdrop-blur"
    @mouseenter="paused = true"
    @mouseleave="paused = false"
    @focusin="paused = true"
    @focusout="paused = false"
  >
    <div class="mx-auto flex h-11 max-w-6xl items-center gap-3 px-6 text-sm">
      <!-- aria-live announces the rotation to screen readers without stealing focus. -->
      <div class="flex min-w-0 flex-1 items-center gap-3" aria-live="polite" aria-atomic="true">
        <Badge variant="secondary" class="shrink-0">{{ messages[index].label }}</Badge>
        <p class="min-w-0 truncate">{{ messages[index].text }}</p>
        <Button variant="link" size="sm" class="hidden h-auto shrink-0 p-0 text-xs sm:inline-flex">
          {{ messages[index].cta }}
          <ArrowRight class="ml-1 size-3" aria-hidden="true" />
        </Button>
      </div>

      <div class="flex shrink-0 items-center gap-1.5">
        <button
          v-for="(message, i) in messages"
          :key="message.text"
          type="button"
          class="focus-visible:ring-ring size-1.5 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          :class="i === index ? 'bg-foreground' : 'bg-muted-foreground/40 hover:bg-muted-foreground'"
          :aria-label="`Show announcement ${i + 1} of ${messages.length}`"
          :aria-current="i === index ? 'true' : undefined"
          @click="index = i"
        />
      </div>
    </div>
  </div>
</template>

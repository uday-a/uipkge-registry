<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { ArrowRight, Sparkles, X } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const props = withDefaults(
  defineProps<{
    /** Milliseconds before the card slides in. */
    delay?: number
    /** sessionStorage key holding the dismissal. */
    storageKey?: string
  }>(),
  {
    delay: 1200,
    storageKey: 'uipkge:corner-announcement-dismissed',
  },
)

// Hidden on the server and on first paint; the delay timer is what reveals it.
const visible = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

function dismiss() {
  visible.value = false
  try {
    window.sessionStorage.setItem(props.storageKey, '1')
  } catch {
    // Blocked storage: the dismissal still holds for this page view.
  }
}

function wasDismissed() {
  try {
    return window.sessionStorage.getItem(props.storageKey) === '1'
  } catch {
    return false
  }
}

onMounted(() => {
  if (!wasDismissed()) timer = setTimeout(() => (visible.value = true), props.delay)
})

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="translate-y-4 opacity-0"
    leave-active-class="transition duration-200 ease-in"
    leave-to-class="translate-y-4 opacity-0"
  >
    <div
      v-show="visible"
      data-slot="announcement-corner-toast"
      class="fixed right-4 bottom-4 z-50 w-[22rem] max-w-[calc(100vw-2rem)]"
      role="complementary"
      aria-label="Product announcement"
    >
      <Card class="shadow-lg">
        <CardContent class="p-4">
          <div class="flex items-start gap-3">
            <span
              class="border-border bg-muted flex size-10 shrink-0 items-center justify-center rounded-lg border"
              aria-hidden="true"
            >
              <Sparkles class="text-primary size-4" />
            </span>
            <div class="min-w-0 flex-1">
              <Badge variant="secondary" class="mb-1.5">New</Badge>
              <p class="text-sm font-semibold">Scoping now follows SCIM groups</p>
              <p class="text-muted-foreground mt-1 text-xs leading-relaxed">
                Move someone between teams in your IdP and their dashboards follow within the sync window.
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              class="-mt-1 -mr-1 size-7 shrink-0"
              aria-label="Dismiss announcement"
              @click="dismiss"
            >
              <X class="size-3.5" aria-hidden="true" />
            </Button>
          </div>

          <Separator class="my-3" />

          <div class="flex items-center gap-2">
            <Button size="sm" class="h-7">
              Read the changelog
              <ArrowRight class="ml-1 size-3.5" aria-hidden="true" />
            </Button>
            <Button variant="ghost" size="sm" class="h-7" @click="dismiss">Not now</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </Transition>
</template>

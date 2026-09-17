<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Cookie } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const props = withDefaults(defineProps<{ storageKey?: string }>(), {
  storageKey: 'uipkge:consent',
})

const visible = ref(false)

function decide(choice: 'accepted' | 'rejected') {
  visible.value = false
  try {
    window.localStorage.setItem(props.storageKey, choice)
  } catch {
    // Blocked storage: the choice holds for this page view only.
  }
}

onMounted(() => {
  try {
    visible.value = !window.localStorage.getItem(props.storageKey)
  } catch {
    visible.value = true
  }
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
      v-if="visible"
      data-slot="cookie-consent-bar"
      class="border-border bg-card/95 fixed inset-x-0 bottom-0 z-50 border-t backdrop-blur"
      role="region"
      aria-label="Cookie consent"
    >
      <div class="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:gap-8">
        <div class="flex min-w-0 items-start gap-3">
          <Cookie class="text-muted-foreground mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <p class="text-sm font-medium">We store two things</p>
              <Badge variant="outline">No ad tracking</Badge>
            </div>
            <p class="text-muted-foreground mt-1 text-sm leading-relaxed">
              A session cookie so you stay signed in, and an analytics cookie recording which pages get read. Rejecting
              keeps the first and drops the second.
            </p>
          </div>
        </div>

        <Separator orientation="vertical" class="hidden h-10 lg:block" />

        <!-- Reject carries the same visual weight as accept. A ghost "reject"
             beside a solid "accept" is a dark pattern with extra steps. -->
        <div class="flex shrink-0 flex-wrap items-center gap-2">
          <Button variant="outline" @click="decide('rejected')">Reject analytics</Button>
          <Button @click="decide('accepted')">Accept</Button>
          <Button variant="ghost" size="sm">Manage</Button>
        </div>
      </div>
    </div>
  </Transition>
</template>

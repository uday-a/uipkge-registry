<script setup lang="ts">
import { ref } from 'vue'
import { Cookie } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'

interface Props {
  variant?: 'bottom-bar' | 'card'
}

withDefaults(defineProps<Props>(), {
  variant: 'bottom-bar',
})

const visible = ref(true)
const showPreferences = ref(false)
const analytics = ref(true)
const marketing = ref(false)

function dismiss() {
  visible.value = false
}
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-150 ease-out"
    enter-from-class="opacity-0"
    leave-active-class="transition-opacity duration-150 ease-in"
    leave-to-class="opacity-0"
  >
    <div v-if="visible" data-slot="cookie-consent-banner" role="dialog" aria-label="Cookie consent">
      <div v-if="variant === 'bottom-bar'" class="bg-card border-border w-full border-t px-4 py-4 sm:px-6">
        <div class="mx-auto flex max-w-5xl flex-col gap-4">
          <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div class="flex items-start gap-3">
              <span
                class="bg-primary/10 text-primary mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full"
              >
                <Cookie class="size-4" aria-hidden="true" />
              </span>
              <p class="text-muted-foreground max-w-xl text-sm leading-relaxed">
                We use cookies to improve your experience and analyze traffic. Read our
                <a
                  href="#"
                  class="text-foreground focus-visible:ring-ring rounded-sm font-medium underline underline-offset-4 outline-none focus-visible:ring-2"
                  >Cookie Policy</a
                >.
              </p>
            </div>
            <div class="flex shrink-0 flex-wrap items-center gap-2">
              <Button variant="ghost" size="sm" @click="showPreferences = !showPreferences">
                {{ showPreferences ? 'Hide preferences' : 'Customize' }}
              </Button>
              <Button variant="outline" size="sm" @click="dismiss">Reject</Button>
              <Button size="sm" @click="dismiss">Accept all</Button>
            </div>
          </div>

          <div v-if="showPreferences" class="flex flex-col gap-3">
            <Separator />
            <div class="flex items-center justify-between gap-4 py-1">
              <div>
                <p class="text-sm font-medium">Necessary</p>
                <p class="text-muted-foreground text-xs">Required for the site to function.</p>
              </div>
              <Switch :model-value="true" disabled aria-label="Necessary cookies" />
            </div>
            <div class="flex items-center justify-between gap-4 py-1">
              <div>
                <p class="text-sm font-medium">Analytics</p>
                <p class="text-muted-foreground text-xs">Helps us understand usage patterns.</p>
              </div>
              <Switch v-model="analytics" aria-label="Analytics cookies" />
            </div>
            <div class="flex items-center justify-between gap-4 py-1">
              <div>
                <p class="text-sm font-medium">Marketing</p>
                <p class="text-muted-foreground text-xs">Used to personalize campaigns.</p>
              </div>
              <Switch v-model="marketing" aria-label="Marketing cookies" />
            </div>
            <div class="mt-1 flex justify-end">
              <Button size="sm" @click="dismiss">Save preferences</Button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="bg-card border-border mx-auto max-w-md rounded-xl border p-6 shadow-xs">
        <div class="flex flex-col gap-4">
          <div class="flex items-start gap-3">
            <span class="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-full">
              <Cookie class="size-4" aria-hidden="true" />
            </span>
            <div>
              <h3 class="text-sm font-semibold">We value your privacy</h3>
              <p class="text-muted-foreground mt-1 text-sm leading-relaxed">
                We use cookies to improve your experience and analyze traffic. Read our
                <a
                  href="#"
                  class="text-foreground focus-visible:ring-ring rounded-sm font-medium underline underline-offset-4 outline-none focus-visible:ring-2"
                  >Cookie Policy</a
                >.
              </p>
            </div>
          </div>

          <template v-if="showPreferences">
            <Separator />
            <div class="flex items-center justify-between gap-4 py-1">
              <div>
                <p class="text-sm font-medium">Necessary</p>
                <p class="text-muted-foreground text-xs">Required for the site to function.</p>
              </div>
              <Switch :model-value="true" disabled aria-label="Necessary cookies" />
            </div>
            <div class="flex items-center justify-between gap-4 py-1">
              <div>
                <p class="text-sm font-medium">Analytics</p>
                <p class="text-muted-foreground text-xs">Helps us understand usage patterns.</p>
              </div>
              <Switch v-model="analytics" aria-label="Analytics cookies" />
            </div>
            <div class="flex items-center justify-between gap-4 py-1">
              <div>
                <p class="text-sm font-medium">Marketing</p>
                <p class="text-muted-foreground text-xs">Used to personalize campaigns.</p>
              </div>
              <Switch v-model="marketing" aria-label="Marketing cookies" />
            </div>
          </template>

          <div class="flex flex-wrap items-center gap-2">
            <Button variant="ghost" size="sm" @click="showPreferences = !showPreferences">
              {{ showPreferences ? 'Hide preferences' : 'Customize' }}
            </Button>
            <div class="ml-auto flex items-center gap-2">
              <Button variant="outline" size="sm" @click="dismiss">Reject</Button>
              <Button size="sm" @click="dismiss">
                {{ showPreferences ? 'Save preferences' : 'Accept all' }}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

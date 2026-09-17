<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { Check, Mail } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

const props = withDefaults(defineProps<{ storageKey?: string }>(), {
  storageKey: 'uipkge:exit-newsletter-seen',
})

const open = ref(false)
const email = ref('')
const submitted = ref(false)

function onPointerOut(event: MouseEvent) {
  // Top edge only: leaving sideways is usually the scrollbar or another window.
  if (event.relatedTarget || event.clientY > 4) return
  try {
    if (window.sessionStorage.getItem(props.storageKey) === '1') return
    window.sessionStorage.setItem(props.storageKey, '1')
  } catch {
    // Blocked storage: shows once more this page view, never in a loop.
  }
  open.value = true
  document.removeEventListener('mouseout', onPointerOut)
}

function subscribe() {
  if (!email.value.trim()) return
  submitted.value = true
}

onMounted(() => document.addEventListener('mouseout', onPointerOut))
onBeforeUnmount(() => document.removeEventListener('mouseout', onPointerOut))
</script>

<template>
  <div data-slot="exit-intent-newsletter">
    <Dialog v-model:open="open">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <Badge variant="secondary" class="w-fit gap-1.5">
            <Mail class="size-3" aria-hidden="true" />
            Monthly notes
          </Badge>
          <DialogTitle class="mt-3 text-xl leading-snug text-balance">
            Not ready to trial? Take the writing instead
          </DialogTitle>
          <DialogDescription class="leading-relaxed">
            Last issue: “Why we version metric definitions instead of dashboards.” One email a month, no product
            announcements, unsubscribe in one click.
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <form @submit.prevent="subscribe">
          <div class="flex gap-2">
            <Input
              v-model="email"
              type="email"
              required
              placeholder="you@company.com"
              autocomplete="email"
              aria-label="Email address"
            />
            <Button type="submit" class="shrink-0">Subscribe</Button>
          </div>
          <p class="mt-2 min-h-5 text-xs" aria-live="polite">
            <span v-if="submitted" class="text-success inline-flex items-center gap-1.5">
              <Check class="size-3" aria-hidden="true" />
              Check your inbox to confirm.
            </span>
            <span v-else class="text-muted-foreground">8,400 subscribers, mostly data and finance engineers.</span>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>

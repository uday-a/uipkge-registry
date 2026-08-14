<script setup lang="ts">
import { ref } from 'vue'
import { Check, Mail } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const email = ref('')
const submitted = ref(false)

function subscribe() {
  if (!email.value.trim()) return
  submitted.value = true
}
</script>

<template>
  <section data-slot="newsletter-inline-band" class="border-border bg-muted/40 border-y">
    <div class="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 lg:flex-row lg:items-center lg:gap-12">
      <div class="min-w-0 lg:flex-1">
        <div class="flex items-center gap-2">
          <Mail class="text-muted-foreground size-4" aria-hidden="true" />
          <Badge variant="secondary">Monthly</Badge>
        </div>
        <p class="mt-2.5 text-lg leading-snug font-medium text-balance">
          Engineering notes on metric modelling, access control, and warehouse cost.
        </p>
        <p class="text-muted-foreground mt-1.5 text-sm">
          Read by 8,400 data and finance engineers. One email a month, no product announcements.
        </p>
      </div>

      <form class="lg:w-[26rem] lg:shrink-0" @submit.prevent="subscribe">
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
        <!-- Status row is reserved from first paint, so confirming does not
             nudge the band's height and shift the page under the cursor. -->
        <p class="mt-2 min-h-5 text-xs" aria-live="polite">
          <span v-if="submitted" class="text-success inline-flex items-center gap-1.5">
            <Check class="size-3" aria-hidden="true" />
            Check your inbox to confirm.
          </span>
          <span v-else class="text-muted-foreground">Unsubscribe in one click. We never share the list.</span>
        </p>
      </form>
    </div>
  </section>
</template>

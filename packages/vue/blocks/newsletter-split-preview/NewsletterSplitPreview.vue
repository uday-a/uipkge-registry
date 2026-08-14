<script setup lang="ts">
import { ref } from 'vue'
import { Check, Mail } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

const lastIssue = {
  subject: 'Why we version metric definitions instead of dashboards',
  date: 'Feb 18, 2026',
  readTime: '9 min',
  opening:
    'Dashboards are the output. The definition is the thing teams argue about, so that is what belongs under review — with a diff, an owner, and a revert path. This issue walks through what changed when we moved ours into the repo.',
}

const email = ref('')
const submitted = ref(false)

function subscribe() {
  if (!email.value.trim()) return
  submitted.value = true
}
</script>

<template>
  <section data-slot="newsletter-split-preview" class="bg-background">
    <div class="mx-auto max-w-6xl px-6 py-20 lg:py-28">
      <div class="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <Badge variant="secondary" class="gap-1.5">
            <Mail class="size-3" aria-hidden="true" />
            Monthly
          </Badge>
          <h2 class="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Notes from the people who build it
          </h2>
          <p class="text-muted-foreground mt-3 text-lg">
            One email a month on metric modelling, access control, and warehouse cost. No product announcements.
          </p>

          <form class="mt-6 max-w-md" @submit.prevent="subscribe">
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
              <span v-else class="text-muted-foreground">8,400 subscribers · unsubscribe in one click.</span>
            </p>
          </form>
        </div>

        <!-- Showing the last issue is the point: nobody should have to subscribe
             to find out what they are subscribing to. -->
        <Card>
          <CardContent class="p-6">
            <div class="flex flex-wrap items-center gap-3">
              <Badge variant="outline">Last issue</Badge>
              <span class="text-muted-foreground text-xs">{{ lastIssue.date }} · {{ lastIssue.readTime }}</span>
            </div>

            <h3 class="mt-4 text-lg leading-snug font-semibold tracking-tight text-balance">
              {{ lastIssue.subject }}
            </h3>

            <Separator class="my-4" />

            <p class="text-muted-foreground text-sm leading-relaxed">{{ lastIssue.opening }}</p>

            <Button variant="link" class="mt-4 h-auto p-0 text-sm">Read the full issue</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Check, Layers, Link2, ShieldCheck, Sparkles, Zap } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

const email = ref('')
const submitted = ref(false)
const position = ref(214)

const benefits = [
  { icon: Zap, title: 'Ships in minutes', copy: 'Drop-in blocks and primitives, not boilerplate to rewrite.' },
  {
    icon: ShieldCheck,
    title: 'Own the code',
    copy: 'Every file is copied into your repo. Edit it freely, no lock-in.',
  },
  { icon: Layers, title: 'Dual framework', copy: 'Vue and React mirrors stay in lockstep across every component.' },
]

function handleSubmit() {
  if (!email.value.includes('@')) return
  submitted.value = true
}
</script>

<template>
  <section data-slot="waitlist" class="bg-background grid min-h-screen lg:grid-cols-2">
    <div class="bg-muted/40 relative flex items-center px-6 py-16 lg:border-r lg:px-16">
      <div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div class="bg-primary/10 -top-32 left-1/3 size-[420px] rounded-full blur-3xl" />
      </div>

      <div class="max-w-lg">
        <div class="flex items-center gap-3">
          <div class="bg-primary text-primary-foreground grid size-10 place-items-center rounded-lg shadow-sm">
            <Sparkles class="size-5" />
          </div>
          <span class="text-sm font-semibold tracking-tight">Northwind</span>
        </div>

        <h1 class="mt-8 text-3xl font-semibold tracking-tight sm:text-4xl">Be first in line when we launch</h1>
        <p class="text-muted-foreground mt-4 text-base sm:text-lg">
          We&rsquo;re onboarding a small cohort of teams each week. Join the waitlist and we&rsquo;ll save your spot.
        </p>

        <ul class="mt-10 space-y-6">
          <li v-for="benefit in benefits" :key="benefit.title" class="flex gap-4">
            <div class="bg-primary/10 text-primary grid size-9 shrink-0 place-items-center rounded-lg">
              <component :is="benefit.icon" class="size-4.5" />
            </div>
            <div>
              <p class="text-sm font-medium">{{ benefit.title }}</p>
              <p class="text-muted-foreground mt-1 text-sm">{{ benefit.copy }}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div class="flex items-center justify-center px-6 py-16">
      <Card class="w-full max-w-md">
        <template v-if="!submitted">
          <CardHeader>
            <CardTitle>Join the waitlist</CardTitle>
            <CardDescription
              >Early access rolls out weekly. No spam &mdash; one email when it&rsquo;s your turn.</CardDescription
            >
          </CardHeader>
          <CardContent>
            <form class="space-y-3" @submit.prevent="handleSubmit">
              <Input v-model="email" type="email" placeholder="you@company.com" required />
              <Button type="submit" class="w-full">Request access</Button>
            </form>
            <p class="text-muted-foreground mt-4 text-xs">2,300+ teams already in line</p>
          </CardContent>
        </template>

        <template v-else>
          <CardContent class="pt-6 text-center">
            <div class="bg-primary/10 text-primary mx-auto grid size-12 place-items-center rounded-full">
              <Check class="size-6" />
            </div>
            <h2 class="mt-5 text-2xl font-semibold tracking-tight">You&rsquo;re #{{ position }} in line</h2>
            <p class="text-muted-foreground mt-2 text-sm">
              We&rsquo;ll email {{ email }} as soon as your spot opens up.
            </p>
            <div class="bg-muted/50 mt-6 flex items-start gap-3 rounded-lg border p-4 text-left">
              <Link2 class="text-muted-foreground mt-0.5 size-4 shrink-0" />
              <p class="text-muted-foreground text-xs">
                Want to skip the queue? Share your invite link after launch &mdash; every friend who signs up moves you
                up 5 spots.
              </p>
            </div>
          </CardContent>
        </template>
      </Card>
    </div>
  </section>
</template>

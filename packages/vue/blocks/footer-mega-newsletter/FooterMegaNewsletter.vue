<script setup lang="ts">
import { ref } from 'vue'
import { ArrowRight, Check, Github, Linkedin, Sparkles, Youtube } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

const sections = [
  { heading: 'Product', links: ['Metric layer', 'Dashboards', 'Alerting', 'Embedding', 'Changelog'] },
  { heading: 'Solutions', links: ['Finance', 'RevOps', 'Analytics', 'Engineering'] },
  { heading: 'Developers', links: ['Documentation', 'API reference', 'CLI', 'Status'] },
  { heading: 'Company', links: ['About', 'Careers', 'Customers', 'Press kit'] },
  { heading: 'Legal', links: ['Privacy', 'Terms', 'DPA', 'Subprocessors'] },
]

const email = ref('')
const submitted = ref(false)

function subscribe() {
  if (!email.value.trim()) return
  submitted.value = true
}
</script>

<template>
  <footer data-slot="footer-mega-newsletter" class="border-border bg-background border-t">
    <div class="mx-auto max-w-6xl px-6 py-14">
      <div class="grid gap-12 lg:grid-cols-[22rem_1fr] lg:gap-16">
        <div>
          <a href="#top" class="flex items-center gap-2 font-semibold tracking-tight">
            <Sparkles class="text-primary size-5" aria-hidden="true" />
            Northwind
          </a>
          <p class="text-muted-foreground mt-3 max-w-sm text-sm leading-relaxed">
            One certified metric layer between your warehouse and everything downstream.
          </p>

          <form class="mt-6" @submit.prevent="subscribe">
            <label for="footer-email" class="text-sm font-medium">Monthly engineering notes</label>
            <div class="mt-2 flex gap-2">
              <Input
                id="footer-email"
                v-model="email"
                type="email"
                placeholder="you@company.com"
                autocomplete="email"
                class="max-w-64"
              />
              <Button type="submit">
                Subscribe
                <ArrowRight class="ml-1.5 size-3.5" aria-hidden="true" />
              </Button>
            </div>
            <!-- Status line reserves its own row, so confirming does not shift the columns. -->
            <p class="text-muted-foreground mt-2 min-h-5 text-xs">
              <span v-if="submitted" class="text-success inline-flex items-center gap-1.5">
                <Check class="size-3" aria-hidden="true" />
                Check your inbox to confirm.
              </span>
              <span v-else>One email a month. Unsubscribe in one click.</span>
            </p>
          </form>
        </div>

        <div class="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          <div v-for="section in sections" :key="section.heading">
            <p class="text-muted-foreground/70 text-xs font-medium tracking-wide uppercase">{{ section.heading }}</p>
            <ul class="mt-3 space-y-2">
              <li v-for="link in section.links" :key="link">
                <a href="#" class="text-muted-foreground hover:text-foreground text-sm transition-colors">{{ link }}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Separator class="my-10" />

      <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
        <p class="text-muted-foreground text-xs">© 2026 Northwind Data, Inc. All rights reserved.</p>
        <Badge variant="outline" class="w-fit">SOC 2 Type II</Badge>
        <div class="flex items-center gap-1 sm:ml-auto">
          <Button variant="ghost" size="icon" class="size-8" aria-label="GitHub">
            <Github class="size-4" aria-hidden="true" />
          </Button>
          <Button variant="ghost" size="icon" class="size-8" aria-label="LinkedIn">
            <Linkedin class="size-4" aria-hidden="true" />
          </Button>
          <Button variant="ghost" size="icon" class="size-8" aria-label="YouTube">
            <Youtube class="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { Github, Linkedin, Sparkles } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const sections = [
  { heading: 'Platform', links: ['Metric layer', 'Governance', 'Alerting', 'Embedding'] },
  { heading: 'Company', links: ['About', 'Careers', 'Customers', 'Press kit'] },
  { heading: 'Resources', links: ['Documentation', 'Guides', 'Benchmarks', 'Status'] },
]
</script>

<template>
  <footer data-slot="footer-brand-statement" class="border-border bg-background border-t">
    <div class="mx-auto max-w-6xl px-6 py-16">
      <a href="#top" class="flex w-fit items-center gap-2 font-semibold tracking-tight">
        <Sparkles class="text-primary size-5" aria-hidden="true" />
        Northwind
      </a>

      <!-- The statement is the only oversized type on the page. Keep it to one
           sentence; at this size a second one stops being read. -->
      <p class="mt-8 max-w-3xl text-2xl leading-tight font-medium tracking-tight text-balance sm:text-3xl">
        Every number your company acts on should have one definition, one owner, and a history you can read.
      </p>
      <p class="text-muted-foreground mt-4 max-w-xl text-sm leading-relaxed">
        That is the whole product. Everything else here is detail.
      </p>

      <Separator class="my-12" />

      <div class="grid grid-cols-2 gap-8 sm:grid-cols-3">
        <div v-for="section in sections" :key="section.heading">
          <p class="text-muted-foreground/70 text-xs font-medium tracking-wide uppercase">{{ section.heading }}</p>
          <ul class="mt-3 space-y-2">
            <li v-for="link in section.links" :key="link">
              <a href="#" class="text-muted-foreground hover:text-foreground text-sm transition-colors">{{ link }}</a>
            </li>
          </ul>
        </div>
      </div>

      <Separator class="my-10" />

      <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div class="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
          <span>© 2026 Northwind Data, Inc.</span>
          <a href="#privacy" class="hover:text-foreground transition-colors">Privacy</a>
          <a href="#terms" class="hover:text-foreground transition-colors">Terms</a>
          <a href="mailto:hello@northwind.example" class="hover:text-foreground transition-colors">
            hello@northwind.example
          </a>
        </div>
        <div class="flex items-center gap-2 sm:ml-auto">
          <Badge variant="outline">SOC 2 Type II</Badge>
          <Badge variant="outline">GDPR</Badge>
          <Button variant="ghost" size="icon" class="size-8" aria-label="GitHub">
            <Github class="size-4" aria-hidden="true" />
          </Button>
          <Button variant="ghost" size="icon" class="size-8" aria-label="LinkedIn">
            <Linkedin class="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  </footer>
</template>

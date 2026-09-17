<script setup lang="ts">
import { ref } from 'vue'
import { Github, Linkedin, Sparkles } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

const sections = [
  { heading: 'Platform', links: ['Metric layer', 'Dashboards', 'Alerting', 'Embedding', 'API', 'CLI'] },
  { heading: 'Solutions', links: ['Finance', 'RevOps', 'Analytics', 'Engineering', 'Healthcare', 'Retail'] },
  { heading: 'Developers', links: ['Documentation', 'API reference', 'SDKs', 'Webhooks', 'Status', 'Changelog'] },
  { heading: 'Resources', links: ['Guides', 'Benchmarks', 'Customers', 'Blog', 'Webinars', 'Glossary'] },
  { heading: 'Company', links: ['About', 'Careers', 'Press kit', 'Partners', 'Contact', 'Security'] },
  { heading: 'Legal', links: ['Privacy', 'Terms', 'DPA', 'Subprocessors', 'SLA', 'Accessibility'] },
]

const region = ref('eu')
const currency = ref('eur')
</script>

<template>
  <footer data-slot="footer-sitemap-dense" class="border-border bg-background border-t">
    <div class="mx-auto max-w-6xl px-6 py-12">
      <div class="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
        <div v-for="section in sections" :key="section.heading">
          <p class="text-muted-foreground/70 text-xs font-medium tracking-wide uppercase">{{ section.heading }}</p>
          <ul class="mt-3 space-y-1.5">
            <li v-for="link in section.links" :key="link">
              <a href="#" class="text-muted-foreground hover:text-foreground text-sm transition-colors">{{ link }}</a>
            </li>
          </ul>
        </div>
      </div>

      <Separator class="my-10" />

      <div class="flex flex-col gap-6 lg:flex-row lg:items-center">
        <a href="#top" class="flex shrink-0 items-center gap-2 text-sm font-semibold tracking-tight">
          <Sparkles class="text-primary size-4" aria-hidden="true" />
          Northwind
        </a>

        <div class="flex flex-wrap items-center gap-2">
          <Select v-model="region">
            <SelectTrigger class="h-8 w-40 text-xs" aria-label="Data region">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="eu">EU (Frankfurt)</SelectItem>
              <SelectItem value="us">US (Virginia)</SelectItem>
              <SelectItem value="au">AU (Sydney)</SelectItem>
            </SelectContent>
          </Select>

          <Select v-model="currency">
            <SelectTrigger class="h-8 w-28 text-xs" aria-label="Currency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="eur">EUR €</SelectItem>
              <SelectItem value="usd">USD $</SelectItem>
              <SelectItem value="gbp">GBP £</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="flex flex-wrap items-center gap-3 lg:ml-auto">
          <!-- Status dot is a live indicator, so it carries its own text for
               screen readers rather than relying on colour alone. -->
          <a href="#status" class="hover:bg-muted flex items-center gap-2 rounded-md px-2 py-1 transition-colors">
            <span class="bg-success size-2 rounded-full" aria-hidden="true" />
            <span class="text-muted-foreground text-xs">All systems operational</span>
          </a>
          <Badge variant="outline">SOC 2</Badge>
          <Badge variant="outline">GDPR</Badge>
          <Button variant="ghost" size="icon" class="size-8" aria-label="GitHub">
            <Github class="size-4" aria-hidden="true" />
          </Button>
          <Button variant="ghost" size="icon" class="size-8" aria-label="LinkedIn">
            <Linkedin class="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      <p class="text-muted-foreground mt-6 text-xs">© 2026 Northwind Data, Inc. All rights reserved.</p>
    </div>
  </footer>
</template>

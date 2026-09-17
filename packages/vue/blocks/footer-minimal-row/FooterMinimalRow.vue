<script setup lang="ts">
import { Github, Linkedin, Sparkles } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const links = [
  { label: 'Product', href: '#product' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Docs', href: '#docs' },
  { label: 'Privacy', href: '#privacy' },
  { label: 'Terms', href: '#terms' },
]
</script>

<template>
  <footer data-slot="footer-minimal-row" class="border-border bg-background border-t">
    <div class="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center">
      <a href="#top" class="flex shrink-0 items-center gap-2 text-sm font-semibold tracking-tight">
        <Sparkles class="text-primary size-4" aria-hidden="true" />
        Northwind
      </a>

      <Separator orientation="vertical" class="hidden h-4 sm:block" />

      <nav class="flex flex-wrap items-center gap-x-5 gap-y-2" aria-label="Footer">
        <a
          v-for="link in links"
          :key="link.href"
          :href="link.href"
          class="text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          {{ link.label }}
        </a>
      </nav>

      <div class="flex items-center gap-1 sm:ml-auto">
        <Button variant="ghost" size="icon" class="size-8" aria-label="GitHub">
          <Github class="size-4" aria-hidden="true" />
        </Button>
        <Button variant="ghost" size="icon" class="size-8" aria-label="LinkedIn">
          <Linkedin class="size-4" aria-hidden="true" />
        </Button>
        <span class="text-muted-foreground ml-2 text-xs">© 2026 Northwind</span>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ArrowRight, CircleAlert, Info } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

withDefaults(defineProps<{ tone?: 'neutral' | 'attention' }>(), { tone: 'neutral' })
</script>

<template>
  <section
    data-slot="announcement-banner-split"
    class="border-b"
    :class="tone === 'attention' ? 'border-border bg-muted' : 'border-border bg-card'"
  >
    <div class="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:gap-8">
      <!-- Message column carries the classification; the action column stays
           the same width whatever the message length, so a stack of these
           banners aligns down the page. -->
      <div class="flex min-w-0 flex-1 items-start gap-3">
        <component
          :is="tone === 'attention' ? CircleAlert : Info"
          class="mt-0.5 size-4 shrink-0"
          :class="tone === 'attention' ? 'text-destructive' : 'text-muted-foreground'"
          aria-hidden="true"
        />
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-2">
            <Badge :variant="tone === 'attention' ? 'outline' : 'secondary'">
              {{ tone === 'attention' ? 'Scheduled maintenance' : 'Release 2.4.0' }}
            </Badge>
            <span class="text-muted-foreground font-mono text-xs">Aug 14, 2026 · 02:00–04:00 UTC</span>
          </div>
          <p class="mt-1.5 text-sm leading-relaxed">
            <template v-if="tone === 'attention'">
              Query serving stays online. Scheduled materialisation pauses for the window and resumes automatically.
            </template>
            <template v-else>
              Command palette, table virtualisation past 10k rows, and AA-contrast sidebar badges in dark mode.
            </template>
          </p>
        </div>
      </div>

      <Separator orientation="vertical" class="hidden h-10 sm:block" />

      <div class="flex shrink-0 items-center gap-2">
        <Button variant="outline" size="sm">
          {{ tone === 'attention' ? 'Status page' : 'Full changelog' }}
          <ArrowRight class="ml-1.5 size-3.5" aria-hidden="true" />
        </Button>
        <Button variant="ghost" size="sm">Subscribe</Button>
      </div>
    </div>
  </section>
</template>

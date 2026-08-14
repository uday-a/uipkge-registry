<script setup lang="ts">
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

// One sentence each. The row is a proof band, not a testimonial section — if a
// quote needs two sentences it belongs in a card layout instead.
const quotes = [
  {
    wordmark: 'Northwind',
    quote: 'Close starts from a reconciled position now, which it never did before.',
    author: 'Erin Walsh',
    role: 'VP Finance',
    initials: 'EW',
  },
  {
    wordmark: 'Halden',
    quote: 'Clinic leads answer their own questions without filing a ticket.',
    author: 'Daniel Brooks',
    role: 'Head of Analytics',
    initials: 'DB',
  },
  {
    wordmark: 'Verity',
    quote: 'Sales and finance forecast off one definition, so review is about the plan.',
    author: 'Priya Raman',
    role: 'RevOps Director',
    initials: 'PR',
  },
]
</script>

<template>
  <section data-slot="testimonial-logo-quote-row" class="bg-background">
    <div class="mx-auto max-w-6xl px-6 py-16">
      <div class="grid gap-8 md:grid-cols-3 md:gap-10">
        <figure v-for="(entry, index) in quotes" :key="entry.wordmark" class="relative">
          <span class="text-sm font-semibold tracking-[0.18em] uppercase">{{ entry.wordmark }}</span>
          <blockquote class="mt-4 text-sm leading-relaxed text-pretty">“{{ entry.quote }}”</blockquote>
          <figcaption class="mt-5 flex items-center gap-3">
            <Avatar class="size-8">
              <AvatarFallback class="text-xs">{{ entry.initials }}</AvatarFallback>
            </Avatar>
            <div class="min-w-0">
              <p class="truncate text-xs font-medium">{{ entry.author }}</p>
              <p class="text-muted-foreground truncate text-xs">{{ entry.role }}</p>
            </div>
          </figcaption>

          <!-- Vertical rules between columns only, so the row reads as one band. -->
          <Separator
            v-if="index < quotes.length - 1"
            orientation="vertical"
            class="absolute top-0 -right-5 hidden h-full md:block"
          />
        </figure>
      </div>
    </div>
  </section>
</template>

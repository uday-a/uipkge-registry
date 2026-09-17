<script setup lang="ts">
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

const quotes = [
  { quote: 'Close starts from a reconciled position now.', author: 'Erin Walsh', role: 'VP Finance', initials: 'EW' },
  {
    quote: 'The request queue went away and stayed away.',
    author: 'Daniel Brooks',
    role: 'Head of Analytics',
    initials: 'DB',
  },
  {
    quote: 'One pipeline definition, two teams, no argument.',
    author: 'Priya Raman',
    role: 'RevOps Director',
    initials: 'PR',
  },
  {
    quote: 'We deleted eleven spreadsheets in one quarter.',
    author: 'Marcus Ellery',
    role: 'Staff Engineer',
    initials: 'ME',
  },
  {
    quote: 'Auditors get a change log instead of a folder.',
    author: 'Sophie Lindqvist',
    role: 'Controller',
    initials: 'SL',
  },
  { quote: 'Permissions finally match the org chart.', author: 'Tom Fairbanks', role: 'IT Director', initials: 'TF' },
  {
    quote: 'Nobody has written a bespoke extract since March.',
    author: 'Anna Reyes',
    role: 'Data Lead',
    initials: 'AR',
  },
  { quote: 'Forecast review is about the forecast again.', author: 'Grace Whitlock', role: 'CFO', initials: 'GW' },
]

const rowOne = quotes.slice(0, 4)
const rowTwo = quotes.slice(4)
</script>

<template>
  <section data-slot="testimonial-marquee-scroll" class="bg-background overflow-hidden">
    <div class="mx-auto max-w-6xl px-6 pt-20 lg:pt-28">
      <div class="max-w-2xl">
        <Badge variant="secondary">What people say</Badge>
        <h2 class="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Eight hundred teams, unprompted</h2>
      </div>
    </div>

    <!-- Edge masks fade the rows into the page so cards never end mid-cut. -->
    <div class="marquee relative mt-10 space-y-4 pb-20 lg:pb-28">
      <div v-for="(row, index) in [rowOne, rowTwo]" :key="index" class="marquee__row">
        <div class="marquee__track" :class="index === 1 ? 'marquee__track--reverse' : ''">
          <!-- Duplicated once so the loop has an identical second half to scroll into. -->
          <Card v-for="(entry, i) in [...row, ...row]" :key="`${entry.author}-${i}`" class="w-80 shrink-0">
            <CardContent class="p-5">
              <blockquote class="text-sm leading-relaxed">“{{ entry.quote }}”</blockquote>
              <div class="mt-4 flex items-center gap-3">
                <Avatar class="size-8">
                  <AvatarFallback class="text-xs">{{ entry.initials }}</AvatarFallback>
                </Avatar>
                <div class="min-w-0">
                  <p class="truncate text-xs font-medium">{{ entry.author }}</p>
                  <p class="text-muted-foreground truncate text-xs">{{ entry.role }}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Keyframes and the edge mask cannot be expressed as utilities; everything else
   stays in the template. Matches the approach in logo-ticker-infinite. */
@keyframes marquee-scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.marquee {
  mask-image: linear-gradient(to right, transparent, black 6rem, black calc(100% - 6rem), transparent);
}

.marquee__row {
  overflow: hidden;
}

.marquee__track {
  display: flex;
  width: max-content;
  gap: 1rem;
  animation: marquee-scroll 46s linear infinite;
}

.marquee__track--reverse {
  animation-direction: reverse;
}

.marquee__row:hover .marquee__track {
  animation-play-state: paused;
}

@media (prefers-reduced-motion: reduce) {
  .marquee__track {
    animation: none;
  }
  .marquee__row {
    overflow-x: auto;
  }
}
</style>

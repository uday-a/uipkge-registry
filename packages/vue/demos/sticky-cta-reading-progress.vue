<script setup lang="ts">
import StickyCtaReadingProgress from '@/components/blocks/sticky-cta-reading-progress/StickyCtaReadingProgress.vue'
// StickyCtaReadingProgress is the block file the user installs. Open
// `components/blocks/StickyCtaReadingProgress.vue` after install to change
// the reveal point. Progress is computed from scroll position on mount. The
// filler paragraphs below only exist so the demo has something to scroll —
// the bar needs a page taller than the viewport before it can reveal.
const paragraphs = [
  'The bar reveals once the reader is fifteen percent down the page — early enough to catch skimmers, late enough that it reads as a follow-up rather than a banner.',
  'The progress meter is the same scroll measurement, so the offer always sits next to a live indicator of how much is left.',
  'It renders hidden on the server and on the first client paint, so there is no hydration mismatch and no flash of a bar that then disappears.',
  'Keep scrolling — past the reveal point the bar slides up and the meter fills as you go. Dismiss it and it stays dismissed.',
]
</script>

<template>
  <Story
    title="Sticky CTA — Reading Progress"
    description="A sticky bar doubling as a reading-progress indicator: it reveals partway down a long page and reports how much remains."
  >
    <div class="mx-auto max-w-2xl space-y-6 pb-40">
      <p v-for="(paragraph, index) in paragraphs" :key="index" class="text-muted-foreground leading-relaxed">
        {{ paragraph }}
      </p>
      <p
        v-for="(paragraph, index) in [...paragraphs, ...paragraphs, ...paragraphs]"
        :key="`repeat-${index}`"
        class="text-muted-foreground leading-relaxed"
      >
        {{ paragraph }}
      </p>
    </div>
    <StickyCtaReadingProgress />
  </Story>
</template>

<script setup lang="ts">
import NewsletterInlineBand from '@/components/blocks/newsletter-inline-band/NewsletterInlineBand.vue'
// NewsletterInlineBand is the block file the user installs. Open
// `components/blocks/NewsletterInlineBand.vue` after install to wire the
// submit handler; validation is the browser's own email type.
</script>

<template>
  <Story
    title="Newsletter — Inline Band"
    description="Slim signup band: inline field, submit, subscriber count as proof, and a status row that is reserved up front so confirming does not shift the page."
  >
    <NewsletterInlineBand />
  </Story>
</template>

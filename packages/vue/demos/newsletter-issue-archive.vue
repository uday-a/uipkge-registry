<script setup lang="ts">
import NewsletterIssueArchive from '@/components/blocks/newsletter-issue-archive/NewsletterIssueArchive.vue'
</script>

<template>
  <Story
    title="Default"
    description="Substack/Beehiiv style publication archive with hero subscription form, featured issue spotlight, interactive category filtering, live search, and edition cards."
  >
    <NewsletterIssueArchive />
  </Story>

  <Story
    title="Custom Publication Branding"
    description="Archive customized for a specialized frontend architecture digest with tailored headline, description, and subscriber counter."
  >
    <NewsletterIssueArchive
      publication-name="Design Tokens Dispatch"
      subtitle="In-depth explorations of modern multi-brand token pipelines, OKLCH color science, and component registry infrastructure."
      subscriber-count="18,200+ Subscribers · Top 5% on Substack"
    />
  </Story>
</template>

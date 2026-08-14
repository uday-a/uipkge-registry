<script setup lang="ts">
import SocialMediaPostScheduler from '@/components/blocks/social-media-post-scheduler/SocialMediaPostScheduler.vue'
</script>

<template>
  <Story
    title="Default multi-channel composer"
    description="Buffer and Hootsuite style social post composer and scheduler with target channel toggles, character limit monitoring, hashtag and emoji quick insert, media dropzone, optimal engagement scheduling, and high-fidelity live social feed previews."
  >
    <SocialMediaPostScheduler />
  </Story>

  <Story
    title="Product launch announcement"
    description="Technical release announcement tailored for developer audiences across X (Twitter), LinkedIn, and Threads."
  >
    <SocialMediaPostScheduler
      initial-content="🚀 UIPKGE v2.4 is live! 40+ accessible headless UI primitives, zero npm lock-in, and full OKLCH dark mode tokens. Built for speed and craft. Try the interactive playground now! 👇&#10;&#10;#UI #OpenSource #DesignSystem #WebDev"
      :initial-channels="['twitter', 'linkedin', 'threads']"
      initial-media-url="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop"
      initial-date="2026-08-28"
      initial-time="10:00 AM EST"
      :initial-auto-repost="true"
    />
  </Story>

  <Story
    title="Instagram visual campaign"
    description="Media-centric photography workflow showcasing responsive aspect ratios and Instagram feed layout mockup."
  >
    <SocialMediaPostScheduler
      initial-content="Behind the scenes: Crafting pixel-perfect spring physics and sub-pixel optical alignments in our design engineering studio. ✨&#10;&#10;#DesignSystem #Frontend #UI #Tech"
      :initial-channels="['instagram', 'threads']"
      initial-media-url="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop"
      initial-date="2026-08-30"
      initial-time="01:30 PM EST"
      :initial-auto-repost="false"
    />
  </Story>
</template>

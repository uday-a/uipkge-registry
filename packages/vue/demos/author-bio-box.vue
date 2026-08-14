<script setup lang="ts">
import AuthorBioBox from '@/components/blocks/author-bio-box/AuthorBioBox.vue'
</script>

<template>
  <Story
    title="Default"
    description="Full editorial author signature card with avatar, verified badge, bio, social links, follow/RSS actions, and recent articles list."
  >
    <div class="mx-auto max-w-3xl">
      <AuthorBioBox />
    </div>
  </Story>

  <Story
    title="Split layout"
    description="Two-column responsive layout with profile and actions on the left, and recent publications on the right."
  >
    <div class="mx-auto max-w-4xl">
      <AuthorBioBox variant="split" />
    </div>
  </Story>

  <Story
    title="Compact"
    description="Streamlined card designed for sidebars, author lists, or compact editorial bylines."
  >
    <div class="mx-auto max-w-md">
      <AuthorBioBox variant="compact" />
    </div>
  </Story>

  <Story
    title="In article context"
    description="Simulated article footer container with reading typography and author bio box at the end of post."
  >
    <div class="border-border/40 bg-muted/10 mx-auto max-w-2xl space-y-6 rounded-lg border p-6">
      <div class="border-border/40 space-y-2 border-b pb-4">
        <p class="text-primary text-xs font-semibold tracking-widest uppercase">Article Byline</p>
        <h3 class="text-foreground text-lg font-bold">The Future of Unbundled UI Systems</h3>
        <p class="text-muted-foreground text-xs">Published on Aug 21, 2026 · 7 min read</p>
      </div>
      <AuthorBioBox />
    </div>
  </Story>
</template>

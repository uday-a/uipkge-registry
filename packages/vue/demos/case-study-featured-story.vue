<script setup lang="ts">
import CaseStudyFeaturedStory from '@/components/blocks/case-study-featured-story/CaseStudyFeaturedStory.vue'
// CaseStudyFeaturedStory is the block file the user installs. Open
// `components/blocks/CaseStudyFeaturedStory.vue` after install to replace
// the narrative and the `results` array. The panel is `lg:sticky`, so long
// narratives keep the numbers in view.
</script>

<template>
  <Story
    title="Case Study — Featured Story"
    description="One featured customer story. The narrative column carries challenge, approach, and result copy with a pull quote; the results panel pins four metrics and company facts alongside."
  >
    <CaseStudyFeaturedStory />
  </Story>
</template>

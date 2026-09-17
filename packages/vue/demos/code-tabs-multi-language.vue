<script setup lang="ts">
import CodeTabsMultiLanguage from '@/components/blocks/code-tabs-multi-language/CodeTabsMultiLanguage.vue'
// CodeTabsMultiLanguage is the block file the user installs. Open
// `components/blocks/CodeTabsMultiLanguage.vue` after install to add
// languages; samples are plain strings, so any highlighter can be layered on.
</script>

<template>
  <Story
    title="Code — Multi-Language Tabs"
    description="Language tabs over one code sample. The copy control reports its own success state, and a caption names the endpoint the sample calls."
  >
    <CodeTabsMultiLanguage />
  </Story>
</template>

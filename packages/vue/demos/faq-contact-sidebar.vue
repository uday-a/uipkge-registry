<script setup lang="ts">
import FaqContactSidebar from '@/components/blocks/faq-contact-sidebar/FaqContactSidebar.vue'
// FaqContactSidebar is the block file the user installs. Open
// `components/blocks/FaqContactSidebar.vue` after install to point the card
// at a real inbox. The sidebar is `lg:sticky` so it stays beside long lists.
</script>

<template>
  <Story
    title="FAQ — With Contact Sidebar"
    description="Answers beside a sticky support card with a named contact, a stated response time, and a docs link — for whatever the list does not cover."
  >
    <FaqContactSidebar />
  </Story>
</template>

<script setup lang="ts">
import Contact01 from '@/components/blocks/contact-01/Contact01.vue'
// Contact01 emits `submit` with `{ name, email, company, subject,
// message }`. Wire it to your form endpoint in the consuming page.
// Edit `components/blocks/Contact01.vue` to swap the contact rows or
// map placeholder for a real map embed.
</script>

<template>
  <Story
    title="Contact 01"
    description="Two-column contact section. Contact rows + map placeholder on the left, form Card on the right with success-state swap."
  >
    <Contact01 />
  </Story>
</template>

<script setup lang="ts">
import ContactUs from '@/components/blocks/contact-us/ContactUs.vue'
// Block demo — thin wrapper; the Code tab shows the block's ContactUs.vue.
// Pass an access-token + location to show the live map (falls back to a
// placeholder without one). Use the Astro/Vite env (NOT Nuxt's
// useRuntimeConfig — undefined here, it crashed the demo to an empty render);
// mirrors the React demo's import.meta.env.PUBLIC_MAPBOX_TOKEN.
const token = import.meta.env.PUBLIC_MAPBOX_TOKEN as string
</script>

<template>
  <Story
    title="Contact Us"
    description="Two-column contact section with a live map pinned to your office and a form Card that swaps to a success state on submit."
  >
    <ContactUs :access-token="token" :location="[-122.4194, 37.7749]" location-label="San Francisco, CA" />
  </Story>
</template>

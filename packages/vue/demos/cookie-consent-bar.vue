<script setup lang="ts">
import CookieConsentBar from '@/components/blocks/cookie-consent-bar/CookieConsentBar.vue'
// CookieConsentBar is the block file the user installs. Open\n// `components/blocks/CookieConsentBar.vue` after install to wire the\n// handlers. Reject is styled the same as accept, deliberately.
</script>

<template>
  <Story
    title="Cookie Consent — Bar"
    description="Bottom consent bar with accept, reject, and manage weighted equally, plus a one-line statement of what is actually stored."
  >
    <CookieConsentBar />
  </Story>
</template>

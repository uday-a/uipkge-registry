<script setup lang="ts">
import CookieConsentPreferences from '@/components/blocks/cookie-consent-preferences/CookieConsentPreferences.vue'
// CookieConsentPreferences is the block file the user installs. Open\n// `components/blocks/CookieConsentPreferences.vue` after install to edit the\n// categories and persist the result.
</script>

<template>
  <Story
    title="Cookie Consent — Preferences"
    description="Granular consent: each category with its purpose, retention, and a switch — strictly-necessary shown locked rather than hidden from the list."
  >
    <CookieConsentPreferences />
  </Story>
</template>

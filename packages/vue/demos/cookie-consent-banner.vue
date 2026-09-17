<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import CookieConsentBanner from '@/components/blocks/cookie-consent-banner/CookieConsentBanner.vue'

const barKey = ref(0)
const cardKey = ref(0)
</script>

<template>
  <Story
    title="Bottom bar"
    description="Full-width consent bar with cookie icon, Cookie Policy link, and Customize / Reject / Accept all actions. Customize expands inline preferences. Dismiss it, then reset to bring it back."
  >
    <div class="flex flex-col items-center gap-3">
      <div class="border-border w-full overflow-hidden rounded-lg border">
        <CookieConsentBanner :key="barKey" variant="bottom-bar" />
      </div>
      <Button variant="outline" size="sm" @click="barKey++">Reset banner</Button>
    </div>
  </Story>

  <Story
    title="Card"
    description="Compact rounded card with the same content stacked vertically. Flip the theme toggle to check tokens in dark mode."
  >
    <div class="flex flex-col items-center gap-3">
      <CookieConsentBanner :key="cardKey" variant="card" />
      <Button variant="outline" size="sm" @click="cardKey++">Reset banner</Button>
    </div>
  </Story>
</template>

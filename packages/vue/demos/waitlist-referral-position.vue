<script setup lang="ts">
import WaitlistReferralPosition from '@/components/blocks/waitlist-referral-position/WaitlistReferralPosition.vue'
// WaitlistReferralPosition is the block file the user installs. Open
// `components/blocks/WaitlistReferralPosition.vue` after install to replace
// the stub position with a real queue lookup.
</script>

<template>
  <Story
    title="Waitlist — Referral Position"
    description="Waitlist capture that swaps on submit to a queue position, a referral link that moves it, and a progress meter toward the next access tier."
  >
    <WaitlistReferralPosition />
  </Story>
</template>

<script setup lang="ts">
import AuthMfa from '@/components/blocks/auth-mfa/AuthMfa.vue'
// AuthMfa ships a full 2-step verification card. The default `demoCode`
// prop is '123456' — type that into the pin input to see the verified
// state. Consumers wire @verify / @resend / @continue to their backend.
</script>

<template>
  <Story
    title="Auth MFA"
    description="Two-step verification card. 6-digit OTP pin input auto-submits on entry, shows verifying state and an inline error on mismatch, has a 30-second resend cooldown, and swaps to a Verified card with a Continue button on success. Try code `123456` in the demo."
  >
    <AuthMfa />
  </Story>
</template>

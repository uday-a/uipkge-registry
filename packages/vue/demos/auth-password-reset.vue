<script setup lang="ts">
import AuthPasswordReset from '@/components/blocks/auth-password-reset/AuthPasswordReset.vue'
// AuthPasswordReset is the block file the user installs into their
// project. Open `components/blocks/AuthPasswordReset.vue` after install
// to wire the actual mail/db calls (replace the @request/@reset no-ops).
</script>

<template>
  <Story
    title="Auth Password Reset"
    description="Four-stage flow in a single card: request (email form) -> sent (check-your-inbox confirmation with `Open reset form` demo button) -> reset (new password + confirm with match validation) -> done (success confirmation linking back to sign-in)."
  >
    <AuthPasswordReset />
  </Story>
</template>

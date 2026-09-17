<script setup lang="ts">
import AuthSignUp from '@/components/blocks/auth-sign-up/AuthSignUp.vue'
// AuthSignUp is the block file the user installs into their project.
// Open `components/blocks/AuthSignUp.vue` after install to wire real
// auth handlers (replace the @submit / @oauth no-ops).
</script>

<template>
  <Story
    title="Auth Sign Up"
    description="Full-page sign-up surface. Name/email/password/confirm form with password-match validation, T&C acceptance gate, GitHub + Google OAuth row, link back to sign-in. Emits `submit` with the validated payload and `oauth` with the chosen provider."
  >
    <AuthSignUp />
  </Story>
</template>

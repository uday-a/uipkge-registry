<script setup lang="ts">
import AuthSignIn from '@/components/blocks/auth-sign-in/AuthSignIn.vue'
// AuthSignIn is the block file the user installs into their project.
// Open `components/blocks/AuthSignIn.vue` after install to wire real
// auth handlers (replace the @submit / @oauth no-ops).
</script>

<template>
  <Story
    title="Auth Sign In"
    description="Full-page sign-in surface. Email + password + remember-me form, forgot-password and sign-up links, GitHub + Google OAuth row. Emits `submit` with the form payload and `oauth` with the chosen provider."
  >
    <AuthSignIn />
  </Story>
</template>

<script setup lang="ts">
import Login01 from '@/components/blocks/login-01/Login01.vue'
// Login01 is the block file the user installs into their project.
// Open `components/blocks/Login01.vue` after install to wire real
// auth handlers (replace the @submit/@oauth/@forgot-password no-ops).
</script>

<template>
  <Story
    title="Login 01"
    description="Centered card. Email + password, forgot-password link, primary submit, divider, then a 2-button SSO row (Google + GitHub). Sign-up footer."
  >
    <Login01 />
  </Story>
</template>

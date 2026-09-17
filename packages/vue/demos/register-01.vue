<script setup lang="ts">
import Register01 from '@/components/blocks/register-01/Register01.vue'
// Register01 is the block file the user installs into their project.
// Open `components/blocks/Register01.vue` to plug in real handlers for
// submit/sign-in/oauth/view-terms/view-privacy.
</script>

<template>
  <Story
    title="Register 01"
    description="Centered sign-up card. Name, email, password, confirm with mismatch warning, terms-checkbox-gated submit, divider, SSO row, sign-in footer."
  >
    <Register01 />
  </Story>
</template>

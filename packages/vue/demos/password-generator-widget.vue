<script setup lang="ts">
import PasswordGeneratorWidget from '@/components/blocks/password-generator-widget/PasswordGeneratorWidget.vue'
</script>

<template>
  <Story
    title="Password & Passphrase Generator"
    description="1Password and Bitwarden-style customizable secret generator with entropy strength meter, character pool toggles, memorable Diceware passphrases, PIN codes, and volatile history drawer."
  >
    <PasswordGeneratorWidget />
  </Story>
</template>

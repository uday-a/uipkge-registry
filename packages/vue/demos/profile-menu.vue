<script setup lang="ts">
import ProfileMenu from '@/components/blocks/profile-menu/ProfileMenu.vue'
// ProfileMenu ships with a default Avatar trigger so the demo just
// renders the block bare. Consumers can override the trigger via the
// default slot (which receives `user` and `initials`). Emits `select`
// with the chosen item key.
</script>

<template>
  <Story
    title="Profile Menu"
    description="Header-grade profile/account dropdown. Default Avatar trigger or pass your own via the default slot. Sections: upgrade, account/billing/notifications/settings, log out. Emits `select` with the chosen item key."
  >
    <div class="flex justify-start">
      <ProfileMenu />
    </div>
  </Story>
</template>

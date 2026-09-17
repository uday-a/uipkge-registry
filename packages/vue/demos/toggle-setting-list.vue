<script setup lang="ts">
import { ref } from 'vue'
import ToggleSettingList from '@/components/blocks/toggle-setting-list/ToggleSettingList.vue'
import { Bell } from 'lucide-vue-next'

const items = [
  { key: 'email', label: 'Email notifications', desc: 'Get updates in your inbox.' },
  { key: 'sms', label: 'SMS alerts', desc: 'Time-critical messages only.' },
  { key: 'digest', label: 'Weekly digest', desc: 'A summary every Monday.' },
]
const values = ref({ email: true, sms: false, digest: true })
</script>

<template>
  <Story title="Default" description="Card with a header icon and a list of labeled switch settings.">
    <ToggleSettingList
      v-model="values"
      title="Notifications"
      description="What should we alert you about?"
      :header-icon="Bell"
      :items="items"
    />
  </Story>
</template>

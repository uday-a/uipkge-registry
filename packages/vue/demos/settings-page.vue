<script setup lang="ts">
import { Building2, CreditCard } from 'lucide-vue-next'
import SettingsPage from '@/components/blocks/settings-page/SettingsPage.vue'
</script>

<template>
  <Story title="Full page" description="Profile section active by default, with sticky save bar and nav rail.">
    <SettingsPage class="min-h-[560px]" />
  </Story>

  <Story title="Notifications" description="Switch rows for email, push and digest.">
    <SettingsPage initial-section="notifications" class="min-h-[420px]" />
  </Story>

  <Story title="Appearance" description="Theme cards plus a reduced-motion toggle.">
    <SettingsPage initial-section="appearance" class="min-h-[420px]" />
  </Story>

  <Story title="Workspace" description="Identity fields with an adorned URL slug input.">
    <SettingsPage initial-section="workspace" class="min-h-[420px]" />
  </Story>

  <Story title="Billing" description="Plan summary with manage-billing affordance.">
    <SettingsPage initial-section="billing" class="min-h-[360px]" />
  </Story>

  <Story title="Danger zone" description="Destructive panel; the Delete… button opens a type-to-confirm dialog.">
    <SettingsPage initial-section="danger" class="min-h-[360px]" />
  </Story>

  <Story title="Custom nav" description="sections prop reorders and trims the rail; ids map to built-in panels.">
    <SettingsPage
      :sections="[
        { id: 'workspace', label: 'Workspace', icon: Building2 },
        { id: 'billing', label: 'Billing', icon: CreditCard },
      ]"
      initial-section="workspace"
      class="min-h-[380px]"
    />
  </Story>
</template>

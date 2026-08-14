<script setup lang="ts">
import SmartInboxTriage from '@/components/blocks/smart-inbox-triage/SmartInboxTriage.vue'
</script>

<template>
  <Story
    title="Smart Inbox Triage"
    description="Superhuman-style high-velocity email inbox triage command center with keyboard shortcuts [E/H/R/J/K], split category tabs (VIP, Team & GitHub, Newsletters, Archived), dual-pane split reader, fast triage actions, and ⌘K command palette."
  >
    <SmartInboxTriage />
  </Story>

  <Story
    title="Team & GitHub Stream"
    description="Pre-filtered category focusing on engineering pull requests and design token migration specs."
  >
    <SmartInboxTriage initial-category="team" initial-selected-id="msg-4" />
  </Story>

  <Story title="Newsletters Queue" description="Newsletters category viewing technical digests and deep-dives.">
    <SmartInboxTriage initial-category="newsletters" initial-selected-id="msg-6" />
  </Story>

  <Story
    title="Search Filtered"
    description="Pre-populated search query filtering messages related to OKLCH tokens and design specs."
  >
    <SmartInboxTriage initial-search="OKLCH" initial-selected-id="msg-4" />
  </Story>

  <Story
    title="Inbox Zero State"
    description="Zero inbox state when all pending triage items in the current view have been processed."
  >
    <SmartInboxTriage :messages="[]" />
  </Story>
</template>

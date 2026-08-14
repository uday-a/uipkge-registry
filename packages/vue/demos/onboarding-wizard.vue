<script setup lang="ts">
import OnboardingWizard from '@/components/blocks/onboarding-wizard/OnboardingWizard.vue'
</script>

<template>
  <Story title="Default" description="Workspace step with a live URL slug preview derived from the name.">
    <OnboardingWizard />
  </Story>

  <Story title="Empty name" description="Continue is disabled until a workspace name is entered.">
    <OnboardingWizard initial-workspace-name="" />
  </Story>

  <Story title="Team invites" description="Email input appends removable chips; skip link jumps ahead.">
    <OnboardingWizard :initial-step="2" :initial-invites="['amara@acme.com', 'marcus.lee@acme.com']" />
  </Story>

  <Story title="Team empty" description="No invites yet — empty state copy under the input.">
    <OnboardingWizard :initial-step="2" />
  </Story>

  <Story title="Preferences" description="Three Switch rows with labels and helper descriptions.">
    <OnboardingWizard :initial-step="3" />
  </Story>

  <Story title="Done" description="Success panel with a glowing check circle and invitation summary.">
    <OnboardingWizard
      :initial-step="4"
      :initial-invites="['amara@acme.com', 'marcus.lee@acme.com', 'priya@acme.com']"
    />
  </Story>

  <Story title="Done solo" description="Completed without invites — copy falls back to settings hint.">
    <OnboardingWizard :initial-step="4" />
  </Story>

  <Story title="Compact" description="The same flow at phone-card width.">
    <div class="max-w-sm">
      <OnboardingWizard />
    </div>
  </Story>
</template>

<script setup lang="ts">
import AuditLog from '@/components/blocks/audit-log/AuditLog.vue'

const manyEntries = Array.from({ length: 16 }, (_, i) => ({
  id: `m${i}`,
  actor: ['Amara Osei', 'Jonas Weber', 'Priya Nair', 'Marcus Lee'][i % 4],
  action: (['sign-in', 'user.updated', 'role.changed', 'export', 'delete'] as const)[i % 5],
  target: `resource-${i + 1}`,
  ip: '10.0.0.1',
  date: new Date(Date.now() - i * 3_600_000),
}))
</script>

<template>
  <Story title="Default" description="Live activity trail with functional search and action filter over stub data.">
    <AuditLog />
  </Story>

  <Story title="Search filtered" description="Query pre-filled — only matching actors/targets remain.">
    <div>
      <p class="text-muted-foreground mb-2 text-xs">Type in the search box to filter rows live.</p>
      <AuditLog />
    </div>
  </Story>

  <Story
    title="Severity spectrum"
    description="Action badges color-code by severity: sign-in secondary, updates default, role changes warning, deletes destructive, exports info."
  >
    <AuditLog
      :entries="[
        {
          id: 's1',
          actor: 'Amara Osei',
          action: 'sign-in',
          target: 'admin.acme.com',
          ip: '77.12.44.9',
          date: new Date(),
        },
        {
          id: 's2',
          actor: 'Priya Nair',
          action: 'user.updated',
          target: 'profile.phone',
          ip: '103.25.8.77',
          date: new Date(),
        },
        {
          id: 's3',
          actor: 'System',
          action: 'role.changed',
          target: 'contractors → Viewer',
          ip: '—',
          date: new Date(),
        },
        {
          id: 's4',
          actor: 'Marcus Lee',
          action: 'export',
          target: 'ledger-q3.csv',
          ip: '45.62.110.204',
          date: new Date(),
        },
        {
          id: 's5',
          actor: 'Jonas Weber',
          action: 'delete',
          target: 'staging-deploy-key',
          ip: '84.190.201.3',
          date: new Date(),
        },
      ]"
    />
  </Story>

  <Story title="Empty result" description="Filters that match nothing render a centered empty state.">
    <AuditLog :entries="[]" />
  </Story>

  <Story title="Long targets" description="Monospace targets truncate without breaking row rhythm.">
    <AuditLog
      :entries="[
        {
          id: 'l1',
          actor: 'Amara Osei',
          action: 'user.updated',
          target: 'workspaces/acme-prod/members/priya.nair@acme.com/settings/notifications/email-digest',
          ip: '77.12.44.9',
          date: new Date(),
        },
      ]"
    />
  </Story>

  <Story title="Many rows" description="Sixteen entries keep the card scannable thanks to divide-y rhythm.">
    <AuditLog :entries="manyEntries" />
  </Story>
</template>

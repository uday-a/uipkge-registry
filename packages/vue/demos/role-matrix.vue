<script setup lang="ts">
import { ref } from 'vue'
import RoleMatrix from '@/components/blocks/role-matrix/RoleMatrix.vue'

const grants = ref({
  'users.create': ['admin'],
  'users.read': ['admin', 'editor', 'viewer'],
  'users.update': ['admin', 'editor'],
  'users.delete': [],
  'billing.read': ['admin'],
  'billing.manage': [],
  'content.create': ['admin', 'editor'],
  'content.read': ['admin', 'editor', 'viewer'],
  'content.delete': ['admin'],
})
</script>

<template>
  <Story title="Default" description="Three roles, three resource groups, live tri-state column headers.">
    <RoleMatrix />
  </Story>

  <Story title="Controlled" description="v-model mirrors the full grants map as cells toggle.">
    <RoleMatrix v-model="grants" />
  </Story>

  <Story title="Read-only" description="readOnly disables every control and shows a badge.">
    <RoleMatrix read-only />
  </Story>

  <Story title="Many roles" description="Five roles force horizontal scroll inside the card.">
    <RoleMatrix
      :roles="[
        { id: 'owner', label: 'Owner' },
        { id: 'admin', label: 'Admin' },
        { id: 'editor', label: 'Editor' },
        { id: 'analyst', label: 'Analyst' },
        { id: 'viewer', label: 'Viewer' },
      ]"
    />
  </Story>

  <Story title="Custom groups" description="Swap in your own resources and permissions via props.">
    <RoleMatrix
      :groups="[
        {
          resource: 'Shipments',
          permissions: [
            { id: 'ship.create', label: 'Book shipments' },
            { id: 'ship.read', label: 'Track shipments' },
          ],
        },
        {
          resource: 'Invoices',
          permissions: [{ id: 'inv.pay', label: 'Pay invoices' }],
        },
      ]"
    />
  </Story>
</template>

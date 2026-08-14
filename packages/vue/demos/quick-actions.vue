<script setup lang="ts">
import QuickActions from '@/components/blocks/quick-actions/QuickActions.vue'
import { Briefcase, ClipboardList, FileText, UserPlus } from 'lucide-vue-next'

const actions = [
  { id: 1, label: 'Add new employee', icon: UserPlus, route: '#' },
  { id: 2, label: 'Review time off', icon: ClipboardList, route: '#' },
  { id: 3, label: 'Run payroll', icon: Briefcase, route: '#' },
  { id: 4, label: 'View documents', icon: FileText, route: '#' },
]
</script>

<template>
  <Story title="Default" description="Card listing common shortcuts as icon-labeled buttons.">
    <QuickActions title="Quick Actions" description="Frequently used shortcuts." :actions="actions" />
  </Story>
</template>

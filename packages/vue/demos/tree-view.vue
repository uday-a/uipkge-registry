<script setup lang="ts">
import { ref } from 'vue'
import { TreeView } from '@/components/ui/tree-view'
import { FileCode, FileText, Folder, Hash, Settings, User } from 'lucide-vue-next'
import type { TreeViewItem } from '@/components/ui/tree-view'

const fileTree: TreeViewItem[] = [
  {
    id: '1',
    label: 'src',
    icon: Folder,
    children: [
      {
        id: '1-1',
        label: 'components',
        icon: Folder,
        children: [
          { id: '1-1-1', label: 'Button.vue', icon: FileCode },
          { id: '1-1-2', label: 'Card.vue', icon: FileCode },
          { id: '1-1-3', label: 'Dialog.vue', icon: FileCode },
        ],
      },
      {
        id: '1-2',
        label: 'composables',
        icon: Folder,
        children: [
          { id: '1-2-1', label: 'useToast.ts', icon: FileCode },
          { id: '1-2-2', label: 'useTheme.ts', icon: FileCode },
        ],
      },
      { id: '1-3', label: 'App.vue', icon: FileCode },
      { id: '1-4', label: 'main.ts', icon: FileCode },
    ],
  },
  { id: '2', label: 'package.json', icon: FileText },
  { id: '3', label: 'tsconfig.json', icon: FileText },
  { id: '4', label: 'README.md', icon: FileText, disabled: true },
]

const channels: TreeViewItem[] = [
  {
    id: 'general',
    label: 'General',
    icon: Hash,
    children: [
      { id: 'general-announcements', label: 'announcements', icon: Hash },
      { id: 'general-random', label: 'random', icon: Hash },
      { id: 'general-help', label: 'help', icon: Hash, selected: true },
    ],
  },
  {
    id: 'design',
    label: 'Design',
    icon: Hash,
    children: [
      { id: 'design-feedback', label: 'feedback', icon: Hash },
      { id: 'design-shipped', label: 'shipped', icon: Hash },
    ],
  },
]

const settingsTree: TreeViewItem[] = [
  {
    id: 'account',
    label: 'Account',
    icon: User,
    children: [
      { id: 'account-profile', label: 'Profile' },
      { id: 'account-security', label: 'Security' },
      { id: 'account-notifications', label: 'Notifications' },
    ],
  },
  {
    id: 'workspace',
    label: 'Workspace',
    icon: Settings,
    children: [
      { id: 'workspace-members', label: 'Members' },
      { id: 'workspace-billing', label: 'Billing' },
      { id: 'workspace-integrations', label: 'Integrations' },
    ],
  },
]

const selectedId = ref<string | null>(null)
const checkSelected = ref<string | null>(null)
</script>

<template>
  <Story
    title="Default"
    description="Expandable file tree with continuous Discord-style elbow connectors. Defaults to fully expanded."
  >
    <TreeView
      :items="fileTree"
      :default-expanded="true"
      :selected-id="selectedId"
      class="max-w-sm"
      @select="selectedId = $event.id"
    />
  </Story>

  <Story
    title="Collapsed by default"
    description="Set default-expanded to false (the default) to start fully collapsed; click chevrons to drill in."
  >
    <TreeView :items="fileTree" class="max-w-sm" />
  </Story>

  <Story
    title="With checkboxes"
    description="show-checkboxes adds a 14px checkbox before each row's icon for selection-style trees."
  >
    <TreeView
      :items="settingsTree"
      :default-expanded="true"
      show-checkboxes
      :selected-id="checkSelected"
      class="max-w-sm"
      @select="checkSelected = $event.id"
    />
  </Story>

  <Story
    title="Without icons"
    description="show-icons=false drops the leading icon column for a tighter, label-only layout."
  >
    <TreeView :items="settingsTree" :default-expanded="true" :show-icons="false" class="max-w-sm" />
  </Story>

  <Story title="Channel-style" description="Discord-style channel tree with one item pre-selected.">
    <TreeView :items="channels" :default-expanded="true" class="max-w-sm" />
  </Story>
</template>

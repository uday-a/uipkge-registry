<script lang="ts">
  import { TreeView, type TreeViewItem } from '@svelte-registry/tree-view'
  import { FileCode, FileText, Folder, Hash, Settings, User } from '@lucide/svelte'

  let { story }: { story: string } = $props()

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

  let selectedId = $state<string | null>(null)
  let checkSelected = $state<string | null>(null)
</script>

{#if story === 'Default'}
  <TreeView
    items={fileTree}
    defaultExpanded
    selectedId={selectedId}
    class="max-w-sm"
    onselect={(item) => (selectedId = item.id)}
  />
{/if}

{#if story === 'Collapsed by default'}
  <TreeView items={fileTree} class="max-w-sm" />
{/if}

{#if story === 'With checkboxes'}
  <TreeView
    items={settingsTree}
    defaultExpanded
    showCheckboxes
    selectedId={checkSelected}
    class="max-w-sm"
    onselect={(item) => (checkSelected = item.id)}
  />
{/if}

{#if story === 'Without icons'}
  <TreeView items={settingsTree} defaultExpanded showIcons={false} class="max-w-sm" />
{/if}

{#if story === 'Channel-style'}
  <TreeView items={channels} defaultExpanded class="max-w-sm" />
{/if}

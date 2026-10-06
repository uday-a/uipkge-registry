<script lang="ts">
  import { TreeSelect, type TreeSelectNode } from '@svelte-registry/tree-select'

  let { story }: { story: string } = $props()

  let fileValue = $state<string | null>(null)
  let multiValue = $state<string[]>([])
  let smValue = $state<string | null>(null)
  let lgValue = $state<string | null>(null)
  let orgValue = $state<string[]>(['frontend', 'backend'])

  const fileTree: TreeSelectNode[] = [
    {
      value: 'src',
      label: 'src',
      children: [
        {
          value: 'src/components',
          label: 'components',
          children: [
            { value: 'src/components/Button.vue', label: 'Button.vue' },
            { value: 'src/components/Card.vue', label: 'Card.vue' },
            { value: 'src/components/Dialog.vue', label: 'Dialog.vue' },
          ],
        },
        {
          value: 'src/composables',
          label: 'composables',
          children: [
            { value: 'src/composables/useToast.ts', label: 'useToast.ts' },
            { value: 'src/composables/useTheme.ts', label: 'useTheme.ts' },
          ],
        },
        { value: 'src/App.vue', label: 'App.vue' },
        { value: 'src/main.ts', label: 'main.ts' },
      ],
    },
    { value: 'package.json', label: 'package.json' },
    { value: 'tsconfig.json', label: 'tsconfig.json' },
  ]

  const orgTree: TreeSelectNode[] = [
    {
      value: 'engineering',
      label: 'Engineering',
      children: [
        { value: 'frontend', label: 'Frontend Team' },
        { value: 'backend', label: 'Backend Team' },
        { value: 'devops', label: 'DevOps Team' },
      ],
    },
    {
      value: 'design',
      label: 'Design',
      children: [
        { value: 'ux', label: 'UX Team' },
        { value: 'visual', label: 'Visual Team' },
      ],
    },
    {
      value: 'product',
      label: 'Product',
      children: [
        { value: 'pm', label: 'Product Managers' },
        { value: 'analytics', label: 'Analytics' },
      ],
    },
  ]

  const restrictedTree: TreeSelectNode[] = [
    {
      value: 'folder1',
      label: 'Folder 1',
      children: [
        { value: 'file1', label: 'file1.txt' },
        { value: 'file2', label: 'file2.txt', disabled: true },
      ],
    },
    { value: 'locked', label: 'Locked folder', disabled: true, children: [] },
  ]
</script>

{#if story === 'File picker'}
  <div class="max-w-md space-y-2">
    <TreeSelect bind:value={fileValue} data={fileTree} placeholder="Select a file..." class="w-full" />
    <p class="text-xs text-muted-foreground">Selected: {fileValue ?? 'none'}</p>
  </div>
{/if}

{#if story === 'Multi-select with checkboxes'}
  <div class="max-w-md space-y-2">
    <TreeSelect bind:value={multiValue} data={fileTree} multiple placeholder="Select files..." class="w-full" />
    <p class="text-xs text-muted-foreground">{multiValue.length} file(s) selected</p>
  </div>
{/if}

{#if story === 'Size variants'}
  <div class="max-w-md space-y-3">
    <TreeSelect bind:value={smValue} data={fileTree} size="sm" placeholder="Small..." class="w-full" />
    <TreeSelect data={fileTree} placeholder="Default..." class="w-full" />
    <TreeSelect bind:value={lgValue} data={fileTree} size="lg" placeholder="Large..." class="w-full" />
  </div>
{/if}

{#if story === 'Loading & disabled states'}
  <div class="max-w-md space-y-3">
    <TreeSelect data={fileTree} loading placeholder="Loading files..." class="w-full" />
    <TreeSelect data={fileTree} disabled placeholder="Disabled" class="w-full" />
  </div>
{/if}

{#if story === 'Restricted nodes'}
  <div class="max-w-md">
    <TreeSelect data={restrictedTree} placeholder="Select a file..." class="w-full" />
  </div>
{/if}

{#if story === 'In context: Team permissions'}
  <div class="max-w-md rounded-xl border border-border bg-card text-card-foreground shadow-xs">
    <div class="flex flex-col gap-1.5 p-6 pb-2">
      <h3 class="font-semibold leading-none tracking-tight">Project access</h3>
      <p class="text-sm text-muted-foreground">Choose which teams can collaborate on this repository.</p>
    </div>
    <div class="space-y-4 p-6 pt-2">
      <TreeSelect
        bind:value={orgValue}
        data={orgTree}
        multiple
        defaultExpandAll
        placeholder="Select teams..."
        class="w-full"
      />
      <div class="flex items-center justify-between text-xs text-muted-foreground">
        <span>{orgValue.length} team(s) granted access</span>
        <span class="font-medium text-foreground">{orgValue.join(', ') || 'No access'}</span>
      </div>
    </div>
  </div>
{/if}

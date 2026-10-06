<script lang="ts">
  import { TreeTable, type TreeTableColumn, type TreeTableRow } from '@svelte-registry/tree-table'
  import { Button } from '@svelte-registry/button'
  import { ChevronDown, Folder, File, FileCode, FileJson, RefreshCw, type LucideIcon } from '@lucide/svelte'

  let { story }: { story: string } = $props()

  interface FileNode extends TreeTableRow {
    name: string
    type: string
    size: string
    modified: string
  }

  const projectFiles: FileNode[] = [
    {
      id: 'src',
      name: 'src',
      type: 'folder',
      size: '—',
      modified: '2024-03-15',
      children: [
        {
          id: 'src/components',
          name: 'components',
          type: 'folder',
          size: '—',
          modified: '2024-03-14',
          children: [
            { id: 'src/components/Button.vue', name: 'Button.vue', type: 'vue', size: '2.4 KB', modified: '2024-03-10' },
            { id: 'src/components/Card.vue', name: 'Card.vue', type: 'vue', size: '1.8 KB', modified: '2024-03-12' },
            {
              id: 'src/components/ui',
              name: 'ui',
              type: 'folder',
              size: '—',
              modified: '2024-03-13',
              children: [
                {
                  id: 'src/components/ui/Input.vue',
                  name: 'Input.vue',
                  type: 'vue',
                  size: '1.2 KB',
                  modified: '2024-03-08',
                },
                {
                  id: 'src/components/ui/Select.vue',
                  name: 'Select.vue',
                  type: 'vue',
                  size: '3.1 KB',
                  modified: '2024-03-09',
                },
              ],
            },
          ],
        },
        { id: 'src/app.vue', name: 'app.vue', type: 'vue', size: '4.2 KB', modified: '2024-03-15' },
        { id: 'src/main.ts', name: 'main.ts', type: 'ts', size: '0.8 KB', modified: '2024-03-01' },
      ],
    },
    {
      id: 'public',
      name: 'public',
      type: 'folder',
      size: '—',
      modified: '2024-02-20',
      children: [
        { id: 'public/favicon.ico', name: 'favicon.ico', type: 'image', size: '32 KB', modified: '2024-01-01' },
        { id: 'public/logo.svg', name: 'logo.svg', type: 'image', size: '4.5 KB', modified: '2024-02-15' },
      ],
    },
    { id: 'package.json', name: 'package.json', type: 'json', size: '1.5 KB', modified: '2024-03-14' },
    { id: 'README.md', name: 'README.md', type: 'md', size: '3.2 KB', modified: '2024-03-15' },
  ]

  const fileColumns: TreeTableColumn<FileNode>[] = [
    { key: 'name', label: 'Name' },
    { key: 'size', label: 'Size', cellClass: 'text-muted-foreground tabular-nums' },
    { key: 'modified', label: 'Modified', cellClass: 'text-muted-foreground' },
  ]

  const fileIcon: Record<string, LucideIcon> = {
    vue: FileCode,
    ts: FileCode,
    json: FileJson,
    md: File,
    image: File,
  }

  const orgData: TreeTableRow[] = [
    {
      id: 'eng',
      name: 'Engineering',
      headcount: 42,
      budget: '$4.2M',
      lead: 'Michael Chen',
      children: [
        {
          id: 'eng-frontend',
          name: 'Frontend',
          headcount: 12,
          budget: '$1.1M',
          lead: 'Alex Rivera',
          children: [
            { id: 'eng-frontend-vue', name: 'Vue Team', headcount: 6, budget: '$550K', lead: 'Jordan Lee' },
            { id: 'eng-frontend-react', name: 'React Team', headcount: 6, budget: '$550K', lead: 'Taylor Brooks' },
          ],
        },
        { id: 'eng-backend', name: 'Backend', headcount: 18, budget: '$1.8M', lead: 'Sam Patel' },
        { id: 'eng-devops', name: 'DevOps', headcount: 12, budget: '$1.3M', lead: 'Riley Morgan' },
      ],
    },
    {
      id: 'design',
      name: 'Design',
      headcount: 8,
      budget: '$900K',
      lead: 'Emily Davis',
      children: [
        { id: 'design-product', name: 'Product Design', headcount: 5, budget: '$600K', lead: 'Casey Kim' },
        { id: 'design-brand', name: 'Brand', headcount: 3, budget: '$300K', lead: 'Morgan Reyes' },
      ],
    },
    { id: 'sales', name: 'Sales', headcount: 15, budget: '$2.1M', lead: 'David Wilson' },
  ]

  const orgColumns: TreeTableColumn[] = [
    { key: 'name', label: 'Department' },
    { key: 'lead', label: 'Team lead' },
    { key: 'headcount', label: 'Headcount', cellClass: 'tabular-nums' },
    { key: 'budget', label: 'Budget', cellClass: 'tabular-nums' },
  ]

  let loading = $state(false)
  let selectedIds = $state<string[]>([])

  async function simulateLoad() {
    loading = true
    await new Promise((r) => setTimeout(r, 1800))
    loading = false
  }
</script>

{#if story === 'Project file explorer'}
  <TreeTable data={projectFiles} columns={fileColumns} defaultExpanded>
    {#snippet cell({ row, column })}
      {#if column.key === 'name'}
        {@const Icon = row.type === 'folder' ? Folder : (fileIcon[row.type] || File)}
        <span class="flex items-center gap-2">
          <Icon class="size-4 text-muted-foreground" />
          {row.name}
        </span>
      {:else}
        {row[column.key]}
      {/if}
    {/snippet}
  </TreeTable>
{/if}

{#if story === 'Department budget breakdown'}
  <TreeTable data={orgData} columns={orgColumns} defaultExpanded />
{/if}

{#if story === 'Selectable rows'}
  <div class="max-w-2xl rounded-xl border border-border bg-card text-card-foreground shadow-xs">
    <div class="flex flex-col gap-1.5 p-6 pb-2">
      <h3 class="flex items-center justify-between text-base font-semibold leading-none tracking-tight">
        <span>Select files to archive</span>
        <span
          class="inline-flex items-center rounded-md border border-transparent bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground"
          >{selectedIds.length} selected</span
        >
      </h3>
    </div>
    <div class="p-6 pt-2">
      <TreeTable
        data={projectFiles}
        columns={fileColumns}
        selectable
        defaultExpanded
        onselect={(ids) => (selectedIds = ids)}
      >
        {#snippet cell({ row, column })}
          {#if column.key === 'name'}
            {@const Icon = row.type === 'folder' ? Folder : (fileIcon[row.type] || File)}
            <span class="flex items-center gap-2">
              <Icon class="size-4 text-muted-foreground" />
              {row.name}
            </span>
          {:else}
            {row[column.key]}
          {/if}
        {/snippet}
      </TreeTable>
    </div>
  </div>
{/if}

{#if story === 'Loading state'}
  <div class="flex items-center gap-3">
    <Button variant="outline" disabled={loading} onclick={simulateLoad}>
      <RefreshCw class="mr-2 size-4 {loading ? 'animate-spin' : ''}" />
      {loading ? 'Loading…' : 'Reload files'}
    </Button>
  </div>
  <TreeTable data={projectFiles} columns={fileColumns} {loading} defaultExpanded />
{/if}

{#if story === 'Custom expand icon'}
  <div class="grid gap-6 lg:grid-cols-2">
    <div class="space-y-1.5">
      <span class="text-xs text-muted-foreground">Compact indent (16px)</span>
      <TreeTable data={projectFiles} columns={fileColumns} indent={16} defaultExpanded>
        {#snippet expandIcon({ expanded })}
          <ChevronDown class="size-4 transition-transform duration-150 {expanded ? '' : '-rotate-90'}" />
        {/snippet}
      </TreeTable>
    </div>
    <div class="space-y-1.5">
      <span class="text-xs text-muted-foreground">Wide indent (40px)</span>
      <TreeTable data={projectFiles} columns={fileColumns} indent={40} defaultExpanded />
    </div>
  </div>
{/if}

{#if story === 'Empty state'}
  <TreeTable data={[]} columns={fileColumns} emptyText="No files match your search." />
{/if}

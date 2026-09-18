<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDown, Folder, File, FileCode, FileJson, RefreshCw } from 'lucide-vue-next'
import { TreeTable, type TreeTableColumn, type TreeTableRow } from '@/components/ui/tree-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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

const fileIcon: Record<string, typeof File> = {
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

const loading = ref(false)
const selectedIds = ref<string[]>([])

async function simulateLoad() {
  loading.value = true
  await new Promise((r) => setTimeout(r, 1800))
  loading.value = false
}
</script>

<template>
  <Story
    title="Project file explorer"
    description="A file browser with type icons and a size column — the canonical use case for a tree table."
  >
    <TreeTable :data="projectFiles" :columns="fileColumns" :default-expanded="true">
      <template #cell-name="{ row }">
        <span class="flex items-center gap-2">
          <component
            :is="row.type === 'folder' ? Folder : fileIcon[row.type] || File"
            class="text-muted-foreground size-4"
          />
          {{ row.name }}
        </span>
      </template>
    </TreeTable>
  </Story>

  <Story
    title="Department budget breakdown"
    description="Hierarchical org data with numeric columns — roll up headcount and budget across nested teams."
  >
    <TreeTable :data="orgData" :columns="orgColumns" :default-expanded="true" />
  </Story>

  <Story
    title="Selectable rows"
    description="Checkboxes with v-model:selected — pick files to bulk-delete or departments to export."
  >
    <Card class="max-w-2xl">
      <CardHeader>
        <CardTitle class="flex items-center justify-between text-base">
          <span>Select files to archive</span>
          <Badge variant="secondary">{{ selectedIds.length }} selected</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TreeTable
          :data="projectFiles"
          :columns="fileColumns"
          :selectable="true"
          :default-expanded="true"
          @update:selected="(ids) => (selectedIds = ids)"
        >
          <template #cell-name="{ row }">
            <span class="flex items-center gap-2">
              <component
                :is="row.type === 'folder' ? Folder : fileIcon[row.type] || File"
                class="text-muted-foreground size-4"
              />
              {{ row.name }}
            </span>
          </template>
        </TreeTable>
      </CardContent>
    </Card>
  </Story>

  <Story
    title="Loading state"
    description="A spinner overlay while the tree data is being fetched — keeps the layout stable during the wait."
  >
    <div class="flex items-center gap-3">
      <Button variant="outline" :disabled="loading" @click="simulateLoad">
        <RefreshCw class="mr-2 size-4" :class="loading ? 'animate-spin' : ''" />
        {{ loading ? 'Loading…' : 'Reload files' }}
      </Button>
    </div>
    <TreeTable :data="projectFiles" :columns="fileColumns" :loading="loading" :default-expanded="true" />
  </Story>

  <Story
    title="Custom expand icon"
    description="Swap the chevron for a rotated ChevronDown, and tune the indent for denser or looser trees."
  >
    <div class="grid gap-6 lg:grid-cols-2">
      <div class="space-y-1.5">
        <span class="text-muted-foreground text-xs">Compact indent (16px)</span>
        <TreeTable :data="projectFiles" :columns="fileColumns" :indent="16" :default-expanded="true">
          <template #expand-icon="{ expanded }">
            <ChevronDown class="size-4 transition-transform duration-150" :class="expanded ? '' : '-rotate-90'" />
          </template>
        </TreeTable>
      </div>
      <div class="space-y-1.5">
        <span class="text-muted-foreground text-xs">Wide indent (40px)</span>
        <TreeTable :data="projectFiles" :columns="fileColumns" :indent="40" :default-expanded="true" />
      </div>
    </div>
  </Story>

  <Story title="Empty state" description="When the query returns no rows, a friendly empty state replaces the tree.">
    <TreeTable :data="[]" :columns="fileColumns" empty-text="No files match your search." />
  </Story>
</template>

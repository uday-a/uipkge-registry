<script setup lang="ts">
import { ref, watch } from 'vue'
import type { HTMLAttributes } from 'vue'
import {
  Download,
  FileArchive,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileVideo,
  Folder,
  LayoutGrid,
  List,
  MoreVertical,
  Pencil,
  Search,
  Share2,
  Trash2,
  Upload,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

type FileKind = 'pdf' | 'image' | 'sheet' | 'video' | 'archive'

interface FolderItem {
  id: string
  name: string
  count: number
}

interface FileItem {
  id: string
  name: string
  kind: FileKind
  size: string
  modified: string
}

const props = withDefaults(
  defineProps<{
    variant?: 'grid' | 'list'
    class?: HTMLAttributes['class']
  }>(),
  {
    variant: 'grid',
  },
)

const view = ref<'grid' | 'list'>(props.variant)

watch(
  () => props.variant,
  (v) => {
    if (v) view.value = v
  },
)

const folders: FolderItem[] = [
  { id: 'folder-design-assets', name: 'Design Assets', count: 24 },
  { id: 'folder-client-files', name: 'Client Files', count: 12 },
  { id: 'folder-brand-kit', name: 'Brand Kit', count: 8 },
  { id: 'folder-archive', name: 'Archive', count: 56 },
]

const files: FileItem[] = [
  { id: 'file-brand-guidelines', name: 'brand-guidelines.pdf', kind: 'pdf', size: '4.2 MB', modified: 'Mar 14, 2026' },
  { id: 'file-homepage-hero', name: 'homepage-hero.png', kind: 'image', size: '2.8 MB', modified: 'Mar 12, 2026' },
  { id: 'file-logo-final', name: 'logo-final.svg', kind: 'image', size: '48 KB', modified: 'Mar 10, 2026' },
  { id: 'file-pricing-model', name: 'pricing-model.xlsx', kind: 'sheet', size: '316 KB', modified: 'Mar 8, 2026' },
  { id: 'file-launch-video', name: 'launch-video.mp4', kind: 'video', size: '184 MB', modified: 'Mar 5, 2026' },
  { id: 'file-app-iconset', name: 'app-iconset.zip', kind: 'archive', size: '12.4 MB', modified: 'Feb 27, 2026' },
]

const fileKindIcons: Record<FileKind, typeof FileText> = {
  pdf: FileText,
  image: FileImage,
  sheet: FileSpreadsheet,
  video: FileVideo,
  archive: FileArchive,
}

function setView(v: unknown) {
  if (v === 'grid' || v === 'list') view.value = v
}
</script>

<template>
  <div data-slot="file-manager" :class="cn('w-full', props.class)">
    <div class="bg-card text-card-foreground rounded-xl border shadow-xs">
      <div class="flex flex-wrap items-center gap-3 border-b p-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#" class="inline-flex min-h-6 items-center">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#" class="inline-flex min-h-6 items-center">Documents</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Design</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div class="relative ml-auto w-full max-w-56 sm:w-auto">
          <Search
            aria-hidden="true"
            class="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2"
          />
          <Input type="search" placeholder="Search files…" class="pl-8" />
        </div>

        <ToggleGroup
          type="single"
          size="sm"
          :model-value="view"
          class="bg-muted items-center gap-0.5 rounded-md p-0.5"
          aria-label="View mode"
          @update:model-value="setView"
        >
          <ToggleGroupItem
            value="grid"
            class="data-[state=on]:bg-background size-7 rounded-sm p-0 data-[state=on]:shadow-sm"
            title="Grid view"
            aria-label="Grid view"
          >
            <LayoutGrid aria-hidden="true" class="size-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="list"
            class="data-[state=on]:bg-background size-7 rounded-sm p-0 data-[state=on]:shadow-sm"
            title="List view"
            aria-label="List view"
          >
            <List aria-hidden="true" class="size-4" />
          </ToggleGroupItem>
        </ToggleGroup>

        <Button size="sm">
          <Upload aria-hidden="true" class="size-4" />
          Upload
        </Button>
      </div>

      <div class="flex flex-wrap items-center gap-x-4 gap-y-2 border-b px-4 py-3">
        <Progress :model-value="36.4" class="h-1.5 min-w-40 flex-1 sm:max-w-xs" aria-label="Storage used" />
        <p class="text-muted-foreground text-xs">18.2 GB of 50 GB used</p>
      </div>

      <div v-if="view === 'grid'" class="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 lg:grid-cols-4">
        <button
          v-for="folder in folders"
          :key="folder.id"
          type="button"
          class="hover:bg-muted/50 focus-visible:ring-ring flex flex-col items-start gap-3 rounded-lg border p-3 text-left shadow-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          <span class="grid size-9 place-items-center rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-500">
            <Folder class="size-5" />
          </span>
          <span class="w-full min-w-0">
            <span class="block truncate text-sm font-medium">{{ folder.name }}</span>
            <span class="text-muted-foreground block text-xs">{{ folder.count }} items</span>
          </span>
        </button>

        <button
          v-for="file in files"
          :key="file.id"
          type="button"
          class="hover:bg-muted/50 focus-visible:ring-ring group flex flex-col items-start gap-3 rounded-lg border p-3 text-left shadow-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          <span
            class="bg-muted text-muted-foreground group-hover:bg-background grid size-9 place-items-center rounded-md transition-colors"
          >
            <component :is="fileKindIcons[file.kind]" class="size-5" />
          </span>
          <span class="min-w-0">
            <span class="block truncate text-sm font-medium">{{ file.name }}</span>
            <span class="text-muted-foreground block text-xs">{{ file.size }} · {{ file.modified }}</span>
          </span>
        </button>
      </div>

      <div v-else role="table" aria-label="Files and folders">
        <div role="row" class="text-muted-foreground hidden border-b px-4 py-2 text-xs sm:flex">
          <span role="columnheader" class="flex-1 pl-9">Name</span>
          <span role="columnheader" class="w-20 text-right">Size</span>
          <span role="columnheader" class="w-28 text-right">Modified</span>
          <span class="w-9" />
        </div>
        <ul role="rowgroup" class="divide-y">
          <li
            v-for="item in [
              ...folders.map((f) => ({ ...f, isFolder: true })),
              ...files.map((f) => ({ ...f, isFolder: false })),
            ]"
            :key="item.id"
            role="row"
            class="hover:bg-muted/50 flex items-center gap-3 px-4 py-2.5 transition-colors"
          >
            <span
              class="grid size-6 shrink-0 place-items-center rounded-md"
              :class="
                item.isFolder ? 'bg-amber-500/10 text-amber-600 dark:text-amber-500' : 'bg-muted text-muted-foreground'
              "
            >
              <Folder v-if="item.isFolder" class="size-4" />
              <component :is="fileKindIcons[(item as FileItem).kind]" v-else class="size-4" />
            </span>
            <span role="cell" class="min-w-0 flex-1 truncate text-sm font-medium">{{ item.name }}</span>
            <span role="cell" class="text-muted-foreground hidden w-20 shrink-0 text-right text-xs sm:block">
              {{ item.isFolder ? `${(item as FolderItem).count} items` : (item as FileItem).size }}
            </span>
            <span role="cell" class="text-muted-foreground hidden w-28 shrink-0 text-right text-xs md:block">
              {{ item.isFolder ? '—' : (item as FileItem).modified }}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button variant="ghost" size="icon-sm" class="shrink-0" :aria-label="`Actions for ${item.name}`">
                  <MoreVertical class="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem><Download class="size-4" />Download</DropdownMenuItem>
                <DropdownMenuItem><Pencil class="size-4" />Rename</DropdownMenuItem>
                <DropdownMenuItem><Share2 class="size-4" />Share link</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive"><Trash2 class="size-4" />Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

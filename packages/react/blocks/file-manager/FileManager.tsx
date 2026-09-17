'use client'

import { useState } from 'react'
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
} from 'lucide-react'
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

export interface FileManagerProps {
  variant?: 'grid' | 'list'
  className?: string
}

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

export function FileManager({ variant = 'grid', className }: FileManagerProps) {
  const [view, setView] = useState<'grid' | 'list'>(variant)
  const rows = [...folders.map((f) => ({ ...f, isFolder: true })), ...files.map((f) => ({ ...f, isFolder: false }))]

  return (
    <div data-slot="file-manager" className={cn('w-full', className)}>
      <div className="bg-card text-card-foreground rounded-xl border shadow-xs">
        <div className="flex flex-wrap items-center gap-3 border-b p-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#" className="inline-flex min-h-6 items-center">
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#" className="inline-flex min-h-6 items-center">
                  Documents
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Design</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="relative ml-auto w-full max-w-56 sm:w-auto">
            <Search
              aria-hidden="true"
              className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2"
            />
            <Input type="search" placeholder="Search files…" className="pl-8" />
          </div>

          <ToggleGroup
            type="single"
            size="sm"
            value={view}
            className="bg-muted items-center gap-0.5 rounded-md p-0.5"
            aria-label="View mode"
            onValueChange={(v) => v && setView(v as 'grid' | 'list')}
          >
            <ToggleGroupItem
              value="grid"
              className="data-[state=on]:bg-background size-7 rounded-sm p-0 data-[state=on]:shadow-sm"
              title="Grid view"
              aria-label="Grid view"
            >
              <LayoutGrid aria-hidden="true" className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="list"
              className="data-[state=on]:bg-background size-7 rounded-sm p-0 data-[state=on]:shadow-sm"
              title="List view"
              aria-label="List view"
            >
              <List aria-hidden="true" className="size-4" />
            </ToggleGroupItem>
          </ToggleGroup>

          <Button size="sm">
            <Upload aria-hidden="true" className="size-4" />
            Upload
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b px-4 py-3">
          <Progress value={36.4} className="h-1.5 min-w-40 flex-1 sm:max-w-xs" aria-label="Storage used" />
          <p className="text-muted-foreground text-xs">18.2 GB of 50 GB used</p>
        </div>

        {view === 'grid' ? (
          <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 lg:grid-cols-4">
            {folders.map((folder) => (
              <button
                key={folder.id}
                type="button"
                className="hover:bg-muted/50 focus-visible:ring-ring flex flex-col items-start gap-3 rounded-lg border p-3 text-left shadow-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                <span className="grid size-9 place-items-center rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-500">
                  <Folder className="size-5" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{folder.name}</span>
                  <span className="text-muted-foreground block text-xs">{folder.count} items</span>
                </span>
              </button>
            ))}

            {files.map((file) => {
              const Icon = fileKindIcons[file.kind]
              return (
                <button
                  key={file.id}
                  type="button"
                  className="hover:bg-muted/50 focus-visible:ring-ring group flex flex-col items-start gap-3 rounded-lg border p-3 text-left shadow-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                  <span className="bg-muted text-muted-foreground group-hover:bg-background grid size-9 place-items-center rounded-md transition-colors">
                    <Icon className="size-5" />
                  </span>
                  <span className="w-full min-w-0">
                    <span className="block truncate text-sm font-medium">{file.name}</span>
                    <span className="text-muted-foreground block text-xs">
                      {file.size} · {file.modified}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        ) : (
          <div role="table" aria-label="Files and folders">
            <div role="row" className="text-muted-foreground hidden border-b px-4 py-2 text-xs sm:flex">
              <span role="columnheader" className="flex-1 pl-9">
                Name
              </span>
              <span role="columnheader" className="w-20 text-right">
                Size
              </span>
              <span role="columnheader" className="w-28 text-right">
                Modified
              </span>
              <span className="w-9" />
            </div>
            <ul role="rowgroup" className="divide-y">
              {rows.map((item) => {
                const Icon = item.isFolder ? Folder : fileKindIcons[(item as FileItem).kind]
                return (
                  <li
                    key={item.id}
                    role="row"
                    className="hover:bg-muted/50 flex items-center gap-3 px-4 py-2.5 transition-colors"
                  >
                    <span
                      className={cn(
                        'grid size-6 shrink-0 place-items-center rounded-md',
                        item.isFolder
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-500'
                          : 'bg-muted text-muted-foreground',
                      )}
                    >
                      <Icon className="size-4" />
                    </span>
                    <span role="cell" className="min-w-0 flex-1 truncate text-sm font-medium">
                      {item.name}
                    </span>
                    <span
                      role="cell"
                      className="text-muted-foreground hidden w-20 shrink-0 text-right text-xs sm:block"
                    >
                      {item.isFolder ? `${(item as FolderItem).count} items` : (item as FileItem).size}
                    </span>
                    <span
                      role="cell"
                      className="text-muted-foreground hidden w-28 shrink-0 text-right text-xs md:block"
                    >
                      {item.isFolder ? '—' : (item as FileItem).modified}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="shrink-0"
                          aria-label={`Actions for ${item.name}`}
                        >
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Download className="size-4" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Pencil className="size-4" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share2 className="size-4" />
                          Share link
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive">
                          <Trash2 className="size-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

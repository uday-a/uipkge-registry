<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, ref } from 'vue'
import {
  ChevronDown,
  Download,
  Eye,
  Mail,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

type UserStatus = 'active' | 'pending' | 'archived'

interface UserRow {
  id: string
  name: string
  email: string
  role: string
  status: UserStatus
  lastActive: string
}

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const search = ref('')
const statusFilter = ref<'all' | UserStatus>('all')
const selected = ref<Set<string>>(new Set())

const users: UserRow[] = [
  { id: 'u1', name: 'Amara Okafor', email: 'amara@acme.dev', role: 'Admin', status: 'active', lastActive: '2 min ago' },
  {
    id: 'u2',
    name: 'Jonas Weber',
    email: 'jonas@acme.dev',
    role: 'Engineer',
    status: 'active',
    lastActive: '1 hr ago',
  },
  {
    id: 'u3',
    name: 'Priya Nair',
    email: 'priya@acme.dev',
    role: 'Designer',
    status: 'pending',
    lastActive: '3 hr ago',
  },
  {
    id: 'u4',
    name: 'Marco Silva',
    email: 'marco@acme.dev',
    role: 'Engineer',
    status: 'active',
    lastActive: '5 hr ago',
  },
  {
    id: 'u5',
    name: 'Lena Fischer',
    email: 'lena@acme.dev',
    role: 'Support',
    status: 'archived',
    lastActive: '2 days ago',
  },
  {
    id: 'u6',
    name: 'Tomasz Nowak',
    email: 'tomasz@acme.dev',
    role: 'Engineer',
    status: 'active',
    lastActive: '6 hr ago',
  },
  {
    id: 'u7',
    name: 'Sofia Rossi',
    email: 'sofia@acme.dev',
    role: 'Manager',
    status: 'pending',
    lastActive: '1 day ago',
  },
  {
    id: 'u8',
    name: 'Daniel Kim',
    email: 'daniel@acme.dev',
    role: 'Engineer',
    status: 'active',
    lastActive: '22 min ago',
  },
]

const filtered = computed(() => {
  const query = search.value.trim().toLowerCase()
  return users.filter((user) => {
    const matchesStatus = statusFilter.value === 'all' || user.status === statusFilter.value
    const matchesQuery = !query || user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query)
    return matchesStatus && matchesQuery
  })
})

const allSelected = computed(
  () => filtered.value.length > 0 && filtered.value.every((user) => selected.value.has(user.id)),
)
const someSelected = computed(() => filtered.value.some((user) => selected.value.has(user.id)))

function toggleAll(checked: boolean) {
  selected.value = checked ? new Set(filtered.value.map((user) => user.id)) : new Set()
}

function toggleRow(id: string, checked: boolean) {
  const next = new Set(selected.value)
  if (checked) next.add(id)
  else next.delete(id)
  selected.value = next
}

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

const statusClass: Record<UserStatus, string> = {
  active: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  archived: '',
}
</script>

<template>
  <div data-slot="data-table-page" :class="cn('w-full space-y-4', props.class)">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">Members</h2>
        <p class="text-muted-foreground mt-1 text-sm">{{ filtered.length }} of {{ users.length }} members</p>
      </div>
      <Button>
        <Plus aria-hidden="true" />
        New member
      </Button>
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <div class="relative">
        <Search
          aria-hidden="true"
          class="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
        />
        <Input v-model="search" placeholder="Search members..." class="w-64 pl-9" />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="outline" size="sm" class="capitalize">
            {{ statusFilter === 'all' ? 'Status: All' : `Status: ${statusFilter}` }}
            <ChevronDown aria-hidden="true" class="ml-1 size-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem @click="statusFilter = 'all'">All</DropdownMenuItem>
          <DropdownMenuItem @click="statusFilter = 'active'">Active</DropdownMenuItem>
          <DropdownMenuItem @click="statusFilter = 'pending'">Pending</DropdownMenuItem>
          <DropdownMenuItem @click="statusFilter = 'archived'">Archived</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="outline" size="sm">
            <SlidersHorizontal aria-hidden="true" class="mr-1 size-4" />
            View
            <ChevronDown aria-hidden="true" class="ml-1 size-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Role</DropdownMenuItem>
          <DropdownMenuItem>Last active</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <div
      v-if="selected.size > 0"
      class="bg-background flex items-center justify-between rounded-lg border px-4 py-2 shadow-xs"
    >
      <p class="text-sm font-medium">{{ selected.size }} selected</p>
      <div class="flex items-center gap-2">
        <Button aria-label="Download attachment" variant="outline" size="sm">
          <Download aria-hidden="true" />
          Export
        </Button>
        <Button variant="ghost" size="sm" class="text-destructive hover:text-destructive">
          <Trash2 aria-hidden="true" />
          Delete
        </Button>
      </div>
    </div>

    <div class="bg-card overflow-x-auto rounded-lg border shadow-xs">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="w-12">
              <Checkbox
                :model-value="allSelected ? true : someSelected ? 'indeterminate' : false"
                aria-label="Select all rows"
                @update:model-value="toggleAll($event === true)"
              />
            </TableHead>
            <TableHead>Member</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead class="text-right">Last active</TableHead>
            <TableHead class="w-12"><span class="sr-only">Actions</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="user in filtered" :key="user.id" class="hover:bg-muted/50">
            <TableCell>
              <Checkbox
                :model-value="selected.has(user.id)"
                :aria-label="`Select ${user.name}`"
                @update:model-value="toggleRow(user.id, $event === true)"
              />
            </TableCell>
            <TableCell>
              <div class="flex items-center gap-3">
                <Avatar class="size-8">
                  <AvatarFallback class="text-xs">{{ initials(user.name) }}</AvatarFallback>
                </Avatar>
                <div class="min-w-0">
                  <p class="truncate text-sm font-medium">{{ user.name }}</p>
                  <p class="text-muted-foreground truncate text-xs">{{ user.email }}</p>
                </div>
              </div>
            </TableCell>
            <TableCell
              ><Badge variant="secondary">{{ user.role }}</Badge></TableCell
            >
            <TableCell>
              <Badge
                :variant="user.status === 'archived' ? 'secondary' : undefined"
                :class="cn('capitalize', statusClass[user.status])"
              >
                {{ user.status }}
              </Badge>
            </TableCell>
            <TableCell class="text-muted-foreground text-right text-xs tabular-nums">
              {{ user.lastActive }}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <Button variant="ghost" size="icon-sm" class="text-muted-foreground">
                    <MoreHorizontal aria-hidden="true" />
                    <span class="sr-only">Open actions for {{ user.name }}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Eye aria-hidden="true" />
                    View profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Mail aria-hidden="true" />
                    Copy email
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive">
                    <Trash2 aria-hidden="true" />
                    Remove
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
          <TableRow v-if="filtered.length === 0">
            <TableCell colspan="6" class="text-muted-foreground h-24 text-center text-sm">
              No members match your filters.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <div class="flex items-center justify-between">
      <p class="text-muted-foreground text-sm">Page 1 of 4</p>
      <div class="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled>Previous</Button>
        <Button variant="outline" size="sm">Next</Button>
      </div>
    </div>
  </div>
</template>

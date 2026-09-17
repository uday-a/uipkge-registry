'use client'

import * as React from 'react'
import { ChevronDown, Download, Eye, Mail, MoreHorizontal, Plus, Search, SlidersHorizontal, Trash2 } from 'lucide-react'
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

const statusClass: Record<UserStatus, string> = {
  active: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  archived: '',
}

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function DataTablePage({ className }: { className?: string }) {
  const [search, setSearch] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<'all' | UserStatus>('all')
  const [selected, setSelected] = React.useState<Set<string>>(new Set())

  const filtered = users.filter((user) => {
    const query = search.trim().toLowerCase()
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    const matchesQuery = !query || user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query)
    return matchesStatus && matchesQuery
  })

  const allSelected = filtered.length > 0 && filtered.every((user) => selected.has(user.id))
  const someSelected = filtered.some((user) => selected.has(user.id))

  function toggleAll(checked: boolean) {
    setSelected(checked ? new Set(filtered.map((user) => user.id)) : new Set())
  }

  function toggleRow(id: string, checked: boolean) {
    const next = new Set(selected)
    if (checked) next.add(id)
    else next.delete(id)
    setSelected(next)
  }

  return (
    <div data-slot="data-table-page" className={cn('w-full space-y-4', className)}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Members</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            {filtered.length} of {users.length} members
          </p>
        </div>
        <Button>
          <Plus aria-hidden="true" />
          New member
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search
            aria-hidden="true"
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
          />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search members..."
            className="w-64 pl-9"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="capitalize">
              {statusFilter === 'all' ? 'Status: All' : `Status: ${statusFilter}`}
              <ChevronDown aria-hidden="true" className="ml-1 size-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => setStatusFilter('all')}>All</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('active')}>Active</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('pending')}>Pending</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('archived')}>Archived</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <SlidersHorizontal aria-hidden="true" className="mr-1 size-4" />
              View
              <ChevronDown aria-hidden="true" className="ml-1 size-4 opacity-50" />
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

      {selected.size > 0 && (
        <div className="bg-background flex items-center justify-between rounded-lg border px-4 py-2 shadow-xs">
          <p className="text-sm font-medium">{selected.size} selected</p>
          <div className="flex items-center gap-2">
            <Button aria-label="Download attachment" variant="outline" size="sm">
              <Download aria-hidden="true" />
              Export
            </Button>
            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
              <Trash2 aria-hidden="true" />
              Delete
            </Button>
          </div>
        </div>
      )}

      <div className="bg-card overflow-x-auto rounded-lg border shadow-xs">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected ? true : someSelected ? 'indeterminate' : false}
                  onCheckedChange={(checked) => toggleAll(checked === true)}
                  aria-label="Select all rows"
                />
              </TableHead>
              <TableHead>Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Last active</TableHead>
              <TableHead className="w-12">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((user) => (
              <TableRow key={user.id} className="hover:bg-muted/50">
                <TableCell>
                  <Checkbox
                    checked={selected.has(user.id)}
                    onCheckedChange={(checked) => toggleRow(user.id, checked === true)}
                    aria-label={`Select ${user.name}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarFallback className="text-xs">{initials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{user.name}</p>
                      <p className="text-muted-foreground truncate text-xs">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{user.role}</Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={user.status === 'archived' ? 'secondary' : undefined}
                    className={cn('capitalize', statusClass[user.status])}
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-right text-xs tabular-nums">
                  {user.lastActive}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm" className="text-muted-foreground">
                        <MoreHorizontal aria-hidden="true" />
                        <span className="sr-only">Open actions for {user.name}</span>
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
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-muted-foreground h-24 text-center text-sm">
                  No members match your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">Page 1 of 4</p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

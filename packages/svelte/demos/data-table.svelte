<script lang="ts">
  import type { ColumnDef, Row, Table } from '@tanstack/table-core'
  import {
    DataTable,
    DataTableColumnHeader,
    renderComponent,
    renderSnippet,
    type FilterDefinition,
  } from '@svelte-registry/data-table'
  import { ChevronDown, ChevronRight, Copy, MoreHorizontal, Pencil, Trash2 } from '@lucide/svelte'
  import { Badge } from '@svelte-registry/badge'
  import { Avatar, AvatarFallback } from '@svelte-registry/avatar'
  import { Progress } from '@svelte-registry/progress'
  import { Switch } from '@svelte-registry/switch'
  import { Label } from '@svelte-registry/label'
  import { Button } from '@svelte-registry/button'
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from '@svelte-registry/dropdown-menu'

  let { story }: { story: string } = $props()

  interface Employee {
    id: string
    name: string
    email: string
    role: string
    department: string
    status: 'active' | 'on_leave' | 'terminated'
    hired: string
  }

  // Generated dataset for virtual-scroll story.
  const FIRST_NAMES = [
    'James',
    'Elena',
    'Marcus',
    'Sophie',
    'Daniel',
    'Claire',
    'Nathan',
    'Olivia',
    'Henry',
    'Amelia',
    'Lucas',
    'Grace',
    'Owen',
    'Stella',
    'Isaac',
  ]
  const ROLES = ['Backend Engineer', 'Frontend Engineer', 'Designer', 'PM', 'Data Scientist', 'Tech Writer', 'DevOps', 'QA Lead']
  const DEPTS = ['Engineering', 'Product', 'Design', 'Marketing']
  const STATUSES = ['active', 'on_leave', 'terminated'] as const
  const bigData: Employee[] = Array.from({ length: 500 }, (_, i) => {
    const first = FIRST_NAMES[i % FIRST_NAMES.length]!
    return {
      id: String(i + 100),
      name: `${first} ${'ABCDEFGHIJ'[i % 10]}.`,
      email: `${first.toLowerCase()}${i}@uipkge.dev`,
      role: ROLES[i % ROLES.length]!,
      department: DEPTS[i % DEPTS.length]!,
      status: STATUSES[i % STATUSES.length]!,
      hired: `202${2 + (i % 3)}-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 27) + 1).padStart(2, '0')}`,
    }
  })

  const data: Employee[] = (
    [
      { id: '1', name: 'James Carter', email: 'james.carter@uipkge.dev', role: 'Backend Engineer', department: 'Engineering', status: 'active' },
      { id: '2', name: 'Elena Rossi', email: 'elena.rossi@uipkge.dev', role: 'Tech Writer', department: 'Marketing', status: 'active' },
      { id: '3', name: 'Marcus Hale', email: 'marcus.hale@uipkge.dev', role: 'Data Scientist', department: 'Product', status: 'on_leave' },
      { id: '4', name: 'Sophie Bennett', email: 'sophie.bennett@uipkge.dev', role: 'Senior Engineer', department: 'Engineering', status: 'active' },
      { id: '5', name: 'Daniel Price', email: 'daniel.price@uipkge.dev', role: 'Designer', department: 'Design', status: 'terminated' },
      { id: '6', name: 'Claire Donovan', email: 'claire.donovan@uipkge.dev', role: 'PM', department: 'Product', status: 'active' },
      { id: '7', name: 'Nathan Brooks', email: 'nathan.brooks@uipkge.dev', role: 'Senior Engineer', department: 'Engineering', status: 'active' },
      { id: '8', name: 'Olivia Grant', email: 'olivia.grant@uipkge.dev', role: 'Designer', department: 'Design', status: 'on_leave' },
      { id: '9', name: 'Henry Walsh', email: 'henry.walsh@uipkge.dev', role: 'Frontend Engineer', department: 'Engineering', status: 'active' },
      { id: '10', name: 'Amelia Cole', email: 'amelia.cole@uipkge.dev', role: 'QA Lead', department: 'Engineering', status: 'active' },
      { id: '11', name: 'Lucas Meyer', email: 'lucas.meyer@uipkge.dev', role: 'DevOps', department: 'Engineering', status: 'active' },
      { id: '12', name: 'Grace Turner', email: 'grace.turner@uipkge.dev', role: 'Designer', department: 'Design', status: 'active' },
      { id: '13', name: 'Owen Barrett', email: 'owen.barrett@uipkge.dev', role: 'PM', department: 'Product', status: 'on_leave' },
      { id: '14', name: 'Stella Quinn', email: 'stella.quinn@uipkge.dev', role: 'Tech Writer', department: 'Marketing', status: 'active' },
      { id: '15', name: 'Isaac Nolan', email: 'isaac.nolan@uipkge.dev', role: 'Data Scientist', department: 'Product', status: 'active' },
      { id: '16', name: 'Hannah Reid', email: 'hannah.reid@uipkge.dev', role: 'Frontend Engineer', department: 'Engineering', status: 'terminated' },
    ] as Omit<Employee, 'hired'>[]
  ).map((row, i) => ({
    ...row,
    hired: `202${2 + (i % 3)}-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 27) + 1).padStart(2, '0')}`,
  }))

  const statusCell = ({ row }: { row: Row<Employee> }) => renderSnippet(statusBadge, row.original.status)
  const sortHeader =
    (label: string) =>
    ({ column }: { column: any }) =>
      renderComponent(DataTableColumnHeader, { column, label })

  const plainColumns: ColumnDef<Employee>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'role', header: 'Role' },
    { accessorKey: 'department', header: 'Department' },
    { accessorKey: 'status', header: 'Status', cell: statusCell },
  ]

  const selectColumn: ColumnDef<Employee> = {
    id: 'select',
    enableSorting: false,
    enableHiding: false,
    size: 32,
    header: ({ table }) => renderSnippet(selectAllCheckbox, table),
    cell: ({ row }) => renderSnippet(selectRowCheckbox, row),
  }

  const actionsColumn: ColumnDef<Employee> = {
    id: 'actions',
    enableSorting: false,
    enableHiding: false,
    size: 40,
    cell: ({ row }) => renderSnippet(rowActions, row.original),
  }

  const sortableColumnDefinitions: ColumnDef<Employee>[] = [
    selectColumn,
    { accessorKey: 'name', header: sortHeader('Name') },
    { accessorKey: 'email', header: sortHeader('Email') },
    { accessorKey: 'role', header: sortHeader('Role') },
    { accessorKey: 'department', header: sortHeader('Department') },
    { accessorKey: 'status', header: sortHeader('Status'), cell: statusCell },
  ]

  const expanderColumn: ColumnDef<Employee> = {
    id: 'expander',
    enableSorting: false,
    enableHiding: false,
    size: 32,
    cell: ({ row }) => renderSnippet(expanderButton, row),
  }

  const expansionColumns: ColumnDef<Employee>[] = [
    expanderColumn,
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'department', header: 'Department' },
    { accessorKey: 'status', header: 'Status', cell: statusCell },
  ]

  // Rich-cell columns demo: avatar+name, progress bar, custom header.
  const richColumns: ColumnDef<Employee>[] = [
    { accessorKey: 'name', header: 'Person', cell: ({ row }) => renderSnippet(personCell, row.original) },
    {
      id: 'tenure',
      header: () => renderSnippet(tenureHeader, undefined),
      cell: ({ row }) => renderSnippet(tenureCell, (parseInt(row.original.id) % 10) + 1),
    },
    { accessorKey: 'department', header: 'Department' },
    { accessorKey: 'status', header: 'Status', cell: statusCell },
  ]

  const filters: FilterDefinition[] = [
    {
      column: 'department',
      label: 'Department',
      type: 'multiselect',
      options: ['Engineering', 'Product', 'Design', 'Marketing'],
    },
    { column: 'status', label: 'Status', type: 'multiselect', options: ['active', 'on_leave', 'terminated'] },
  ]

  const dateFilters: FilterDefinition[] = [...filters, { column: 'hired', label: 'Hired', type: 'date' }]

  // Per-column header filter — each header carries its own filter definition.
  // The funnel icon next to the sort affordance opens a popover with the
  // right UI (text input / multiselect / select / date). Independent of the
  // toolbar filter modes; you can ship both at once if you want users to
  // drill from either entry point.
  const headerFilterColumns: ColumnDef<Employee>[] = [
    selectColumn,
    {
      accessorKey: 'name',
      header: ({ column }) =>
        renderComponent(DataTableColumnHeader, {
          column,
          label: 'Name',
          filter: { column: 'name', label: 'Name', type: 'text' },
        }),
    },
    {
      accessorKey: 'email',
      header: ({ column }) =>
        renderComponent(DataTableColumnHeader, {
          column,
          label: 'Email',
          filter: { column: 'email', label: 'Email', type: 'text' },
        }),
    },
    { accessorKey: 'role', header: sortHeader('Role') },
    {
      accessorKey: 'department',
      header: ({ column }) =>
        renderComponent(DataTableColumnHeader, {
          column,
          label: 'Department',
          filter: {
            column: 'department',
            label: 'Department',
            type: 'multiselect',
            options: ['Engineering', 'Product', 'Design', 'Marketing'],
          },
        }),
    },
    {
      accessorKey: 'status',
      header: ({ column }) =>
        renderComponent(DataTableColumnHeader, {
          column,
          label: 'Status',
          filter: {
            column: 'status',
            label: 'Status',
            type: 'multiselect',
            options: [
              { value: 'active', label: 'Active' },
              { value: 'on_leave', label: 'On leave' },
              { value: 'terminated', label: 'Terminated' },
            ],
          },
        }),
      cell: statusCell,
    },
  ]

  let onlyActive = $state(false)
  let actionMessage = $state('')
  let infiniteRows = $state<Employee[]>(data.slice(0, 8))
  let infiniteLoading = $state(false)
  function loadMoreInfinite() {
    if (infiniteLoading || infiniteRows.length >= data.length) return
    infiniteLoading = true
    window.setTimeout(() => {
      infiniteRows = data.slice(0, Math.min(infiniteRows.length + 4, data.length))
      infiniteLoading = false
    }, 600)
  }
  function announceAction(message: string) {
    actionMessage = message
    window.setTimeout(() => (actionMessage = ''), 2000)
  }
  const sortableColumns: ColumnDef<Employee>[] = [...sortableColumnDefinitions, actionsColumn]
  const dateColumns: ColumnDef<Employee>[] = [
    ...sortableColumnDefinitions,
    { accessorKey: 'hired', header: sortHeader('Hired') },
    actionsColumn,
  ]
  let serverRows = $state<Employee[]>(data.slice(0, 10))
  let serverLoading = $state(false)
  function onServerState(state: { page: number; pageSize: number }) {
    serverLoading = true
    window.setTimeout(() => {
      const start = (state.page - 1) * state.pageSize
      serverRows = data.slice(start, start + state.pageSize)
      serverLoading = false
    }, 350)
  }

  function initials(name: string) {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  }
</script>

{#snippet statusBadge(status: Employee['status'])}
  <Badge variant={status === 'active' ? 'default' : status === 'on_leave' ? 'secondary' : 'outline'} class="capitalize">
    {status.replace('_', ' ')}
  </Badge>
{/snippet}

{#snippet selectAllCheckbox(table: Table<Employee>)}
  <input
    type="checkbox"
    class="accent-foreground size-4 cursor-pointer rounded"
    checked={table.getIsAllPageRowsSelected()}
    indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()}
    onchange={(e) => table.toggleAllPageRowsSelected(e.currentTarget.checked)}
    aria-label="Select all rows"
  />
{/snippet}

{#snippet selectRowCheckbox(row: Row<Employee>)}
  <input
    type="checkbox"
    class="accent-foreground size-4 cursor-pointer rounded"
    checked={row.getIsSelected()}
    onchange={(e) => row.toggleSelected(e.currentTarget.checked)}
    aria-label="Select row"
  />
{/snippet}

{#snippet rowActions(employee: Employee)}
  <DropdownMenu>
    <DropdownMenuTrigger>
      {#snippet child({ props })}
        <Button {...props} variant="ghost" size="icon-sm" class="-my-1 size-8" aria-label="Open row actions">
          <MoreHorizontal class="size-4" />
        </Button>
      {/snippet}
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuItem
        onclick={() => {
          navigator.clipboard?.writeText(employee.email)
          announceAction(`Copied ${employee.email}`)
        }}
      >
        <Copy class="size-3.5" />
        Copy email
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onclick={() => announceAction(`Edit ${employee.name}`)}>
        <Pencil class="size-3.5" />
        Edit
      </DropdownMenuItem>
      <DropdownMenuItem class="text-destructive" onclick={() => announceAction(`Deleted ${employee.name}`)}>
        <Trash2 class="size-3.5" />
        Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
{/snippet}

{#snippet expanderButton(row: Row<Employee>)}
  <Button
    variant="ghost"
    size="icon-sm"
    class="-my-1 size-7"
    aria-label={row.getIsExpanded() ? 'Collapse' : 'Expand'}
    onclick={(e) => {
      e.stopPropagation()
      row.toggleExpanded()
    }}
  >
    {#if row.getIsExpanded()}
      <ChevronDown class="size-4" />
    {:else}
      <ChevronRight class="size-4" />
    {/if}
  </Button>
{/snippet}

{#snippet personCell(e: Employee)}
  <div class="flex items-center gap-3">
    <Avatar class="size-8">
      <AvatarFallback>{initials(e.name)}</AvatarFallback>
    </Avatar>
    <div>
      <div class="font-medium">{e.name}</div>
      <div class="text-muted-foreground text-xs">{e.email}</div>
    </div>
  </div>
{/snippet}

{#snippet tenureHeader(_: undefined)}
  <div class="flex items-center gap-1">
    Tenure
    <span class="text-muted-foreground text-xs">(yrs)</span>
  </div>
{/snippet}

{#snippet tenureCell(yrs: number)}
  <div class="flex items-center gap-2">
    <Progress value={yrs * 10} class="h-1.5 w-20" />
    <span class="text-muted-foreground text-xs tabular-nums">{yrs}y</span>
  </div>
{/snippet}

{#snippet bulkActions(rows: Row<Employee>[], clear: () => void)}
  <Button size="sm" variant="outline" onclick={() => announceAction(`Exporting ${rows.length} rows`)}>Export</Button>
  <Button
    size="sm"
    variant="destructive"
    onclick={() => {
      announceAction(`Deleted ${rows.length} rows`)
      clear()
    }}
  >
    Delete
  </Button>
{/snippet}

<p role="status" aria-live="polite" class="text-muted-foreground min-h-5 text-xs">{actionMessage}</p>

{#if story === 'Default — fully featured'}
  <DataTable
    columns={sortableColumns}
    {data}
    {filters}
    filterColumn="email"
    filterPlaceholder="Search by email…"
    enableColumnVisibility
  />
{/if}

{#if story === 'Sortable columns'}
  <DataTable columns={sortableColumns} {data} />
{/if}

{#if story === 'Plain headers'}
  <DataTable columns={plainColumns} {data} />
{/if}

{#if story === 'No search'}
  <DataTable columns={sortableColumns} {data} {filters} enableSearch={false} />
{/if}

{#if story === 'No view dropdown'}
  <DataTable columns={sortableColumns} {data} filterColumn="email" enableColumnVisibility={false} />
{/if}

{#if story === 'No pagination'}
  <DataTable columns={sortableColumns} {data} filterColumn="email" enablePagination={false} />
{/if}

{#if story === 'Hide toolbar entirely'}
  <DataTable columns={sortableColumns} {data} hideToolbar enablePagination={false} />
{/if}

{#if story === 'Sticky header'}
  <DataTable columns={sortableColumns} {data} filterColumn="email" stickyHeader maxHeight="280px" />
{/if}

{#if story === 'Density: compact'}
  <DataTable columns={sortableColumns} {data} filterColumn="email" density="compact" />
{/if}

{#if story === 'Density: comfortable'}
  <DataTable columns={sortableColumns} {data} filterColumn="email" density="comfortable" />
{/if}

{#if story === 'Row click navigation'}
  <DataTable
    columns={sortableColumns}
    {data}
    filterColumn="email"
    onRowClick={(row) => announceAction(`Selected ${row.name}`)}
  />
{/if}

{#if story === 'Bulk action bar'}
  <DataTable columns={sortableColumns} {data} filterColumn="email" renderBulkActions={bulkActions} />
{/if}

{#if story === 'Empty state'}
  <DataTable columns={sortableColumns} data={[]} filterColumn="email">
    {#snippet emptyState()}
      <div class="space-y-2 py-8">
        <p class="font-medium">No employees yet</p>
        <p class="text-muted-foreground text-sm">Add your first one to get started.</p>
      </div>
    {/snippet}
  </DataTable>
{/if}

{#if story === 'Row expansion'}
  <DataTable
    columns={expansionColumns}
    {data}
    filterColumn="name"
    filterPlaceholder="Filter by name…"
    enablePagination={false}
  >
    {#snippet renderExpanded(row)}
      <div class="space-y-1 text-sm">
        <p><strong>Email:</strong> {row.email}</p>
        <p><strong>Role:</strong> {row.role}</p>
        <p><strong>Department:</strong> {row.department}</p>
        <p class="text-muted-foreground mt-2 text-xs">Click the chevron again to collapse.</p>
      </div>
    {/snippet}
  </DataTable>
{/if}

{#if story === 'Column pinning'}
  <DataTable
    columns={sortableColumns}
    {data}
    filterColumn="email"
    defaultColumnPinning={{ left: ['select', 'name'], right: ['actions'] }}
  />
{/if}

{#if story === 'Column resizing'}
  <DataTable columns={sortableColumns} {data} filterColumn="email" enableResize />
{/if}

{#if story === 'Export CSV'}
  <DataTable columns={sortableColumns} {data} {filters} filterColumn="email" enableExport />
{/if}

{#if story === 'Custom cells + headers'}
  <DataTable columns={richColumns} {data} enablePagination={false} />
{/if}

{#if story === 'Custom filter UI'}
  <DataTable
    columns={sortableColumns}
    data={onlyActive ? data.filter((d) => d.status === 'active') : data}
    {filters}
    filterColumn="email"
    filterMode="inline"
  >
    {#snippet customFilters()}
      <div class="border-border ml-2 flex items-center gap-2 border-l px-2">
        <Switch checked={onlyActive} onCheckedChange={(v) => (onlyActive = v)} id="only-active" />
        <Label for="only-active" class="cursor-pointer text-sm">Only active</Label>
      </div>
    {/snippet}
  </DataTable>
{/if}

{#if story === 'Drag-to-reorder columns'}
  <DataTable columns={sortableColumns} {data} filterColumn="email" enableReorder />
{/if}

{#if story === 'Virtual scrolling (large dataset)'}
  <DataTable
    columns={sortableColumns}
    data={bigData}
    filterColumn="email"
    virtual
    stickyHeader
    maxHeight="320px"
    enablePagination={false}
  />
{/if}

{#if story === 'Footer / totals row'}
  <DataTable columns={sortableColumns} {data} filterColumn="email" enablePagination={false}>
    {#snippet renderFooter(rows)}
      <tr class="font-medium">
        <td colspan={7} class="px-3 py-3 text-sm">
          Total: {rows.length} employee{rows.length === 1 ? '' : 's'}
          <span class="text-muted-foreground ml-2">
            · {rows.filter((r) => r.original.status === 'active').length} active
          </span>
        </td>
      </tr>
    {/snippet}
  </DataTable>
{/if}

{#if story === 'Inline filter mode (default)'}
  <DataTable
    columns={sortableColumns}
    {data}
    {filters}
    filterColumn="email"
    filterPlaceholder="Search…"
    filterMode="inline"
  />
{/if}

{#if story === 'Popover filter mode'}
  <DataTable
    columns={sortableColumns}
    {data}
    {filters}
    filterColumn="email"
    filterPlaceholder="Search…"
    filterMode="popover"
  />
{/if}

{#if story === 'Modal filter mode (side panel)'}
  <DataTable
    columns={sortableColumns}
    {data}
    {filters}
    filterColumn="email"
    filterPlaceholder="Search…"
    filterMode="modal"
  />
{/if}

{#if story === 'Per-column header filter'}
  <DataTable columns={headerFilterColumns} {data} hideToolbar />
{/if}

{#if story === 'Header filters + toolbar (both)'}
  <DataTable
    columns={headerFilterColumns}
    {data}
    {filters}
    filterColumn="email"
    filterPlaceholder="Search by email…"
    filterMode="popover"
  />
{/if}

{#if story === 'Loading'}
  <DataTable columns={sortableColumns} data={[]} filterColumn="email" loading />
{/if}

{#if story === 'Infinite scroll'}
  <DataTable
    columns={sortableColumns}
    data={infiniteRows}
    filterColumn="email"
    infinite
    loading={infiniteLoading}
    stickyHeader
    maxHeight="280px"
    onFetchMore={loadMoreInfinite}
  />
{/if}

{#if story === 'Density toggle'}
  <DataTable columns={sortableColumns} {data} filterColumn="email" enableDensityToggle enableColumnVisibility />
{/if}

{#if story === 'Date range filter'}
  <DataTable columns={dateColumns} {data} filters={dateFilters} filterColumn="email" />
{/if}

{#if story === 'Grouped by department'}
  <DataTable columns={sortableColumns} {data} defaultGrouping={['department']} enablePagination={false} />
{/if}

{#if story === 'Keyboard navigation'}
  <DataTable columns={sortableColumns} {data} filterColumn="email" enableKeyboardNavigation />
{/if}

{#if story === 'Borderless'}
  <div class="bg-muted/30 rounded-lg p-3">
    <DataTable columns={sortableColumns} {data} filterColumn="email" borderless="full" />
  </div>
{/if}

{#if story === 'Server-side pagination'}
  <DataTable
    columns={sortableColumns}
    data={serverRows}
    totalRows={data.length}
    loading={serverLoading}
    filterColumn="email"
    onStateChange={onServerState}
  />
{/if}

{#if story === 'Inline bulk dock'}
  <DataTable
    columns={sortableColumns}
    {data}
    filterColumn="email"
    bulkActionPosition="inline"
    renderBulkActions={bulkActions}
  />
{/if}

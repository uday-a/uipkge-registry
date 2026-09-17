<script setup lang="ts">
import { DataTable } from "@/components/ui/data-table";
import { h, onUnmounted, ref } from "vue";
import type { ColumnDef } from "@tanstack/vue-table";
import {
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Pencil,
  Copy,
  Trash2,
} from "lucide-vue-next";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/ui/data-table";

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: "active" | "on_leave" | "terminated";
  hired: string;
}

// Generated dataset for virtual-scroll story.
const FIRST_NAMES = [
  "James",
  "Elena",
  "Marcus",
  "Sophie",
  "Daniel",
  "Claire",
  "Nathan",
  "Olivia",
  "Henry",
  "Amelia",
  "Lucas",
  "Grace",
  "Owen",
  "Stella",
  "Isaac",
];
const ROLES = [
  "Backend Engineer",
  "Frontend Engineer",
  "Designer",
  "PM",
  "Data Scientist",
  "Tech Writer",
  "DevOps",
  "QA Lead",
];
const DEPTS = ["Engineering", "Product", "Design", "Marketing"];
const STATUSES = ["active", "on_leave", "terminated"] as const;
const bigData: Employee[] = Array.from({ length: 500 }, (_, i) => {
  const first = FIRST_NAMES[i % FIRST_NAMES.length];
  return {
    id: String(i + 100),
    name: `${first} ${"ABCDEFGHIJ"[i % 10]}.`,
    email: `${first.toLowerCase()}${i}@uipkge.dev`,
    role: ROLES[i % ROLES.length],
    department: DEPTS[i % DEPTS.length],
    status: STATUSES[i % STATUSES.length],
    hired: `202${2 + (i % 3)}-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 27) + 1).padStart(2, "0")}`,
  };
});

const data: Employee[] = [
  {
    id: "1",
    name: "James Carter",
    email: "james.carter@uipkge.dev",
    role: "Backend Engineer",
    department: "Engineering",
    status: "active",
  },
  {
    id: "2",
    name: "Elena Rossi",
    email: "elena.rossi@uipkge.dev",
    role: "Tech Writer",
    department: "Marketing",
    status: "active",
  },
  {
    id: "3",
    name: "Marcus Hale",
    email: "marcus.hale@uipkge.dev",
    role: "Data Scientist",
    department: "Product",
    status: "on_leave",
  },
  {
    id: "4",
    name: "Sophie Bennett",
    email: "sophie.bennett@uipkge.dev",
    role: "Senior Engineer",
    department: "Engineering",
    status: "active",
  },
  {
    id: "5",
    name: "Daniel Price",
    email: "daniel.price@uipkge.dev",
    role: "Designer",
    department: "Design",
    status: "terminated",
  },
  {
    id: "6",
    name: "Claire Donovan",
    email: "claire.donovan@uipkge.dev",
    role: "PM",
    department: "Product",
    status: "active",
  },
  {
    id: "7",
    name: "Nathan Brooks",
    email: "nathan.brooks@uipkge.dev",
    role: "Senior Engineer",
    department: "Engineering",
    status: "active",
  },
  {
    id: "8",
    name: "Olivia Grant",
    email: "olivia.grant@uipkge.dev",
    role: "Designer",
    department: "Design",
    status: "on_leave",
  },
  {
    id: "9",
    name: "Henry Walsh",
    email: "henry.walsh@uipkge.dev",
    role: "Frontend Engineer",
    department: "Engineering",
    status: "active",
  },
  {
    id: "10",
    name: "Amelia Cole",
    email: "amelia.cole@uipkge.dev",
    role: "QA Lead",
    department: "Engineering",
    status: "active",
  },
  {
    id: "11",
    name: "Lucas Meyer",
    email: "lucas.meyer@uipkge.dev",
    role: "DevOps",
    department: "Engineering",
    status: "active",
  },
  {
    id: "12",
    name: "Grace Turner",
    email: "grace.turner@uipkge.dev",
    role: "Designer",
    department: "Design",
    status: "active",
  },
  {
    id: "13",
    name: "Owen Barrett",
    email: "owen.barrett@uipkge.dev",
    role: "PM",
    department: "Product",
    status: "on_leave",
  },
  {
    id: "14",
    name: "Stella Quinn",
    email: "stella.quinn@uipkge.dev",
    role: "Tech Writer",
    department: "Marketing",
    status: "active",
  },
  {
    id: "15",
    name: "Isaac Nolan",
    email: "isaac.nolan@uipkge.dev",
    role: "Data Scientist",
    department: "Product",
    status: "active",
  },
  {
    id: "16",
    name: "Hannah Reid",
    email: "hannah.reid@uipkge.dev",
    role: "Frontend Engineer",
    department: "Engineering",
    status: "terminated",
  },
].map((row, i) => ({
  ...row,
  hired: `202${2 + (i % 3)}-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 27) + 1).padStart(2, "0")}`,
})) as Employee[];

const infiniteRows = ref<Employee[]>(data.slice(0, 8));
const infiniteLoading = ref(false);
function loadMoreInfinite() {
  if (infiniteLoading.value || infiniteRows.value.length >= data.length) return;
  infiniteLoading.value = true;
  window.setTimeout(() => {
    infiniteRows.value = data.slice(
      0,
      Math.min(infiniteRows.value.length + 4, data.length),
    );
    infiniteLoading.value = false;
  }, 600);
}

const serverRows = ref<Employee[]>(data.slice(0, 10));
const serverLoading = ref(false);
function onServerState(state: { page: number; pageSize: number }) {
  serverLoading.value = true;
  window.setTimeout(() => {
    const start = (state.page - 1) * state.pageSize;
    serverRows.value = data.slice(start, start + state.pageSize);
    serverLoading.value = false;
  }, 350);
}

const plainColumns: ColumnDef<Employee>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "role", header: "Role" },
  { accessorKey: "department", header: "Department" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const s = row.original.status;
      const variant =
        s === "active" ? "default" : s === "on_leave" ? "secondary" : "outline";
      return h(Badge, { variant, class: "capitalize" }, () =>
        s.replace("_", " "),
      );
    },
  },
];

const selectColumn: ColumnDef<Employee> = {
  id: "select",
  enableSorting: false,
  enableHiding: false,
  size: 32,
  header: ({ table }) =>
    h("input", {
      type: "checkbox",
      class: "size-4 accent-foreground cursor-pointer rounded",
      checked: table.getIsAllPageRowsSelected(),
      indeterminate:
        table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected(),
      onChange: (e: Event) =>
        table.toggleAllPageRowsSelected((e.target as HTMLInputElement).checked),
      "aria-label": "Select all rows",
    }),
  cell: ({ row }) =>
    h("input", {
      type: "checkbox",
      class: "size-4 accent-foreground cursor-pointer rounded",
      checked: row.getIsSelected(),
      onChange: (e: Event) =>
        row.toggleSelected((e.target as HTMLInputElement).checked),
      "aria-label": "Select row",
    }),
};

const actionMessage = ref("");
let actionTimer: ReturnType<typeof setTimeout> | undefined;
function announceAction(message: string) {
  clearTimeout(actionTimer);
  actionMessage.value = message;
  actionTimer = setTimeout(() => (actionMessage.value = ""), 2000);
}
onUnmounted(() => clearTimeout(actionTimer));

const actionsColumn: ColumnDef<Employee> = {
  id: "actions",
  enableSorting: false,
  enableHiding: false,
  size: 40,
  cell: ({ row }) =>
    h(DropdownMenu, null, {
      default: () => [
        h(DropdownMenuTrigger, { asChild: true }, () =>
          h(
            Button,
            {
              variant: "ghost",
              size: "icon-sm",
              class: "size-8 -my-1",
              "aria-label": "Open row actions",
            },
            () => h(MoreHorizontal, { class: "size-4" }),
          ),
        ),
        h(DropdownMenuContent, { align: "end" }, () => [
          h(DropdownMenuLabel, null, () => "Actions"),
          h(
            DropdownMenuItem,
            {
              onSelect: () => {
                navigator.clipboard?.writeText(row.original.email);
                announceAction(`Copied ${row.original.email}`);
              },
            },
            () => [h(Copy, { class: "size-3.5" }), "Copy email"],
          ),
          h(DropdownMenuSeparator),
          h(
            DropdownMenuItem,
            {
              onSelect: () => {
                announceAction(`Editing ${row.original.name}`);
              },
            },
            () => [h(Pencil, { class: "size-3.5" }), "Edit"],
          ),
          h(
            DropdownMenuItem,
            {
              class: "text-destructive",
              onSelect: () => {
                announceAction(`Deleted ${row.original.name}`);
              },
            },
            () => [h(Trash2, { class: "size-3.5" }), "Delete"],
          ),
        ]),
      ],
    }),
};

const sortableColumns: ColumnDef<Employee>[] = [
  selectColumn,
  {
    accessorKey: "name",
    header: ({ column }) => h(DataTableColumnHeader, { column, label: "Name" }),
  },
  {
    accessorKey: "email",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, label: "Email" }),
  },
  {
    accessorKey: "role",
    header: ({ column }) => h(DataTableColumnHeader, { column, label: "Role" }),
  },
  {
    accessorKey: "department",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, label: "Department" }),
  },
  {
    accessorKey: "status",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, label: "Status" }),
    cell: ({ row }) => {
      const s = row.original.status;
      const variant =
        s === "active" ? "default" : s === "on_leave" ? "secondary" : "outline";
      return h(Badge, { variant, class: "capitalize" }, () =>
        s.replace("_", " "),
      );
    },
  },
  actionsColumn,
];

const expanderColumn: ColumnDef<Employee> = {
  id: "expander",
  enableSorting: false,
  enableHiding: false,
  size: 32,
  cell: ({ row }) =>
    h(
      Button,
      {
        variant: "ghost",
        size: "icon-sm",
        class: "size-7 -my-1",
        "aria-label": row.getIsExpanded() ? "Collapse" : "Expand",
        onClick: (e: Event) => {
          e.stopPropagation();
          row.toggleExpanded();
        },
      },
      () =>
        row.getIsExpanded()
          ? h(ChevronDown, { class: "size-4" })
          : h(ChevronRight, { class: "size-4" }),
    ),
};

const expansionColumns: ColumnDef<Employee>[] = [
  expanderColumn,
  { accessorKey: "name", header: "Name" },
  { accessorKey: "department", header: "Department" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const s = row.original.status;
      const variant =
        s === "active" ? "default" : s === "on_leave" ? "secondary" : "outline";
      return h(Badge, { variant, class: "capitalize" }, () =>
        s.replace("_", " "),
      );
    },
  },
];

// Rich-cell columns demo: avatar+name, progress bar, custom header.
const richColumns: ColumnDef<Employee>[] = [
  {
    accessorKey: "name",
    header: "Person",
    cell: ({ row }) => {
      const e = row.original;
      const initials = e.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
      return h("div", { class: "flex items-center gap-3" }, [
        h(Avatar, { class: "size-8" }, () => h(AvatarFallback, () => initials)),
        h("div", null, [
          h("div", { class: "font-medium" }, e.name),
          h("div", { class: "text-muted-foreground text-xs" }, e.email),
        ]),
      ]);
    },
  },
  {
    id: "tenure",
    header: () =>
      h("div", { class: "flex items-center gap-1" }, [
        "Tenure",
        h("span", { class: "text-muted-foreground text-xs" }, "(yrs)"),
      ]),
    cell: ({ row }) => {
      const yrs = (parseInt(row.original.id) % 10) + 1;
      return h("div", { class: "flex items-center gap-2" }, [
        h(Progress, { modelValue: yrs * 10, class: "h-1.5 w-20" }),
        h(
          "span",
          { class: "text-muted-foreground text-xs tabular-nums" },
          `${yrs}y`,
        ),
      ]);
    },
  },
  { accessorKey: "department", header: "Department" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const s = row.original.status;
      const variant =
        s === "active" ? "default" : s === "on_leave" ? "secondary" : "outline";
      return h(Badge, { variant, class: "capitalize" }, () =>
        s.replace("_", " "),
      );
    },
  },
];

const onlyActive = ref(false);

const filters = [
  {
    column: "department",
    label: "Department",
    type: "multiselect" as const,
    options: ["Engineering", "Product", "Design", "Marketing"],
  },
  {
    column: "status",
    label: "Status",
    type: "multiselect" as const,
    options: ["active", "on_leave", "terminated"],
  },
];

const dateFilters = [
  ...filters,
  { column: "hired", label: "Hired", type: "date" as const },
];

const dateColumns: ColumnDef<Employee>[] = [
  ...sortableColumns.slice(0, -1),
  {
    accessorKey: "hired",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, label: "Hired" }),
  },
  actionsColumn,
];

// Per-column header filter — each header carries its own filter definition.
// The funnel icon next to the sort affordance opens a popover with the
// right UI (text input / multiselect / select / date). Independent of the
// toolbar filter modes; you can ship both at once if you want users to
// drill from either entry point.
const headerFilterColumns: ColumnDef<Employee>[] = [
  selectColumn,
  {
    accessorKey: "name",
    header: ({ column }) =>
      h(DataTableColumnHeader, {
        column,
        label: "Name",
        filter: { column: "name", label: "Name", type: "text" },
      }),
  },
  {
    accessorKey: "email",
    header: ({ column }) =>
      h(DataTableColumnHeader, {
        column,
        label: "Email",
        filter: { column: "email", label: "Email", type: "text" },
      }),
  },
  {
    accessorKey: "role",
    header: ({ column }) => h(DataTableColumnHeader, { column, label: "Role" }),
  },
  {
    accessorKey: "department",
    header: ({ column }) =>
      h(DataTableColumnHeader, {
        column,
        label: "Department",
        filter: {
          column: "department",
          label: "Department",
          type: "multiselect",
          options: ["Engineering", "Product", "Design", "Marketing"],
        },
      }),
  },
  {
    accessorKey: "status",
    header: ({ column }) =>
      h(DataTableColumnHeader, {
        column,
        label: "Status",
        filter: {
          column: "status",
          label: "Status",
          type: "multiselect",
          options: [
            { value: "active", label: "Active" },
            { value: "on_leave", label: "On leave" },
            { value: "terminated", label: "Terminated" },
          ],
        },
      }),
    cell: ({ row }) => {
      const s = row.original.status;
      const variant =
        s === "active" ? "default" : s === "on_leave" ? "secondary" : "outline";
      return h(Badge, { variant, class: "capitalize" }, () =>
        s.replace("_", " "),
      );
    },
  },
];
</script>

<template>
  <div class="space-y-4">
    <p
      role="status"
      aria-live="polite"
      class="text-muted-foreground min-h-5 text-xs"
    >
      {{ actionMessage }}
    </p>
    <Story
      title="Default — fully featured"
      description="Industry-standard layout: search + faceted filter chips in the toolbar (not a side panel), row selection, sortable columns, View dropdown, pagination. Filter chips open popovers — same pattern as shadcn / Linear / Airtable."
    >
      <DataTable
        :columns="sortableColumns"
        :data="data"
        :filters="filters"
        filter-column="email"
        filter-placeholder="Search by email…"
        enable-column-visibility
      />
    </Story>

    <Story
      title="Sortable columns"
      description="Wrap each column header with DataTableColumnHeader. Click cycles asc → desc → none. Arrow icon reflects state."
    >
      <DataTable :columns="sortableColumns" :data="data" />
    </Story>

    <Story
      title="Plain headers"
      description="Use plain string headers when you do not need sort. Pagination still works."
    >
      <DataTable :columns="plainColumns" :data="data" />
    </Story>

    <Story
      title="No search"
      description="Hide the global search input with `enable-search=false`. Filters + view + pagination still render."
    >
      <DataTable
        :columns="sortableColumns"
        :data="data"
        :filters="filters"
        :enable-search="false"
      />
    </Story>

    <Story
      title="No view dropdown"
      description="Hide the column-visibility dropdown with `enable-column-visibility=false`."
    >
      <DataTable
        :columns="sortableColumns"
        :data="data"
        filter-column="email"
        :enable-column-visibility="false"
      />
    </Story>

    <Story
      title="No pagination"
      description="Hide the pagination footer with `enable-pagination=false`. Useful when the dataset is small or scrolled inline."
    >
      <DataTable
        :columns="sortableColumns"
        :data="data"
        filter-column="email"
        :enable-pagination="false"
      />
    </Story>

    <Story
      title="Hide toolbar entirely"
      description="`hide-toolbar` removes search + filters + view in one shot. Combine with `enable-pagination=false` for a pure read-only sortable table."
    >
      <DataTable
        :columns="sortableColumns"
        :data="data"
        hide-toolbar
        :enable-pagination="false"
      />
    </Story>

    <Story
      title="Sticky header"
      description="Combine `sticky-header` + `max-height` to keep headers visible while the body scrolls."
    >
      <DataTable
        :columns="sortableColumns"
        :data="data"
        filter-column="email"
        sticky-header
        max-height="280px"
      />
    </Story>

    <Story
      title="Density: compact"
      description="Tighter row padding for log-style or analytics views."
    >
      <DataTable
        :columns="sortableColumns"
        :data="data"
        filter-column="email"
        density="compact"
      />
    </Story>

    <Story
      title="Density: comfortable"
      description="Roomier padding when content is heavy or visual breathing room matters."
    >
      <DataTable
        :columns="sortableColumns"
        :data="data"
        filter-column="email"
        density="comfortable"
      />
    </Story>

    <Story
      title="Row click navigation"
      description="`onRowClick` fires with the original row record. Rows get cursor-pointer + hover bg automatically."
    >
      <DataTable
        :columns="sortableColumns"
        :data="data"
        filter-column="email"
        :on-row-click="
          (row) => {
            announceAction(`Selected ${row.name}`);
          }
        "
      />
    </Story>

    <Story
      title="Bulk action bar"
      description="When rows are selected, a #bulk-actions slot renders above the table. Use it for Delete N, Export N, etc."
    >
      <DataTable :columns="sortableColumns" :data="data" filter-column="email">
        <template #bulk-actions="{ rows, clear }">
          <Button
            size="sm"
            variant="outline"
            @click="
              () => {
                announceAction(`Exporting ${rows.length} rows`);
              }
            "
            >Export</Button
          >
          <Button
            size="sm"
            variant="destructive"
            @click="
              () => {
                announceAction(`Deleted ${rows.length} rows`);
                clear();
              }
            "
            >Delete</Button
          >
        </template>
      </DataTable>
    </Story>

    <Story
      title="Empty state"
      description="`#empty` slot replaces the default 'No results' message. Useful for first-run prompts or filter-mismatch hints."
    >
      <DataTable :columns="sortableColumns" :data="[]" filter-column="email">
        <template #empty>
          <div class="space-y-2 py-8">
            <p class="font-medium">No employees yet</p>
            <p class="text-muted-foreground text-sm">
              Add your first one to get started.
            </p>
          </div>
        </template>
      </DataTable>
    </Story>

    <Story
      title="Row expansion"
      description="`#expanded` slot renders custom content under any expanded row. Columns use `row.toggleExpanded()` to drive state."
    >
      <DataTable
        :columns="expansionColumns"
        :data="data"
        filter-column="name"
        filter-placeholder="Filter by name…"
        :enable-pagination="false"
      >
        <template #expanded="{ row }">
          <div class="space-y-1 text-sm">
            <p><strong>Email:</strong> {{ row.email }}</p>
            <p><strong>Role:</strong> {{ row.role }}</p>
            <p><strong>Department:</strong> {{ row.department }}</p>
            <p class="text-muted-foreground mt-2 text-xs">
              Click the chevron again to collapse.
            </p>
          </div>
        </template>
      </DataTable>
    </Story>

    <Story
      title="Column pinning"
      description="Pin Name to the left, Status to the right. Pinned columns stay in place during horizontal scroll."
    >
      <DataTable
        :columns="sortableColumns"
        :data="data"
        filter-column="email"
        :default-column-pinning="{
          left: ['select', 'name'],
          right: ['actions'],
        }"
      />
    </Story>

    <Story
      title="Column resizing"
      description="`enable-resize` adds drag handles between columns. Drag right edges to widen / shrink."
    >
      <DataTable
        :columns="sortableColumns"
        :data="data"
        filter-column="email"
        enable-resize
      />
    </Story>

    <Story
      title="Export CSV"
      description="`enable-export` adds a Download button in the toolbar. Exports the currently filtered + visible columns."
    >
      <DataTable
        :columns="sortableColumns"
        :data="data"
        :filters="filters"
        filter-column="email"
        enable-export
      />
    </Story>

    <Story
      title="Custom cells + headers"
      description="Anything Vue can render works in `column.cell` / `column.header`. Avatar+name composite, progress bar with side label, custom header markup — all just functions returning vnodes."
    >
      <DataTable
        :columns="richColumns"
        :data="data"
        :enable-pagination="false"
      />
    </Story>

    <Story
      title="Custom filter UI"
      description="`#custom-filters` slot drops your own controls into any filter mode (inline / popover / sheet). Bind to your own ref and call table.getColumn() to apply."
    >
      <DataTable
        :columns="sortableColumns"
        :data="onlyActive ? data.filter((d) => d.status === 'active') : data"
        :filters="filters"
        filter-column="email"
        filter-mode="inline"
      >
        <template #custom-filters>
          <div class="border-border ml-2 flex items-center gap-2 border-l px-2">
            <Switch
              :model-value="onlyActive"
              @update:model-value="onlyActive = $event"
              id="only-active"
            />
            <Label for="only-active" class="cursor-pointer text-sm"
              >Only active</Label
            >
          </div>
        </template>
      </DataTable>
    </Story>

    <Story
      title="Drag-to-reorder columns"
      description="`enable-reorder` makes column headers draggable. Pick up a header and drop on another to swap positions."
    >
      <DataTable
        :columns="sortableColumns"
        :data="data"
        filter-column="email"
        enable-reorder
      />
    </Story>

    <Story
      title="Virtual scrolling (large dataset)"
      description="`virtual` enables CSS content-visibility on every row — browser skips layout/paint of off-screen rows. Pair with `max-height` for a scroll container."
    >
      <DataTable
        :columns="sortableColumns"
        :data="bigData"
        filter-column="email"
        virtual
        sticky-header
        max-height="320px"
        :enable-pagination="false"
      />
    </Story>

    <Story
      title="Footer / totals row"
      description="`#footer` slot renders below TableBody. Useful for sums and totals."
    >
      <DataTable
        :columns="sortableColumns"
        :data="data"
        filter-column="email"
        :enable-pagination="false"
      >
        <template #footer="{ rows }">
          <tr class="font-medium">
            <td colspan="7" class="px-3 py-3 text-sm">
              Total: {{ rows.length }} employee{{
                rows.length === 1 ? "" : "s"
              }}
              <span class="text-muted-foreground ml-2"
                >·
                {{
                  rows.filter((r: any) => r.original.status === "active").length
                }}
                active</span
              >
            </td>
          </tr>
        </template>
      </DataTable>
    </Story>

    <Story
      title="Inline filter mode (default)"
      description="Faceted filter chips in the toolbar — the default and industry standard for most tables. Best when you have ≤4–5 filters."
    >
      <DataTable
        :columns="sortableColumns"
        :data="data"
        :filters="filters"
        filter-column="email"
        filter-placeholder="Search…"
        filter-mode="inline"
      />
    </Story>

    <Story
      title="Popover filter mode"
      description="Filters open in a small popup attached to a toolbar button. Compact when you have many filters but want them quick to reach."
    >
      <DataTable
        :columns="sortableColumns"
        :data="data"
        :filters="filters"
        filter-column="email"
        filter-placeholder="Search…"
        filter-mode="popover"
      />
    </Story>

    <Story
      title="Modal filter mode (side panel)"
      description="Opt-in: `filter-mode=modal` opens filters in a right Sheet. Use when you have many filters or dense inputs (date ranges, long multiselects) that would crowd the toolbar."
    >
      <DataTable
        :columns="sortableColumns"
        :data="data"
        :filters="filters"
        filter-column="email"
        filter-placeholder="Search…"
        filter-mode="modal"
      />
    </Story>

    <Story
      title="Per-column header filter"
      description="Each header carries a funnel icon next to the sort affordance. Click it to open a popover with the appropriate UI for the column type (text input on Name/Email, multiselect on Department/Status). The active filter shows a primary dot on the funnel; toolbar Clear-all still works."
    >
      <DataTable :columns="headerFilterColumns" :data="data" hide-toolbar />
    </Story>

    <Story
      title="Header filters + toolbar (both)"
      description="Same column setup but with the toolbar still visible. Demonstrates that header-level filters and the toolbar filter chips (inline/popover/modal) can coexist — both pipe into the same TanStack column-filter state."
    >
      <DataTable
        :columns="headerFilterColumns"
        :data="data"
        :filters="filters"
        filter-column="email"
        filter-placeholder="Search by email…"
        filter-mode="popover"
      />
    </Story>

    <Story
      title="Loading"
      description="`loading` renders a skeleton while the first page is empty, then dims the body on subsequent fetches. Pair with server-side `totalRows`."
    >
      <DataTable
        :columns="sortableColumns"
        :data="[]"
        filter-column="email"
        loading
      />
    </Story>

    <Story
      title="Infinite scroll"
      description="`infinite` hides pagination and emits `fetch-more` when the sentinel row enters the viewport. Append rows on the consumer side."
    >
      <DataTable
        :columns="sortableColumns"
        :data="infiniteRows"
        filter-column="email"
        infinite
        :loading="infiniteLoading"
        sticky-header
        max-height="280px"
        @fetch-more="loadMoreInfinite"
      />
    </Story>

    <Story
      title="Density toggle"
      description="`enable-density-toggle` adds a Compact / Cozy / Comfortable control in the toolbar. The table density updates immediately."
    >
      <DataTable
        :columns="sortableColumns"
        :data="data"
        filter-column="email"
        enable-density-toggle
        enable-column-visibility
      />
    </Story>

    <Story
      title="Date range filter"
      description="`type: 'date'` on a filter definition opens a range calendar. ISO `YYYY-MM-DD` cell values compare lexicographically."
    >
      <DataTable
        :columns="dateColumns"
        :data="data"
        :filters="dateFilters"
        filter-column="email"
      />
    </Story>

    <Story
      title="Grouped by department"
      description="`default-grouping` clusters rows under a group header. Click a header to collapse or expand the group."
    >
      <DataTable
        :columns="sortableColumns"
        :data="data"
        :default-grouping="['department']"
        :enable-pagination="false"
      />
    </Story>

    <Story
      title="Keyboard navigation"
      description="Focus the table, then J/K or arrows move the row, Space selects, Enter activates, Esc clears, ⌘A selects all, ⌘C copies TSV."
    >
      <DataTable
        :columns="sortableColumns"
        :data="data"
        filter-column="email"
        enable-keyboard-navigation
      />
    </Story>

    <Story
      title="Borderless"
      description="`borderless='full'` drops the outer card chrome so the table sits flush on a parent surface."
    >
      <div class="bg-muted/30 rounded-lg p-3">
        <DataTable
          :columns="sortableColumns"
          :data="data"
          filter-column="email"
          borderless="full"
        />
      </div>
    </Story>

    <Story
      title="Server-side pagination"
      description="Pass `total-rows` from the API and listen to `update:state` to fetch the next page. The table does not filter or paginate locally."
    >
      <DataTable
        :columns="sortableColumns"
        :data="serverRows"
        :total-rows="data.length"
        :loading="serverLoading"
        filter-column="email"
        @update:state="onServerState"
      />
    </Story>

    <Story
      title="Inline bulk dock"
      description="`bulk-action-position='inline'` renders selected-row actions as a banner above the table instead of the floating HUD."
    >
      <DataTable
        :columns="sortableColumns"
        :data="data"
        filter-column="email"
        bulk-action-position="inline"
      >
        <template #bulk-actions="{ rows, clear }">
          <Button
            size="sm"
            variant="outline"
            @click="announceAction(`Exporting ${rows.length} rows`)"
            >Export</Button
          >
          <Button
            size="sm"
            variant="destructive"
            @click="
              () => {
                announceAction(`Deleted ${rows.length} rows`);
                clear();
              }
            "
            >Delete</Button
          >
        </template>
      </DataTable>
    </Story>
  </div>
</template>

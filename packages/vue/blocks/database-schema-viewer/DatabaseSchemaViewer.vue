<script setup lang="ts">
import { computed, ref } from 'vue'
import type { HTMLAttributes } from 'vue'
import {
  ArrowRight,
  Check,
  Clock,
  Code2,
  Copy,
  Database,
  Download,
  HardDrive,
  Key,
  Layers,
  Link2,
  Search,
  Table2,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ColumnDefinition {
  name: string
  type: string
  nullable: boolean
  defaultValue: string | null
  isPrimaryKey?: boolean
  isForeignKey?: boolean
  foreignKeyRef?: string
  description?: string
}

interface ForeignKeyDefinition {
  name: string
  column: string
  foreignTable: string
  foreignColumn: string
  onDelete: 'CASCADE' | 'RESTRICT' | 'SET NULL' | 'NO ACTION'
  onUpdate: 'CASCADE' | 'RESTRICT' | 'SET NULL' | 'NO ACTION'
}

interface IndexDefinition {
  name: string
  type: 'B-Tree' | 'GIN' | 'GiST' | 'Hash'
  columns: string[]
  size: string
  isUnique?: boolean
  isPrimary?: boolean
}

interface TableSchema {
  name: string
  schema: string
  rowCount: number
  rowCountFormatted: string
  size: string
  primaryKey: string
  lastAnalyzed: string
  description: string
  columns: ColumnDefinition[]
  foreignKeys: ForeignKeyDefinition[]
  indexes: IndexDefinition[]
  ddl: string
}

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const searchQuery = ref('')
const selectedTableName = ref('orders')
const activeTab = ref('columns')
const copiedDDL = ref(false)
const exportedAll = ref(false)

const tables: TableSchema[] = [
  {
    name: 'users',
    schema: 'public',
    rowCount: 42850,
    rowCountFormatted: '42,850 rows',
    size: '18.4 MB',
    primaryKey: 'id (UUID)',
    lastAnalyzed: '12 mins ago',
    description: 'User accounts, authentication identities, role assignments, and profile metadata.',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        nullable: false,
        defaultValue: 'gen_random_uuid()',
        isPrimaryKey: true,
        description: 'Unique identifier for the user',
      },
      {
        name: 'email',
        type: 'varchar(255)',
        nullable: false,
        defaultValue: null,
        description: 'Verified primary contact email',
      },
      {
        name: 'encrypted_password',
        type: 'varchar(255)',
        nullable: false,
        defaultValue: null,
        description: 'Bcrypt hashed password digest',
      },
      {
        name: 'full_name',
        type: 'varchar(100)',
        nullable: true,
        defaultValue: null,
        description: 'Display name or legal identity',
      },
      {
        name: 'role',
        type: 'varchar(32)',
        nullable: false,
        defaultValue: "'member'",
        description: 'System authorization role',
      },
      {
        name: 'avatar_url',
        type: 'text',
        nullable: true,
        defaultValue: null,
        description: 'Remote profile avatar image URL',
      },
      {
        name: 'is_verified',
        type: 'boolean',
        nullable: false,
        defaultValue: 'false',
        description: 'Email verification status flag',
      },
      {
        name: 'created_at',
        type: 'timestamptz',
        nullable: false,
        defaultValue: 'CURRENT_TIMESTAMP',
        description: 'Account creation timestamp',
      },
      {
        name: 'updated_at',
        type: 'timestamptz',
        nullable: false,
        defaultValue: 'CURRENT_TIMESTAMP',
        description: 'Last record modification timestamp',
      },
    ],
    foreignKeys: [],
    indexes: [
      { name: 'users_pkey', type: 'B-Tree', columns: ['id'], size: '1.2 MB', isPrimary: true, isUnique: true },
      { name: 'idx_users_email', type: 'B-Tree', columns: ['email'], size: '940 KB', isUnique: true },
      { name: 'idx_users_role_created', type: 'B-Tree', columns: ['role', 'created_at DESC'], size: '1.8 MB' },
    ],
    ddl: `CREATE TABLE public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email varchar(255) NOT NULL UNIQUE,
  encrypted_password varchar(255) NOT NULL,
  full_name varchar(100),
  role varchar(32) NOT NULL DEFAULT 'member',
  avatar_url text,
  is_verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_users_role CHECK (role IN ('admin', 'member', 'viewer'))
);`,
  },
  {
    name: 'orders',
    schema: 'public',
    rowCount: 148290,
    rowCountFormatted: '148,290 rows',
    size: '64.2 MB',
    primaryKey: 'id (UUID)',
    lastAnalyzed: '2 mins ago',
    description: 'Customer transactional purchase orders, fulfillment status, and payment totals.',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        nullable: false,
        defaultValue: 'gen_random_uuid()',
        isPrimaryKey: true,
        description: 'Unique order identifier',
      },
      {
        name: 'order_number',
        type: 'varchar(48)',
        nullable: false,
        defaultValue: null,
        description: 'Human-readable sequential invoice reference',
      },
      {
        name: 'user_id',
        type: 'uuid',
        nullable: false,
        defaultValue: null,
        isForeignKey: true,
        foreignKeyRef: 'users.id',
        description: 'Purchaser account reference',
      },
      {
        name: 'status',
        type: 'varchar(32)',
        nullable: false,
        defaultValue: "'pending'",
        description: 'Order lifecycle stage',
      },
      {
        name: 'total_amount',
        type: 'numeric(10,2)',
        nullable: false,
        defaultValue: '0.00',
        description: 'Grand total charged in base currency',
      },
      {
        name: 'currency',
        type: 'varchar(3)',
        nullable: false,
        defaultValue: "'USD'",
        description: 'ISO 4217 three-letter currency code',
      },
      {
        name: 'billing_address',
        type: 'jsonb',
        nullable: true,
        defaultValue: "'{}'::jsonb",
        description: 'Structured billing snapshot',
      },
      {
        name: 'shipping_address',
        type: 'jsonb',
        nullable: true,
        defaultValue: "'{}'::jsonb",
        description: 'Structured destination address',
      },
      {
        name: 'shipped_at',
        type: 'timestamptz',
        nullable: true,
        defaultValue: null,
        description: 'Carrier pickup confirmation date',
      },
      {
        name: 'created_at',
        type: 'timestamptz',
        nullable: false,
        defaultValue: 'CURRENT_TIMESTAMP',
        description: 'Checkout completion timestamp',
      },
      {
        name: 'updated_at',
        type: 'timestamptz',
        nullable: false,
        defaultValue: 'CURRENT_TIMESTAMP',
        description: 'Order state mutation timestamp',
      },
    ],
    foreignKeys: [
      {
        name: 'fk_orders_user_id',
        column: 'user_id',
        foreignTable: 'users',
        foreignColumn: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    ],
    indexes: [
      { name: 'orders_pkey', type: 'B-Tree', columns: ['id'], size: '4.8 MB', isPrimary: true, isUnique: true },
      { name: 'idx_orders_user_id', type: 'B-Tree', columns: ['user_id'], size: '3.4 MB' },
      { name: 'idx_orders_status_created', type: 'B-Tree', columns: ['status', 'created_at DESC'], size: '5.1 MB' },
      { name: 'idx_orders_number_unique', type: 'B-Tree', columns: ['order_number'], size: '3.2 MB', isUnique: true },
    ],
    ddl: `CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number varchar(48) NOT NULL UNIQUE,
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  status varchar(32) NOT NULL DEFAULT 'pending',
  total_amount numeric(10,2) NOT NULL DEFAULT 0.00,
  currency varchar(3) NOT NULL DEFAULT 'USD',
  billing_address jsonb DEFAULT '{}'::jsonb,
  shipping_address jsonb DEFAULT '{}'::jsonb,
  shipped_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);`,
  },
  {
    name: 'order_items',
    schema: 'public',
    rowCount: 384120,
    rowCountFormatted: '384,120 rows',
    size: '112.5 MB',
    primaryKey: 'id (UUID)',
    lastAnalyzed: '8 mins ago',
    description: 'Granular line items and unit pricing linked to purchase orders.',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        nullable: false,
        defaultValue: 'gen_random_uuid()',
        isPrimaryKey: true,
        description: 'Line item primary key',
      },
      {
        name: 'order_id',
        type: 'uuid',
        nullable: false,
        defaultValue: null,
        isForeignKey: true,
        foreignKeyRef: 'orders.id',
        description: 'Parent order reference',
      },
      {
        name: 'product_id',
        type: 'uuid',
        nullable: false,
        defaultValue: null,
        isForeignKey: true,
        foreignKeyRef: 'products.id',
        description: 'Catalog item reference',
      },
      { name: 'quantity', type: 'integer', nullable: false, defaultValue: '1', description: 'Units purchased' },
      {
        name: 'unit_price',
        type: 'numeric(10,2)',
        nullable: false,
        defaultValue: '0.00',
        description: 'Unit price captured at purchase',
      },
      {
        name: 'discount_amount',
        type: 'numeric(10,2)',
        nullable: false,
        defaultValue: '0.00',
        description: 'Item level discount applied',
      },
      {
        name: 'created_at',
        type: 'timestamptz',
        nullable: false,
        defaultValue: 'CURRENT_TIMESTAMP',
        description: 'Record insertion timestamp',
      },
    ],
    foreignKeys: [
      {
        name: 'fk_order_items_order_id',
        column: 'order_id',
        foreignTable: 'orders',
        foreignColumn: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      {
        name: 'fk_order_items_product_id',
        column: 'product_id',
        foreignTable: 'products',
        foreignColumn: 'id',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },
    ],
    indexes: [
      { name: 'order_items_pkey', type: 'B-Tree', columns: ['id'], size: '12.1 MB', isPrimary: true, isUnique: true },
      { name: 'idx_order_items_order_id', type: 'B-Tree', columns: ['order_id'], size: '8.9 MB' },
      { name: 'idx_order_items_product_id', type: 'B-Tree', columns: ['product_id'], size: '8.4 MB' },
    ],
    ddl: `CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE ON UPDATE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  unit_price numeric(10,2) NOT NULL DEFAULT 0.00,
  discount_amount numeric(10,2) NOT NULL DEFAULT 0.00,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);`,
  },
  {
    name: 'products',
    schema: 'public',
    rowCount: 12400,
    rowCountFormatted: '12,400 rows',
    size: '9.8 MB',
    primaryKey: 'id (UUID)',
    lastAnalyzed: '45 mins ago',
    description: 'Catalog products, SKU identifiers, real-time inventory counts, and price tiers.',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        nullable: false,
        defaultValue: 'gen_random_uuid()',
        isPrimaryKey: true,
        description: 'Product primary key',
      },
      {
        name: 'sku',
        type: 'varchar(64)',
        nullable: false,
        defaultValue: null,
        description: 'Stock keeping unit barcode index',
      },
      { name: 'name', type: 'varchar(255)', nullable: false, defaultValue: null, description: 'Public product title' },
      {
        name: 'description',
        type: 'text',
        nullable: true,
        defaultValue: null,
        description: 'Detailed marketing specifications',
      },
      { name: 'price', type: 'numeric(10,2)', nullable: false, defaultValue: '0.00', description: 'Base retail price' },
      {
        name: 'stock_quantity',
        type: 'integer',
        nullable: false,
        defaultValue: '0',
        description: 'Available warehouse stock',
      },
      {
        name: 'is_active',
        type: 'boolean',
        nullable: false,
        defaultValue: 'true',
        description: 'Visibility in storefront',
      },
      {
        name: 'metadata',
        type: 'jsonb',
        nullable: true,
        defaultValue: "'{}'::jsonb",
        description: 'Custom attributes and tags',
      },
      {
        name: 'created_at',
        type: 'timestamptz',
        nullable: false,
        defaultValue: 'CURRENT_TIMESTAMP',
        description: 'Product onboarding timestamp',
      },
      {
        name: 'updated_at',
        type: 'timestamptz',
        nullable: false,
        defaultValue: 'CURRENT_TIMESTAMP',
        description: 'Last catalog revision',
      },
    ],
    foreignKeys: [],
    indexes: [
      { name: 'products_pkey', type: 'B-Tree', columns: ['id'], size: '380 KB', isPrimary: true, isUnique: true },
      { name: 'idx_products_sku', type: 'B-Tree', columns: ['sku'], size: '290 KB', isUnique: true },
      { name: 'idx_products_is_active', type: 'B-Tree', columns: ['is_active'], size: '180 KB' },
    ],
    ddl: `CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sku varchar(64) NOT NULL UNIQUE,
  name varchar(255) NOT NULL,
  description text,
  price numeric(10,2) NOT NULL DEFAULT 0.00,
  stock_quantity integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);`,
  },
  {
    name: 'subscriptions',
    schema: 'public',
    rowCount: 19850,
    rowCountFormatted: '19,850 rows',
    size: '14.1 MB',
    primaryKey: 'id (UUID)',
    lastAnalyzed: '18 mins ago',
    description: 'Recurring billing contracts, subscription plans, and renewal period bounds.',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        nullable: false,
        defaultValue: 'gen_random_uuid()',
        isPrimaryKey: true,
        description: 'Subscription contract ID',
      },
      {
        name: 'user_id',
        type: 'uuid',
        nullable: false,
        defaultValue: null,
        isForeignKey: true,
        foreignKeyRef: 'users.id',
        description: 'Subscriber user ID',
      },
      {
        name: 'plan_tier',
        type: 'varchar(32)',
        nullable: false,
        defaultValue: "'starter'",
        description: 'SaaS plan designation',
      },
      {
        name: 'status',
        type: 'varchar(32)',
        nullable: false,
        defaultValue: "'active'",
        description: 'Lifecycle status',
      },
      {
        name: 'current_period_start',
        type: 'timestamptz',
        nullable: false,
        defaultValue: 'CURRENT_TIMESTAMP',
        description: 'Current billing window start',
      },
      {
        name: 'current_period_end',
        type: 'timestamptz',
        nullable: false,
        defaultValue: null,
        description: 'Next scheduled billing date',
      },
      {
        name: 'cancel_at_period_end',
        type: 'boolean',
        nullable: false,
        defaultValue: 'false',
        description: 'Cancellation intent at renewal',
      },
      {
        name: 'created_at',
        type: 'timestamptz',
        nullable: false,
        defaultValue: 'CURRENT_TIMESTAMP',
        description: 'Initial signup timestamp',
      },
    ],
    foreignKeys: [
      {
        name: 'fk_subscriptions_user_id',
        column: 'user_id',
        foreignTable: 'users',
        foreignColumn: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    ],
    indexes: [
      { name: 'subscriptions_pkey', type: 'B-Tree', columns: ['id'], size: '620 KB', isPrimary: true, isUnique: true },
      { name: 'idx_subscriptions_user_id', type: 'B-Tree', columns: ['user_id'], size: '540 KB' },
      { name: 'idx_subscriptions_status', type: 'B-Tree', columns: ['status'], size: '410 KB' },
    ],
    ddl: `CREATE TABLE public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  plan_tier varchar(32) NOT NULL DEFAULT 'starter',
  status varchar(32) NOT NULL DEFAULT 'active',
  current_period_start timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  current_period_end timestamptz NOT NULL,
  cancel_at_period_end boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);`,
  },
  {
    name: 'audit_logs',
    schema: 'public',
    rowCount: 920400,
    rowCountFormatted: '920,400 rows',
    size: '201.0 MB',
    primaryKey: 'id (UUID)',
    lastAnalyzed: '1 min ago',
    description: 'Immutable security event stream, compliance audit records, and state change captures.',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        nullable: false,
        defaultValue: 'gen_random_uuid()',
        isPrimaryKey: true,
        description: 'Event ledger entry identifier',
      },
      {
        name: 'actor_id',
        type: 'uuid',
        nullable: true,
        defaultValue: null,
        isForeignKey: true,
        foreignKeyRef: 'users.id',
        description: 'Initiating user account reference',
      },
      {
        name: 'action',
        type: 'varchar(64)',
        nullable: false,
        defaultValue: null,
        description: 'Standardized action identifier',
      },
      {
        name: 'entity_type',
        type: 'varchar(64)',
        nullable: false,
        defaultValue: null,
        description: 'Target entity namespace',
      },
      {
        name: 'entity_id',
        type: 'varchar(128)',
        nullable: false,
        defaultValue: null,
        description: 'Target entity unique identifier',
      },
      { name: 'ip_address', type: 'inet', nullable: true, defaultValue: null, description: 'Client network IP' },
      {
        name: 'payload',
        type: 'jsonb',
        nullable: true,
        defaultValue: "'{}'::jsonb",
        description: 'Full before/after state diff',
      },
      {
        name: 'created_at',
        type: 'timestamptz',
        nullable: false,
        defaultValue: 'CURRENT_TIMESTAMP',
        description: 'Exact audit record timestamp',
      },
    ],
    foreignKeys: [
      {
        name: 'fk_audit_logs_actor_id',
        column: 'actor_id',
        foreignTable: 'users',
        foreignColumn: 'id',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
    ],
    indexes: [
      { name: 'audit_logs_pkey', type: 'B-Tree', columns: ['id'], size: '28.4 MB', isPrimary: true, isUnique: true },
      { name: 'idx_audit_logs_actor_id', type: 'B-Tree', columns: ['actor_id'], size: '19.2 MB' },
      {
        name: 'idx_audit_logs_action_created',
        type: 'B-Tree',
        columns: ['action', 'created_at DESC'],
        size: '32.6 MB',
      },
      { name: 'idx_audit_logs_entity', type: 'B-Tree', columns: ['entity_type', 'entity_id'], size: '24.1 MB' },
    ],
    ddl: `CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES public.users(id) ON DELETE SET NULL ON UPDATE CASCADE,
  action varchar(64) NOT NULL,
  entity_type varchar(64) NOT NULL,
  entity_id varchar(128) NOT NULL,
  ip_address inet,
  payload jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);`,
  },
]

const filteredTables = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return tables
  return tables.filter(
    (table) =>
      table.name.toLowerCase().includes(query) ||
      table.description.toLowerCase().includes(query) ||
      table.columns.some((col) => col.name.toLowerCase().includes(query)),
  )
})

const activeTable = computed(() => {
  return tables.find((t) => t.name === selectedTableName.value) ?? tables[0]
})

function formatRowCount(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}k`
  return String(count)
}

function copyToClipboard(text: string) {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(text)
    copiedDDL.value = true
    setTimeout(() => {
      copiedDDL.value = false
    }, 2000)
  }
}

function exportAllDDL() {
  const allSql = tables.map((t) => `-- Table: ${t.name}\n${t.ddl}`).join('\n\n')
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(allSql)
    exportedAll.value = true
    setTimeout(() => {
      exportedAll.value = false
    }, 2000)
  }
}
</script>

<template>
  <div
    data-slot="database-schema-viewer"
    :class="
      cn('bg-background text-foreground border-border w-full overflow-hidden rounded-xl border shadow-xs', props.class)
    "
  >
    <!-- Top Database Header -->
    <header class="border-border bg-card/60 border-b px-4 py-3.5 sm:px-6">
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div class="flex flex-wrap items-center gap-3">
          <div class="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-lg">
            <Database class="size-4.5" />
          </div>
          <div class="flex flex-col">
            <div class="flex flex-wrap items-center gap-2">
              <span class="font-mono text-sm font-semibold tracking-tight">production-cluster-pg16</span>
              <span class="flex size-2 rounded-full bg-emerald-500" title="Connected & Synced" />
              <Badge variant="secondary" class="font-mono text-xs font-normal">PostgreSQL 16.2</Badge>
            </div>
            <span class="text-muted-foreground text-xs">18 tables · 420 MB</span>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <div class="relative w-full sm:w-60">
            <Search class="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
            <Input v-model="searchQuery" placeholder="Search tables or columns..." class="h-8 pl-8 text-xs" />
          </div>
          <Button
            aria-label="Download attachment"
            variant="outline"
            size="sm"
            class="h-8 shrink-0 gap-1.5 text-xs"
            @click="exportAllDDL"
          >
            <Check v-if="exportedAll" class="size-3.5 text-emerald-500" />
            <Download v-else class="size-3.5" />
            {{ exportedAll ? 'DDL Copied!' : 'Export DDL' }}
          </Button>
        </div>
      </div>
    </header>

    <!-- Two-Column Inspector Body -->
    <div class="grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[260px_1fr]">
      <!-- Left Sidebar: Tables List -->
      <aside class="border-border bg-muted/20 border-r p-3 sm:p-4">
        <div class="mb-2.5 flex items-center justify-between gap-x-2 px-1">
          <span class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Database Tables</span>
          <Badge variant="secondary" class="h-5 px-1.5 font-mono text-xs">{{ filteredTables.length }}</Badge>
        </div>

        <div class="space-y-1">
          <button
            v-for="table in filteredTables"
            :key="table.name"
            type="button"
            :class="
              cn(
                'flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition-colors',
                selectedTableName === table.name
                  ? 'bg-primary/10 text-primary border-primary/20 border font-medium shadow-xs'
                  : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground border border-transparent',
              )
            "
            @click="selectedTableName = table.name"
          >
            <div class="flex min-w-0 items-center gap-2">
              <Table2 class="size-3.5 shrink-0 opacity-70" />
              <span class="truncate font-mono">{{ table.name }}</span>
            </div>
            <span class="bg-muted text-muted-foreground ml-2 shrink-0 rounded-full px-1.5 py-0.5 font-mono text-xs">
              {{ formatRowCount(table.rowCount) }}
            </span>
          </button>

          <div v-if="filteredTables.length === 0" class="text-muted-foreground py-6 text-center text-xs">
            No matching tables found
          </div>
        </div>

        <Separator class="my-4" />

        <div class="border-border/70 bg-card space-y-1.5 rounded-lg border p-3 text-xs">
          <div class="text-muted-foreground flex items-center justify-between gap-x-2">
            <span>Encoding:</span>
            <span class="text-foreground font-mono">UTF8</span>
          </div>
          <div class="text-muted-foreground flex items-center justify-between gap-x-2">
            <span>Collation:</span>
            <span class="text-foreground font-mono">en_US.utf8</span>
          </div>
          <div class="text-muted-foreground flex items-center justify-between gap-x-2">
            <span>Default Schema:</span>
            <span class="text-foreground font-mono">public</span>
          </div>
        </div>
      </aside>

      <!-- Right Main Panel: Table Detail Inspector -->
      <main class="bg-card/30 min-w-0 space-y-5 p-4 sm:p-6">
        <!-- Active Table Header & Stats -->
        <div class="border-border space-y-3 border-b pb-2">
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div class="space-y-1">
              <div class="flex flex-wrap items-center gap-2">
                <span class="text-muted-foreground font-mono text-sm">public.</span>
                <h2 class="text-foreground font-mono text-xl font-bold tracking-tight break-all">
                  {{ activeTable.name }}
                </h2>
                <Badge variant="outline" class="font-mono text-xs font-normal">BASE TABLE</Badge>
              </div>
              <p class="text-muted-foreground text-xs">{{ activeTable.description }}</p>
            </div>

            <Button
              variant="outline"
              size="sm"
              class="h-8 shrink-0 gap-1.5 self-start text-xs sm:self-auto"
              @click="copyToClipboard(activeTable.ddl)"
            >
              <Check v-if="copiedDDL" class="size-3.5 text-emerald-500" />
              <Copy v-else class="size-3.5" />
              {{ copiedDDL ? 'Copied DDL' : 'Copy Table DDL' }}
            </Button>
          </div>

          <!-- Metadata Stat Badges -->
          <div class="flex flex-wrap items-center gap-2 pt-1">
            <div
              class="border-border bg-card text-muted-foreground inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs"
            >
              <Table2 class="text-foreground/70 size-3.5" />
              <span>Rows:</span>
              <span class="text-foreground font-mono font-medium">{{ activeTable.rowCountFormatted }}</span>
            </div>

            <div
              class="border-border bg-card text-muted-foreground inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs"
            >
              <Key class="size-3.5 text-amber-500" />
              <span>Primary Key:</span>
              <span class="text-foreground font-mono font-medium">{{ activeTable.primaryKey }}</span>
            </div>

            <div
              class="border-border bg-card text-muted-foreground inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs"
            >
              <HardDrive class="text-foreground/70 size-3.5" />
              <span>Table Size:</span>
              <span class="text-foreground font-mono font-medium">{{ activeTable.size }}</span>
            </div>

            <div
              class="border-border bg-card text-muted-foreground inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs"
            >
              <Clock class="text-foreground/70 size-3.5" />
              <span>Last Analyzed:</span>
              <span class="text-foreground font-medium">{{ activeTable.lastAnalyzed }}</span>
            </div>
          </div>
        </div>

        <!-- View Tabs Navigation -->
        <Tabs v-model="activeTab" default-value="columns" class="w-full">
          <TabsList class="grid h-9 w-full grid-cols-2 p-1 md:grid-cols-4">
            <TabsTrigger value="columns" class="gap-1.5 text-xs">
              <Table2 class="size-3.5" />
              <span>Columns</span>
              <span class="bg-muted py-0.2 rounded-full px-1.5 font-mono text-xs">{{
                activeTable.columns.length
              }}</span>
            </TabsTrigger>
            <TabsTrigger value="foreign-keys" class="gap-1.5 text-xs">
              <Link2 class="size-3.5" />
              <span>Foreign Keys</span>
              <span class="bg-muted py-0.2 rounded-full px-1.5 font-mono text-xs">{{
                activeTable.foreignKeys.length
              }}</span>
            </TabsTrigger>
            <TabsTrigger value="indexes" class="gap-1.5 text-xs">
              <Layers class="size-3.5" />
              <span>Indexes</span>
              <span class="bg-muted py-0.2 rounded-full px-1.5 font-mono text-xs">{{
                activeTable.indexes.length
              }}</span>
            </TabsTrigger>
            <TabsTrigger value="ddl" class="gap-1.5 text-xs">
              <Code2 class="size-3.5" />
              <span>SQL DDL Preview</span>
            </TabsTrigger>
          </TabsList>

          <!-- Tab 1: Columns List -->
          <TabsContent value="columns" class="mt-4">
            <Card class="border-border overflow-hidden border shadow-none">
              <div class="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow class="bg-muted/40 hover:bg-muted/40">
                      <TableHead class="text-xs font-semibold">Column Name</TableHead>
                      <TableHead class="text-xs font-semibold">Data Type</TableHead>
                      <TableHead class="text-xs font-semibold">Nullable</TableHead>
                      <TableHead class="text-xs font-semibold">Default Value</TableHead>
                      <TableHead class="text-xs font-semibold">Constraints</TableHead>
                      <TableHead class="text-xs font-semibold">Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow v-for="col in activeTable.columns" :key="col.name" class="text-xs">
                      <TableCell class="font-mono font-medium">
                        <div class="flex items-center gap-1.5">
                          <Key v-if="col.isPrimaryKey" class="size-3.5 shrink-0 text-amber-500" />
                          <Link2 v-else-if="col.isForeignKey" class="size-3.5 shrink-0 text-sky-500" />
                          <span :class="cn(col.isPrimaryKey && 'font-semibold text-amber-600 dark:text-amber-400')">
                            {{ col.name }}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" class="font-mono text-xs font-normal">
                          {{ col.type }}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge v-if="!col.nullable" variant="outline" class="text-muted-foreground text-xs">
                          NOT NULL
                        </Badge>
                        <span v-else class="text-muted-foreground">NULL</span>
                      </TableCell>
                      <TableCell class="text-muted-foreground font-mono">
                        {{ col.defaultValue ?? '—' }}
                      </TableCell>
                      <TableCell>
                        <div class="flex flex-wrap items-center gap-1">
                          <Badge
                            v-if="col.isPrimaryKey"
                            class="border-amber-500/30 bg-amber-500/15 text-xs text-amber-700 dark:text-amber-300"
                          >
                            PK
                          </Badge>
                          <Badge v-if="col.isForeignKey" variant="secondary" class="gap-1 font-mono text-xs">
                            FK &rarr; {{ col.foreignKeyRef }}
                          </Badge>
                          <span v-if="!col.isPrimaryKey && !col.isForeignKey" class="text-muted-foreground">—</span>
                        </div>
                      </TableCell>
                      <TableCell class="text-muted-foreground max-w-[200px] truncate">
                        {{ col.description ?? '—' }}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          <!-- Tab 2: Foreign Keys & Relations -->
          <TabsContent value="foreign-keys" class="mt-4 space-y-3">
            <div v-if="activeTable.foreignKeys.length > 0" class="space-y-3">
              <Card
                v-for="fk in activeTable.foreignKeys"
                :key="fk.name"
                class="border-border space-y-3 border p-4 shadow-none"
              >
                <div class="border-border flex flex-wrap items-center justify-between gap-2 border-b pb-2">
                  <div class="flex flex-wrap items-center gap-2">
                    <Link2 class="size-4 text-sky-500" />
                    <span class="text-foreground font-mono text-xs font-semibold">{{ fk.name }}</span>
                  </div>
                  <Badge variant="secondary" class="font-mono text-xs">Many-to-One (N:1)</Badge>
                </div>

                <div
                  class="bg-muted/40 border-border/60 flex flex-col justify-between gap-3 rounded-lg border p-3 sm:flex-row sm:items-center"
                >
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="text-muted-foreground text-xs">Source:</span>
                    <Badge variant="outline" class="font-mono text-xs"> {{ activeTable.name }}.{{ fk.column }} </Badge>
                  </div>

                  <ArrowRight class="text-muted-foreground hidden size-4 sm:block" />

                  <div class="flex flex-wrap items-center gap-2">
                    <span class="text-muted-foreground text-xs">References:</span>
                    <Badge variant="default" class="font-mono text-xs">
                      {{ fk.foreignTable }}.{{ fk.foreignColumn }}
                    </Badge>
                  </div>
                </div>

                <div class="grid grid-cols-1 gap-2 pt-1 text-xs sm:grid-cols-2">
                  <div
                    class="border-border/50 bg-card flex items-center justify-between gap-x-2 rounded-md border px-2.5 py-1.5"
                  >
                    <span class="text-muted-foreground">On Delete Action:</span>
                    <Badge variant="secondary" class="font-mono text-xs">{{ fk.onDelete }}</Badge>
                  </div>
                  <div
                    class="border-border/50 bg-card flex items-center justify-between gap-x-2 rounded-md border px-2.5 py-1.5"
                  >
                    <span class="text-muted-foreground">On Update Action:</span>
                    <Badge variant="secondary" class="font-mono text-xs">{{ fk.onUpdate }}</Badge>
                  </div>
                </div>
              </Card>
            </div>

            <Card v-else class="border-border border border-dashed p-8 text-center">
              <div class="flex flex-col items-center justify-center space-y-2">
                <div class="bg-muted text-muted-foreground flex size-10 items-center justify-center rounded-full">
                  <Link2 class="size-5" />
                </div>
                <h3 class="text-sm font-semibold">No Outbound Foreign Keys</h3>
                <p class="text-muted-foreground max-w-sm text-xs">
                  Table <span class="font-mono font-medium">{{ activeTable.name }}</span> has no outbound relations. It
                  acts as an independent entity or is referenced by downstream child tables.
                </p>
              </div>
            </Card>
          </TabsContent>

          <!-- Tab 3: Indexes & Constraints -->
          <TabsContent value="indexes" class="mt-4">
            <Card class="border-border overflow-hidden border shadow-none">
              <div class="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow class="bg-muted/40 hover:bg-muted/40">
                      <TableHead class="text-xs font-semibold">Index Name</TableHead>
                      <TableHead class="text-xs font-semibold">Method</TableHead>
                      <TableHead class="text-xs font-semibold">Indexed Columns</TableHead>
                      <TableHead class="text-xs font-semibold">Index Size</TableHead>
                      <TableHead class="text-xs font-semibold">Constraint Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow v-for="idx in activeTable.indexes" :key="idx.name" class="text-xs">
                      <TableCell class="font-mono font-medium">
                        <div class="flex items-center gap-1.5">
                          <Layers class="text-muted-foreground size-3.5 shrink-0" />
                          <span>{{ idx.name }}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" class="font-mono text-xs">
                          {{ idx.type }}
                        </Badge>
                      </TableCell>
                      <TableCell class="text-foreground font-mono">
                        {{ idx.columns.join(', ') }}
                      </TableCell>
                      <TableCell class="text-muted-foreground font-mono">
                        {{ idx.size }}
                      </TableCell>
                      <TableCell>
                        <Badge
                          v-if="idx.isPrimary"
                          class="border-amber-500/30 bg-amber-500/15 text-xs text-amber-700 dark:text-amber-300"
                        >
                          PRIMARY KEY
                        </Badge>
                        <Badge v-else-if="idx.isUnique" variant="secondary" class="text-xs"> UNIQUE </Badge>
                        <Badge v-else variant="outline" class="text-muted-foreground text-xs"> INDEX </Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          <!-- Tab 4: SQL DDL Preview -->
          <TabsContent value="ddl" class="mt-4">
            <div class="border-border bg-muted/40 overflow-hidden rounded-lg border">
              <div class="border-border bg-card flex items-center justify-between gap-x-2 border-b px-4 py-2.5">
                <div class="flex flex-wrap items-center gap-2">
                  <Code2 class="text-primary size-4" />
                  <span class="text-foreground font-mono text-xs font-medium">{{ activeTable.name }}.sql</span>
                  <Badge variant="secondary" class="font-mono text-xs">PostgreSQL DDL</Badge>
                </div>
                <Button variant="ghost" size="sm" class="h-7 gap-1 text-xs" @click="copyToClipboard(activeTable.ddl)">
                  <Check v-if="copiedDDL" class="size-3 text-emerald-500" />
                  <Copy v-else class="size-3" />
                  {{ copiedDDL ? 'Copied' : 'Copy' }}
                </Button>
              </div>

              <div
                class="overflow-x-auto bg-neutral-950 p-4 font-mono text-xs leading-relaxed text-neutral-100 dark:bg-neutral-950"
              >
                <pre class="whitespace-pre"><code>{{ activeTable.ddl }}</code></pre>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  </div>
</template>

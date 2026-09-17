<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  Check,
  Cloud,
  CloudOff,
  Copy,
  Download,
  Edit2,
  FileCode,
  Globe,
  MoreHorizontal,
  Plus,
  Search,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export type DnsRecordType = 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'CAA'

export interface DnsRecord {
  id: string
  type: DnsRecordType
  name: string
  content: string
  ttl: string
  proxied: boolean
  priority?: number
  comment?: string
}

interface Props {
  domain?: string
  nameservers?: string[]
  dnssecEnabled?: boolean
  initialRecords?: DnsRecord[]
  initialAddOpen?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  domain: 'uipkge.dev',
  nameservers: () => ['ns1.uipkge.net', 'ns2.uipkge.net'],
  dnssecEnabled: true,
  initialRecords: undefined,
  initialAddOpen: false,
})

const defaultRecords: DnsRecord[] = [
  {
    id: 'rec-1',
    type: 'A',
    name: '@',
    content: '76.76.21.21',
    ttl: 'Auto',
    proxied: true,
    comment: 'Apex production load balancer',
  },
  {
    id: 'rec-2',
    type: 'CNAME',
    name: 'www',
    content: 'cname.vercel-dns.com',
    ttl: 'Auto',
    proxied: true,
    comment: 'Primary web redirect',
  },
  {
    id: 'rec-3',
    type: 'CNAME',
    name: 'api',
    content: 'api-gateway.uipkge.net',
    ttl: '300s',
    proxied: false,
    comment: 'Direct REST gateway route',
  },
  {
    id: 'rec-4',
    type: 'AAAA',
    name: '@',
    content: '2606:4700:3038::6815:1515',
    ttl: 'Auto',
    proxied: true,
    comment: 'IPv6 edge ingress',
  },
  {
    id: 'rec-5',
    type: 'MX',
    name: 'mail',
    content: 'aspmx.l.google.com',
    ttl: '3600s',
    proxied: false,
    priority: 10,
    comment: 'Google Workspace MX',
  },
  {
    id: 'rec-6',
    type: 'TXT',
    name: '_dmarc',
    content: 'v=spf1 include:_spf.google.com ~all',
    ttl: '3600s',
    proxied: false,
    comment: 'Sender Policy Framework verification',
  },
  {
    id: 'rec-7',
    type: 'CAA',
    name: '@',
    content: '0 issue "letsencrypt.org"',
    ttl: 'Auto',
    proxied: false,
    comment: 'Certificate authority restriction',
  },
]

const records = ref<DnsRecord[]>(
  props.initialRecords ? props.initialRecords.map((r) => ({ ...r })) : defaultRecords.map((r) => ({ ...r })),
)

const searchQuery = ref('')
const selectedTypeFilter = ref<string>('ALL')
const isAddOpen = ref(props.initialAddOpen)
const isZoneFileOpen = ref(false)
const editingId = ref<string | null>(null)

// Form fields
const formType = ref<DnsRecordType>('A')
const formName = ref('')
const formContent = ref('')
const formTtl = ref('Auto')
const formProxied = ref(true)
const formPriority = ref(10)
const formComment = ref('')

const typeBadgeStyles: Record<DnsRecordType, { bg: string; text: string; border: string }> = {
  A: {
    bg: 'bg-blue-500/10 dark:bg-blue-500/20',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-500/30',
  },
  AAAA: {
    bg: 'bg-teal-500/10 dark:bg-teal-500/20',
    text: 'text-teal-600 dark:text-teal-400',
    border: 'border-teal-500/30',
  },
  CNAME: {
    bg: 'bg-purple-500/10 dark:bg-purple-500/20',
    text: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-500/30',
  },
  MX: {
    bg: 'bg-amber-500/10 dark:bg-amber-500/20',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-500/30',
  },
  TXT: {
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-500/30',
  },
  CAA: {
    bg: 'bg-sky-500/10 dark:bg-sky-500/20',
    text: 'text-sky-600 dark:text-sky-400',
    border: 'border-sky-500/30',
  },
}

const placeholderMap: Record<DnsRecordType, string> = {
  A: 'e.g. 76.76.21.21',
  AAAA: 'e.g. 2606:4700:3038::6815:1515',
  CNAME: 'e.g. cname.vercel-dns.com',
  MX: 'e.g. mail.google.com',
  TXT: 'e.g. v=spf1 include:_spf.google.com ~all',
  CAA: 'e.g. 0 issue "letsencrypt.org"',
}

// When type changes, auto-set proxy capability
watch(formType, (newType) => {
  if (['MX', 'TXT', 'CAA'].includes(newType)) {
    formProxied.value = false
  } else if (!editingId.value) {
    formProxied.value = true
  }
})

const filteredRecords = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  return records.value.filter((record) => {
    const matchesType = selectedTypeFilter.value === 'ALL' || record.type === selectedTypeFilter.value
    const matchesQuery =
      !query ||
      record.name.toLowerCase().includes(query) ||
      record.content.toLowerCase().includes(query) ||
      record.type.toLowerCase().includes(query) ||
      (record.comment && record.comment.toLowerCase().includes(query))
    return matchesType && matchesQuery
  })
})

const copiedKey = ref<string | null>(null)
let copyTimeout: number | undefined

async function copyText(key: string, text: string) {
  try {
    await navigator.clipboard.writeText(text)
    copiedKey.value = key
    window.clearTimeout(copyTimeout)
    copyTimeout = window.setTimeout(() => {
      copiedKey.value = null
    }, 1600)
  } catch {
    // Clipboard unavailable
  }
}

function toggleProxy(id: string) {
  const rec = records.value.find((r) => r.id === id)
  if (rec && ['A', 'AAAA', 'CNAME'].includes(rec.type)) {
    rec.proxied = !rec.proxied
  }
}

function deleteRecord(id: string) {
  records.value = records.value.filter((r) => r.id !== id)
  if (editingId.value === id) {
    cancelForm()
  }
}

function startAdd() {
  editingId.value = null
  formType.value = 'A'
  formName.value = ''
  formContent.value = ''
  formTtl.value = 'Auto'
  formProxied.value = true
  formPriority.value = 10
  formComment.value = ''
  isAddOpen.value = true
}

function startEdit(record: DnsRecord) {
  editingId.value = record.id
  formType.value = record.type
  formName.value = record.name
  formContent.value = record.content
  formTtl.value = record.ttl
  formProxied.value = record.proxied
  formPriority.value = record.priority ?? 10
  formComment.value = record.comment ?? ''
  isAddOpen.value = true
}

function cancelForm() {
  isAddOpen.value = false
  editingId.value = null
}

function saveRecord() {
  const name = formName.value.trim() || '@'
  const content = formContent.value.trim()
  if (!content) return

  if (editingId.value) {
    const idx = records.value.findIndex((r) => r.id === editingId.value)
    if (idx !== -1) {
      records.value[idx] = {
        ...records.value[idx],
        type: formType.value,
        name,
        content,
        ttl: formTtl.value,
        proxied: ['A', 'AAAA', 'CNAME'].includes(formType.value) ? formProxied.value : false,
        priority: formType.value === 'MX' ? Number(formPriority.value) : undefined,
        comment: formComment.value.trim() || undefined,
      }
    }
  } else {
    const newRecord: DnsRecord = {
      id: `rec-${Date.now()}`,
      type: formType.value,
      name,
      content,
      ttl: formTtl.value,
      proxied: ['A', 'AAAA', 'CNAME'].includes(formType.value) ? formProxied.value : false,
      priority: formType.value === 'MX' ? Number(formPriority.value) : undefined,
      comment: formComment.value.trim() || undefined,
    }
    records.value.unshift(newRecord)
  }

  cancelForm()
}

const zoneFileContent = computed(() => {
  const date = new Date().toISOString().split('T')[0].replace(/-/g, '')
  const lines: string[] = [
    `; BIND zone file for ${props.domain}`,
    `; Generated on ${new Date().toUTCString()}`,
    `$ORIGIN ${props.domain}.`,
    `$TTL 3600`,
    ``,
    `; SOA Record`,
    `@       IN  SOA  ${props.nameservers[0]}. hostmaster.${props.domain}. (`,
    `                 ${date}01 ; Serial`,
    `                 7200       ; Refresh (2 hours)`,
    `                 3600       ; Retry (1 hour)`,
    `                 1209600    ; Expire (2 weeks)`,
    `                 3600       ; Minimum TTL (1 hour)`,
    `)`,
    ``,
    `; Nameservers`,
  ]

  props.nameservers.forEach((ns) => {
    lines.push(`@       IN  NS   ${ns}.`)
  })

  lines.push('', '; Resource Records')

  for (const r of records.value) {
    const recName = (r.name === '@' ? '@' : r.name).padEnd(12, ' ')
    const ttlValue = r.ttl === 'Auto' ? '3600' : r.ttl.replace('s', '')
    const ttlStr = ttlValue.padEnd(6, ' ')
    const typeStr = r.type.padEnd(7, ' ')

    if (r.type === 'MX') {
      const prio = String(r.priority ?? 10).padEnd(4, ' ')
      lines.push(`${recName} ${ttlStr} IN  ${typeStr} ${prio} ${r.content}.`)
    } else if (r.type === 'TXT') {
      lines.push(`${recName} ${ttlStr} IN  ${typeStr} "${r.content}"`)
    } else if (r.type === 'CNAME') {
      lines.push(`${recName} ${ttlStr} IN  ${typeStr} ${r.content}.`)
    } else {
      lines.push(`${recName} ${ttlStr} IN  ${typeStr} ${r.content}`)
    }
  }

  return lines.join('\n')
})

function downloadZoneFile() {
  const blob = new Blob([zoneFileContent.value], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${props.domain}.zone`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function resolveHostname(recordName: string): string {
  if (recordName === '@') return props.domain
  return `${recordName}.${props.domain}`
}
</script>

<template>
  <div data-slot="dns-record-manager" :class="cn('w-full space-y-6', props.class)">
    <!-- Domain Header & Status Card -->
    <Card class="border-border bg-card shadow-xs">
      <CardHeader class="pb-4">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div class="space-y-1.5">
            <div class="flex flex-wrap items-center gap-2.5">
              <div class="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
                <Globe class="size-4.5" />
              </div>
              <h2 class="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
                {{ props.domain }}
              </h2>
              <Badge
                v-if="props.dnssecEnabled"
                variant="outline"
                class="gap-1.5 border-emerald-500/30 bg-emerald-500/10 py-0.5 text-emerald-600 dark:text-emerald-400"
              >
                <span class="size-1.5 rounded-full bg-emerald-500" />
                <ShieldCheck class="size-3.5" />
                Active · DNSSEC Enabled
              </Badge>
              <Badge
                v-else
                variant="outline"
                class="gap-1.5 border-amber-500/30 bg-amber-500/10 py-0.5 text-amber-600 dark:text-amber-400"
              >
                <span class="size-1.5 rounded-full bg-amber-500" />
                <ShieldAlert class="size-3.5" />
                Active · DNSSEC Inactive
              </Badge>
            </div>
            <p class="text-muted-foreground text-xs sm:text-sm">
              Authoritative DNS routing and global edge proxy management for {{ props.domain }}.
            </p>
          </div>

          <!-- Header CTA Buttons -->
          <div class="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              class="h-8 gap-1.5 text-xs font-medium"
              @click="isZoneFileOpen = !isZoneFileOpen"
            >
              <FileCode class="size-3.5" />
              {{ isZoneFileOpen ? 'Hide Zone File' : 'Export Zone File' }}
            </Button>
            <Button size="sm" class="h-8 gap-1.5 text-xs font-medium" @click="startAdd">
              <Plus class="size-3.5" />
              Add Record
            </Button>
          </div>
        </div>

        <Separator class="my-4" />

        <!-- Nameserver Inspector Bar -->
        <div class="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-muted-foreground font-medium">Nameservers:</span>
            <div class="flex flex-wrap items-center gap-1.5">
              <button
                v-for="ns in props.nameservers"
                :key="ns"
                type="button"
                :aria-label="`Copy nameserver ${ns}`"
                class="border-border bg-muted/60 hover:bg-muted focus-visible:ring-ring/50 group text-foreground flex min-h-6 items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-xs transition-colors focus-visible:ring-[2px] focus-visible:outline-none"
                @click="copyText(ns, ns)"
              >
                <span>{{ ns }}</span>
                <Check v-if="copiedKey === ns" class="size-3 text-emerald-500" />
                <Copy v-else class="text-muted-foreground group-hover:text-foreground size-3" />
              </button>
            </div>
          </div>
          <div class="text-muted-foreground flex items-center gap-2">
            <span class="size-2 animate-pulse rounded-full bg-emerald-500" />
            <span>Propagation: 100% Synced</span>
          </div>
        </div>
      </CardHeader>
    </Card>

    <!-- Zone File Export Card (Collapsible) -->
    <Card v-if="isZoneFileOpen" class="border-border bg-card shadow-xs">
      <CardHeader class="pb-3">
        <div class="flex items-center justify-between">
          <div>
            <CardTitle class="text-sm font-semibold sm:text-base">BIND RFC 1035 Zone File</CardTitle>
            <CardDescription class="text-xs">
              Complete DNS zone mapping for {{ props.domain }} ready for import into Route53, Bind9, or Cloudflare.
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            class="size-7"
            aria-label="Close zone file viewer"
            @click="isZoneFileOpen = false"
          >
            <X class="size-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent class="space-y-3 pt-0">
        <div class="relative">
          <pre
            class="border-border bg-muted/70 text-foreground max-h-56 overflow-x-auto rounded-lg border p-3 font-mono text-xs leading-relaxed select-all"
            >{{ zoneFileContent }}</pre
          >
        </div>
        <div class="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            class="h-8 gap-1.5 text-xs"
            @click="copyText('zone-file', zoneFileContent)"
          >
            <Check v-if="copiedKey === 'zone-file'" class="size-3.5 text-emerald-500" />
            <Copy v-else class="size-3.5" />
            {{ copiedKey === 'zone-file' ? 'Copied Zone File' : 'Copy Zone Content' }}
          </Button>
          <Button aria-label="Download attachment" size="sm" class="h-8 gap-1.5 text-xs" @click="downloadZoneFile">
            <Download class="size-3.5" />
            Download .zone File
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Add / Edit DNS Record Card -->
    <Card v-if="isAddOpen" class="border-primary/30 bg-muted/20 shadow-xs">
      <CardHeader class="pb-4">
        <div class="flex items-center justify-between">
          <div>
            <CardTitle class="text-base font-semibold">
              {{ editingId ? 'Edit DNS Record' : 'Add New DNS Record' }}
            </CardTitle>
            <CardDescription class="text-xs">
              {{
                editingId
                  ? 'Update configuration, target destination, or edge proxy status.'
                  : `Configure host routing, MX exchangers, or verification TXT tags for ${props.domain}.`
              }}
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon-sm" class="size-7" aria-label="Cancel record form" @click="cancelForm">
            <X class="size-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent class="space-y-4 pt-0">
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-12">
          <!-- Type Select -->
          <div class="sm:col-span-3">
            <label for="dns-type" class="text-foreground mb-1.5 block text-xs font-medium"> Type </label>
            <Select v-model="formType">
              <SelectTrigger id="dns-type" class="w-full [&_svg]:shrink-0 [&>span]:truncate">
                <SelectValue placeholder="Record type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">A (IPv4 Address)</SelectItem>
                <SelectItem value="AAAA">AAAA (IPv6 Address)</SelectItem>
                <SelectItem value="CNAME">CNAME (Canonical Alias)</SelectItem>
                <SelectItem value="MX">MX (Mail Exchanger)</SelectItem>
                <SelectItem value="TXT">TXT (Text Record)</SelectItem>
                <SelectItem value="CAA">CAA (Cert Authority)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Name Input -->
          <div class="sm:col-span-5">
            <label for="dns-name" class="text-foreground mb-1.5 block text-xs font-medium">
              Name / Subdomain
              <span class="text-muted-foreground font-normal">(@ for root)</span>
            </label>
            <Input id="dns-name" v-model="formName" placeholder="@ or subdomain" class="font-mono text-xs" />
          </div>

          <!-- TTL Select -->
          <div class="sm:col-span-4">
            <label for="dns-ttl" class="text-foreground mb-1.5 block text-xs font-medium"> TTL </label>
            <Select v-model="formTtl">
              <SelectTrigger id="dns-ttl" class="w-full [&_svg]:shrink-0 [&>span]:truncate">
                <SelectValue placeholder="TTL" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Auto">Auto (Automatic)</SelectItem>
                <SelectItem value="60s">1 min (60s)</SelectItem>
                <SelectItem value="300s">5 mins (300s)</SelectItem>
                <SelectItem value="1800s">30 mins (1800s)</SelectItem>
                <SelectItem value="3600s">1 hour (3600s)</SelectItem>
                <SelectItem value="86400s">1 day (86400s)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-3" :class="formType === 'MX' ? 'sm:grid-cols-12' : ''">
          <!-- Content / Target Input -->
          <div :class="formType === 'MX' ? 'sm:col-span-9' : 'w-full'">
            <label for="dns-content" class="text-foreground mb-1.5 block text-xs font-medium">
              {{
                formType === 'A'
                  ? 'IPv4 Address'
                  : formType === 'AAAA'
                    ? 'IPv6 Address'
                    : formType === 'CNAME'
                      ? 'Target Domain'
                      : formType === 'MX'
                        ? 'Mail Server Hostname'
                        : formType === 'TXT'
                          ? 'TXT Content / Value'
                          : 'Target / Tag Value'
              }}
            </label>
            <Input
              id="dns-content"
              v-model="formContent"
              :placeholder="placeholderMap[formType]"
              class="font-mono text-xs"
            />
          </div>

          <!-- Priority Input for MX -->
          <div v-if="formType === 'MX'" class="sm:col-span-3">
            <label for="dns-priority" class="text-foreground mb-1.5 block text-xs font-medium"> Priority </label>
            <Input
              id="dns-priority"
              v-model="formPriority"
              type="number"
              min="0"
              max="65535"
              placeholder="10"
              class="font-mono text-xs"
            />
          </div>
        </div>

        <!-- Optional Comment -->
        <div>
          <label for="dns-comment" class="text-foreground mb-1.5 block text-xs font-medium">
            Comment <span class="text-muted-foreground font-normal">(optional note)</span>
          </label>
          <Input
            id="dns-comment"
            v-model="formComment"
            placeholder="e.g. Production ingress or verification tag"
            class="text-xs"
          />
        </div>

        <!-- Proxy Switch (for A, AAAA, CNAME) -->
        <div
          v-if="['A', 'AAAA', 'CNAME'].includes(formType)"
          class="border-border bg-background/80 flex items-center justify-between rounded-lg border p-3"
        >
          <div class="space-y-0.5">
            <div class="flex items-center gap-2">
              <Cloud class="size-4 text-amber-500" />
              <span class="text-foreground text-xs font-medium">Proxy Status</span>
            </div>
            <p class="text-muted-foreground text-xs">
              {{
                formProxied
                  ? 'Proxied: Accelerate traffic and protect origin IP behind Cloudflare edge.'
                  : 'DNS only: Direct traffic route without edge proxy caching.'
              }}
            </p>
          </div>
          <Switch id="proxy-toggle" v-model="formProxied" />
        </div>

        <!-- Form Actions -->
        <div class="flex items-center justify-end gap-2 pt-2">
          <Button variant="outline" size="sm" class="h-8 text-xs" @click="cancelForm"> Cancel </Button>
          <Button size="sm" class="h-8 text-xs" :disabled="!formContent.trim()" @click="saveRecord">
            {{ editingId ? 'Update Record' : 'Save Record' }}
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- DNS Records Management Section -->
    <div class="space-y-3">
      <!-- Toolbar Filter & Search -->
      <div class="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div class="relative w-full max-w-sm">
          <Search
            class="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2"
          />
          <Input
            v-model="searchQuery"
            placeholder="Search records by name, target, or content..."
            class="h-8.5 pl-8 text-xs"
          />
        </div>

        <!-- Type Filter Buttons / Select -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            :class="
              cn(
                'min-h-6 rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                selectedTypeFilter === 'ALL'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground',
              )
            "
            @click="selectedTypeFilter = 'ALL'"
          >
            All ({{ records.length }})
          </button>
          <button
            v-for="t in ['A', 'CNAME', 'MX', 'TXT', 'AAAA', 'CAA'] as DnsRecordType[]"
            :key="t"
            type="button"
            :class="
              cn(
                'min-h-6 min-w-6 rounded-md px-2 py-1 font-mono text-xs font-medium transition-colors',
                selectedTypeFilter === t
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground',
              )
            "
            @click="selectedTypeFilter = t"
          >
            {{ t }}
          </button>
        </div>
      </div>

      <!-- DNS Records Table -->
      <div class="border-border bg-card overflow-hidden rounded-lg border shadow-xs">
        <div class="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow class="bg-muted/40">
                <TableHead class="w-24">Type</TableHead>
                <TableHead class="min-w-[140px]">Name</TableHead>
                <TableHead class="min-w-[240px]">Target Content</TableHead>
                <TableHead class="w-28 text-center">Proxy Status</TableHead>
                <TableHead class="w-20">TTL</TableHead>
                <TableHead class="w-12 text-right"><span class="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="record in filteredRecords"
                :key="record.id"
                class="hover:bg-muted/30 transition-colors"
                :class="editingId === record.id ? 'bg-primary/5' : ''"
              >
                <!-- Record Type Badge -->
                <TableCell>
                  <span
                    :class="
                      cn(
                        'inline-flex items-center justify-center rounded-md border px-2 py-0.5 font-mono text-xs font-bold',
                        typeBadgeStyles[record.type].bg,
                        typeBadgeStyles[record.type].text,
                        typeBadgeStyles[record.type].border,
                      )
                    "
                  >
                    {{ record.type }}
                  </span>
                </TableCell>

                <!-- Name & Hostname helper -->
                <TableCell>
                  <div class="flex flex-col">
                    <span class="text-foreground font-mono text-xs font-semibold">
                      {{ record.name }}
                    </span>
                    <span class="text-muted-foreground truncate font-mono text-xs">
                      {{ resolveHostname(record.name) }}
                    </span>
                  </div>
                </TableCell>

                <!-- Target Content with Copy button -->
                <TableCell>
                  <div class="flex items-center gap-2">
                    <div class="min-w-0 flex-1">
                      <div class="flex items-center gap-1.5">
                        <span
                          v-if="record.type === 'MX'"
                          class="border-border bg-muted text-muted-foreground rounded px-1 font-mono text-xs"
                        >
                          Pri {{ record.priority }}
                        </span>
                        <code class="text-foreground/90 font-mono text-xs break-all select-all">
                          {{ record.content }}
                        </code>
                      </div>
                      <p v-if="record.comment" class="text-muted-foreground mt-0.5 truncate text-xs">
                        {{ record.comment }}
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon-sm"
                      class="text-muted-foreground hover:text-foreground size-7 shrink-0"
                      :aria-label="`Copy content for ${record.name}`"
                      @click="copyText(record.id, record.content)"
                    >
                      <Check v-if="copiedKey === record.id" class="size-3.5 text-emerald-500" />
                      <Copy v-else class="size-3.5" />
                    </Button>
                  </div>
                </TableCell>

                <!-- Proxy Status Switch / Cloud badge -->
                <TableCell class="text-center">
                  <div v-if="['A', 'AAAA', 'CNAME'].includes(record.type)" class="flex justify-center">
                    <button
                      type="button"
                      :aria-label="`Toggle proxy status for ${record.name}, currently ${record.proxied ? 'proxied' : 'dns only'}`"
                      :class="
                        cn(
                          'group inline-flex min-h-6 items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus-visible:ring-[2px] focus-visible:outline-none',
                          record.proxied
                            ? 'border-amber-500/30 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 dark:text-amber-400'
                            : 'border-border bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground',
                        )
                      "
                      @click="toggleProxy(record.id)"
                    >
                      <Cloud v-if="record.proxied" class="size-3.5 fill-amber-500 text-amber-500" />
                      <CloudOff v-else class="text-muted-foreground group-hover:text-foreground size-3.5" />
                      <span>{{ record.proxied ? 'Proxied' : 'DNS only' }}</span>
                    </button>
                  </div>
                  <div v-else class="flex justify-center">
                    <span class="text-muted-foreground/60 inline-flex items-center gap-1 font-mono text-xs">
                      <CloudOff class="size-3" />
                      DNS only
                    </span>
                  </div>
                </TableCell>

                <!-- TTL Badge -->
                <TableCell>
                  <Badge variant="outline" class="border-border bg-muted/40 font-mono text-xs font-normal">
                    {{ record.ttl }}
                  </Badge>
                </TableCell>

                <!-- Row Actions Dropdown -->
                <TableCell class="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                      <Button variant="ghost" size="icon-sm" class="text-muted-foreground size-7 p-0">
                        <MoreHorizontal class="size-4" />
                        <span class="sr-only">Open record actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" class="w-44">
                      <DropdownMenuItem @click="startEdit(record)">
                        <Edit2 class="mr-2 size-3.5" />
                        Edit Record
                      </DropdownMenuItem>
                      <DropdownMenuItem @click="copyText(record.id, record.content)">
                        <Copy class="mr-2 size-3.5" />
                        Copy Target
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        @click="copyText(`${record.id}-bind`, `${record.name} IN ${record.type} ${record.content}`)"
                      >
                        <FileCode class="mr-2 size-3.5" />
                        Copy BIND Row
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        class="text-destructive focus:text-destructive"
                        @click="deleteRecord(record.id)"
                      >
                        <Trash2 class="mr-2 size-3.5" />
                        Delete Record
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>

              <!-- Empty State -->
              <TableRow v-if="filteredRecords.length === 0">
                <TableCell colspan="6" class="h-32 text-center">
                  <div class="flex flex-col items-center justify-center gap-1.5 text-center">
                    <Globe class="text-muted-foreground/50 size-8" />
                    <p class="text-foreground text-sm font-medium">No DNS records found</p>
                    <p class="text-muted-foreground max-w-sm text-xs">
                      {{
                        searchQuery
                          ? 'No records match your search filter query.'
                          : 'No records configured for this domain yet. Add your first record to begin routing.'
                      }}
                    </p>
                    <Button size="sm" class="mt-2 h-7 gap-1 text-xs" @click="startAdd">
                      <Plus class="size-3" />
                      Add DNS Record
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      <!-- Table Footer info -->
      <div class="text-muted-foreground flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
        <p>
          Showing <span class="text-foreground font-medium">{{ filteredRecords.length }}</span> of
          <span class="text-foreground font-medium">{{ records.length }}</span> configured records
        </p>
        <div class="flex items-center gap-4">
          <span class="flex items-center gap-1.5">
            <span class="size-2 rounded-full bg-amber-500" />
            {{ records.filter((r) => r.proxied).length }} Proxied
          </span>
          <span class="flex items-center gap-1.5">
            <span class="bg-muted-foreground size-2 rounded-full" />
            {{ records.filter((r) => !r.proxied).length }} DNS Only
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
